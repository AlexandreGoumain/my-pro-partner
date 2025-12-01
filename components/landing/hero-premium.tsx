"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Send, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const demoMessages = [
    {
        user: "Crée un devis pour M. Dupont, 3 jours de peinture à 350€",
        ai: "Devis #2024-089 créé pour M. Dupont : 1 050€ HT. Envoyé par email.",
        action: "Devis envoyé ✓",
    },
    {
        user: "Qui me doit de l'argent ?",
        ai: "3 factures impayées : 8 450€ au total. Martin Construction en retard de 45j.",
        action: "Relance envoyée ✓",
    },
    {
        user: "Combien j'ai fait ce mois ?",
        ai: "CA du mois : 12 840€ (+23%). 38 factures, 2 en attente de paiement.",
        action: "Voir le rapport ✓",
    },
];

export function HeroPremium() {
    const [currentDemo, setCurrentDemo] = useState(0);
    const [userText, setUserText] = useState("");
    const [aiText, setAiText] = useState("");
    const [showAction, setShowAction] = useState(false);
    const [phase, setPhase] = useState<"typing-user" | "typing-ai" | "complete">("typing-user");
    const [waitlistCount, setWaitlistCount] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Entrance animation
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Fetch waitlist
    useEffect(() => {
        fetch("/api/waitlist/count")
            .then((res) => res.json())
            .then((data) => setWaitlistCount(data.count))
            .catch(() => {});
    }, []);

    // Demo animation
    useEffect(() => {
        const demo = demoMessages[currentDemo];
        let userIndex = 0;
        let aiIndex = 0;

        setUserText("");
        setAiText("");
        setShowAction(false);
        setPhase("typing-user");

        // Type user message
        const userInterval = setInterval(() => {
            if (userIndex <= demo.user.length) {
                setUserText(demo.user.slice(0, userIndex));
                userIndex++;
            } else {
                clearInterval(userInterval);
                setPhase("typing-ai");

                // Pause then type AI response
                setTimeout(() => {
                    const aiInterval = setInterval(() => {
                        if (aiIndex <= demo.ai.length) {
                            setAiText(demo.ai.slice(0, aiIndex));
                            aiIndex++;
                        } else {
                            clearInterval(aiInterval);
                            setPhase("complete");
                            setTimeout(() => setShowAction(true), 300);
                        }
                    }, 20);
                }, 600);
            }
        }, 35);

        return () => clearInterval(userInterval);
    }, [currentDemo]);

    // Auto-rotate
    useEffect(() => {
        if (phase !== "complete") return;
        const timeout = setTimeout(() => {
            setCurrentDemo((prev) => (prev + 1) % demoMessages.length);
        }, 3500);
        return () => clearTimeout(timeout);
    }, [phase]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fafafa]"
        >
            {/* Gradient background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-gradient-radial from-black/[0.03] via-transparent to-transparent rounded-full" />
                <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] bg-gradient-radial from-black/[0.02] via-transparent to-transparent rounded-full" />
            </div>

            {/* Grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left: Copy */}
                    <div
                        className={`space-y-8 transition-all duration-1000 ${
                            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-black/[0.08] shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-black" />
                            </span>
                            <span className="text-[13px] font-medium text-black">
                                Lancement imminent
                            </span>
                            <div className="h-3 w-px bg-black/10" />
                            <span className="text-[13px] text-black/50">
                                {waitlistCount} inscrit{waitlistCount !== 1 ? "s" : ""}
                            </span>
                        </div>

                        {/* Headline */}
                        <div className="space-y-6">
                            <h1 className="text-[52px] sm:text-[64px] lg:text-[76px] font-bold tracking-[-0.035em] text-black leading-[1]">
                                <span className="block">Arrêtez de</span>
                                <span className="block mt-2">perdre 3h/jour</span>
                                <span className="block mt-2 text-black/40">en paperasse.</span>
                            </h1>

                            <p className="text-[18px] sm:text-[20px] text-black/60 leading-[1.6] max-w-[480px]">
                                L&apos;assistant IA qui gère vos devis, factures et relances.{" "}
                                <span className="text-black font-medium">
                                    Parlez, c&apos;est fait.
                                </span>
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/waitlist">
                                <Button
                                    size="lg"
                                    className="bg-black hover:bg-black/90 text-white h-14 px-8 text-[15px] font-semibold rounded-xl shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15 transition-all duration-300 group"
                                >
                                    Rejoindre la liste d&apos;attente
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="#demo">
                                <Button
                                    size="lg"
                                    variant="ghost"
                                    className="h-14 px-8 text-[15px] font-medium text-black/70 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all duration-300"
                                >
                                    Voir comment ça marche
                                </Button>
                            </Link>
                        </div>

                        {/* Trust */}
                        <div className="flex items-center gap-8 pt-4">
                            {["Sans carte bancaire", "14 jours gratuits", "Support français"].map(
                                (item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-black/[0.06] flex items-center justify-center">
                                            <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />
                                        </div>
                                        <span className="text-[13px] text-black/50 font-medium">
                                            {item}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Right: Demo */}
                    <div
                        className={`relative transition-all duration-1000 delay-200 ${
                            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                    >
                        {/* Shadow/Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-b from-black/5 via-black/10 to-black/5 rounded-[32px] blur-2xl" />

                        {/* Main Card */}
                        <div className="relative bg-white rounded-2xl border border-black/[0.08] shadow-2xl shadow-black/10 overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06] bg-gradient-to-b from-neutral-50 to-white">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-black/10" />
                                        <div className="w-3 h-3 rounded-full bg-black/10" />
                                        <div className="w-3 h-3 rounded-full bg-black/10" />
                                    </div>
                                    <div className="h-4 w-px bg-black/10" />
                                    <span className="text-[12px] font-medium text-black/40">
                                        Assistant MyProPartner
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/[0.03]">
                                    <Sparkles className="w-3 h-3 text-black/50" />
                                    <span className="text-[11px] font-medium text-black/50">IA</span>
                                </div>
                            </div>

                            {/* Chat */}
                            <div className="p-6 min-h-[340px] flex flex-col">
                                <div className="flex-1 space-y-5">
                                    {/* User message */}
                                    <div className="flex justify-end">
                                        <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-br-md bg-black text-white">
                                            <p className="text-[14px] leading-relaxed">
                                                {userText}
                                                {phase === "typing-user" && (
                                                    <span className="inline-block w-0.5 h-4 bg-white/70 ml-0.5 animate-pulse" />
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* AI response */}
                                    {(phase === "typing-ai" || phase === "complete") && (
                                        <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                                                <Sparkles className="w-4 h-4 text-black/60" />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-md bg-neutral-100 border border-black/[0.04]">
                                                    <p className="text-[14px] text-black leading-relaxed">
                                                        {aiText}
                                                        {phase === "typing-ai" && (
                                                            <span className="inline-block w-0.5 h-4 bg-black/50 ml-0.5 animate-pulse" />
                                                        )}
                                                    </p>
                                                </div>

                                                {/* Action button */}
                                                {showAction && (
                                                    <div className="animate-in fade-in slide-in-from-bottom-1 duration-200">
                                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black text-white text-[12px] font-medium">
                                                            <Check className="w-3 h-3" />
                                                            {demoMessages[currentDemo].action}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Input */}
                                <div className="mt-6 flex items-center gap-3 p-2 rounded-xl bg-neutral-50 border border-black/[0.06]">
                                    <input
                                        type="text"
                                        placeholder="Demandez n'importe quoi..."
                                        className="flex-1 bg-transparent px-3 py-2 text-[14px] text-black placeholder:text-black/30 focus:outline-none"
                                        disabled
                                    />
                                    <button className="p-2.5 rounded-lg bg-black text-white hover:bg-black/90 transition-colors">
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Demo indicators */}
                        <div className="flex justify-center gap-2 mt-6">
                            {demoMessages.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentDemo(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        i === currentDemo ? "w-8 bg-black" : "w-1.5 bg-black/20"
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Floating elements */}
                        <div className="absolute -top-3 -right-3 px-3 py-2 rounded-xl bg-white border border-black/10 shadow-lg animate-in fade-in zoom-in duration-500 delay-700">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-black" />
                                </span>
                                <span className="text-[11px] font-semibold text-black">En direct</span>
                            </div>
                        </div>

                        <div className="absolute -bottom-2 -left-3 px-3 py-2 rounded-xl bg-white border border-black/10 shadow-lg animate-in fade-in zoom-in duration-500 delay-900">
                            <p className="text-[11px] text-black/50">
                                Réponse en <span className="font-semibold text-black">1.2s</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                <span className="text-[11px] text-black/30 font-medium">Scroll</span>
                <div className="w-5 h-8 rounded-full border-2 border-black/20 flex justify-center pt-2">
                    <div className="w-1 h-2 rounded-full bg-black/30 animate-pulse" />
                </div>
            </div>
        </section>
    );
}
