"use client";

import { Sparkles, Send } from "lucide-react";
import { mockConversation } from "./mock-data";

export function MockAI() {
    return (
        <div className="space-y-5 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-[16px] font-semibold text-black">Assistant IA</h3>
                        <p className="text-[11px] text-black/40">
                            Parlez naturellement, je m&apos;occupe du reste
                        </p>
                    </div>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] text-black/40 px-2 py-1 rounded-full bg-black/[0.04]">
                    <span className="w-1.5 h-1.5 rounded-full bg-black/60 animate-pulse" />
                    En ligne
                </span>
            </div>

            {/* Chat area */}
            <div className="flex-1 p-4 rounded-xl bg-neutral-50 border border-black/[0.04] space-y-4 overflow-y-auto">
                {mockConversation.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "gap-3"}`}
                    >
                        {msg.role === "ai" && (
                            <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] ${
                                msg.role === "user"
                                    ? "bg-black text-white rounded-br-md"
                                    : "bg-white border border-black/[0.08] text-black rounded-bl-md"
                            }`}
                        >
                            {msg.message}
                        </div>
                    </div>
                ))}
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2">
                {[
                    "Relancer les impayés",
                    "Créer une facture",
                    "CA de la semaine",
                    "Stocks à commander",
                ].map((suggestion, i) => (
                    <button
                        key={i}
                        className="px-3 py-1.5 rounded-full border border-black/[0.08] text-[11px] text-black/60 hover:bg-black/[0.04] transition-colors"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-black/[0.08]">
                <input
                    type="text"
                    placeholder="Demandez quelque chose..."
                    className="flex-1 text-[13px] bg-transparent outline-none"
                />
                <button className="w-8 h-8 rounded-lg bg-black flex items-center justify-center hover:bg-black/90 transition-colors">
                    <Send className="w-4 h-4 text-white" strokeWidth={2} />
                </button>
            </div>
        </div>
    );
}
