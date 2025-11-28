"use client";

import { Card } from "@/components/ui/card";
import type { TempsReportData } from "@/hooks/use-temps";
import { formatDuree } from "@/lib/utils/format";
import { Clock, DollarSign, Target, TrendingUp } from "lucide-react";

export interface ReportStatsCardsProps {
    data: TempsReportData;
}

export function ReportStatsCards({ data }: ReportStatsCardsProps) {
    const utilizationRate =
        data.totals.tracked > 0
            ? Math.round((data.totals.billable / data.totals.tracked) * 100)
            : 0;

    const avgHourlyRate =
        data.totals.billable > 0
            ? Math.round(data.totals.amount / (data.totals.billable / 60))
            : 0;

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Heures trackées */}
            <Card className="p-5 border-black/8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-black/5 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-black/60" />
                    </div>
                    <span className="text-[13px] text-black/50">
                        Heures trackées
                    </span>
                </div>
                <div className="text-[24px] font-semibold tracking-[-0.02em] text-black">
                    {formatDuree(data.totals.tracked)}
                </div>
                <p className="text-[12px] text-black/40 mt-1">
                    Moy. {formatDuree(data.averages.dailyTracked)}/jour
                </p>
            </Card>

            {/* Heures facturables */}
            <Card className="p-5 border-black/8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-black/5 flex items-center justify-center">
                        <Target className="h-4 w-4 text-black/60" />
                    </div>
                    <span className="text-[13px] text-black/50">
                        Heures facturables
                    </span>
                </div>
                <div className="text-[24px] font-semibold tracking-[-0.02em] text-black">
                    {formatDuree(data.totals.billable)}
                </div>
                <p className="text-[12px] text-black/40 mt-1">
                    {utilizationRate}% du temps tracké
                </p>
            </Card>

            {/* CA potentiel */}
            <Card className="p-5 border-black/8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-black/5 flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-black/60" />
                    </div>
                    <span className="text-[13px] text-black/50">
                        CA potentiel
                    </span>
                </div>
                <div className="text-[24px] font-semibold tracking-[-0.02em] text-black">
                    {data.totals.amount.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                        maximumFractionDigits: 0,
                    })}
                </div>
                <p className="text-[12px] text-black/40 mt-1">
                    {data.totals.entries} entrées de temps
                </p>
            </Card>

            {/* Taux horaire moyen */}
            <Card className="p-5 border-black/8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-black/5 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-black/60" />
                    </div>
                    <span className="text-[13px] text-black/50">
                        Taux horaire moy.
                    </span>
                </div>
                <div className="text-[24px] font-semibold tracking-[-0.02em] text-black">
                    {avgHourlyRate.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                    })}
                    /h
                </div>
                <p className="text-[12px] text-black/40 mt-1">
                    Sur les heures facturables
                </p>
            </Card>
        </div>
    );
}
