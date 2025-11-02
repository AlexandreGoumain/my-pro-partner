"use client";

import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, PieChart, Download, Calendar, Target } from "lucide-react";

export function FeatureAnalytics() {
    const features = [
        {
            icon: TrendingUp,
            title: "Évolution du CA",
            description: "Visualisez la croissance de votre chiffre d'affaires en temps réel"
        },
        {
            icon: PieChart,
            title: "Répartition des ventes",
            description: "Analysez vos revenus par client, produit ou service"
        },
        {
            icon: Target,
            title: "Objectifs & KPIs",
            description: "Définissez et suivez vos objectifs commerciaux"
        },
        {
            icon: Download,
            title: "Export comptable",
            description: "Exportez vos données vers Excel ou votre comptable"
        },
    ];

    return (
        <section className="py-32 px-6 sm:px-8 bg-white">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10 rounded-[32px] blur-3xl translate-y-8" />
                        <Card className="relative p-8 bg-white border border-black/[0.08] shadow-xl">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-black/[0.08]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
                                            <BarChart3 className="w-5 h-5 text-white" strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h4 className="text-[15px] font-semibold text-black">Tableau de bord</h4>
                                            <p className="text-[13px] text-black/40">Vue d'ensemble mensuelle</p>
                                        </div>
                                    </div>
                                    <button className="px-3 py-1.5 rounded-lg border border-black/[0.08] text-[12px] font-medium hover:bg-black/5 transition-colors">
                                        Novembre 2024
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                                        <p className="text-[12px] text-green-600/60 mb-1">CA ce mois</p>
                                        <p className="text-[24px] font-semibold text-green-700">48 750 €</p>
                                        <p className="text-[11px] text-green-600/60 mt-1 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            +24% vs mois dernier
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                                        <p className="text-[12px] text-blue-600/60 mb-1">Factures</p>
                                        <p className="text-[24px] font-semibold text-blue-700">32</p>
                                        <p className="text-[11px] text-blue-600/60 mt-1">28 payées · 4 en attente</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[13px] text-black/60 font-medium">Évolution CA (6 mois)</p>
                                    </div>
                                    <div className="h-40 flex items-end justify-between gap-2">
                                        {[
                                            { month: "Juin", value: 65, amount: "32k" },
                                            { month: "Juil", value: 72, amount: "36k" },
                                            { month: "Août", value: 58, amount: "29k" },
                                            { month: "Sept", value: 78, amount: "39k" },
                                            { month: "Oct", value: 82, amount: "41k" },
                                            { month: "Nov", value: 95, amount: "48k" },
                                        ].map((bar, index) => (
                                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                                <div className="w-full flex flex-col justify-end h-32">
                                                    <div
                                                        className={`w-full rounded-t-lg ${
                                                            index === 5 ? 'bg-black' : 'bg-black/20'
                                                        } relative group cursor-pointer hover:bg-black/30 transition-colors`}
                                                        style={{ height: `${bar.value}%` }}
                                                    >
                                                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <div className="px-2 py-1 rounded bg-black text-white text-[10px] font-medium whitespace-nowrap">
                                                                {bar.amount}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-black/40 font-medium">
                                                    {bar.month}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-black/[0.08]">
                                    <div className="space-y-2">
                                        <p className="text-[13px] text-black/60 font-medium">Top clients ce mois</p>
                                        {[
                                            { name: "Entreprise ABC", amount: "8 450 €", percent: 65 },
                                            { name: "Société XYZ", amount: "6 200 €", percent: 48 },
                                            { name: "Client DEF", amount: "4 890 €", percent: 38 },
                                        ].map((client, index) => (
                                            <div key={index} className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[12px] text-black/60">{client.name}</span>
                                                    <span className="text-[12px] text-black font-medium">{client.amount}</span>
                                                </div>
                                                <div className="h-1 bg-black/[0.05] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-black rounded-full"
                                                        style={{ width: `${client.percent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="order-1 lg:order-2 space-y-8">
                        <div className="space-y-5">
                            <div className="inline-flex px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                                <span className="text-[13px] text-black/60 font-medium">
                                    Analytics & Reporting
                                </span>
                            </div>
                            <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.02em] text-black leading-[1.05]">
                                Prenez les bonnes décisions
                            </h2>
                            <p className="text-[19px] text-black/60 leading-[1.5] tracking-[-0.01em]">
                                Visualisez vos performances en un coup d'œil. Tableaux de bord intuitifs,
                                rapports détaillés, et insights pour faire croître votre business.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-5 rounded-xl bg-neutral-50 border border-black/[0.08] hover:border-black/[0.12] transition-all duration-300"
                                    >
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-black" strokeWidth={2} />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-[16px] font-semibold text-black tracking-[-0.01em]">
                                                {feature.title}
                                            </h3>
                                            <p className="text-[14px] text-black/60 leading-[1.5]">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-wrap gap-3 pt-4">
                            <div className="px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                                <span className="text-[13px] text-black/60 font-medium">
                                    ✓ Graphiques en temps réel
                                </span>
                            </div>
                            <div className="px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                                <span className="text-[13px] text-black/60 font-medium">
                                    ✓ Rapports personnalisés
                                </span>
                            </div>
                            <div className="px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                                <span className="text-[13px] text-black/60 font-medium">
                                    ✓ Export PDF/Excel
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
