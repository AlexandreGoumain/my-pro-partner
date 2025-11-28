"use client";

import { Card } from "@/components/ui/card";
import type { ConsultingStats } from "@/lib/types/mission";
import { formatDuree } from "@/lib/types/mission";
import { Clock, DollarSign, FileText, TrendingUp } from "lucide-react";

export interface TimesheetStatsProps {
    stats: ConsultingStats;
}

export function TimesheetStats({ stats }: TimesheetStatsProps) {
    const formatCurrency = (amount: number) =>
        amount.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
        });

    const formatPercent = (value: number) => `${Math.round(value)}%`;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

            {/* Taux d'utilisation */}
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
                            Taux d&apos;utilisation
                        </div>
                        <div className="text-[20px] font-semibold tracking-[-0.01em]">
                            {formatPercent(stats.tauxUtilisation)}
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
                            Heures à facturer
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
