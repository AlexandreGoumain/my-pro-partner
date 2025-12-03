// ============================================
// CHAT HEADER COMPONENT
// ============================================

import { IconBox } from "@/components/ui/icon-box";
import { cn } from "@/lib/utils";
import { History, MessageSquare, Plus, X } from "lucide-react";

export interface ChatHeaderProps {
    onClose: () => void;
    onToggleHistory: () => void;
    onNewConversation: () => void;
    isHistoryOpen: boolean;
}

export function ChatHeader({
    onClose,
    onToggleHistory,
    onNewConversation,
    isHistoryOpen,
}: ChatHeaderProps) {
    return (
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/10">
            <div className="flex items-center gap-2">
                <IconBox
                    icon={MessageSquare}
                    size="sm"
                    shape="circle"
                    bgColor="bg-black"
                    iconColor="text-white"
                />
                <div>
                    <h3 className="text-[14px] font-medium text-black">
                        Assistant IA
                    </h3>
                    <p className="text-[11px] text-black/40">
                        <kbd className="px-1 py-0.5 bg-black/5 rounded text-[9px]">
                            ⌘K
                        </kbd>{" "}
                        pour ouvrir ·{" "}
                        <kbd className="px-1 py-0.5 bg-black/5 rounded text-[9px]">
                            Échap
                        </kbd>{" "}
                        pour fermer
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={onNewConversation}
                    className="p-1.5 hover:bg-black/5 rounded transition-colors duration-200"
                    aria-label="Nouvelle conversation"
                    title="Nouvelle conversation"
                >
                    <Plus className="w-4 h-4 text-black/60" strokeWidth={2} />
                </button>
                <button
                    onClick={onToggleHistory}
                    className={cn(
                        "p-1.5 rounded transition-colors duration-200",
                        isHistoryOpen
                            ? "bg-black/10 text-black"
                            : "hover:bg-black/5 text-black/60"
                    )}
                    aria-label="Historique"
                    title="Historique des conversations"
                >
                    <History className="w-4 h-4" strokeWidth={2} />
                </button>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-black/5 rounded transition-colors duration-200"
                    aria-label="Fermer le chat"
                >
                    <X className="w-4 h-4 text-black/60" strokeWidth={2} />
                </button>
            </div>
        </div>
    );
}
