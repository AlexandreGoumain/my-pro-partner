"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface ComparisonRow {
    feature: string;
    traditional: boolean | string;
    mypropartner: boolean | string;
    highlight?: boolean;
}

const comparisonData: ComparisonRow[] = [
    {
        feature: "Prix mensuel (plan pro)",
        traditional: "75-300€",
        mypropartner: "79€",
        highlight: true,
    },
    {
        feature: "Installation et setup",
        traditional: "2-4 semaines",
        mypropartner: "7 minutes",
        highlight: true,
    },
    {
        feature: "Formation nécessaire",
        traditional: "2-5 jours",
        mypropartner: "Aucune",
    },
    {
        feature: "Assistant IA intégré",
        traditional: false,
        mypropartner: true,
        highlight: true,
    },
    {
        feature: "Interface moderne & intuitive",
        traditional: false,
        mypropartner: true,
    },
    {
        feature: "Application mobile PWA",
        traditional: "En option (+)",
        mypropartner: true,
    },
    {
        feature: "Mode hors-ligne",
        traditional: false,
        mypropartner: true,
    },
    {
        feature: "Support client",
        traditional: "Email uniquement",
        mypropartner: "Chat + Email + Docs",
    },
    {
        feature: "Mises à jour",
        traditional: "Payantes",
        mypropartner: "Gratuites",
    },
    {
        feature: "Stripe intégré (Terminal + Online)",
        traditional: false,
        mypropartner: true,
        highlight: true,
    },
    {
        feature: "Programme de fidélité",
        traditional: false,
        mypropartner: true,
    },
    {
        feature: "Marketing automation",
        traditional: false,
        mypropartner: true,
    },
    {
        feature: "Multi-magasin",
        traditional: "En option (+)",
        mypropartner: true,
    },
    {
        feature: "Gestion d'équipe & permissions",
        traditional: true,
        mypropartner: true,
    },
    {
        feature: "Export FEC (comptabilité)",
        traditional: true,
        mypropartner: true,
    },
    {
        feature: "Templates métier (20 types)",
        traditional: false,
        mypropartner: true,
    },
    {
        feature: "API REST",
        traditional: "En option (+)",
        mypropartner: "Plan PRO+",
    },
];

export function ComparisonTable() {
    return (
        <section className="relative py-32 px-6 sm:px-8 bg-gradient-to-b from-neutral-50/50 via-white to-neutral-50/50 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1100px] mx-auto relative">
                {/* Header */}
                <div className="text-center space-y-5 mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                        <Sparkles className="w-4 h-4 text-black/60" strokeWidth={2} />
                        <span className="text-[13px] text-black/60 font-medium">
                            MyProPartner vs ERPs traditionnels
                        </span>
                    </div>

                    <h2 className="text-[48px] sm:text-[64px] font-semibold tracking-[-0.03em] text-black leading-[1.05]">
                        Pourquoi choisir
                        <br />
                        <span className="text-black/60">MyProPartner ?</span>
                    </h2>

                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5]">
                        Comparaison objective avec les solutions ERP traditionnelles du marché.
                    </p>
                </div>

                {/* Comparison Table */}
                <Card className="overflow-hidden border-black/[0.08] shadow-xl bg-white">
                    {/* Table Header */}
                    <div className="grid grid-cols-[2fr,1fr,1fr] gap-4 p-6 bg-neutral-50 border-b border-black/[0.08]">
                        <div className="text-[14px] font-semibold text-black/60 uppercase tracking-wider">
                            Fonctionnalité
                        </div>
                        <div className="text-center">
                            <p className="text-[16px] font-semibold text-black/70">
                                ERPs Traditionnels
                            </p>
                            <p className="text-[12px] text-black/40 mt-1">Sage, QuickBooks, etc.</p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white">
                                <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
                                <p className="text-[16px] font-semibold">MyProPartner</p>
                            </div>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-black/[0.06]">
                        {comparisonData.map((row, index) => (
                            <div
                                key={index}
                                className={`grid grid-cols-[2fr,1fr,1fr] gap-4 p-5 transition-colors ${
                                    row.highlight
                                        ? "bg-black/[0.015]"
                                        : "hover:bg-black/[0.01]"
                                }`}
                            >
                                {/* Feature name */}
                                <div className="flex items-center">
                                    <span
                                        className={`text-[15px] ${
                                            row.highlight
                                                ? "font-semibold text-black"
                                                : "text-black/80"
                                        }`}
                                    >
                                        {row.feature}
                                    </span>
                                </div>

                                {/* Traditional ERP */}
                                <div className="flex items-center justify-center">
                                    {typeof row.traditional === "boolean" ? (
                                        row.traditional ? (
                                            <div className="p-1.5 rounded-full bg-black/[0.05]">
                                                <Check
                                                    className="w-4 h-4 text-black/40"
                                                    strokeWidth={2.5}
                                                />
                                            </div>
                                        ) : (
                                            <div className="p-1.5 rounded-full bg-black/[0.03]">
                                                <X
                                                    className="w-4 h-4 text-black/30"
                                                    strokeWidth={2.5}
                                                />
                                            </div>
                                        )
                                    ) : (
                                        <span className="text-[14px] text-black/60 text-center">
                                            {row.traditional}
                                        </span>
                                    )}
                                </div>

                                {/* MyProPartner */}
                                <div className="flex items-center justify-center">
                                    {typeof row.mypropartner === "boolean" ? (
                                        row.mypropartner ? (
                                            <div className="p-1.5 rounded-full bg-black">
                                                <Check
                                                    className="w-4 h-4 text-white"
                                                    strokeWidth={2.5}
                                                />
                                            </div>
                                        ) : (
                                            <div className="p-1.5 rounded-full bg-black/[0.05]">
                                                <X
                                                    className="w-4 h-4 text-black/30"
                                                    strokeWidth={2.5}
                                                />
                                            </div>
                                        )
                                    ) : (
                                        <span
                                            className={`text-[14px] text-center font-medium ${
                                                row.highlight ? "text-black" : "text-black/80"
                                            }`}
                                        >
                                            {row.mypropartner}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table Footer */}
                    <div className="p-6 bg-gradient-to-br from-black via-black to-black/90 text-white">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="text-center sm:text-left">
                                <p className="text-[19px] font-semibold mb-1">
                                    Le choix est clair.
                                </p>
                                <p className="text-[14px] text-white/70">
                                    Moins cher, plus rapide, plus moderne.
                                </p>
                            </div>
                            <Link href="/auth/register">
                                <Button className="bg-white hover:bg-white/95 text-black h-12 px-8 text-[15px] font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                                    Essayer maintenant
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>

                {/* Bottom note */}
                <div className="mt-8 text-center">
                    <p className="text-[13px] text-black/50">
                        * Données basées sur une analyse comparative de solutions ERP du marché français
                        (Sage, QuickBooks, Cegid, EBP) en décembre 2024.
                    </p>
                </div>
            </div>
        </section>
    );
}
