// ============================================
// CHAT HISTORY PANEL - Conversations List with Search
// ============================================

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    Download,
    MessageSquare,
    Pin,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Conversation } from "@/hooks/chatbot/types";

export interface ChatHistoryPanelProps {
    conversations: Conversation[];
    currentConversationId: string | null;
    isLoading: boolean;
    onClose: () => void;
    onNewConversation: () => void;
    onSelectConversation: (id: string) => void;
    onDeleteConversation: (id: string) => void;
    onPinConversation: (id: string, pinned: boolean) => void;
    onSearch: (query: string) => void;
    onExport: (id: string, format: "txt" | "json") => void;
}

export function ChatHistoryPanel({
    conversations,
    currentConversationId,
    isLoading,
    onClose,
    onNewConversation,
    onSelectConversation,
    onDeleteConversation,
    onPinConversation,
    onSearch,
    onExport,
}: ChatHistoryPanelProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [exportingId, setExportingId] = useState<string | null>(null);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, onSearch]);

    const handleExport = useCallback(
        async (id: string, format: "txt" | "json") => {
            setExportingId(id);
            try {
                await onExport(id, format);
            } finally {
                setExportingId(null);
            }
        },
        [onExport]
    );

    const formatDate = (date: Date) => {
        const d = new Date(date);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return "Aujourd'hui";
        if (days === 1) return "Hier";
        if (days < 7) return `Il y a ${days} jours`;
        return d.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
        });
    };

    return (
        <div className="absolute inset-0 bg-white z-10 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/10">
                <h3 className="text-[14px] font-medium text-black">
                    Historique
                </h3>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-black/5 rounded transition-colors"
                >
                    <X className="w-5 h-5 text-black/60" strokeWidth={2} />
                </button>
            </div>

            {/* Search + New */}
            <div className="px-3 py-3 border-b border-black/10 space-y-2">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                    <Input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 h-9 text-[13px]"
                    />
                </div>
                <button
                    onClick={onNewConversation}
                    className={cn(
                        "w-full flex items-center gap-2 px-3 py-2",
                        "text-[13px] font-medium text-black",
                        "bg-black/5 hover:bg-black/10 rounded-md",
                        "transition-colors duration-200"
                    )}
                >
                    <Plus className="w-4 h-4" strokeWidth={2} />
                    Nouvelle conversation
                </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                        <MessageSquare className="w-10 h-10 text-black/20 mb-3" />
                        <p className="text-[13px] text-black/40 text-center">
                            {searchQuery
                                ? "Aucun résultat"
                                : "Aucune conversation"}
                        </p>
                    </div>
                ) : (
                    <div className="py-2">
                        {conversations.map((conv) => (
                            <div
                                key={conv.id}
                                className={cn(
                                    "group px-3 py-2 mx-2 rounded-md cursor-pointer",
                                    "hover:bg-black/5 transition-colors",
                                    conv.id === currentConversationId &&
                                        "bg-black/5"
                                )}
                                onClick={() => onSelectConversation(conv.id)}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            {conv.pinned && (
                                                <Pin className="w-3 h-3 text-black/40 flex-shrink-0" />
                                            )}
                                            <p className="text-[13px] font-medium text-black truncate">
                                                {conv.titre}
                                            </p>
                                        </div>
                                        <p className="text-[11px] text-black/40 mt-0.5">
                                            {formatDate(conv.updatedAt)} ·{" "}
                                            {conv._count?.messages || 0} msg
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onPinConversation(
                                                    conv.id,
                                                    !conv.pinned
                                                );
                                            }}
                                            className={cn(
                                                "p-1 rounded hover:bg-black/10",
                                                conv.pinned && "text-black"
                                            )}
                                            title={
                                                conv.pinned
                                                    ? "Désépingler"
                                                    : "Épingler"
                                            }
                                        >
                                            <Pin
                                                className="w-3.5 h-3.5"
                                                strokeWidth={2}
                                            />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleExport(conv.id, "txt");
                                            }}
                                            disabled={exportingId === conv.id}
                                            className="p-1 rounded hover:bg-black/10"
                                            title="Exporter"
                                        >
                                            <Download
                                                className="w-3.5 h-3.5"
                                                strokeWidth={2}
                                            />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteConversation(conv.id);
                                            }}
                                            className="p-1 rounded hover:bg-red-50 text-black/60 hover:text-red-600"
                                            title="Supprimer"
                                        >
                                            <Trash2
                                                className="w-3.5 h-3.5"
                                                strokeWidth={2}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
