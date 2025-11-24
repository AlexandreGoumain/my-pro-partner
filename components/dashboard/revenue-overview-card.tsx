"use client";

import { Card } from "@/components/ui/card";
import { MiniChart, type MiniChartData } from "@/components/ui/mini-chart";
import type { RevenueMetrics } from "@/lib/types/dashboard";
import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface RevenueOverviewCardProps {
    revenue: RevenueMetrics;
    className?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatCurrency(value: number): string {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M€`;
    }
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k€`;
    }
    return `${value.toFixed(0)}€`;
}

// ============================================================================
// Component
// ============================================================================

export function RevenueOverviewCard({ revenue, className }: RevenueOverviewCardProps) {
    const { thisMonth, comparison, trend, averageTransaction, projectedEndOfMonth } = revenue;

    // Prepare chart data
    const chartData: MiniChartData[] = trend.map((item) => ({
        label: item.month,
        value: item.amount,
    }));

    // Trend icon and styling
    const TrendIcon =
        comparison.trend === "up"
            ? TrendingUp
            : comparison.trend === "down"
            ? TrendingDown
            : Minus;

    const trendConfig = {
        up: {
            color: "text-black",
            bg: "bg-black/[0.06]",
            borderColor: "border-black/10",
        },
        down: {
            color: "text-black/40",
            bg: "bg-black/[0.03]",
            borderColor: "border-black/5",
        },
        stable: {
            color: "text-black/60",
            bg: "bg-black/[0.04]",
            borderColor: "border-black/8",
        },
    };

    const currentTrend = trendConfig[comparison.trend];

    return (
        <Card
            className={`group relative p-6 overflow-hidden border-black/[0.08] bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500 ${
                className || ""
            }`}
        >
            {/* Subtle hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                            <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                                Chiffre d'affaires
                            </h3>
                        </div>
                        <p className="text-[13px] text-black/40 ml-3">Ce mois-ci</p>
                    </div>

                    {/* Enhanced Trend badge */}
                    <div
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${currentTrend.bg} ${currentTrend.borderColor} backdrop-blur-sm transition-all duration-200`}
                    >
                        <TrendIcon className={`w-3.5 h-3.5 ${currentTrend.color}`} strokeWidth={2.5} />
                        <span className={`text-[12px] font-semibold ${currentTrend.color} tabular-nums`}>
                            {comparison.change > 0 ? "+" : ""}
                            {comparison.change}%
                        </span>
                    </div>
                </div>

                {/* Main revenue figure */}
                <div className="mb-6">
                    <div className="group/amount flex items-baseline gap-2 mb-2">
                        <div className="text-[40px] font-bold tracking-[-0.04em] bg-gradient-to-br from-black via-black to-black/70 bg-clip-text text-transparent leading-none">
                            {formatCurrency(thisMonth)}
                        </div>
                        {comparison.trend === "up" && (
                            <Sparkles className="w-4 h-4 text-black/20 opacity-0 group-hover/amount:opacity-100 transition-opacity duration-300" />
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[13px] text-black/40">
                            vs {formatCurrency(comparison.previous)} le mois dernier
                        </span>
                    </div>
                </div>

                {/* Mini chart with wrapper */}
                <div className="mb-6 p-3 -mx-3 bg-black/[0.01] rounded-lg">
                    <MiniChart data={chartData} type="line" height={80} color="#000" />
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 pt-5 border-t border-black/[0.06]">
                    <div className="group/stat p-3 -mx-1 rounded-lg hover:bg-black/[0.02] transition-all duration-200">
                        <div className="flex items-center gap-1.5 mb-2">
                            <div className="text-[11px] font-medium text-black/40 uppercase tracking-wide">
                                Projection
                            </div>
                        </div>
                        <div className="text-[16px] font-semibold tracking-[-0.01em] text-black tabular-nums">
                            {formatCurrency(projectedEndOfMonth)}
                        </div>
                        <div className="text-[10px] text-black/30 mt-0.5">fin de mois</div>
                    </div>
                    <div className="group/stat p-3 -mx-1 rounded-lg hover:bg-black/[0.02] transition-all duration-200">
                        <div className="flex items-center gap-1.5 mb-2">
                            <div className="text-[11px] font-medium text-black/40 uppercase tracking-wide">
                                Panier moyen
                            </div>
                        </div>
                        <div className="text-[16px] font-semibold tracking-[-0.01em] text-black tabular-nums">
                            {formatCurrency(averageTransaction)}
                        </div>
                        <div className="text-[10px] text-black/30 mt-0.5">par transaction</div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
