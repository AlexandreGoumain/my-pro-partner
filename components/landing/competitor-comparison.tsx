"use client";

import { Card } from "@/components/ui/card";
import { Check, X, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PLANS_CONFIG } from "@/lib/config/plans.config";

interface CompetitorFeature {
    category: string;
    features: {
        name: string;
        myProPartner: boolean | string;
        competitor1: boolean | string;
        competitor2: boolean | string;
        competitor3: boolean | string;
    }[];
}

const comparisonData: CompetitorFeature[] = [
    {
        category: "Tarification",
        features: [
            {
                name: "Prix mensuel (plan Pro)",
                myProPartner: `${PLANS_CONFIG.PRO.price.monthly}€`,
                competitor1: "149€",
                competitor2: "199€",
                competitor3: "Devis uniquement"
            },
            {
                name: "Essai gratuit sans CB",
                myProPartner: true,
                competitor1: false,
                competitor2: true,
                competitor3: false
            },
            {
                name: "Pas de frais cachés",
                myProPartner: true,
                competitor1: false,
                competitor2: false,
                competitor3: false
            }
        ]
    },
    {
        category: "Assistant IA",
        features: [
            {
                name: "Assistant vocal intelligent",
                myProPartner: true,
                competitor1: false,
                competitor2: false,
                competitor3: false
            },
            {
                name: "Création documents par IA",
                myProPartner: true,
                competitor1: false,
                competitor2: false,
                competitor3: false
            },
            {
                name: "Réponses instantanées",
                myProPartner: true,
                competitor1: false,
                competitor2: false,
                competitor3: false
            }
        ]
    },
    {
        category: "Fonctionnalités",
        features: [
            {
                name: "Gestion complète CRM",
                myProPartner: true,
                competitor1: true,
                competitor2: true,
                competitor3: true
            },
            {
                name: "Devis & Factures",
                myProPartner: true,
                competitor1: true,
                competitor2: true,
                competitor3: true
            },
            {
                name: "Gestion des stocks",
                myProPartner: true,
                competitor1: true,
                competitor2: "Option payante",
                competitor3: true
            },
            {
                name: "Point de vente (POS)",
                myProPartner: true,
                competitor1: "Option payante",
                competitor2: false,
                competitor3: "Option payante"
            },
            {
                name: "Programme de fidélité",
                myProPartner: true,
                competitor1: false,
                competitor2: false,
                competitor3: false
            },
            {
                name: "Marketing automation",
                myProPartner: true,
                competitor1: "Option payante",
                competitor2: false,
                competitor3: "Option payante"
            }
        ]
    },
    {
        category: "Expérience utilisateur",
        features: [
            {
                name: "Interface intuitive",
                myProPartner: true,
                competitor1: "Interface complexe",
                competitor2: true,
                competitor3: "Formation requise"
            },
            {
                name: "Installation en 2 min",
                myProPartner: true,
                competitor1: "1-2 jours",
                competitor2: "Quelques heures",
                competitor3: "Plusieurs jours"
            },
            {
                name: "Support français",
                myProPartner: "24/7",
                competitor1: "Email uniquement",
                competitor2: "Horaires limités",
                competitor3: "Support payant"
            }
        ]
    }
];

const competitors = [
    { id: "mypropartner", name: "MyProPartner", highlight: true },
    { id: "competitor1", name: "Solution 1" },
    { id: "competitor2", name: "Solution 2" },
    { id: "competitor3", name: "Solution 3" }
];

function CellValue({ value, isHighlight }: { value: boolean | string; isHighlight: boolean }) {
    if (typeof value === "boolean") {
        return value ? (
            <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${
                isHighlight ? "bg-white/[0.15]" : "bg-black/[0.06]"
            }`}>
                <Check className={`w-4 h-4 ${isHighlight ? "text-white" : "text-black"}`} strokeWidth={2.5} />
            </div>
        ) : (
            <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/[0.03]">
                <X className="w-4 h-4 text-black/30" strokeWidth={2} />
            </div>
        );
    }

    return (
        <span className={`text-[13px] font-medium ${
            isHighlight ? "text-white" : "text-black/70"
        }`}>
            {value}
        </span>
    );
}

export function CompetitorComparison() {
    return (
        <section className="relative py-32 px-6 sm:px-8 bg-gradient-to-b from-white via-neutral-50/50 to-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-black/[0.02] rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-black/[0.02] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1200px] mx-auto relative">
                {/* Header */}
                <div className="text-center space-y-5 mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                        <Zap className="w-4 h-4 text-black/60" strokeWidth={2} />
                        <span className="text-[13px] text-black/60 font-medium">
                            Comparaison objective
                        </span>
                    </div>
                    <h2 className="text-[48px] sm:text-[64px] font-semibold tracking-[-0.03em] text-black leading-[1.05]">
                        Pourquoi nous choisir ?
                    </h2>
                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5]">
                        Comparez par vous-même. MyProPartner offre plus de fonctionnalités pour moins cher.
                    </p>
                </div>

                {/* Comparison Table - Mobile: Stacked Cards */}
                <div className="lg:hidden space-y-4">
                    {comparisonData.map((category, categoryIndex) => (
                        <Card key={categoryIndex} className="p-6 bg-white border-black/[0.08]">
                            <h3 className="text-[18px] font-semibold text-black mb-4">
                                {category.category}
                            </h3>
                            <div className="space-y-4">
                                {category.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="space-y-2">
                                        <div className="text-[13px] font-medium text-black/60">
                                            {feature.name}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="p-2 rounded-lg bg-black text-white text-center">
                                                <div className="text-[11px] opacity-60 mb-1">Nous</div>
                                                <CellValue value={feature.myProPartner} isHighlight={true} />
                                            </div>
                                            <div className="p-2 rounded-lg bg-black/[0.02] border border-black/[0.06] text-center">
                                                <div className="text-[11px] text-black/40 mb-1">Autres</div>
                                                <CellValue value={feature.competitor1} isHighlight={false} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Comparison Table - Desktop */}
                <div className="hidden lg:block overflow-hidden rounded-2xl border border-black/[0.08] shadow-2xl shadow-black/5">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            {/* Header */}
                            <thead>
                                <tr className="border-b border-black/[0.08]">
                                    <th className="text-left p-6 bg-white">
                                        <span className="text-[13px] font-semibold text-black/40 uppercase tracking-wide">
                                            Fonctionnalités
                                        </span>
                                    </th>
                                    {competitors.map((competitor) => (
                                        <th key={competitor.id} className={`text-center ${
                                            competitor.highlight
                                                ? "bg-black pt-8 pb-6 px-6"
                                                : "bg-white p-6"
                                        }`}>
                                            {competitor.highlight && (
                                                <div className="mb-3">
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black shadow-md">
                                                        <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
                                                        <span className="text-[11px] font-semibold">Le meilleur choix</span>
                                                    </div>
                                                </div>
                                            )}
                                            <div className={`text-[16px] font-semibold tracking-[-0.01em] ${
                                                competitor.highlight ? "text-white" : "text-black"
                                            }`}>
                                                {competitor.name}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            {/* Body */}
                            <tbody>
                                {comparisonData.map((category, categoryIndex) => (
                                    <>
                                        {/* Category Header */}
                                        <tr key={`category-${categoryIndex}`} className="border-b border-black/[0.08]">
                                            <td colSpan={5} className="p-4 bg-black/[0.02]">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-black/40" />
                                                    <span className="text-[14px] font-semibold text-black uppercase tracking-wide">
                                                        {category.category}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Features */}
                                        {category.features.map((feature, featureIndex) => (
                                            <tr
                                                key={`feature-${categoryIndex}-${featureIndex}`}
                                                className="border-b border-black/[0.06] hover:bg-black/[0.01] transition-colors"
                                            >
                                                <td className="p-5 bg-white">
                                                    <span className="text-[14px] text-black/70">
                                                        {feature.name}
                                                    </span>
                                                </td>
                                                <td className="p-5 text-center bg-black">
                                                    <CellValue value={feature.myProPartner} isHighlight={true} />
                                                </td>
                                                <td className="p-5 text-center bg-white">
                                                    <CellValue value={feature.competitor1} isHighlight={false} />
                                                </td>
                                                <td className="p-5 text-center bg-white">
                                                    <CellValue value={feature.competitor2} isHighlight={false} />
                                                </td>
                                                <td className="p-5 text-center bg-white">
                                                    <CellValue value={feature.competitor3} isHighlight={false} />
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                        <Sparkles className="w-4 h-4 text-black/60" strokeWidth={2} />
                        <span className="text-[13px] text-black/60 font-medium">
                            Plus de fonctionnalités • Prix plus bas • Support meilleur
                        </span>
                    </div>

                    <div>
                        <Link href="/waitlist">
                            <Button className="bg-black hover:bg-black/90 text-white h-12 px-8 text-[15px] font-medium rounded-md shadow-sm group">
                                Essayer gratuitement 14 jours
                                <Sparkles className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    <p className="text-[13px] text-black/40">
                        Sans carte bancaire • Migration gratuite depuis n'importe quel concurrent
                    </p>
                </div>
            </div>
        </section>
    );
}
