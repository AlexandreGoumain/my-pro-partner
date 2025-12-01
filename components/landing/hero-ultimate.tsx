"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, MessageSquare, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const aiConversations = [
    {
        question: "Quel client me doit le plus d'argent ?",
        answer: {
            text: "Martin Construction vous doit 8 450€ depuis 45 jours.",
            action: "Envoyer une relance",
        },
    },
    {
        question: "Crée un devis pour 3 jours de peinture",
        answer: {
            text: "Devis créé : 3 jours x 350€ = 1 050€ HT",
            action: "Voir le devis",
        },
    },
    {
        question: "Combien j'ai facturé ce mois ?",
        answer: {
            text: "12 840€ ce mois (+23% vs mois dernier)",
            action: "Voir le détail",
        },
    },
];

export function HeroUltimate() {
    const [typingText, setTypingText] = useState("");
    const [showResponse, setShowResponse] = useState(false);
    const [currentConversation, setCurrentConversation] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [waitlistCount, setWaitlistCount] = useState(0);

    const conversation = aiConversations[currentConversation];

    // Fetch waitlist count
    useEffect(() => {
        const fetchWaitlistCount = async () => {
            try {
                const response = await fetch("/api/waitlist/count");
                if (response.ok) {
                    const data = await response.json();
                    setWaitlistCount(data.count);
                }
            } catch (error) {
                console.error("Failed to fetch waitlist count:", error);
            }
        };
        fetchWaitlistCount();
    }, []);

    // Typing animation
    useEffect(() => {
        setTypingText("");
        setShowResponse(false);
        setIsTyping(true);

        let currentIndex = 0;
        const fullText = conversation.question;

        const typingInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setTypingText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
                setIsTyping(false);
                setTimeout(() => setShowResponse(true), 400);
            }
        }, 45);

        return () => clearInterval(typingInterval);
    }, [currentConversation, conversation.question]);

    // Auto-rotate conversations
    useEffect(() => {
        if (!showResponse) return;

        const timeout = setTimeout(() => {
            setCurrentConversation((prev) => (prev + 1) % aiConversations.length);
        }, 4000);

        return () => clearTimeout(timeout);
    }, [showResponse]);

    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 overflow-hidden bg-white">
            {/* Subtle background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-black/[0.02] rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-black/[0.02] rounded-full blur-[120px]" />
            </div>

            <div className="max-w-[1200px] mx-auto relative z-10 py-20">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                    {/* Left: Copy */}
                    <div className="space-y-8 text-center lg:text-left">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                            <div className="relative">
                                <div className="w-2 h-2 bg-black rounded-full" />
                                <div className="absolute inset-0 w-2 h-2 bg-black/50 rounded-full animate-ping" />
                            </div>
                            <span className="text-[13px] text-black font-medium">
                                Lancement imminent
                            </span>
                        </div>

                        {/* Headline */}
                        <div className="space-y-5">
                            <h1 className="text-[48px] sm:text-[56px] lg:text-[64px] font-bold tracking-[-0.03em] text-black leading-[1.05]">
                                Arrêtez de perdre
                                <span className="block mt-1 bg-gradient-to-r from-black via-black/90 to-black/70 bg-clip-text text-transparent">
                                    3h par jour en admin.
                                </span>
                            </h1>

                            <p className="text-[18px] sm:text-[20px] text-black/60 leading-relaxed max-w-[520px] mx-auto lg:mx-0">
                                Devis, factures, relances, stocks...{" "}
                                <span className="text-black font-medium">
                                    Demandez, c&apos;est fait.
                                </span>{" "}
                                L&apos;IA gère tout. Vous, concentrez-vous sur vos clients.
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                            <Link href="/waitlist">
                                <Button
                                    size="lg"
                                    className="bg-black hover:bg-black/90 text-white h-13 px-7 text-[15px] font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group"
                                >
                                    Rejoindre la liste d&apos;attente
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="#demo">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-13 px-7 text-[15px] font-medium rounded-xl border-black/10 hover:bg-black/[0.02]"
                                >
                                    Voir la démo
                                </Button>
                            </Link>
                        </div>

                        {/* Social proof */}
                        <div className="flex items-center gap-4 justify-center lg:justify-start pt-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 border-2 border-white"
                                    />
                                ))}
                            </div>
                            <p className="text-[13px] text-black/50">
                                <span className="font-semibold text-black">
                                    {waitlistCount > 0 ? `${waitlistCount}` : "0"}
                                </span>{" "}
                                inscrit{waitlistCount > 1 ? "s" : ""} sur la liste d&apos;attente
                            </p>
                        </div>

                        {/* Trust points */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start text-[13px] text-black/50">
                            <span>✓ Sans carte bancaire</span>
                            <span>✓ 14 jours gratuits</span>
                            <span>✓ Support français</span>
                        </div>
                    </div>

                    {/* Right: Interactive Demo */}
                    <div className="relative">
                        {/* Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10 rounded-3xl blur-3xl translate-y-4 scale-95" />

                        {/* Card */}
                        <Card className="relative border-black/10 shadow-2xl shadow-black/10 overflow-hidden bg-white">
                            {/* Browser bar */}
                            <div className="bg-neutral-50 border-b border-black/[0.06] px-4 py-3 flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-black/10" />
                                    <div className="w-3 h-3 rounded-full bg-black/10" />
                                    <div className="w-3 h-3 rounded-full bg-black/10" />
                                </div>
                                <div className="flex-1 mx-4">
                                    <div className="bg-white border border-black/[0.06] rounded-md px-3 py-1.5 text-[11px] text-black/40 font-mono text-center">
                                        app.mypropartner.com
                                    </div>
                                </div>
                                <div className="w-6 h-6 rounded-md bg-black/[0.03] flex items-center justify-center">
                                    <Sparkles className="w-3.5 h-3.5 text-black/40" />
                                </div>
                            </div>

                            {/* Chat */}
                            <div className="p-6 sm:p-8 min-h-[320px]">
                                <div className="space-y-5">
                                    {/* User message */}
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-black/[0.04] flex items-center justify-center">
                                            <MessageSquare className="w-4 h-4 text-black/50" strokeWidth={2} />
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <div className="inline-block px-4 py-2.5 rounded-2xl rounded-tl-sm bg-black/[0.03] border border-black/[0.06]">
                                                <p className="text-[14px] text-black font-medium">
                                                    {typingText}
                                                    {isTyping && (
                                                        <span className="inline-block w-0.5 h-4 bg-black ml-0.5 animate-pulse" />
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Response */}
                                    {showResponse && (
                                        <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-black flex items-center justify-center">
                                                <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
                                            </div>
                                            <div className="flex-1 pt-1 space-y-3">
                                                <div className="inline-block px-4 py-2.5 rounded-2xl rounded-tl-sm bg-white border border-black/10 shadow-sm">
                                                    <p className="text-[14px] text-black font-medium">
                                                        {conversation.answer.text}
                                                    </p>
                                                </div>

                                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-[13px] font-medium hover:bg-black/90 transition-colors">
                                                    <Zap className="w-3.5 h-3.5" strokeWidth={2} />
                                                    {conversation.answer.action}
                                                </button>

                                                <p className="text-[11px] text-black/40 flex items-center gap-1">
                                                    <span className="w-1 h-1 rounded-full bg-black/40" />
                                                    Réponse en 1.2s
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Floating badge */}
                        <div className="absolute -right-2 sm:-right-4 top-1/4 hidden sm:block">
                            <div className="px-3 py-2 rounded-xl bg-white border border-black/10 shadow-lg">
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <div className="w-2 h-2 rounded-full bg-black" />
                                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-black/50 animate-ping" />
                                    </div>
                                    <span className="text-[11px] font-semibold text-black">
                                        IA Active
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conversation indicators */}
                <div className="flex justify-center gap-2 mt-12">
                    {aiConversations.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentConversation(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentConversation
                                    ? "bg-black w-6"
                                    : "bg-black/20 hover:bg-black/40"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
