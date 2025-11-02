// ============================================
// MESSAGE STREAMING HOOK - Handle message sending and streaming
// ============================================

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Message } from './use-messages';

export interface MessageStreamingState {
  isLoading: boolean;
  error: Error | null;
  sendMessage: (content: string) => Promise<void>;
  submitFeedback: (messageId: string, feedback: 'positive' | 'negative', comment?: string) => Promise<void>;
}

interface UseMessageStreamingParams {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  currentConversationId: string | null;
  setCurrentConversationId: (id: string | null) => void;
  loadConversations: () => Promise<void>;
}

/**
 * Hook to handle message streaming with navigation support
 */
export function useMessageStreaming({
  messages,
  setMessages,
  currentConversationId,
  setCurrentConversationId,
  loadConversations,
}: UseMessageStreamingParams): MessageStreamingState {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // Add user message immediately
        const userMessage: Message = {
          id: `temp-${Date.now()}`,
          role: 'user',
          content,
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        // Send to server
        const response = await fetch('/api/chatbot/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            conversationId: currentConversationId,
          }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi du message");
        }

        // Get conversation ID from headers
        const conversationId = response.headers.get('X-Conversation-Id');
        if (conversationId && !currentConversationId) {
          setCurrentConversationId(conversationId);
        }

        // Read the stream response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = '';
        const assistantMessageId = `temp-assistant-${Date.now()}`;

        // Create empty assistant message immediately
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMessageId,
            role: 'assistant' as const,
            content: '',
            createdAt: new Date(),
          },
        ]);

        if (reader) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                console.log('Stream completed. Final message:', assistantMessage);
                break;
              }

              // Decode chunk
              const chunk = decoder.decode(value, { stream: true });
              console.log('Received chunk:', chunk);

              // Check if it's a navigation event (JSON)
              const lines = chunk.split('\n');
              for (const line of lines) {
                if (line.trim().startsWith('{') && line.includes('"type"')) {
                  try {
                    const event = JSON.parse(line.trim());
                    if (event.type === 'navigation' && event.path) {
                      console.log('Navigation event detected:', event.path);
                      // Perform navigation
                      router.push(event.path);
                      continue;
                    }
                  } catch (parseError) {
                    // Not valid JSON, treat as text
                    assistantMessage += line;
                  }
                } else if (line.trim()) {
                  // Normal text
                  assistantMessage += line;
                }
              }

              // Update assistant message in real-time
              setMessages((prev) => {
                const withoutLast = prev.filter((m) => m.id !== assistantMessageId);
                return [
                  ...withoutLast,
                  {
                    id: assistantMessageId,
                    role: 'assistant' as const,
                    content: assistantMessage,
                    createdAt: new Date(),
                  },
                ];
              });
            }
          } catch (streamError) {
            console.error('Error reading stream:', streamError);
          }
        }

        // Reload conversations
        await loadConversations();
      } catch (err: any) {
        setError(err);
        console.error('Error sending message:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, currentConversationId, setCurrentConversationId, setMessages, loadConversations, router]
  );

  const submitFeedback = useCallback(
    async (messageId: string, feedback: 'positive' | 'negative', comment?: string) => {
      try {
        const response = await fetch('/api/chatbot/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messageId, feedback, comment }),
        });
        if (!response.ok) throw new Error("Erreur lors de l'envoi du feedback");
      } catch (error) {
        console.error('Error submitting feedback:', error);
      }
    },
    []
  );

  return {
    isLoading,
    error,
    sendMessage,
    submitFeedback,
  };
}
