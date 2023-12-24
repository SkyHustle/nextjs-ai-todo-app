import prisma from "@/lib/db/prisma"
import { auth } from "@clerk/nextjs"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "AiTodo - Todos",
}

// data fetching will be executed on the server
// and only the finished layout will be sent to the client
// this is the default behavior of Next.js
export default async function TodosPage() {
    const { userId } = auth()

    if (!userId) throw new Error("User id not defined")

    const allTodos = await prisma.todo.findMany({ where: { userId } })

    return (
        <div>
            <h1>{JSON.stringify(allTodos)}</h1>
        </div>
    )
}
