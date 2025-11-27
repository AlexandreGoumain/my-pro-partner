// ============================================
// CHAT HEADER COMPONENT
// ============================================

import { IconBox } from "@/components/ui/icon-box";
import { MessageSquare, X } from "lucide-react";

export interface ChatHeaderProps {
    onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
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
                        Toujours là pour vous aider
                    </p>
                </div>
            </div>
            <button
                onClick={onClose}
                className="p-1 hover:bg-black/5 rounded transition-colors duration-200"
                aria-label="Fermer le chat"
            >
                <X className="w-5 h-5 text-black/60" strokeWidth={2} />
            </button>
        </div>
    );
}
