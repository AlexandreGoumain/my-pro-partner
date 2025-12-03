"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChatMessage, FeedbackType, UseChatbotReturn } from "./types";
import { useChatbotUI } from "./use-chatbot-ui";
import { useConversations } from "./use-conversations";

// Navigation path mapping
const pathMap: Record<string, string> = {
    DASHBOARD: "/dashboard",
    CLIENTS: "/dashboard/clients",
    ARTICLES: "/dashboard/catalogue",
    DOCUMENTS: "/dashboard/documents",
    STOCK: "/dashboard/stock",
    SEGMENTS: "/dashboard/segments",
    CAMPAIGNS: "/dashboard/campaigns",
    LOYALTY: "/dashboard/fidelite",
    SETTINGS: "/dashboard/parametres",
};

/**
 * Convert AI SDK UIMessage to our ChatMessage type
 */
function toChatMessage(msg: UIMessage): ChatMessage {
    // Extract text content from parts
    let content = "";
    const toolInvocations: ChatMessage["toolInvocations"] = [];

    for (const part of msg.parts) {
        if (part.type === "text") {
            content += part.text;
        } else if (part.type.startsWith("tool-")) {
            // Handle tool-related parts
            const toolPart = part as {
                type: string;
                toolCallId: string;
                toolName?: string;
                input?: unknown;
                output?: unknown;
                state?: string;
            };

            if (toolPart.toolName) {
                toolInvocations.push({
                    toolCallId: toolPart.toolCallId,
                    toolName: toolPart.toolName,
                    args: (toolPart.input || {}) as Record<string, unknown>,
                    state: toolPart.state === "result" ? "result" : toolPart.state === "error" ? "error" : "pending",
                    result: toolPart.output,
                });
            }
        }
    }

    return {
        id: msg.id,
        role: msg.role as "user" | "assistant" | "system",
        content,
        createdAt: new Date(),
        toolInvocations: toolInvocations.length > 0 ? toolInvocations : undefined,
    };
}

/**
 * Main chatbot hook using AI SDK v5
 */
export function useChatbot(): UseChatbotReturn {
    const router = useRouter();

    // UI State
    const {
        isOpen,
        isHistoryOpen,
        openChat,
        closeChat,
        toggleHistory,
    } = useChatbotUI();

    // Conversations
    const {
        conversations,
        currentConversationId,
        isLoadingConversations,
        searchQuery,
        loadConversations,
        loadConversation: loadConversationMessages,
        deleteConversation,
        pinConversation,
        setCurrentConversationId,
        setSearchQuery,
        exportConversation,
        submitFeedback,
    } = useConversations();

    // Local input state
    const [localInput, setLocalInput] = useState("");

    // Create transport with conversation ID in body
    const transport = useMemo(
        () =>
            new DefaultChatTransport({
                api: "/api/chatbot/message",
                body: { conversationId: currentConversationId },
            }),
        [currentConversationId]
    );

    // AI SDK useChat hook
    const {
        messages: aiMessages,
        sendMessage: aiSendMessage,
        status,
        error,
        stop,
        setMessages: setAiMessages,
    } = useChat({
        id: currentConversationId || undefined,
        transport,
        onToolCall: ({ toolCall }) => {
            // Handle navigate_to tool client-side
            if (toolCall.toolName === "navigate_to") {
                const input = toolCall.input as { page: string; entityId?: string };
                let path = pathMap[input.page] || "/dashboard";
                if (input.entityId) {
                    path += `/${input.entityId}`;
                }
                router.push(path);
            }
            // No return value needed
        },
        onFinish: () => {
            // Reload conversations list after response
            loadConversations();
        },
    });

    // Convert AI messages to our format
    const messages: ChatMessage[] = useMemo(
        () => aiMessages.map(toChatMessage),
        [aiMessages]
    );

    // Derive isLoading from status
    const isLoading = status === "streaming" || status === "submitted";

    // Input change handler
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setLocalInput(e.target.value);
        },
        []
    );

    // Load conversations when chat opens
    useEffect(() => {
        if (isOpen) {
            loadConversations();
        }
    }, [isOpen, loadConversations]);

    // Start new conversation
    const startNewConversation = useCallback(() => {
        setCurrentConversationId(null);
        setAiMessages([]);
        setLocalInput("");
    }, [setCurrentConversationId, setAiMessages]);

    // Load a specific conversation
    const loadConversation = useCallback(
        async (id: string) => {
            const conversationMessages = await loadConversationMessages(id);
            // Convert our messages to UI format for AI SDK
            setAiMessages(
                conversationMessages.map((msg) => ({
                    id: msg.id,
                    role: msg.role as "user" | "assistant",
                    parts: [{ type: "text" as const, text: msg.content }],
                }))
            );
        },
        [loadConversationMessages, setAiMessages]
    );

    // Send message
    const sendMessage = useCallback(
        async (content?: string) => {
            const messageText = content || localInput;
            if (!messageText.trim()) return;

            setLocalInput("");
            await aiSendMessage({ text: messageText });
        },
        [localInput, aiSendMessage]
    );

    // Submit feedback wrapper
    const handleSubmitFeedback = useCallback(
        async (messageId: string, feedback: FeedbackType, comment?: string) => {
            await submitFeedback(messageId, feedback, comment);
        },
        [submitFeedback]
    );

    // Search conversations
    const searchConversations = useCallback(
        (query: string) => {
            setSearchQuery(query);
            loadConversations(query);
        },
        [setSearchQuery, loadConversations]
    );

    return {
        // UI State
        isOpen,
        isHistoryOpen,
        openChat,
        closeChat,
        toggleHistory,

        // Chat State
        messages,
        input: localInput,
        isLoading,
        error: error || null,

        // Chat Actions
        handleInputChange,
        sendMessage,
        stop,

        // Conversation State
        conversations,
        currentConversationId,
        isLoadingConversations,
        searchQuery,

        // Conversation Actions
        startNewConversation,
        loadConversation,
        deleteConversation,
        pinConversation,
        searchConversations,
        exportConversation,

        // Feedback
        submitFeedback: handleSubmitFeedback,
    };
}
