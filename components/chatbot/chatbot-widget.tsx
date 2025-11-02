"use client";

// ============================================
// CHATBOT WIDGET - Floating Button + Window
// ============================================

import { useChatbot } from "@/lib/chatbot/chatbot-context";
import { cn } from "@/lib/utils";
import { MessageSquare, X } from "lucide-react";
import { ChatbotWindow } from "./chatbot-window";

export function ChatbotWidget() {
    const { isOpen, openChat, closeChat } = useChatbot();

    return (
        <>
            {/* Fenêtre du chat */}
            {isOpen && <ChatbotWindow />}

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
