// ============================================
// CHATBOT STATE HOOK - UI State Management
// ============================================

import { useState, useCallback } from 'react';

export interface ChatbotState {
  isOpen: boolean;
  isHistoryOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleHistory: () => void;
}

/**
 * Hook to manage chatbot UI state (open/close, history visibility)
 */
export function useChatbotState(): ChatbotState {
  const [isOpen, setIsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const openChat = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setIsHistoryOpen(false);
  }, []);

  const toggleHistory = useCallback(() => {
    setIsHistoryOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    isHistoryOpen,
    openChat,
    closeChat,
    toggleHistory,
  };
}
