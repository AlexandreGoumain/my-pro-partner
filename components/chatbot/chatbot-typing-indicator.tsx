// ============================================
// CHATBOT TYPING INDICATOR
// ============================================

export function ChatbotTypingIndicator() {
    return (
        <div className="flex items-center gap-1 px-4 py-2.5 bg-black/5 rounded-2xl w-fit">
            <div className="flex gap-1">
                <div className="w-2 h-2 bg-black/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-black/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-black/40 rounded-full animate-bounce" />
            </div>
        </div>
    );
}
