"use client";

// ============================================
// CHATBOT WIDGET - Floating Button + Window
// ============================================

import { useChatbot } from "@/lib/chatbot/chatbot-context";
import { cn } from "@/lib/utils";
import { MessageSquare, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatbotWindow } from "./chatbot-window";

export function ChatbotWidget() {
    const { isOpen, openChat, closeChat } = useChatbot();

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

            {/* Bouton flottant */}
            <button
                onClick={isOpen ? closeChat : openChat}
                className={cn(
                    "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-sm",
                    "bg-black hover:bg-black/90 text-white",
                    "flex items-center justify-center",
                    "transition-all duration-200",
                    "z-50"
                )}
                aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
            >
                {isOpen ? (
                    <X className="w-6 h-6" strokeWidth={2} />
                ) : (
                    <MessageSquare className="w-6 h-6" strokeWidth={2} />
                )}
            </button>
        </>
    );
}
