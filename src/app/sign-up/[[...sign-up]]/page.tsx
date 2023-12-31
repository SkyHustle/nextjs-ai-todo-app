import { Metadata } from "next"
import { SignUp } from "@clerk/nextjs"

export const metadata: Metadata = {
    title: "AiTodo - Sign Up",
}

export default function SignUpPage() {
    return (
        <div className="flex h-screen items-center justify-center">
            <SignUp appearance={{ variables: { colorPrimary: "#0F172A" } }} />
        </div>
    )
}
