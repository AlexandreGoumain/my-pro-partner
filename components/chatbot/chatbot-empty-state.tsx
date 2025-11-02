// ============================================
// CHATBOT EMPTY STATE
// ============================================

import { MessageSquare } from "lucide-react";

export function ChatbotEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-4">
                <MessageSquare
                    className="w-8 h-8 text-black/40"
                    strokeWidth={2}
                />
            </div>
            <h3 className="text-[15px] font-medium text-black mb-1">
                Comment puis-je vous aider ?
            </h3>
            <p className="text-[13px] text-black/40 max-w-xs">
                Posez-moi des questions sur vos clients, articles, stocks,
                statistiques et bien plus encore.
            </p>
        </div>
    );
}
