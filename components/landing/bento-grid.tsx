"use client";

import { Card } from "@/components/ui/card";
import { FileText, Package, Users, Zap } from "lucide-react";

const features = [
    {
        icon: FileText,
        title: "Facturation",
        description:
            "Créez des devis et factures professionnels en quelques secondes. Calculs automatiques, conversion instantanée.",
    },
    {
        icon: Users,
        title: "Gestion Clients",
        description:
            "Centralisez toutes vos données clients. Historique complet, recherche avancée, accès instantané.",
    },
    {
        icon: Package,
        title: "Inventaire",
        description:
            "Suivez votre stock en temps réel. Alertes automatiques, suivi complet, ne manquez plus jamais de stock.",
    },
    {
        icon: Zap,
        title: "Ultra Rapide",
        description:
            "Interface ultra rapide. Réponse instantanée, interactions fluides, aucune attente.",
    },
];

export function BentoGrid() {
    return (
        <section id="features" className="py-32 px-6 sm:px-8 bg-neutral-50">
            <div className="max-w-[1120px] mx-auto">
                <div className="text-center space-y-5 mb-24">
                    <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.02em] text-black leading-[1.05]">
                        Tout ce dont vous avez besoin
                    </h2>
                    <p className="text-[19px] text-black/60 max-w-[600px] mx-auto leading-[1.5] tracking-[-0.01em]">
                        Une plateforme complète qui simplifie la gestion de
                        votre entreprise
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={index}
                                className="group p-10 bg-white border border-black/[0.08] hover:border-black/[0.12] transition-all duration-300 hover:shadow-sm"
                            >
                                <div className="space-y-5">
                                    <div className="inline-flex p-3 rounded-2xl bg-black/[0.03] group-hover:bg-black/[0.06] transition-colors duration-300">
                                        <Icon
                                            className="w-7 h-7 text-black"
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <h3 className="text-[28px] font-semibold text-black tracking-[-0.01em]">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[17px] text-black/60 leading-[1.5] tracking-[-0.01em]">
                                        {feature.description}
                                    </p>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
