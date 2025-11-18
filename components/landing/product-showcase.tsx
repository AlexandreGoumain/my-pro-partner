"use client";

import { Card } from "@/components/ui/card";
import {
    FileText,
    Package,
    Users,
    Store,
    CreditCard,
    Gift,
    BarChart3,
    Smartphone,
    Sparkles,
} from "lucide-react";

interface Feature {
    icon: React.ElementType;
    title: string;
    description: string;
    badge?: string;
}

const features: Feature[] = [
    {
        icon: Sparkles,
        title: "Assistant IA GPT-4",
        description: "Posez vos questions en français, obtenez des réponses instantanées avec vos données réelles",
        badge: "AI-Powered",
    },
    {
        icon: FileText,
        title: "Devis & Factures Automatiques",
        description: "Créez un devis en 2 min, convertissez en facture en 1 clic, envoyez par email avec PDF",
    },
    {
        icon: Users,
        title: "CRM Intelligent",
        description: "500+ clients, segmentation avancée, historique complet, portail client automatique",
    },
    {
        icon: Package,
        title: "Gestion Stock Multi-Magasin",
        description: "Inventaire temps réel, alertes stocks bas, transferts inter-magasins, traçabilité complète",
    },
    {
        icon: CreditCard,
        title: "Encaissement Moderne",
        description: "Point de vente tactile, Stripe Terminal, paiement en ligne, QR codes, relances auto",
    },
    {
        icon: Gift,
        title: "Programme de Fidélité",
        description: "Points automatiques, niveaux personnalisés, récompenses, engagement client maximisé",
    },
    {
        icon: BarChart3,
        title: "Analytics & Rapports",
        description: "Tableaux de bord temps réel, prédictions IA, export FEC, KPIs métier sur-mesure",
    },
    {
        icon: Store,
        title: "Multi-Magasin & Équipe",
        description: "Gérez plusieurs emplacements, rôles & permissions, pointage équipe, planning",
    },
    {
        icon: Smartphone,
        title: "PWA Mobile-First",
        description: "Installez sur mobile/desktop, mode hors-ligne, synchronisation auto, toujours accessible",
    },
];

export function ProductShowcase() {
    return (
        <section className="relative py-32 px-6 sm:px-8 bg-gradient-to-b from-white via-neutral-50/50 to-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1200px] mx-auto relative">
                {/* Header */}
                <div className="text-center space-y-5 mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                        <Package className="w-4 h-4 text-black/60" strokeWidth={2} />
                        <span className="text-[13px] text-black/60 font-medium">
                            Plateforme All-in-One
                        </span>
                    </div>

                    <h2 className="text-[48px] sm:text-[64px] font-semibold tracking-[-0.03em] text-black leading-[1.05]">
                        Tout ce dont vous avez besoin.
                        <br />
                        <span className="text-black/60">Dans un seul outil.</span>
                    </h2>

                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5]">
                        De la création de devis jusqu'au paiement, en passant par la gestion des stocks et la
                        fidélisation. MyProPartner centralise toute votre entreprise.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={index}
                                className="group relative p-6 bg-white border-black/[0.08] hover:border-black/[0.15] hover:shadow-lg transition-all duration-300 overflow-hidden"
                            >
                                {/* Hover gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative space-y-4">
                                    {/* Icon & Badge */}
                                    <div className="flex items-start justify-between">
                                        <div className="p-3 rounded-xl bg-black/[0.03] border border-black/[0.08] group-hover:bg-black group-hover:border-black transition-all duration-300">
                                            <Icon className="w-5 h-5 text-black/60 group-hover:text-white transition-colors duration-300" strokeWidth={2} />
                                        </div>
                                        {feature.badge && (
                                            <span className="px-2.5 py-1 rounded-full bg-black text-white text-[10px] font-semibold tracking-wide">
                                                {feature.badge}
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2">
                                        <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                                            {feature.title}
                                        </h3>
                                        <p className="text-[14px] text-black/60 leading-[1.6]">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Bottom highlight */}
                <div className="mt-16 text-center">
                    <Card className="inline-block p-5 bg-gradient-to-r from-black via-black to-black/90 border-black text-white">
                        <div className="flex flex-wrap items-center justify-center gap-8 text-[14px] font-medium">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span>122 API Routes</span>
                            </div>
                            <div className="w-px h-4 bg-white/20" />
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                <span>40+ Modèles de données</span>
                            </div>
                            <div className="w-px h-4 bg-white/20" />
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                <span>20 Types d'entreprise</span>
                            </div>
                            <div className="w-px h-4 bg-white/20" />
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-yellow-400" strokeWidth={2} />
                                <span>Architecture Enterprise-Grade</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}
