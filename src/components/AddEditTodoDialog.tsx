import { CreateTodoSchema, createTodoSchema } from "@/lib/validation/todo"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import LoadingButton from "./ui/loading-button"
import { useRouter } from "next/navigation"
import { Todo } from "@prisma/client"
import { useState } from "react"

interface AddEditTodoDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    todoToEdit?: Todo
}

export default function AddEditTodoDialog({
    open,
    setOpen,
    todoToEdit,
}: AddEditTodoDialogProps) {
    const [deleteInProgress, setDeleteInProgress] = useState(false)

    const router = useRouter()

    // connect userForm to zod schema
    const form = useForm<CreateTodoSchema>({
        // resolver does the actual form validation
        resolver: zodResolver(createTodoSchema),
        defaultValues: {
            title: todoToEdit?.title || "",
            content: todoToEdit?.content || "",
        },
    })

    async function onSubmit(input: CreateTodoSchema) {
        try {
            if (todoToEdit) {
                const response = await fetch("/api/todos", {
                    method: "PUT",
                    body: JSON.stringify({
                        id: todoToEdit.id,
                        ...input,
                    }),
                })
                if (!response.ok) throw Error("Status code: " + response.status)
            } else {
                // use native JS fetch
                const response = await fetch("/api/todos", {
                    method: "POST",
                    body: JSON.stringify(input),
                })

                if (!response.ok) throw Error("Status code: " + response.status)
                form.reset()
            }
            // refresh to server component(todos/page)
            router.refresh()
            setOpen(false)
        } catch (error) {
            console.error(error)
            alert("Something went wrong, please try again")
            // a toast notification here would be better
        }
    }

    async function deleteTodo() {
        if (!todoToEdit) return
        setDeleteInProgress(true)
        try {
            const response = await fetch("/api/todos", {
                method: "DELETE",
                body: JSON.stringify({
                    id: todoToEdit.id,
                }),
            })
            if (!response.ok) throw Error("Status code: " + response.status)

            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Something went wrong, please try again")
            // a toast notification here would be better
        } finally {
            setDeleteInProgress(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {todoToEdit ? "Edit Todo" : "Create Todo"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-3"
                    >
                        <FormField
                            name="title"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Todo Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="todo title"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="content"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Todo Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="todo content"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="gap-1 sm:gap-0">
                            {todoToEdit && (
                                <LoadingButton
                                    type="button"
                                    variant="destructive"
                                    loading={deleteInProgress}
                                    disabled={form.formState.isSubmitting}
                                    onClick={deleteTodo}
                                >
                                    Delete
                                </LoadingButton>
                            )}
                            <LoadingButton
                                type="submit"
                                loading={form.formState.isSubmitting}
                                disabled={deleteInProgress}
                            >
                                Submit
                            </LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
