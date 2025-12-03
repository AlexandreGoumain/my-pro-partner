"use client";

// ============================================
// CHATBOT WIDGET - Floating Button + Window
// ============================================

import { useChatbot } from "@/lib/chatbot/chatbot-context";
import { cn } from "@/lib/utils";
import { MessageSquare, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useCallback } from "react";
import { ChatbotWindow } from "./chatbot-window";

export function ChatbotWidget() {
    const { isOpen, openChat, closeChat } = useChatbot();

    // Keyboard shortcuts
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            // Cmd/Ctrl + K to toggle chat
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                if (isOpen) {
                    closeChat();
                } else {
                    openChat();
                }
            }

            // Escape to close chat
            if (e.key === "Escape" && isOpen) {
                e.preventDefault();
                closeChat();
            }
        },
        [isOpen, openChat, closeChat]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <>
            {/* Fenêtre du chat avec animation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <ChatbotWindow />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bouton flottant avec indication raccourci */}
            <button
                onClick={isOpen ? closeChat : openChat}
                className={cn(
                    "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-sm",
                    "bg-black hover:bg-black/90 text-white",
                    "flex items-center justify-center",
                    "transition-all duration-200",
                    "z-50 group"
                )}
                aria-label={isOpen ? "Fermer le chat (Échap)" : "Ouvrir le chat (⌘K)"}
            >
                {isOpen ? (
                    <X className="w-6 h-6" strokeWidth={2} />
                ) : (
                    <MessageSquare className="w-6 h-6" strokeWidth={2} />
                )}

                {/* Tooltip avec raccourci */}
                {!isOpen && (
                    <span
                        className={cn(
                            "absolute right-full mr-3 px-2 py-1",
                            "bg-black text-white text-[11px] rounded whitespace-nowrap",
                            "opacity-0 group-hover:opacity-100 transition-opacity",
                            "pointer-events-none"
                        )}
                    >
                        Assistant IA
                        <kbd className="ml-2 px-1 py-0.5 bg-white/20 rounded text-[10px]">
                            ⌘K
                        </kbd>
                    </span>
                )}
            </button>
        </>
    );
}
