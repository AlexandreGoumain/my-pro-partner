// ============================================
// CHATBOT MESSAGE BUBBLE
// ============================================

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatbotMessageBubbleProps {
    role: "user" | "assistant";
    content: string;
    createdAt?: Date;
    messageId?: string;
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
    onFeedback,
}: ChatbotMessageBubbleProps) {
    const [feedbackGiven, setFeedbackGiven] = useState<
        "positive" | "negative" | null
    >(null);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [comment, setComment] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

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
