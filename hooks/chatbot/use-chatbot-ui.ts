"use client";

import { useCallback, useState } from "react";

export interface ChatbotUIState {
    isOpen: boolean;
    isHistoryOpen: boolean;
    openChat: () => void;
    closeChat: () => void;
    toggleChat: () => void;
    toggleHistory: () => void;
    openHistory: () => void;
    closeHistory: () => void;
}

/**
 * Hook to manage chatbot UI state (open/close, history panel)
 */
export function useChatbotUI(): ChatbotUIState {
    const [isOpen, setIsOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const openChat = useCallback(() => {
        setIsOpen(true);
    }, []);

    const closeChat = useCallback(() => {
        setIsOpen(false);
        setIsHistoryOpen(false);
    }, []);

    const toggleChat = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const toggleHistory = useCallback(() => {
        setIsHistoryOpen((prev) => !prev);
    }, []);

    const openHistory = useCallback(() => {
        setIsHistoryOpen(true);
    }, []);

    const closeHistory = useCallback(() => {
        setIsHistoryOpen(false);
    }, []);

    return {
        isOpen,
        isHistoryOpen,
        openChat,
        closeChat,
        toggleChat,
        toggleHistory,
        openHistory,
        closeHistory,
    };
}
