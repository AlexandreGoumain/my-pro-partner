"use client";

import { Card } from "@/components/ui/card";
import { Package, AlertTriangle, TrendingDown, Scan, Clock, BarChart3 } from "lucide-react";

export function FeatureInventory() {
    const features = [
        {
            icon: AlertTriangle,
            title: "Alertes de stock",
            description: "Soyez notifié automatiquement avant la rupture de stock"
        },
        {
            icon: BarChart3,
            title: "Suivi en temps réel",
            description: "Consultez vos niveaux de stock à tout moment, partout"
        },
        {
            icon: Clock,
            title: "Historique mouvements",
            description: "Tracez toutes les entrées et sorties de votre inventaire"
        },
        {
            icon: TrendingDown,
            title: "Analyse des ventes",
            description: "Identifiez vos produits les plus et moins vendus"
        },
    ];

    return (
        <section className="py-32 px-6 sm:px-8 bg-neutral-50">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="space-y-5">
                            <div className="inline-flex px-4 py-2 rounded-full bg-white border border-black/[0.08]">
                                <span className="text-[13px] text-black/60 font-medium">
                                    Gestion des Stocks
                                </span>
                            </div>
                            <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.02em] text-black leading-[1.05]">
                                Ne manquez plus jamais de stock
                            </h2>
                            <p className="text-[19px] text-black/60 leading-[1.5] tracking-[-0.01em]">
                                Suivez votre inventaire en temps réel et recevez des alertes automatiques.
                                Fini les ruptures de stock et les commandes retardées.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-5 rounded-xl bg-white border border-black/[0.08] hover:border-black/[0.12] transition-all duration-300"
                                    >
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-black/[0.03] flex items-center justify-center">
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
                            <div className="px-4 py-2 rounded-full bg-white border border-black/[0.08]">
                                <span className="text-[13px] text-black/60 font-medium">
                                    ✓ Scan de codes-barres
                                </span>
                            </div>
                            <div className="px-4 py-2 rounded-full bg-white border border-black/[0.08]">
                                <span className="text-[13px] text-black/60 font-medium">
                                    ✓ Import/Export Excel
                                </span>
                            </div>
                            <div className="px-4 py-2 rounded-full bg-white border border-black/[0.08]">
                                <span className="text-[13px] text-black/60 font-medium">
                                    ✓ Multi-emplacements
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10 rounded-[32px] blur-3xl translate-y-8" />
                        <Card className="relative p-8 bg-white border border-black/[0.08] shadow-xl">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-black/[0.08]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
                                            <Package className="w-5 h-5 text-white" strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h4 className="text-[15px] font-semibold text-black">Vue d'ensemble Stock</h4>
                                            <p className="text-[13px] text-black/40">Mis à jour en temps réel</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    <div className="p-4 rounded-lg bg-neutral-50 border border-black/[0.05]">
                                        <p className="text-[12px] text-black/40 mb-1">Total articles</p>
                                        <p className="text-[24px] font-semibold text-black">487</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                                        <p className="text-[12px] text-red-600/60 mb-1">Stock bas</p>
                                        <p className="text-[24px] font-semibold text-red-700">12</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20 col-span-2 sm:col-span-1">
                                        <p className="text-[12px] text-orange-600/60 mb-1">À commander</p>
                                        <p className="text-[24px] font-semibold text-orange-700">8</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[13px] text-black/60 font-medium">Alertes de stock</p>
                                        <span className="px-2 py-1 rounded-full bg-red-500/10 text-[11px] text-red-700 font-medium">
                                            3 urgentes
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {[
                                            { name: "Vis inox M6", stock: 12, min: 50, status: "critical" },
                                            { name: "Joint silicone", stock: 28, min: 30, status: "warning" },
                                            { name: "Câble électrique", stock: 85, min: 100, status: "warning" },
                                        ].map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 rounded-lg bg-white border border-black/[0.05] hover:border-black/[0.1] transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-[13px] font-medium text-black">{item.name}</span>
                                                        {item.status === 'critical' && (
                                                            <AlertTriangle className="w-3 h-3 text-red-600" strokeWidth={2} />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-1.5 bg-black/[0.05] rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${
                                                                    item.status === 'critical'
                                                                        ? 'bg-red-600'
                                                                        : 'bg-orange-500'
                                                                }`}
                                                                style={{ width: `${(item.stock / item.min) * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[11px] text-black/40 font-medium">
                                                            {item.stock}/{item.min}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button className="w-full h-10 px-4 rounded-lg bg-black text-white text-[13px] font-medium hover:bg-black/90 transition-colors">
                                    Voir tout le stock
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
