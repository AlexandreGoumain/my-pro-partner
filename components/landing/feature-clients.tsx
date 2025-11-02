"use client";

import { Card } from "@/components/ui/card";
import { Users, Search, History, Bell, Star, TrendingUp } from "lucide-react";

export function FeatureClients() {
    const benefits = [
        {
            icon: Search,
            title: "Recherche instantanée",
            description: "Trouvez n'importe quel client en une fraction de seconde"
        },
        {
            icon: History,
            title: "Historique complet",
            description: "Accédez à tout l'historique de vos échanges et documents"
        },
        {
            icon: Bell,
            title: "Alertes intelligentes",
            description: "Soyez notifié des échéances, paiements et relances"
        },
        {
            icon: TrendingUp,
            title: "Analyse du CA",
            description: "Identifiez vos meilleurs clients et optimisez votre CA"
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
                                <div className="flex items-center gap-3 pb-4 border-b border-black/[0.08]">
                                    <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
                                        <Users className="w-5 h-5 text-white" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h4 className="text-[15px] font-semibold text-black">Fiche Client</h4>
                                        <p className="text-[13px] text-black/40">Entreprise ABC</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg bg-neutral-50 border border-black/[0.05]">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[12px] text-black/40 mb-1">Chiffre d'affaires</p>
                                                <p className="text-[18px] font-semibold text-black">24 850 €</p>
                                            </div>
                                            <div>
                                                <p className="text-[12px] text-black/40 mb-1">Factures</p>
                                                <p className="text-[18px] font-semibold text-black">12 total</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[13px] text-black/60 font-medium">Dernières factures</p>
                                        <div className="space-y-2">
                                            {[
                                                { number: "#2024-012", amount: "2 450 €", status: "Payée", statusColor: "green" },
                                                { number: "#2024-008", amount: "1 890 €", status: "Payée", statusColor: "green" },
                                                { number: "#2024-003", amount: "3 200 €", status: "En attente", statusColor: "orange" },
                                            ].map((invoice, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 rounded-lg bg-white border border-black/[0.05] hover:border-black/[0.1] transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded bg-black/[0.03] flex items-center justify-center">
                                                            <span className="text-[11px] font-medium text-black/60">
                                                                {invoice.number.slice(-3)}
                                                            </span>
                                                        </div>
                                                        <span className="text-[13px] text-black/60">{invoice.number}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[14px] font-medium text-black">{invoice.amount}</span>
                                                        <div className={`px-2 py-1 rounded-full ${
                                                            invoice.statusColor === 'green'
                                                                ? 'bg-green-500/10 border border-green-500/20'
                                                                : 'bg-orange-500/10 border border-orange-500/20'
                                                        }`}>
                                                            <span className={`text-[11px] font-medium ${
                                                                invoice.statusColor === 'green' ? 'text-green-700' : 'text-orange-700'
                                                            }`}>
                                                                {invoice.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                                        <Star className="w-4 h-4 text-blue-600" strokeWidth={2} />
                                        <p className="text-[13px] text-blue-700">
                                            Client premium - Top 10% CA
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="order-1 lg:order-2 space-y-8">
                        <div className="space-y-5">
                            <div className="inline-flex px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                                <span className="text-[13px] text-black/60 font-medium">
                                    Gestion Clients
                                </span>
                            </div>
                            <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.02em] text-black leading-[1.05]">
                                Toute l'histoire de vos clients
                            </h2>
                            <p className="text-[19px] text-black/60 leading-[1.5] tracking-[-0.01em]">
                                Centralisez toutes les informations de vos clients en un seul endroit.
                                Historique complet, documents, paiements, tout est accessible instantanément.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {benefits.map((benefit, index) => {
                                const Icon = benefit.icon;
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
                                                {benefit.title}
                                            </h3>
                                            <p className="text-[14px] text-black/60 leading-[1.5]">
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-wrap gap-3 pt-4">
                            <div className="px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                                <span className="text-[13px] text-black/60 font-medium">
                                    ✓ Import depuis Excel/CSV
                                </span>
                            </div>
                            <div className="px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                                <span className="text-[13px] text-black/60 font-medium">
                                    ✓ Segmentation clients
                                </span>
                            </div>
                            <div className="px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                                <span className="text-[13px] text-black/60 font-medium">
                                    ✓ Export comptable
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
