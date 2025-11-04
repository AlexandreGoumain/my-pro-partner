"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, MessageSquare, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Hero() {
    const [typingText, setTypingText] = useState("");
    const [showResponse, setShowResponse] = useState(false);
    const fullText = "Quel client me doit le plus d'argent ?";

    useEffect(() => {
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setTypingText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
                setTimeout(() => setShowResponse(true), 500);
            }
        }, 50);

        return () => clearInterval(typingInterval);
    }, []);

    return (
        <section className="relative pt-32 sm:pt-40 pb-32 px-6 sm:px-8 overflow-hidden bg-gradient-to-b from-white via-neutral-50/30 to-white">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-black/[0.02] rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-black/[0.02] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1200px] mx-auto relative">
                <div className="text-center space-y-7 mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08] mb-4 animate-in fade-in duration-700">
                        <Sparkles className="w-4 h-4 text-black/60" strokeWidth={2} />
                        <span className="text-[13px] text-black/60 font-medium">
                            500+ entreprises nous font confiance • Essai gratuit 14 jours
                        </span>
                    </div>

                    <h1 className="text-[56px] sm:text-[72px] lg:text-[92px] font-semibold tracking-[-0.03em] text-black leading-[0.95] animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Plus de business.
                        <br />
                        <span className="block mt-2 bg-gradient-to-r from-black via-black to-black/70 bg-clip-text text-transparent">
                            Moins de temps perdu.
                        </span>
                    </h1>

                    <p className="text-[21px] sm:text-[24px] font-normal text-black/60 max-w-[720px] mx-auto leading-[1.4] tracking-[-0.01em] pt-2 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Devis, factures, clients, stocks.{" "}
                        <span className="text-black font-medium">
                            Gérez tout en quelques clics.
                        </span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <Link href="/auth/register">
                            <Button
                                size="lg"
                                className="bg-black hover:bg-black/90 text-white rounded-full h-12 px-8 text-[15px] font-medium shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                            >
                                Essayer gratuitement
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="#demo">
                            <Button
                                size="lg"
                                variant="outline"
                                className="rounded-full h-12 px-8 text-[15px] font-medium border-black/10 hover:bg-black/5"
                            >
                                Voir la démo
                            </Button>
                        </Link>
                    </div>

                    <div className="flex flex-wrap gap-5 justify-center items-center pt-4 text-[13px] text-black/50 font-medium animate-in fade-in duration-700 delay-300">
                        <span>✓ 14 jours gratuits</span>
                        <span className="w-1 h-1 rounded-full bg-black/20" />
                        <span>✓ Sans carte bancaire</span>
                        <span className="w-1 h-1 rounded-full bg-black/20" />
                        <span>✓ Installation en 2 min</span>
                    </div>
                </div>

                {/* Interactive Demo */}
                <div className="mt-20 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-400">
                    <div className="relative max-w-5xl mx-auto">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10 rounded-[32px] blur-3xl translate-y-8" />

                        {/* Main demo card */}
                        <div className="relative">
                            <Card className="border-black/10 shadow-2xl shadow-black/10 overflow-hidden bg-white">
                                {/* Browser chrome */}
                                <div className="bg-neutral-50 border-b border-black/8 px-4 py-3 flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-black/10" />
                                        <div className="w-3 h-3 rounded-full bg-black/10" />
                                        <div className="w-3 h-3 rounded-full bg-black/10" />
                                    </div>
                                    <div className="flex-1 mx-8">
                                        <div className="bg-white border border-black/8 rounded-md px-3 py-1.5 text-[11px] text-black/40 font-mono">
                                            mypropartner.com/dashboard
                                        </div>
                                    </div>
                                </div>

                                {/* Chat Interface */}
                                <div className="p-8 bg-gradient-to-br from-white via-neutral-50/30 to-white">
                                    <div className="space-y-6 max-w-3xl mx-auto">
                                        {/* User message */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                                                <MessageSquare className="w-5 h-5 text-black/60" strokeWidth={2} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="inline-block px-5 py-3.5 rounded-2xl rounded-tl-none bg-black/5 border border-black/8">
                                                    <p className="text-[15px] text-black font-medium">
                                                        {typingText}
                                                        {typingText.length < fullText.length && (
                                                            <span className="inline-block w-0.5 h-4 bg-black ml-0.5 animate-pulse" />
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI response */}
                                        {showResponse && (
                                            <div className="flex items-start gap-4 flex-row-reverse animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-black to-black/80 flex items-center justify-center">
                                                    <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
                                                </div>
                                                <div className="flex-1 text-right">
                                                    <div className="inline-block px-5 py-4 rounded-2xl rounded-tr-none bg-white border border-black/10 shadow-lg">
                                                        <p className="text-[15px] font-medium text-black mb-4 text-left">
                                                            Voici vos 3 principaux débiteurs :
                                                        </p>
                                                        <div className="text-left space-y-3">
                                                            <div className="flex items-center justify-between p-3 bg-black/[0.02] rounded-lg border border-black/5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                                                                        <span className="text-[12px] font-bold text-black">1</span>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[13px] font-semibold text-black">Martin Construction</p>
                                                                        <p className="text-[11px] text-black/40">3 factures • 45j retard</p>
                                                                    </div>
                                                                </div>
                                                                <p className="text-[15px] font-bold text-black">8 450 €</p>
                                                            </div>
                                                            <div className="flex items-center justify-between p-3 bg-black/[0.02] rounded-lg border border-black/5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                                                                        <span className="text-[12px] font-bold text-black">2</span>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[13px] font-semibold text-black">Dupont Rénovation</p>
                                                                        <p className="text-[11px] text-black/40">2 factures • 22j retard</p>
                                                                    </div>
                                                                </div>
                                                                <p className="text-[15px] font-bold text-black">5 200 €</p>
                                                            </div>
                                                            <div className="flex items-center justify-between p-3 bg-black/[0.02] rounded-lg border border-black/5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                                                                        <span className="text-[12px] font-bold text-black">3</span>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[13px] font-semibold text-black">Bernard SARL</p>
                                                                        <p className="text-[11px] text-black/40">1 facture • 12j retard</p>
                                                                    </div>
                                                                </div>
                                                                <p className="text-[15px] font-bold text-black">3 800 €</p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 pt-4 border-t border-black/10 flex items-center justify-between text-left">
                                                            <div className="flex items-center gap-2 text-[11px] text-black/60">
                                                                <Zap className="w-3.5 h-3.5" strokeWidth={2} />
                                                                <span>Réponse générée en 1.2s</span>
                                                            </div>
                                                            <p className="text-[13px] font-semibold text-black">
                                                                Total: 17 450 €
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>

                            {/* Floating badges */}
                            {showResponse && (
                                <>
                                    <div className="absolute -left-8 top-1/4 animate-in fade-in slide-in-from-left duration-700 delay-500 hidden lg:block">
                                        <Card className="p-3 bg-white border-black/10 shadow-lg">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-black" strokeWidth={2} />
                                                <span className="text-[11px] font-medium text-black">Analyse temps réel</span>
                                            </div>
                                        </Card>
                                    </div>
                                    <div className="absolute -right-8 bottom-1/4 animate-in fade-in slide-in-from-right duration-700 delay-700 hidden lg:block">
                                        <Card className="p-3 bg-white border-black/10 shadow-lg">
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-black" strokeWidth={2} />
                                                <span className="text-[11px] font-medium text-black">40+ actions rapides</span>
                                            </div>
                                        </Card>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
