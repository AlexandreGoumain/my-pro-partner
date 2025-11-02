// ============================================
// CHAT INPUT AREA COMPONENT
// ============================================

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface ChatInputAreaProps {
    onSubmit: (message: string) => Promise<void>;
    disabled?: boolean;
}

export function ChatInputArea({
    onSubmit,
    disabled = false,
}: ChatInputAreaProps) {
    const [input, setInput] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Focus on input when component mounts
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || disabled) return;

        const message = input.trim();
        setInput("");
        await onSubmit(message);

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);

        // Auto-resize textarea
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t border-black/10">
            <div className="flex items-end gap-2">
                <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Message à l'assistant..."
                    className="flex-1 min-h-[44px] max-h-[120px] resize-none border-black/10 focus:border-black/20 text-[14px]"
                    disabled={disabled}
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || disabled}
                    className="h-11 w-11 bg-black hover:bg-black/90 shrink-0 shadow-sm"
                >
                    <Send className="w-4 h-4" strokeWidth={2} />
                </Button>
            </div>
            <p className="text-[11px] text-black/30 mt-2">
                <kbd className="px-1.5 py-0.5 bg-black/5 rounded text-[10px]">
                    Entrée
                </kbd>{" "}
                pour envoyer ·{" "}
                <kbd className="px-1.5 py-0.5 bg-black/5 rounded text-[10px]">
                    Shift + Entrée
                </kbd>{" "}
                pour nouvelle ligne
            </p>
        </form>
    );
}
