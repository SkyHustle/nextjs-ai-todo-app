import { todosIndex } from "@/lib/db/pinecone"
import prisma from "@/lib/db/prisma"
import openai, { getEmbedding } from "@/lib/openai"
import { auth } from "@clerk/nextjs"
import {
    ChatCompletionMessage,
    ChatCompletionMessageParam,
} from "openai/resources/index.mjs"
import { OpenAIStream, StreamingTextResponse } from "ai"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const messages: ChatCompletionMessage[] = body.messages
        console.log("Messages: ", messages)

        // Only send over last 5 messages, saves tokens, keeps better context of the latest conversation
        const messagesTruncated = messages.slice(-5)
        console.log("Last 5 ", messagesTruncated)

        // turn into a vector embedding
        // take text of each message and join with a line break in between
        const embedding = await getEmbedding(
            messagesTruncated.map((message) => message.content).join("\n"),
        )

        const { userId } = auth()

        const vectorQueryResponse = await todosIndex.query({
            vector: embedding,
            topK: 1, // return the top 1 result
            filter: { userId }, // only return results for the current user
        })

        // vector embedding has a reference to the todo id
        // use the id to get the todo from mongo
        const relevantTodos = await prisma.todo.findMany({
            where: {
                id: {
                    // create an array of ids from the vector query response
                    in: vectorQueryResponse.matches.map((match) => match.id),
                },
            },
        })

        console.log("Relevant Todos: ", relevantTodos)

        // system messages give the ai instructions on how to respond
        const systemMessage: ChatCompletionMessageParam = {
            role: "system",
            content:
                "You are an inttelligent todo app. You answer questions about the user's todos." +
                "The relevant notes for this query are:\n" +
                relevantTodos
                    .map(
                        (todo) =>
                            `Title: ${todo.title}\n\nContent"\n${todo.content}`,
                    )
                    .join("\n\n"),
        }

        // send the messages to ChatGPT API
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // least expensive model
            stream: true,
            messages: [...messagesTruncated, systemMessage],
        })

        // vercel streaming helpers
        const stream = OpenAIStream(response)
        return new StreamingTextResponse(stream)
    } catch (error) {
        console.error(error)
        return Response.json(
            { error: "Internal server error" },
            { status: 500 },
        )
    }
}
