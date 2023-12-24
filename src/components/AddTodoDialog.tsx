import { CreateTodoSchema, createTodoSchema } from "@/lib/validation/todo"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"

interface AddTodoDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
}

export default function AddTodoDialog({ open, setOpen }: AddTodoDialogProps) {
    // connect userForm to zod schema
    const form = useForm<CreateTodoSchema>({
        // resolver does the actual form validation
        resolver: zodResolver(createTodoSchema),
    })

    async function onSubmit(input: CreateTodoSchema) {
        alert(input)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Todo</DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
