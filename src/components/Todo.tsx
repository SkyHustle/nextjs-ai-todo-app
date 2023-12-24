import { Todo as TodoModel } from "@prisma/client"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card"

interface TodoProps {
    todo: TodoModel
}

export default function Todo({ todo }: TodoProps) {
    const wasUpdated = todo.updatedAt > todo.createdAt

    const createdUpdatedAtTimestamp = (
        wasUpdated ? todo.updatedAt : todo.createdAt
    ).toDateString()

    return (
        <Card>
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
    )
}
