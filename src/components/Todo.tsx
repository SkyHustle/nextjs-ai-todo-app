"use client"
import { Todo as TodoModel } from "@prisma/client"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card"
import AddEditTodoDialog from "./AddEditTodoDialog"
import { useState } from "react"

interface TodoProps {
    todo: TodoModel
}

export default function Todo({ todo }: TodoProps) {
    const [showEditTodoDialog, setShowEditTodoDialog] = useState(false)

    const wasUpdated = todo.updatedAt > todo.createdAt

    const createdUpdatedAtTimestamp = (
        wasUpdated ? todo.updatedAt : todo.createdAt
    ).toDateString()

    return (
        <>
            <Card
                onClick={() => setShowEditTodoDialog(true)}
                className="cursor-pointer transition-shadow hover:shadow-lg"
            >
                <CardHeader>
                    <CardTitle>{todo.title}</CardTitle>
                    <CardDescription>
                        {createdUpdatedAtTimestamp} {wasUpdated && " (updated)"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-line">{todo.content}</p>
                </CardContent>
            </Card>
            <AddEditTodoDialog
                open={showEditTodoDialog}
                setOpen={setShowEditTodoDialog}
                todoToEdit={todo}
            />
        </>
    )
}
