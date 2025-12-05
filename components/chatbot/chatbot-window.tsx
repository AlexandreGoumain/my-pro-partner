"use client";

// ============================================
// CHATBOT WINDOW - Main Chat Interface
// ============================================

import { useChatbot } from "@/lib/chatbot/chatbot-context";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { ChatHeader } from "./chat-header";
import { ChatHistoryPanel } from "./chat-history-panel";
import { ChatInputArea } from "./chat-input-area";
import { ChatMessagesList } from "./chat-messages-list";
import { ChatQuotaIndicator } from "./chat-quota-indicator";

export function ChatbotWindow() {
    const {
        closeChat,
        messages,
        isLoading,
        error,
        sendMessage,
        submitFeedback,
        // History features
        isHistoryOpen,
        toggleHistory,
        conversations,
        currentConversationId,
        isLoadingConversations,
        startNewConversation,
        loadConversation,
        deleteConversation,
        pinConversation,
        searchConversations,
        exportConversation,
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
    const quota = useMemo(() => ({ current: 15, max: 100 }), []);

    const handleRetry = useCallback(() => {
        // Re-send le dernier message utilisateur
        const lastUserMessage = [...messages]
            .reverse()
            .find((m) => m.role === "user");
        if (lastUserMessage) {
            sendMessage(lastUserMessage.content);
        }
    }, [messages, sendMessage]);

    const handleSelectConversation = useCallback(
        async (id: string) => {
            await loadConversation(id);
            toggleHistory();
        },
        [loadConversation, toggleHistory]
    );

    const handleNewConversation = useCallback(() => {
        startNewConversation();
        if (isHistoryOpen) {
            toggleHistory();
        }
    }, [startNewConversation, isHistoryOpen, toggleHistory]);

    return (
        <div
            className={cn(
                "fixed bottom-24 right-6 w-[400px] h-[600px]",
                "bg-white rounded-lg border border-black/10 shadow-sm",
                "flex flex-col overflow-hidden",
                "z-50"
            )}
        >
            <ChatHeader
                onClose={closeChat}
                onToggleHistory={toggleHistory}
                onNewConversation={handleNewConversation}
                isHistoryOpen={isHistoryOpen}
            />

            <div className="relative flex-1 flex flex-col overflow-hidden">
                {/* History Panel with animation */}
                <AnimatePresence>
                    {isHistoryOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 z-20"
                        >
                            <ChatHistoryPanel
                                conversations={conversations}
                                currentConversationId={currentConversationId}
                                isLoading={isLoadingConversations}
                                onClose={toggleHistory}
                                onNewConversation={handleNewConversation}
                                onSelectConversation={handleSelectConversation}
                                onDeleteConversation={deleteConversation}
                                onPinConversation={pinConversation}
                                onSearch={searchConversations}
                                onExport={exportConversation}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main chat content */}
                <ChatMessagesList
                    messages={messages}
                    isLoading={isLoading}
                    error={error}
                    currentPage={currentPage}
                    onFeedback={submitFeedback}
                    onSendMessage={sendMessage}
                    onRetry={handleRetry}
                />
            </div>

            {quota && (
                <ChatQuotaIndicator current={quota.current} max={quota.max} />
            )}

            <ChatInputArea onSubmit={sendMessage} disabled={isLoading} />
        </div>
    );
}
