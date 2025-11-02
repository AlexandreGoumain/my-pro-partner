"use client";

import { Card } from "@/components/ui/card";
import { FileText, Package, Users, Zap } from "lucide-react";

const features = [
    {
        icon: FileText,
        title: "Devis & Factures",
        description:
            "Créez des documents professionnels en 2 minutes. Calculs automatiques, envoi par email, conversion devis → facture en 1 clic.",
        benefits: ["Templates personnalisables", "Numérotation automatique", "Relances automatiques"],
        metric: "3x plus rapide qu'Excel"
    },
    {
        icon: Users,
        title: "Gestion Clients",
        description:
            "Centralisez toutes vos données clients. Historique complet des échanges, factures, paiements. Recherche instantanée.",
        benefits: ["Import Excel/CSV", "Segmentation avancée", "Export comptable"],
        metric: "Tout en 1 clic"
    },
    {
        icon: Package,
        title: "Gestion des Stocks",
        description:
            "Suivez votre inventaire en temps réel. Alertes automatiques avant rupture, historique des mouvements, multi-emplacements.",
        benefits: ["Scan codes-barres", "Alertes en temps réel", "Historique complet"],
        metric: "Zéro rupture de stock"
    },
    {
        icon: Zap,
        title: "Analytics & Rapports",
        description:
            "Visualisez vos performances en un coup d'œil. Évolution du CA, top clients, produits les plus vendus, exports personnalisés.",
        benefits: ["Graphiques temps réel", "Rapports détaillés", "Export PDF/Excel"],
        metric: "Vision à 360° de votre business"
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
                                <div className="space-y-6">
                                    <div className="inline-flex p-3 rounded-2xl bg-black/[0.03] group-hover:bg-black/[0.06] transition-colors duration-300">
                                        <Icon
                                            className="w-7 h-7 text-black"
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-[28px] font-semibold text-black tracking-[-0.01em]">
                                            {feature.title}
                                        </h3>
                                        <p className="text-[17px] text-black/60 leading-[1.5] tracking-[-0.01em]">
                                            {feature.description}
                                        </p>
                                    </div>
                                    <div className="space-y-2 pt-2">
                                        {feature.benefits.map((benefit, benefitIndex) => (
                                            <div key={benefitIndex} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-black/30" />
                                                <span className="text-[14px] text-black/60">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-3 border-t border-black/[0.06]">
                                        <div className="inline-flex px-3 py-1.5 rounded-full bg-black/[0.03] border border-black/[0.08]">
                                            <span className="text-[12px] text-black/60 font-medium">
                                                {feature.metric}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
