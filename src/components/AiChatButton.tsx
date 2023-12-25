import { useState } from "react"
import AiChatBot from "./AiChatBot"
import { Button } from "./ui/button"
import { Bot } from "lucide-react"

export default function AiChatButton() {
    const [chatBotOpen, setChatBotOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setChatBotOpen(!chatBotOpen)}>
                <Bot size={20} className="mr-2" />
                Ai ChatBot
            </Button>
            <AiChatBot
                open={chatBotOpen}
                onClose={() => setChatBotOpen(false)}
            />
        </>
    )
}
