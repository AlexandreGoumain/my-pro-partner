// ============================================
// CHAT MESSAGES LIST COMPONENT
// ============================================

import { useEffect, useRef } from "react";
import { ChatbotMessageBubble } from "./chatbot-message-bubble";
import { ChatbotTypingIndicator } from "./chatbot-typing-indicator";
import { ChatWelcomeScreen } from "./chat-welcome-screen";
import { ChatErrorMessage } from "./chat-error-message";

interface ToolInvocation {
    toolCallId: string;
    toolName: string;
    args: Record<string, unknown>;
    state: "pending" | "result" | "error";
    result?: unknown;
}

export interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    createdAt?: Date;
    toolInvocations?: ToolInvocation[];
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
                    {messages
                        .filter((message) => message.role !== "system")
                        .map((message, index) => (
                        <ChatbotMessageBubble
                            key={message.id || index}
                            role={message.role as "user" | "assistant"}
                            content={message.content}
                            createdAt={message.createdAt}
                            messageId={message.id}
                            toolInvocations={message.toolInvocations}
                            onFeedback={onFeedback}
                        />
                    ))}

                    {isLoading && <ChatbotTypingIndicator />}

                    {error && (
                        <ChatErrorMessage
                            error={error}
                            onRetry={onRetry}
                            onSuggestionClick={onSendMessage}
                        />
                    )}

                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>
    );
}
