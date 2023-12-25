import { Pinecone } from "@pinecone-database/pinecone"

const apiKey = process.env.PINECONE_API_KEY

if (!apiKey) {
    throw Error("PINECONE_API_KEY is not set")
}

const pinecone = new Pinecone({
    environment: "us-west4-gcp-free",
    apiKey,
})

export const todosIndex = pinecone.Index("nextjs-ai-todo-app")
