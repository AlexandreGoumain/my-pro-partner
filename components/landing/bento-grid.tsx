"use client";

import { Card } from "@/components/ui/card";
import { FileText, Package, Users, Zap, Sparkles, ArrowRight, Check } from "lucide-react";
import { useState } from "react";

const features = [
    {
        icon: Sparkles,
        title: "Questions & Réponses",
        description:
            "Parlez naturellement à votre ERP. 'Crée une facture pour M. Dupont avec 3 fenêtres à 800€' et c'est fait. Plus besoin de formulaires compliqués.",
        benefits: ["Commandes vocales", "Compréhension naturelle", "Disponible 24/7"],
        metric: "10x plus rapide que tout le reste",
        highlight: true,
        example: "Quel client me doit le plus d'argent ?"
    },
    {
        icon: FileText,
        title: "Devis & Factures",
        description:
            "Créez des documents professionnels en 2 minutes. Calculs automatiques, envoi par email, conversion devis → facture en 1 clic.",
        benefits: ["Templates personnalisables", "Numérotation automatique", "Relances automatiques"],
        metric: "3x plus rapide qu'Excel",
        example: "Crée un devis pour Martin Construction"
    },
    {
        icon: Users,
        title: "Gestion Clients",
        description:
            "Centralisez toutes vos données clients. Historique complet des échanges, factures, paiements. Recherche instantanée.",
        benefits: ["Import Excel/CSV", "Segmentation avancée", "Export comptable"],
        metric: "Tout en 1 clic",
        example: "500+ clients centralisés"
    },
    {
        icon: Package,
        title: "Gestion des Stocks",
        description:
            "Suivez votre inventaire en temps réel. Alertes automatiques avant rupture, historique des mouvements, multi-emplacements.",
        benefits: ["Scan codes-barres", "Alertes en temps réel", "Historique complet"],
        metric: "Zéro rupture de stock",
        example: "1200+ articles suivis"
    },
    {
        icon: Zap,
        title: "Analytics & Rapports",
        description:
            "Visualisez vos performances en un coup d'œil. Évolution du CA, top clients, produits les plus vendus, exports personnalisés.",
        benefits: ["Graphiques temps réel", "Rapports détaillés", "Export PDF/Excel"],
        metric: "Vision à 360° de votre business",
        example: "Analyse profitabilité en 2 sec"
    },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
    const [isHovered, setIsHovered] = useState(false);
    const Icon = feature.icon;
    const isHighlight = feature.highlight;

    return (
        <Card
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative p-10 transition-all duration-500 overflow-hidden ${
                isHighlight
                    ? "bg-black text-white border-black md:col-span-2 hover:shadow-2xl hover:shadow-black/20"
                    : "bg-white border border-black/[0.08] hover:border-black/[0.15] hover:shadow-lg hover:shadow-black/5"
            }`}
        >
            {/* Animated gradient background on hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                isHighlight
                    ? "bg-gradient-to-br from-black via-black to-black/80"
                    : "bg-gradient-to-br from-white via-neutral-50/50 to-white"
            }`} />

            {/* Content */}
            <div className="relative space-y-6">
                <div className="flex items-start justify-between">
                    <div className={`inline-flex p-3 rounded-2xl transition-all duration-500 ${
                        isHighlight
                            ? "bg-white/[0.1] group-hover:bg-white/[0.15] group-hover:scale-110"
                            : "bg-black/[0.03] group-hover:bg-black/[0.06] group-hover:scale-110"
                    }`}>
                        <Icon
                            className={`w-7 h-7 transition-transform duration-500 ${
                                isHighlight ? "text-white" : "text-black"
                            } ${isHovered ? "rotate-12" : ""}`}
                            strokeWidth={1.5}
                        />
                    </div>
                    {isHighlight && (
                        <div className="inline-flex px-3 py-1.5 rounded-full bg-white/[0.15] border border-white/[0.2] animate-in fade-in slide-in-from-top duration-500">
                            <span className="text-[11px] text-white font-semibold uppercase tracking-wide">
                                Nouveau
                            </span>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <h3 className={`text-[28px] font-semibold tracking-[-0.01em] ${
                        isHighlight ? "text-white" : "text-black"
                    }`}>
                        {feature.title}
                    </h3>
                    <p className={`text-[17px] leading-[1.5] tracking-[-0.01em] ${
                        isHighlight ? "text-white/80" : "text-black/60"
                    }`}>
                        {feature.description}
                    </p>
                </div>

                {/* Benefits with check icons */}
                <div className="space-y-2.5 pt-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                        <div
                            key={benefitIndex}
                            className="flex items-center gap-3 animate-in fade-in slide-in-from-left duration-500"
                            style={{ animationDelay: `${benefitIndex * 100}ms` }}
                        >
                            <div className={`flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full transition-all duration-300 ${
                                isHighlight
                                    ? "bg-white/[0.15] group-hover:bg-white/[0.25]"
                                    : "bg-black/[0.06] group-hover:bg-black/[0.1]"
                            }`}>
                                <Check
                                    className={`w-3 h-3 ${isHighlight ? "text-white" : "text-black/60"}`}
                                    strokeWidth={3}
                                />
                            </div>
                            <span className={`text-[14px] font-medium ${
                                isHighlight ? "text-white/80" : "text-black/60"
                            }`}>
                                {benefit}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Bottom section with metric and example */}
                <div className={`pt-6 mt-6 border-t space-y-4 ${
                    isHighlight ? "border-white/[0.15]" : "border-black/[0.06]"
                }`}>
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
                        isHighlight
                            ? "bg-white/[0.15] border border-white/[0.2] group-hover:bg-white/[0.2]"
                            : "bg-black/[0.03] border border-black/[0.08] group-hover:bg-black/[0.06]"
                    }`}>
                        <Zap className={`w-3.5 h-3.5 ${isHighlight ? "text-white" : "text-black/60"}`} strokeWidth={2} />
                        <span className={`text-[12px] font-medium ${
                            isHighlight ? "text-white" : "text-black/60"
                        }`}>
                            {feature.metric}
                        </span>
                    </div>

                    {/* Example use case */}
                    {feature.example && (
                        <div className={`flex items-center gap-2 text-[13px] ${
                            isHighlight ? "text-white/60" : "text-black/40"
                        }`}>
                            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                            <span className="italic">{feature.example}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating dot decoration on hover */}
            <div className={`absolute top-6 right-6 w-2 h-2 rounded-full transition-all duration-500 ${
                isHighlight ? "bg-white/20" : "bg-black/10"
            } ${isHovered ? "scale-150 opacity-100" : "scale-100 opacity-50"}`} />
        </Card>
    );
}

export function BentoGrid() {
    return (
        <section id="features" className="relative py-32 px-6 sm:px-8 bg-gradient-to-b from-white via-neutral-50/30 to-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-0 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-0 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1120px] mx-auto relative">
                <div className="text-center space-y-5 mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08] animate-in fade-in duration-700">
                        <Package className="w-4 h-4 text-black/60" strokeWidth={2} />
                        <span className="text-[13px] text-black/60 font-medium">
                            Une plateforme complète
                        </span>
                    </div>
                    <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.02em] text-black leading-[1.05] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        Tout ce dont vous avez besoin
                    </h2>
                    <p className="text-[19px] text-black/60 max-w-[640px] mx-auto leading-[1.5] tracking-[-0.01em] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                        Une plateforme complète qui simplifie la gestion de votre entreprise
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>

                {/* Bottom call-to-action */}
                <div className="mt-16 text-center">
                    <p className="text-[15px] text-black/40">
                        Et bien plus encore : <span className="text-black/60 font-medium">multi-devises, multi-taxes, exports comptables, API...</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
