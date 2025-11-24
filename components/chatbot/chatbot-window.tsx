"use client";

// ============================================
// CHATBOT WINDOW - Main Chat Interface
// ============================================

import { useChatbot } from "@/lib/chatbot/chatbot-context";
import { cn } from "@/lib/utils";
import { ChatHeader } from "./chat-header";
import { ChatInputArea } from "./chat-input-area";
import { ChatMessagesList } from "./chat-messages-list";
import { ChatQuotaIndicator } from "./chat-quota-indicator";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

export function ChatbotWindow() {
    const {
        closeChat,
        messages,
        isLoading,
        error,
        sendMessage,
        submitFeedback,
    } = useChatbot();

    const pathname = usePathname();

    // Détecter la page actuelle pour les suggestions contextuelles
    const currentPage = useMemo((): string | undefined => {
        if (!pathname) return undefined;
        if (pathname.includes("/dashboard/clients")) return "CLIENTS";
        if (pathname.includes("/dashboard/articles")) return "ARTICLES";
        if (pathname.includes("/dashboard/stock")) return "STOCK";
        if (pathname.includes("/dashboard/segments")) return "SEGMENTS";
        if (pathname.includes("/dashboard/campaigns")) return "CAMPAIGNS";
        if (pathname.includes("/dashboard")) return "DASHBOARD";
        return undefined;
    }, [pathname]);

    // Quota mocké pour l'instant (TODO: à connecter avec l'API réelle)
    const quota = useMemo(
        () => ({ current: 15, max: 100 }),
        []
    );

    const handleRetry = () => {
        // Re-send le dernier message utilisateur
        const lastUserMessage = [...messages]
            .reverse()
            .find((m) => m.role === "user");
        if (lastUserMessage) {
            sendMessage(lastUserMessage.content);
        }
    };

    return (
        <div
            className={cn(
                "fixed bottom-24 right-6 w-[400px] h-[600px]",
                "bg-white rounded-lg border border-black/10 shadow-sm",
                "flex flex-col",
                "z-50"
            )}
        >
            <ChatHeader onClose={closeChat} />

            <ChatMessagesList
                messages={messages}
                isLoading={isLoading}
                error={error}
                currentPage={currentPage}
                onFeedback={submitFeedback}
                onSendMessage={sendMessage}
                onRetry={handleRetry}
            />

            {quota && (
                <ChatQuotaIndicator current={quota.current} max={quota.max} />
            )}

            <ChatInputArea onSubmit={sendMessage} disabled={isLoading} />
        </div>
    );
}
