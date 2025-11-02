// ============================================
// CHAT MESSAGES LIST COMPONENT
// ============================================

import { useEffect, useRef } from "react";
import { ChatbotEmptyState } from "./chatbot-empty-state";
import { ChatbotMessageBubble } from "./chatbot-message-bubble";
import { ChatbotTypingIndicator } from "./chatbot-typing-indicator";

export interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    createdAt?: Date;
}

export interface ChatMessagesListProps {
    messages: Message[];
    isLoading: boolean;
    onFeedback: (
        messageId: string,
        feedback: "positive" | "negative",
        comment?: string
    ) => Promise<void>;
}

export function ChatMessagesList({
    messages,
    isLoading,
    onFeedback,
}: ChatMessagesListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.length === 0 ? (
                <ChatbotEmptyState />
            ) : (
                <>
                    {messages.map((message, index) => (
                        <ChatbotMessageBubble
                            key={message.id || index}
                            role={message.role}
                            content={message.content}
                            createdAt={message.createdAt}
                            messageId={message.id}
                            onFeedback={onFeedback}
                        />
                    ))}

                    {isLoading && <ChatbotTypingIndicator />}

                    <div ref={messagesEndRef} />
                </>
            )}
        </div>
    );
}
