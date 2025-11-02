"use client";

// ============================================
// CHATBOT WINDOW - Main Chat Interface
// ============================================

import { useChatbot } from "@/lib/chatbot/chatbot-context";
import { cn } from "@/lib/utils";
import { ChatHeader } from "./chat-header";
import { ChatInputArea } from "./chat-input-area";
import { ChatMessagesList } from "./chat-messages-list";

export function ChatbotWindow() {
    const { closeChat, messages, isLoading, sendMessage, submitFeedback } =
        useChatbot();

    return (
        <div
            className={cn(
                "fixed bottom-24 right-6 w-[400px] h-[600px]",
                "bg-white rounded-lg border border-black/10 shadow-sm",
                "flex flex-col",
                "z-50"
            )}
        >
            <ChatHeader onClose={closeChat} />

            <ChatMessagesList
                messages={messages}
                isLoading={isLoading}
                onFeedback={submitFeedback}
            />

            <ChatInputArea onSubmit={sendMessage} disabled={isLoading} />
        </div>
    );
}
