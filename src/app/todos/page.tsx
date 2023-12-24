import prisma from "@/lib/db/prisma"
import { auth } from "@clerk/nextjs"
import { Metadata } from "next"
import Todo from "@/components/Todo"

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
        <div className="grid gap-3 sm:grid-cols-4">
            {allTodos.map((todo) => (
                <Todo todo={todo} key={todo.id} />
            ))}
            {allTodos.length === 0 && (
                <div className="col-span-full text-center">
                    {"You don't have any notes, go ahead and create some!"}
                </div>
            )}
        </div>
    )
}
