// ============================================
// CHATBOT MESSAGE BUBBLE
// ============================================

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface ChatbotMessageBubbleProps {
    role: "user" | "assistant";
    content: string;
    createdAt?: Date;
    messageId?: string;
    onFeedback?: (messageId: string, feedback: "positive" | "negative") => void;
}

export function ChatbotMessageBubble({
    role,
    content,
    createdAt,
    messageId,
    onFeedback,
}: ChatbotMessageBubbleProps) {
    const [feedbackGiven, setFeedbackGiven] = useState<
        "positive" | "negative" | null
    >(null);

    const isUser = role === "user";

    const handleFeedback = (feedback: "positive" | "negative") => {
        if (messageId && onFeedback && !feedbackGiven) {
            setFeedbackGiven(feedback);
            onFeedback(messageId, feedback);
        }
    };

    return (
        <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
            <div
                className={cn(
                    "flex flex-col",
                    isUser ? "items-end" : "items-start"
                )}
            >
                <div
                    className={cn(
                        "max-w-[280px] px-4 py-2.5 rounded-2xl break-words",
                        isUser
                            ? "bg-black text-white rounded-br-md"
                            : "bg-black/5 text-black rounded-bl-md"
                    )}
                >
                    {isUser ? (
                        <p className="text-[14px] whitespace-pre-wrap">
                            {content}
                        </p>
                    ) : (
                        <div className="text-[14px] prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-1 px-1">
                    {createdAt && (
                        <span className="text-[11px] text-black/30">
                            {format(createdAt, "HH:mm", { locale: fr })}
                        </span>
                    )}

                    {!isUser && messageId && onFeedback && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handleFeedback("positive")}
                                disabled={!!feedbackGiven}
                                className={cn(
                                    "p-1 rounded hover:bg-black/5 transition-colors",
                                    feedbackGiven === "positive" &&
                                        "text-green-600",
                                    feedbackGiven &&
                                        feedbackGiven !== "positive" &&
                                        "opacity-30"
                                )}
                            >
                                <ThumbsUp className="w-3 h-3" strokeWidth={2} />
                            </button>
                            <button
                                onClick={() => handleFeedback("negative")}
                                disabled={!!feedbackGiven}
                                className={cn(
                                    "p-1 rounded hover:bg-black/5 transition-colors",
                                    feedbackGiven === "negative" &&
                                        "text-red-600",
                                    feedbackGiven &&
                                        feedbackGiven !== "negative" &&
                                        "opacity-30"
                                )}
                            >
                                <ThumbsDown
                                    className="w-3 h-3"
                                    strokeWidth={2}
                                />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
