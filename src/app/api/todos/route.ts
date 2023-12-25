import { todosIndex } from "@/lib/db/pinecone"
import prisma from "@/lib/db/prisma"
import { getEmbedding } from "@/lib/openai"
import {
    createTodoSchema,
    deleteTodoSchema,
    updateTodoSchema,
} from "@/lib/validation/todo"
import { auth } from "@clerk/nextjs"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        // check the request body against the schema
        const parseResult = createTodoSchema.safeParse(body)
        // if the request body is invalid, return a 400 response
        if (!parseResult.success) {
            console.log("Parsing Error :", parseResult.error)
            return Response.json({ error: "Invalid Input" }, { status: 400 })
        }

        const { title, content } = parseResult.data
        const { userId } = auth()

        // only authenticated users can create todos
        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        // generate embedding
        const embedding = await getEmbeddingForTodo(title, content)

        // make sure entry is stored in mongo before saving embedding to pinecone
        // if either mongo operation fails or pinecone operations fails, entire tx block will not execute
        const todo = await prisma.$transaction(async (tx) => {
            const todo = await tx.todo.create({
                data: {
                    title,
                    content,
                    userId,
                },
            })

            await todosIndex.upsert([
                {
                    id: todo.id,
                    values: embedding,
                    metadata: { userId },
                },
            ])

            return todo
        })

        // create the todo
        // 201 new resource was created successfully
        return Response.json({ todo }, { status: 201 })
    } catch (error) {
        console.log(error)
        return Response.json(
            { error: "Internal Server Error" },
            { status: 500 },
        )
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json()

        const parseResult = updateTodoSchema.safeParse(body)
        // if the request body is invalid, return a 400 response
        if (!parseResult.success) {
            console.log("Parsing Error :", parseResult.error)
            return Response.json({ error: "Invalid Input" }, { status: 400 })
        }

        const { id, title, content } = parseResult.data

        const todo = await prisma.todo.findUnique({ where: { id } })

        // 404 resource not found
        if (!todo) {
            return Response.json({ error: "Todo not found" }, { status: 404 })
        }

        const { userId } = auth()
        // only authenticated users who own todo can update
        if (!userId || userId !== todo.userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        const embedding = await getEmbeddingForTodo(title, content)

        const updatedTodo = await prisma.$transaction(async (tx) => {
            const updatedTodo = await tx.todo.update({
                where: { id },
                data: {
                    title,
                    content,
                },
            })

            await todosIndex.upsert([
                {
                    id,
                    values: embedding,
                    metadata: { userId },
                },
            ])
            return updatedTodo
        })

        // existing resource was updated
        return Response.json({ updatedTodo }, { status: 200 })
    } catch (error) {
        console.log(error)
        return Response.json(
            { error: "Internal Server Error" },
            { status: 500 },
        )
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json()

        const parseResult = deleteTodoSchema.safeParse(body)
        // if the request body is invalid, return a 400 response
        if (!parseResult.success) {
            console.log("Parsing Error :", parseResult.error)
            return Response.json({ error: "Invalid Input" }, { status: 400 })
        }

        const { id } = parseResult.data

        const todo = await prisma.todo.findFirst({ where: { id } })

        // 404 resource not found
        if (!todo) {
            return Response.json({ error: "Todo not found" }, { status: 404 })
        }

        const { userId } = auth()
        // only authenticated users who own todo can delete
        if (!userId || userId !== todo.userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        await prisma.$transaction(async (tx) => {
            await tx.todo.delete({ where: { id } })
            await todosIndex.deleteOne(id)
        })

        // existing resource was deleted
        return Response.json({ message: "Todo was deleted" }, { status: 200 })
    } catch (error) {
        console.log(error)
        return Response.json(
            { error: "Internal Server Error" },
            { status: 500 },
        )
    }
}

async function getEmbeddingForTodo(title: string, content: string | undefined) {
    // format before embedding
    return getEmbedding(title + "\n\n" + content ?? "")
}
