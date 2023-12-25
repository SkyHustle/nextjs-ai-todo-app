"use client"
import Link from "next/link"
import Image from "next/image"
import logo from "@/assets/logo.png"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import AddEditTodoDialog from "@/components/AddEditTodoDialog"
import { ModeToggle } from "@/components/ModeToggle"

export default function NavBar() {
    const [showAddTodoDialog, setShowAddTodoDialog] = useState(false)
    return (
        <>
            <div className="p-4 shadow">
                <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
                    <Link href="/todos" className="flex items-center gap-2">
                        <Image
                            src={logo}
                            alt="AiTodo Logo"
                            width={40}
                            height={40}
                        />
                        <span className="font-bold">aiTodo</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setShowAddTodoDialog(true)}>
                            <Plus size={20} className="mr-2" /> Add Todo
                        </Button>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: {
                                        width: "2.5rem",
                                        height: "2.5rem",
                                    },
                                },
                            }}
                        />
                        <ModeToggle />
                    </div>
                </div>
            </div>
            <AddEditTodoDialog
                open={showAddTodoDialog}
                setOpen={setShowAddTodoDialog}
            />
        </>
    )
}
