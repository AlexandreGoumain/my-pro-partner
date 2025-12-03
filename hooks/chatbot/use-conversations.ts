"use client";

import { useCallback, useState } from "react";
import type {
    ChatMessage,
    Conversation,
    ConversationApiResponse,
    ConversationsApiResponse,
    FeedbackType,
} from "./types";

export interface ConversationsState {
    conversations: Conversation[];
    currentConversationId: string | null;
    isLoadingConversations: boolean;
    searchQuery: string;
    loadConversations: (search?: string) => Promise<void>;
    loadConversation: (id: string) => Promise<ChatMessage[]>;
    deleteConversation: (id: string) => Promise<void>;
    pinConversation: (id: string, pinned: boolean) => Promise<void>;
    setCurrentConversationId: (id: string | null) => void;
    setSearchQuery: (query: string) => void;
    exportConversation: (id: string, format: "txt" | "json") => Promise<void>;
    submitFeedback: (
        messageId: string,
        feedback: FeedbackType,
        comment?: string
    ) => Promise<void>;
}

/**
 * Hook to manage conversations (list, load, delete, pin, search, export, feedback)
 */
export function useConversations(): ConversationsState {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<
        string | null
    >(null);
    const [isLoadingConversations, setIsLoadingConversations] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const loadConversations = useCallback(async (search?: string) => {
        try {
            setIsLoadingConversations(true);
            const params = new URLSearchParams();
            if (search) params.set("search", search);

            const url = `/api/chatbot/conversations${params.toString() ? `?${params}` : ""}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Erreur lors du chargement des conversations");
            }
            const data: ConversationsApiResponse = await response.json();
            setConversations(data.conversations);
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error("Error loading conversations:", error);
            }
        } finally {
            setIsLoadingConversations(false);
        }
    }, []);

    const loadConversation = useCallback(
        async (id: string): Promise<ChatMessage[]> => {
            try {
                const response = await fetch(
                    `/api/chatbot/conversations/${id}`
                );
                if (!response.ok) {
                    throw new Error(
                        "Erreur lors du chargement de la conversation"
                    );
                }
                const conversation: ConversationApiResponse =
                    await response.json();

                setCurrentConversationId(id);

                return conversation.messages.map((m) => ({
                    id: m.id,
                    role: m.role.toLowerCase() as "user" | "assistant",
                    content: m.content,
                    createdAt: new Date(m.createdAt),
                }));
            } catch (error) {
                if (process.env.NODE_ENV === "development") {
                    console.error("Error loading conversation:", error);
                }
                return [];
            }
        },
        []
    );

    const deleteConversation = useCallback(
        async (id: string) => {
            try {
                const response = await fetch(
                    `/api/chatbot/conversations/${id}`,
                    {
                        method: "DELETE",
                    }
                );
                if (!response.ok) {
                    throw new Error("Erreur lors de la suppression");
                }

                await loadConversations(searchQuery);

                if (id === currentConversationId) {
                    setCurrentConversationId(null);
                }
            } catch (error) {
                if (process.env.NODE_ENV === "development") {
                    console.error("Error deleting conversation:", error);
                }
            }
        },
        [loadConversations, currentConversationId, searchQuery]
    );

    const pinConversation = useCallback(
        async (id: string, pinned: boolean) => {
            try {
                const response = await fetch(
                    `/api/chatbot/conversations/${id}`,
                    {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ pinned }),
                    }
                );
                if (!response.ok) {
                    throw new Error("Erreur lors de la mise à jour");
                }

                await loadConversations(searchQuery);
            } catch (error) {
                if (process.env.NODE_ENV === "development") {
                    console.error("Error pinning conversation:", error);
                }
            }
        },
        [loadConversations, searchQuery]
    );

    const exportConversation = useCallback(
        async (id: string, format: "txt" | "json") => {
            try {
                const response = await fetch(
                    `/api/chatbot/conversations/${id}`
                );
                if (!response.ok) {
                    throw new Error("Erreur lors de l'export");
                }
                const conversation: ConversationApiResponse =
                    await response.json();

                let content: string;
                let mimeType: string;
                let extension: string;

                if (format === "json") {
                    content = JSON.stringify(conversation, null, 2);
                    mimeType = "application/json";
                    extension = "json";
                } else {
                    // TXT format
                    const lines = [
                        `Conversation: ${conversation.titre}`,
                        `Date: ${new Date(conversation.createdAt).toLocaleDateString("fr-FR")}`,
                        "",
                        "---",
                        "",
                    ];

                    for (const msg of conversation.messages) {
                        const role = msg.role === "USER" ? "Vous" : "Assistant";
                        const date = new Date(msg.createdAt).toLocaleString("fr-FR");
                        lines.push(`[${date}] ${role}:`);
                        lines.push(msg.content);
                        lines.push("");
                    }

                    content = lines.join("\n");
                    mimeType = "text/plain";
                    extension = "txt";
                }

                // Download file
                const blob = new Blob([content], { type: mimeType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `conversation-${conversation.titre.slice(0, 20).replace(/[^a-z0-9]/gi, "_")}.${extension}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (error) {
                if (process.env.NODE_ENV === "development") {
                    console.error("Error exporting conversation:", error);
                }
            }
        },
        []
    );

    const submitFeedback = useCallback(
        async (
            messageId: string,
            feedback: FeedbackType,
            comment?: string
        ): Promise<void> => {
            try {
                const response = await fetch("/api/chatbot/feedback", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ messageId, feedback, comment }),
                });
                if (!response.ok) {
                    throw new Error("Erreur lors de l'envoi du feedback");
                }
            } catch (error) {
                if (process.env.NODE_ENV === "development") {
                    console.error("Error submitting feedback:", error);
                }
            }
        },
        []
    );

    return {
        conversations,
        currentConversationId,
        isLoadingConversations,
        searchQuery,
        loadConversations,
        loadConversation,
        deleteConversation,
        pinConversation,
        setCurrentConversationId,
        setSearchQuery,
        exportConversation,
        submitFeedback,
    };
}
