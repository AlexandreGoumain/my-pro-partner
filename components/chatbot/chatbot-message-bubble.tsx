// ============================================
// CHATBOT MESSAGE BUBBLE
// ============================================

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ChatToolCalls } from "./chat-tool-call";

interface ToolInvocation {
    toolCallId: string;
    toolName: string;
    args: Record<string, unknown>;
    state: "pending" | "result" | "error";
    result?: unknown;
}

interface ChatbotMessageBubbleProps {
    role: "user" | "assistant";
    content: string;
    createdAt?: Date;
    messageId?: string;
    toolInvocations?: ToolInvocation[];
    onFeedback?: (
        messageId: string,
        feedback: "positive" | "negative",
        comment?: string
    ) => void;
}

export function ChatbotMessageBubble({
    role,
    content,
    createdAt,
    messageId,
    toolInvocations,
    onFeedback,
}: ChatbotMessageBubbleProps) {
    const [feedbackGiven, setFeedbackGiven] = useState<
        "positive" | "negative" | null
    >(null);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [comment, setComment] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [copied, setCopied] = useState(false);

    const isUser = role === "user";

    const handleFeedback = async (
        feedback: "positive" | "negative",
        commentText?: string
    ) => {
        if (messageId && onFeedback && !feedbackGiven) {
            setFeedbackGiven(feedback);
            await onFeedback(messageId, feedback, commentText);
            setShowCommentInput(false);
            setComment("");
        }
    };

    const handleNegativeFeedback = () => {
        setShowCommentInput(true);
    };

    const handleSubmitComment = async () => {
        setIsSubmittingComment(true);
        await handleFeedback("negative", comment || undefined);
        setIsSubmittingComment(false);
    };

    const handleCancelComment = () => {
        setShowCommentInput(false);
        setComment("");
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
            <div
                className={cn(
                    "flex flex-col",
                    isUser ? "items-end" : "items-start"
                )}
            >
                {/* Tool Calls */}
                {!isUser && toolInvocations && toolInvocations.length > 0 && (
                    <ChatToolCalls toolInvocations={toolInvocations} />
                )}

                {/* Message Content */}
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
                        <div className="text-[14px] prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-pre:my-2 prose-code:text-[12px]">
                            <ReactMarkdown
                                components={{
                                    code({ className, children, ...props }) {
                                        const isInline =
                                            typeof children === "string" &&
                                            !children.includes("\n");

                                        if (isInline) {
                                            return (
                                                <code
                                                    className="bg-black/10 px-1 py-0.5 rounded text-[12px] font-mono"
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            );
                                        }

                                        return (
                                            <code
                                                className={cn(
                                                    "block bg-black/5 p-2 rounded text-[12px] overflow-x-auto font-mono whitespace-pre-wrap",
                                                    className
                                                )}
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        );
                                    },
                                    pre({ children }) {
                                        return (
                                            <pre className="bg-black/5 rounded-md overflow-x-auto my-2">
                                                {children}
                                            </pre>
                                        );
                                    },
                                    table({ children }) {
                                        return (
                                            <div className="overflow-x-auto my-2">
                                                <table className="min-w-full text-[12px] border-collapse">
                                                    {children}
                                                </table>
                                            </div>
                                        );
                                    },
                                    th({ children }) {
                                        return (
                                            <th className="border border-black/10 px-2 py-1 bg-black/5 text-left font-medium">
                                                {children}
                                            </th>
                                        );
                                    },
                                    td({ children }) {
                                        return (
                                            <td className="border border-black/10 px-2 py-1">
                                                {children}
                                            </td>
                                        );
                                    },
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>

                {/* Footer: Time + Actions */}
                <div className="flex items-center gap-2 mt-1 px-1">
                    {createdAt && (
                        <span className="text-[11px] text-black/30">
                            {format(createdAt, "HH:mm", { locale: fr })}
                        </span>
                    )}

                    {/* Copy button for assistant messages */}
                    {!isUser && content && (
                        <button
                            onClick={handleCopy}
                            className="p-1 rounded hover:bg-black/5 transition-colors text-black/30 hover:text-black/60"
                            title="Copier"
                        >
                            {copied ? (
                                <Check
                                    className="w-3 h-3 text-green-600"
                                    strokeWidth={2}
                                />
                            ) : (
                                <Copy className="w-3 h-3" strokeWidth={2} />
                            )}
                        </button>
                    )}

                    {/* Feedback buttons */}
                    {!isUser && messageId && onFeedback && !showCommentInput && (
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
                                        "opacity-30",
                                    feedbackGiven && "cursor-not-allowed"
                                )}
                            >
                                <ThumbsUp className="w-3 h-3" strokeWidth={2} />
                            </button>
                            <button
                                onClick={handleNegativeFeedback}
                                disabled={!!feedbackGiven}
                                className={cn(
                                    "p-1 rounded hover:bg-black/5 transition-colors",
                                    feedbackGiven === "negative" &&
                                        "text-red-600",
                                    feedbackGiven &&
                                        feedbackGiven !== "negative" &&
                                        "opacity-30",
                                    feedbackGiven && "cursor-not-allowed"
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

                {/* Formulaire de commentaire pour feedback négatif */}
                {showCommentInput && !feedbackGiven && (
                    <div className="max-w-[280px] mt-2 space-y-2">
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Qu'est-ce qui n'allait pas ? (optionnel)"
                            className="text-[12px] min-h-[60px] resize-none border-black/10 focus:border-black/20"
                            disabled={isSubmittingComment}
                        />
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={handleSubmitComment}
                                disabled={isSubmittingComment}
                                className="h-8 text-[12px] bg-black hover:bg-black/90"
                            >
                                {isSubmittingComment ? "Envoi..." : "Envoyer"}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelComment}
                                disabled={isSubmittingComment}
                                className="h-8 text-[12px] border-black/10 hover:bg-black/5"
                            >
                                Annuler
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
