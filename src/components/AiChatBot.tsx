import { cn } from "@/lib/utils"
import { useChat } from "ai/react"
import { Bot, Trash, XCircle } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Message } from "ai"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import { useEffect, useRef } from "react"

interface AiChatBotProps {
    open: boolean
    onClose: () => void
}

export default function AiChatBot({ open, onClose }: AiChatBotProps) {
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        setMessages,
        isLoading,
        error,
    } = useChat()

    // ref allows us to access a HTML Element Directly
    const inputRef = useRef<HTMLInputElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    // will trigger re-render whenever messages changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    useEffect(() => {
        if (open) {
            inputRef.current?.focus()
        }
    }, [open])

    return (
        <div
            className={cn(
                "bottom-2 right-0 z-10 w-full max-w-[500px] p-1 xl:right-20",
                open ? "fixed" : "hidden",
            )}
        >
            <button onClick={onClose} className="mb-1 ms-auto block">
                <XCircle size={30} />
            </button>
            <div className="flex h-[600px] flex-col rounded border bg-background shadow-xl">
                <div
                    className="mt-3 h-full overflow-y-auto px-3"
                    ref={scrollRef}
                >
                    {messages.map((message) => (
                        <ChatMessage message={message} key={message.id} />
                    ))}
                </div>
                {/* Regular HTML form, don't need input validation, form logic handled by vercel ai SDK */}
                <form onSubmit={handleSubmit} className="m-3 flex gap-1">
                    {/* shadcn Input and Button look better */}
                    <Button
                        title="Clear Chat"
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                        type="button"
                        onClick={() => setMessages([])}
                    >
                        <Trash />
                    </Button>
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask a question about your todos..."
                        ref={inputRef}
                    />
                    <Button type="submit">Send</Button>
                </form>
            </div>
        </div>
    )
}

function ChatMessage({ message: { role, content } }: { message: Message }) {
    const { user } = useUser()

    const isAiMessage = role === "assistant"

    return (
        <div
            className={cn(
                "mb-3 flex items-center",
                isAiMessage ? "me-5 justify-start" : "ms-5 justify-end",
            )}
        >
            {isAiMessage && <Bot className="mr-2 shrink-0" />}
            <p
                className={cn(
                    "whitespace-pre-line rounded-md border px-3 py-2",
                    isAiMessage
                        ? "bg-background"
                        : "bg-primary text-primary-foreground",
                )}
            >
                {content}
            </p>
            {!isAiMessage && user?.imageUrl && (
                <Image
                    src={user.imageUrl}
                    alt="User Image"
                    width={100}
                    height={100}
                    className="object-conver ml-2 h-10 w-10 rounded-full"
                />
            )}
        </div>
    )
}
