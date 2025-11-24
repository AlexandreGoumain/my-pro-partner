// ============================================
// CHAT MESSAGES LIST COMPONENT
// ============================================

import { useEffect, useRef } from "react";
import { ChatbotMessageBubble } from "./chatbot-message-bubble";
import { ChatbotTypingIndicator } from "./chatbot-typing-indicator";
import { ChatWelcomeScreen } from "./chat-welcome-screen";
import { ChatErrorMessage } from "./chat-error-message";

export interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    createdAt?: Date;
}

export interface ChatMessagesListProps {
    messages: Message[];
    isLoading: boolean;
    error?: Error | null;
    userName?: string;
    currentPage?: string;
    onFeedback: (
        messageId: string,
        feedback: "positive" | "negative",
        comment?: string
    ) => Promise<void>;
    onSendMessage: (message: string) => void;
    onRetry?: () => void;
}

export function ChatMessagesList({
    messages,
    isLoading,
    error,
    userName,
    currentPage,
    onFeedback,
    onSendMessage,
    onRetry,
}: ChatMessagesListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
                <ChatWelcomeScreen
                    onSuggestionClick={onSendMessage}
                    userName={userName}
                    currentPage={currentPage}
                />
            ) : (
                <div className="px-4 py-4 space-y-4">
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

                    {error && <ChatErrorMessage error={error} onRetry={onRetry} />}

                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>
    );
}
