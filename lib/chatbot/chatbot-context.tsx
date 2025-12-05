"use client";

// ============================================
// CHATBOT CONTEXT - Global State Management
// ============================================

import {
    useChatbot as useChatbotHook,
    type ChatMessage,
    type Conversation,
    type FeedbackType,
} from "@/hooks/chatbot";
import React, { createContext, useContext } from "react";

interface ChatbotContextValue {
    // État
    isOpen: boolean;
    isHistoryOpen: boolean;
    conversations: Conversation[];
    currentConversationId: string | null;
    isLoadingConversations: boolean;
    searchQuery: string;

    // Messages
    messages: ChatMessage[];
    input: string;
    isLoading: boolean;
    error: Error | null;

    // Actions
    openChat: () => void;
    closeChat: () => void;
    toggleHistory: () => void;
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    sendMessage: (content?: string) => void;
    stop: () => void;
    startNewConversation: () => void;
    loadConversation: (id: string) => Promise<void>;
    deleteConversation: (id: string) => Promise<void>;
    pinConversation: (id: string, pinned: boolean) => Promise<void>;
    searchConversations: (query: string) => void;
    exportConversation: (id: string, format: "txt" | "json") => Promise<void>;
    submitFeedback: (
        messageId: string,
        feedback: FeedbackType,
        comment?: string
    ) => Promise<void>;
}

const ChatbotContext = createContext<ChatbotContextValue | undefined>(
    undefined
);

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
    // Use the new unified hook
    const chatbot = useChatbotHook();

    return (
        <ChatbotContext.Provider value={chatbot}>
            {children}
        </ChatbotContext.Provider>
    );
}

export function useChatbot() {
    const context = useContext(ChatbotContext);
    if (!context) {
        throw new Error("useChatbot must be used within ChatbotProvider");
    }
    return context;
}

// Re-export types for convenience
export type { ChatMessage, Conversation, FeedbackType };
