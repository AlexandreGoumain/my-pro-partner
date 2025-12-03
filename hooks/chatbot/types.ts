/**
 * Types for the Chatbot system
 */

// Message types compatible with AI SDK
export interface ChatMessage {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    createdAt?: Date;
    toolInvocations?: ToolInvocation[];
}

export interface ToolInvocation {
    toolCallId: string;
    toolName: string;
    args: Record<string, unknown>;
    state: "pending" | "result" | "error";
    result?: unknown;
}

// Conversation types
export interface Conversation {
    id: string;
    titre: string;
    pinned: boolean;
    createdAt: Date;
    updatedAt: Date;
    messages?: ChatMessage[];
    _count?: {
        messages: number;
    };
}

// Feedback types
export type FeedbackType = "positive" | "negative";

export interface FeedbackPayload {
    messageId: string;
    feedback: FeedbackType;
    comment?: string;
}

// Chatbot hook return type
export interface UseChatbotReturn {
    // UI State
    isOpen: boolean;
    isHistoryOpen: boolean;
    openChat: () => void;
    closeChat: () => void;
    toggleHistory: () => void;

    // Chat State
    messages: ChatMessage[];
    input: string;
    isLoading: boolean;
    error: Error | null;

    // Chat Actions
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    sendMessage: (content?: string) => void;
    stop: () => void;

    // Conversation State
    conversations: Conversation[];
    currentConversationId: string | null;
    isLoadingConversations: boolean;
    searchQuery: string;

    // Conversation Actions
    startNewConversation: () => void;
    loadConversation: (id: string) => Promise<void>;
    deleteConversation: (id: string) => Promise<void>;
    pinConversation: (id: string, pinned: boolean) => Promise<void>;
    searchConversations: (query: string) => void;
    exportConversation: (id: string, format: "txt" | "json") => Promise<void>;

    // Feedback
    submitFeedback: (
        messageId: string,
        feedback: FeedbackType,
        comment?: string
    ) => Promise<void>;
}

// API Response types
export interface ConversationsApiResponse {
    conversations: Conversation[];
}

export interface ConversationApiResponse {
    id: string;
    titre: string;
    pinned: boolean;
    createdAt: string;
    updatedAt: string;
    messages: Array<{
        id: string;
        role: string;
        content: string;
        createdAt: string;
    }>;
}
