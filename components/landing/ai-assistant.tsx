"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Sparkles,
    MessageSquare,
    Zap,
    TrendingUp,
    Brain,
    Target,
    Shield,
    ArrowRight
} from "lucide-react";
import Link from "next/link";

const aiCapabilities = [
    {
        icon: MessageSquare,
        title: "Chat naturel",
        description: "Posez vos questions en français. Obtenez des réponses instantanées avec vos vraies données.",
        metric: "10x plus rapide"
    },
    {
        icon: Brain,
        title: "Analytics auto",
        description: "Analyse rentabilité, tendances, opportunités en 3 secondes.",
        metric: "95% temps gagné"
    },
    {
        icon: Target,
        title: "Prédictions",
        description: "Prédis votre CA, détecte les risques, score clients automatique.",
        metric: "Prédictions fiables"
    },
    {
        icon: Zap,
        title: "Génération docs",
        description: "Créez devis, factures, emails de relance en 10 secondes.",
        metric: "Documents en 10 sec"
    },
    {
        icon: TrendingUp,
        title: "Gestion impayés",
        description: "Liste complète des débiteurs, rappels personnalisés automatiques.",
        metric: "Cash-flow optimisé"
    },
    {
        icon: Shield,
        title: "Automatisations 24/7",
        description: "Surveillance et actions automatiques en permanence. Zéro oubli.",
        metric: "Toujours actif"
    }
];

export function AIAssistant() {
    return (
        <section className="py-32 px-6 sm:px-8 bg-black text-white overflow-hidden relative">
            {/* Background gradient effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black opacity-50" />
            <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-white/[0.03] rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-white/[0.03] rounded-full blur-3xl" />

            <div className="max-w-[1120px] mx-auto relative z-10">
                {/* Header */}
                <div className="text-center space-y-6 mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1]">
                        <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
                        <span className="text-[13px] text-white/80 font-medium">
                            Réponses instantanées • Analyses automatiques
                        </span>
                    </div>

                    <h2 className="text-[48px] sm:text-[64px] font-semibold tracking-[-0.03em] leading-[1.05]">
                        Posez vos questions.
                        <br />
                        <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                            Obtenez les réponses.
                        </span>
                    </h2>

                    <p className="text-[19px] text-white/60 max-w-[720px] mx-auto leading-[1.5]">
                        Posez vos questions en français. Analyse instantanée, prédictions fiables, documents générés automatiquement.
                    </p>
                </div>

                {/* AI Capabilities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {aiCapabilities.map((capability, index) => {
                        const Icon = capability.icon;
                        return (
                            <Card
                                key={index}
                                className="group bg-white/[0.03] border-white/[0.1] hover:bg-white/[0.05] hover:border-white/[0.15] backdrop-blur-sm p-6 transition-all duration-300"
                            >
                                <div className="space-y-4">
                                    <div className="inline-flex p-3 rounded-2xl bg-white/[0.05] group-hover:bg-white/[0.08] transition-colors duration-300">
                                        <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h3 className="text-[18px] font-semibold text-white mb-2">
                                            {capability.title}
                                        </h3>
                                        <p className="text-[14px] text-white/60 leading-[1.6]">
                                            {capability.description}
                                        </p>
                                    </div>
                                    <div className="inline-flex px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.1]">
                                        <span className="text-[12px] text-white/80 font-medium">
                                            {capability.metric}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Card className="inline-block bg-white/[0.05] border-white/[0.1] p-8">
                        <div className="space-y-6">
                            <h3 className="text-[28px] font-semibold text-white tracking-[-0.02em]">
                                Transformez votre gestion d'entreprise
                            </h3>
                            <p className="text-[16px] text-white/60 max-w-[600px]">
                                Pendant que vos concurrents perdent des heures, vous obtenez des insights en 3 secondes.
                            </p>
                            <Link href="/auth/register">
                                <Button
                                    size="lg"
                                    className="bg-white hover:bg-white/90 text-black rounded-full h-12 px-8 text-[15px] font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                                >
                                    Commencer gratuitement
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <p className="text-[13px] text-white/40">
                                Sans engagement • Sans carte bancaire
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}
