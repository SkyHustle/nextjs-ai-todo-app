// create endpoint to create a new todo
import prisma from "@/lib/db/prisma"
import { createTodoSchema } from "@/lib/validation/todo"
import { auth } from "@clerk/nextjs"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        // check the request body against the schema
        const parseResult = createTodoSchema.safeParse(body)
        // if the request body is invalid, return a 400 response
        if (!parseResult.success) {
            console.log(parseResult.error)
            return Response.json({ error: "Invalid Input" }, { status: 400 })
        }

        const { title, content } = parseResult.data
        const { userId } = auth()

        // only authenticated users can create todos
        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        // create the todo
        const todo = await prisma.todo.create({
            data: {
                title,
                content,
                userId,
            },
        })
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
