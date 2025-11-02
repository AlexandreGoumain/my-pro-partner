// ============================================
// CONVERSATIONS HOOK - Conversation Management
// ============================================

import { useState, useCallback } from 'react';
import type { Message } from './use-messages';

export interface Conversation {
  id: string;
  titre: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  messages?: Message[];
  _count?: {
    messages: number;
  };
}

export interface ConversationsState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoadingConversations: boolean;
  loadConversations: () => Promise<void>;
  loadConversation: (id: string) => Promise<Message[]>;
  deleteConversation: (id: string) => Promise<void>;
  pinConversation: (id: string, pinned: boolean) => Promise<void>;
  setCurrentConversationId: (id: string | null) => void;
}

/**
 * Hook to manage conversations (list, load, delete, pin)
 */
export function useConversations(): ConversationsState {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);

  const loadConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true);
      const response = await fetch('/api/chatbot/conversations');
      if (!response.ok) throw new Error('Erreur lors du chargement des conversations');
      const data = await response.json();
      setConversations(data.conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  const loadConversation = useCallback(async (id: string): Promise<Message[]> => {
    try {
      const response = await fetch(`/api/chatbot/conversations/${id}`);
      if (!response.ok) throw new Error('Erreur lors du chargement de la conversation');
      const conversation = await response.json();

      setCurrentConversationId(id);

      return conversation.messages.map((m: any) => ({
        id: m.id,
        role: m.role.toLowerCase() as 'user' | 'assistant',
        content: m.content,
        createdAt: new Date(m.createdAt),
      }));
    } catch (error) {
      console.error('Error loading conversation:', error);
      return [];
    }
  }, []);

  const deleteConversation = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/chatbot/conversations/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erreur lors de la suppression');

        await loadConversations();

        if (id === currentConversationId) {
          setCurrentConversationId(null);
        }
      } catch (error) {
        console.error('Error deleting conversation:', error);
      }
    },
    [loadConversations, currentConversationId]
  );

  const pinConversation = useCallback(
    async (id: string, pinned: boolean) => {
      try {
        const response = await fetch(`/api/chatbot/conversations/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pinned }),
        });
        if (!response.ok) throw new Error('Erreur lors de la mise à jour');

        await loadConversations();
      } catch (error) {
        console.error('Error pinning conversation:', error);
      }
    },
    [loadConversations]
  );

  return {
    conversations,
    currentConversationId,
    isLoadingConversations,
    loadConversations,
    loadConversation,
    deleteConversation,
    pinConversation,
    setCurrentConversationId,
  };
}
