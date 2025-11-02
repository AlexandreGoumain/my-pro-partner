"use client";

// ============================================
// CHATBOT CONTEXT - Global State Management
// ============================================

import React, { createContext, useContext, useEffect } from "react";
import { useChatbotState } from "./hooks/use-chatbot-state";
import type { Conversation } from "./hooks/use-conversations";
import { useConversations } from "./hooks/use-conversations";
import { useMessageStreaming } from "./hooks/use-message-streaming";
import type { Message } from "./hooks/use-messages";
import { useMessages } from "./hooks/use-messages";

interface ChatbotContextValue {
    // État
    isOpen: boolean;
    isHistoryOpen: boolean;
    conversations: Conversation[];
    currentConversationId: string | null;
    isLoadingConversations: boolean;

    // Messages
    messages: Message[];
    isLoading: boolean;
    error: Error | null;

    // Actions
    openChat: () => void;
    closeChat: () => void;
    toggleHistory: () => void;
    sendMessage: (content: string) => Promise<void>;
    startNewConversation: () => void;
    loadConversation: (id: string) => Promise<void>;
    deleteConversation: (id: string) => Promise<void>;
    pinConversation: (id: string, pinned: boolean) => Promise<void>;
    submitFeedback: (
        messageId: string,
        feedback: "positive" | "negative",
        comment?: string
    ) => Promise<void>;
}

const ChatbotContext = createContext<ChatbotContextValue | undefined>(
    undefined
);

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
    // Use custom hooks
    const { isOpen, isHistoryOpen, openChat, closeChat, toggleHistory } =
        useChatbotState();
    const { messages, setMessages, clearMessages } = useMessages();
    const {
        conversations,
        currentConversationId,
        isLoadingConversations,
        loadConversations,
        loadConversation,
        deleteConversation,
        pinConversation,
        setCurrentConversationId,
    } = useConversations();

    const { isLoading, error, sendMessage, submitFeedback } =
        useMessageStreaming({
            messages,
            setMessages,
            currentConversationId,
            setCurrentConversationId,
            loadConversations,
        });

    // Load conversations when chat opens
    useEffect(() => {
        if (isOpen) {
            loadConversations();
        }
    }, [isOpen, loadConversations]);

    // Start new conversation
    const startNewConversation = () => {
        setCurrentConversationId(null);
        clearMessages();
    };

    // Load a specific conversation
    const handleLoadConversation = async (id: string) => {
        const conversationMessages = await loadConversation(id);
        setMessages(conversationMessages);
    };

    // Handle conversation deletion
    const handleDeleteConversation = async (id: string) => {
        await deleteConversation(id);
        if (id === currentConversationId) {
            startNewConversation();
        }
    };

    const value: ChatbotContextValue = {
        isOpen,
        isHistoryOpen,
        conversations,
        currentConversationId,
        isLoadingConversations,
        messages,
        isLoading,
        error,
        openChat,
        closeChat,
        toggleHistory,
        sendMessage,
        startNewConversation,
        loadConversation: handleLoadConversation,
        deleteConversation: handleDeleteConversation,
        pinConversation,
        submitFeedback,
    };

    return (
        <ChatbotContext.Provider value={value}>
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
