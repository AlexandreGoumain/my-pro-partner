"use client";

import { Card } from "@/components/ui/card";
import {
    Sparkles,
    FileText,
    Users,
    Package,
    TrendingUp,
    Zap,
    MessageSquare,
    Shield
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
    {
        icon: Sparkles,
        title: "Assistant IA",
        description: "Parlez naturellement. L'IA comprend vos besoins et agit instantanément.",
        color: "from-black/[0.03] to-black/[0.06]",
        iconColor: "text-black/70",
        stats: "Réponse en 1.2s",
        highlight: true
    },
    {
        icon: FileText,
        title: "Devis & Factures",
        description: "Créez des documents professionnels en 2 minutes chrono.",
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        stats: "3x plus rapide"
    },
    {
        icon: Users,
        title: "CRM Intelligent",
        description: "Centralisez tous vos clients. Historique complet et recherche instantanée.",
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        stats: "Accès en 1 clic"
    },
    {
        icon: Package,
        title: "Gestion Stocks",
        description: "Suivi en temps réel. Alertes automatiques. Zéro rupture.",
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        stats: "Temps réel"
    },
    {
        icon: TrendingUp,
        title: "Analytics Avancés",
        description: "Tableaux de bord interactifs. Décisions basées sur les données.",
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        stats: "Vision 360°"
    },
    {
        icon: Zap,
        title: "Automatisation",
        description: "Relances clients, calculs TVA, exports comptables. Tout automatique.",
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        stats: "95% automatisé"
    },
    {
        icon: MessageSquare,
        title: "Portal Client",
        description: "Vos clients accèdent à leurs documents 24/7. Moins de support.",
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        stats: "Support -60%"
    },
    {
        icon: Shield,
        title: "Sécurité Max",
        description: "Chiffrement bancaire. RGPD. Sauvegardes automatiques quotidiennes.",
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        stats: "Niveau bancaire"
    }
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const Icon = feature.icon;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${index * 80}ms` }}
        >
            <Card className={`group relative p-8 rounded-3xl border transition-all duration-500 overflow-hidden ${
                feature.highlight
                    ? "bg-black text-white border-black shadow-2xl shadow-black/20 lg:scale-105"
                    : "bg-white border-black/[0.06] hover:border-black/[0.12] hover:shadow-xl hover:shadow-black/5"
            }`}>
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div className={`inline-flex p-4 rounded-2xl transition-all duration-500 ${
                            feature.highlight
                                ? "bg-white/10 group-hover:bg-white/20 group-hover:scale-110"
                                : "bg-black/[0.04] group-hover:bg-black/[0.08] group-hover:scale-110"
                        }`}>
                            <Icon
                                className={`w-7 h-7 transition-all duration-500 ${
                                    feature.highlight ? "text-white" : feature.iconColor
                                } ${isHovered ? "rotate-12 scale-110" : ""}`}
                                strokeWidth={1.5}
                            />
                        </div>

                        {feature.highlight && (
                            <div className="inline-flex px-3 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm">
                                <span className="text-[10px] text-white font-bold uppercase tracking-wide">
                                    Nouveau
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                        <h3 className={`text-[24px] font-bold tracking-[-0.02em] ${
                            feature.highlight ? "text-white" : "text-black"
                        }`}>
                            {feature.title}
                        </h3>
                        <p className={`text-[15px] leading-[1.6] ${
                            feature.highlight ? "text-white/80" : "text-black/60"
                        }`}>
                            {feature.description}
                        </p>
                    </div>

                    {/* Stats badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                        feature.highlight
                            ? "bg-white/15 border border-white/20"
                            : "bg-black/[0.04] border border-black/[0.08] group-hover:bg-black/[0.06]"
                    }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                            feature.highlight ? "bg-white" : "bg-black"
                        } animate-pulse`} />
                        <span className={`text-[12px] font-semibold ${
                            feature.highlight ? "text-white" : "text-black/70"
                        }`}>
                            {feature.stats}
                        </span>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className={`absolute top-6 right-6 w-2 h-2 rounded-full transition-all duration-500 ${
                    feature.highlight ? "bg-white/20" : "bg-black/10"
                } ${isHovered ? "scale-150 opacity-100" : "scale-100 opacity-50"}`} />

                <div className={`absolute bottom-6 right-6 w-20 h-20 rounded-full transition-all duration-700 ${
                    feature.highlight ? "bg-white/5" : "bg-black/[0.02]"
                } ${isHovered ? "scale-150 opacity-100" : "scale-100 opacity-0"}`} />
            </Card>
        </div>
    );
}

export function FeaturesShowcase() {
    return (
        <section id="features" className="relative py-32 px-6 sm:px-8 bg-gradient-to-b from-neutral-50/50 via-white to-neutral-50/30 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-black/[0.015] rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-black/[0.015] rounded-full blur-[100px]" />
            </div>

            <div className="max-w-[1400px] mx-auto relative">
                {/* Header */}
                <div className="text-center space-y-6 mb-20">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/[0.04] border border-black/[0.08]">
                        <Sparkles className="w-4 h-4 text-black/60" strokeWidth={2} />
                        <span className="text-[13px] text-black font-semibold">
                            Une plateforme complète
                        </span>
                    </div>

                    <h2 className="text-[56px] sm:text-[72px] font-bold tracking-[-0.03em] text-black leading-[1.05]">
                        Tout ce dont vous avez
                        <span className="block mt-2 bg-gradient-to-r from-black via-black/90 to-black/60 bg-clip-text text-transparent">
                            réellement besoin.
                        </span>
                    </h2>

                    <p className="text-[20px] text-black/60 max-w-[680px] mx-auto leading-[1.5]">
                        8 modules puissants qui travaillent ensemble pour simplifier votre quotidien
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            feature={feature}
                            index={index}
                        />
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-20 text-center">
                    <p className="text-[15px] text-black/40">
                        Et bien plus encore :{" "}
                        <span className="text-black font-semibold">
                            multi-devises, multi-taxes, API, webhooks, exports comptables...
                        </span>
                    </p>
                </div>
            </div>
        </section>
    );
}
