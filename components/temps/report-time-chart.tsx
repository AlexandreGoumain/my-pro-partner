"use client";

import { Card } from "@/components/ui/card";
import type { TempsReportData } from "@/hooks/use-temps";
import { formatDuree } from "@/lib/utils/format";
import { useMemo } from "react";

export interface ReportTimeChartProps {
    data: TempsReportData["timeSeries"];
    groupBy: string;
}

function formatDate(dateStr: string, groupBy: string): string {
    const date = new Date(dateStr);

    if (groupBy === "month") {
        return date.toLocaleDateString("fr-FR", {
            month: "short",
            year: "2-digit",
        });
    }
    if (groupBy === "week") {
        return `Sem. ${getWeekNumber(date)}`;
    }
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function getWeekNumber(date: Date): number {
    const d = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function ReportTimeChart({ data, groupBy }: ReportTimeChartProps) {
    const maxValue = useMemo(() => {
        return Math.max(...data.map((d) => d.tracked), 1);
    }, [data]);

    const chartData = useMemo(() => {
        return data.map((item) => ({
            ...item,
            label: formatDate(item.date, groupBy),
            trackedPercent: (item.tracked / maxValue) * 100,
            billablePercent: (item.billable / maxValue) * 100,
        }));
    }, [data, groupBy, maxValue]);

    if (data.length === 0) {
        return (
            <Card className="p-5 border-black/8">
                <h3 className="text-[15px] font-medium text-black/80 mb-4">
                    Évolution du temps
                </h3>
                <div className="flex items-center justify-center h-48 text-[14px] text-black/40">
                    Aucune donnée pour cette période
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-5 border-black/8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-medium text-black/80">
                    Évolution du temps
                </h3>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-black/20" />
                        <span className="text-[12px] text-black/50">
                            Tracké
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-black" />
                        <span className="text-[12px] text-black/50">
                            Facturable
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-end gap-1 h-48 overflow-x-auto">
                {chartData.map((item) => (
                    <div
                        key={item.date}
                        className="flex flex-col items-center flex-1 min-w-[40px] group"
                    >
                        {/* Bars */}
                        <div className="relative w-full h-40 flex items-end justify-center gap-0.5">
                            {/* Tracked bar */}
                            <div
                                className="w-3 bg-black/15 rounded-t transition-all duration-200 group-hover:bg-black/25"
                                style={{ height: `${item.trackedPercent}%` }}
                            />
                            {/* Billable bar */}
                            <div
                                className="w-3 bg-black rounded-t transition-all duration-200 group-hover:bg-black/80"
                                style={{ height: `${item.billablePercent}%` }}
                            />

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                <div className="bg-black text-white text-[11px] px-2 py-1.5 rounded-md whitespace-nowrap">
                                    <div>
                                        {formatDuree(item.tracked)} tracké
                                    </div>
                                    <div>
                                        {formatDuree(item.billable)} facturable
                                    </div>
                                    {item.amount > 0 && (
                                        <div className="text-white/70">
                                            {item.amount.toLocaleString(
                                                "fr-FR",
                                                {
                                                    style: "currency",
                                                    currency: "EUR",
                                                }
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Label */}
                        <div className="text-[10px] text-black/40 mt-2 truncate max-w-full">
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
