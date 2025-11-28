"use client";

import { Card } from "@/components/ui/card";
import type { ConsultingStats } from "@/lib/types/mission";
import { formatDuree } from "@/lib/types/mission";
import {
    Briefcase,
    Clock,
    DollarSign,
    FileText,
    Target,
    TrendingUp,
} from "lucide-react";

export interface ConsultingStatsCardsProps {
    stats: ConsultingStats;
}

export function ConsultingStatsCards({ stats }: ConsultingStatsCardsProps) {
    const formatCurrency = (amount: number) =>
        amount.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
        });

    const formatPercent = (value: number) => `${Math.round(value)}%`;

    // Determine utilization color based on target (75-80%)
    const getUtilizationColor = (rate: number) => {
        if (rate >= 75 && rate <= 85) return "text-black";
        if (rate >= 60 && rate < 75) return "text-black/60";
        return "text-black/40";
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Taux d'utilisation - KPI principal */}
            <Card className="p-4 border-black/8 col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                        <Target
                            className="h-5 w-5 text-black/40"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <div className="text-[12px] text-black/40">
                            Taux d&apos;utilisation
                        </div>
                        <div
                            className={`text-[24px] font-semibold tracking-[-0.01em] ${getUtilizationColor(
                                stats.tauxUtilisation
                            )}`}
                        >
                            {formatPercent(stats.tauxUtilisation)}
                        </div>
                    </div>
                </div>
                <div className="mt-2 text-[11px] text-black/30">
                    Objectif: 75-80%
                </div>
            </Card>

            {/* Heures trackées */}
            <Card className="p-4 border-black/8">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                        <Clock
                            className="h-5 w-5 text-black/40"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <div className="text-[12px] text-black/40">
                            Heures trackées
                        </div>
                        <div className="text-[20px] font-semibold tracking-[-0.01em]">
                            {formatDuree(stats.heuresTracked)}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Heures facturables */}
            <Card className="p-4 border-black/8">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                        <TrendingUp
                            className="h-5 w-5 text-black/40"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <div className="text-[12px] text-black/40">
                            Heures facturables
                        </div>
                        <div className="text-[20px] font-semibold tracking-[-0.01em]">
                            {formatDuree(stats.heuresFacturables)}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Missions en cours */}
            <Card className="p-4 border-black/8">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                        <Briefcase
                            className="h-5 w-5 text-black/40"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <div className="text-[12px] text-black/40">
                            Missions en cours
                        </div>
                        <div className="text-[20px] font-semibold tracking-[-0.01em]">
                            {stats.missionsEnCours}
                        </div>
                    </div>
                </div>
            </Card>

            {/* À facturer */}
            <Card className="p-4 border-black/8">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                        <FileText
                            className="h-5 w-5 text-black/40"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <div className="text-[12px] text-black/40">
                            À facturer
                        </div>
                        <div className="text-[20px] font-semibold tracking-[-0.01em]">
                            {formatDuree(stats.heuresNonFacturees)}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Montant non facturé */}
            <Card className="p-4 border-black/8">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                        <DollarSign
                            className="h-5 w-5 text-black/40"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <div className="text-[12px] text-black/40">
                            Montant à facturer
                        </div>
                        <div className="text-[20px] font-semibold tracking-[-0.01em]">
                            {formatCurrency(stats.montantNonFacture)}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
