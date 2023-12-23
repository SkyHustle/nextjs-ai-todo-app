import Image from "next/image"
import logo from "@/assets/logo.png"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default function Home() {
    const { userId } = auth()
    if (userId) redirect("/todos")

    return (
        <main className="flex h-screen flex-col items-center justify-center gap-5">
            <div className="flex items-center gap-4">
                <Image src={logo} alt="AiTodo logo" width={100} height={100} />
                <span className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                    AiTodo
                </span>
            </div>
            <p className="max-w-prose text-center text-gray-500">
                AiTodo is a todo app that uses AI to help you manage your todos.
                Built with OpenAi integration, Pinecone, Next.js, Shadcn UI,
                Tailwind, Clerk and more.
            </p>
            <Button size="lg" asChild>
                <Link href="/todos">Get Started</Link>
            </Button>
        </main>
    )
}
