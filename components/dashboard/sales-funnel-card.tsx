"use client";

import { Card } from "@/components/ui/card";
import type { SalesMetrics } from "@/lib/types/dashboard";
import { FileText, CheckCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface SalesFunnelCardProps {
    sales: SalesMetrics;
    className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function SalesFunnelCard({ sales, className }: SalesFunnelCardProps) {
    const {
        quotesCreated,
        quotesConverted,
        conversionRate,
        conversionRateComparison,
        averageTicket,
    } = sales;

    // Trend icon and styling
    const TrendIcon =
        conversionRateComparison.trend === "up"
            ? TrendingUp
            : conversionRateComparison.trend === "down"
            ? TrendingDown
            : Minus;

    const trendColor =
        conversionRateComparison.trend === "up"
            ? "text-black"
            : conversionRateComparison.trend === "down"
            ? "text-black/40"
            : "text-black/60";

    const trendBgColor =
        conversionRateComparison.trend === "up"
            ? "bg-black/5"
            : conversionRateComparison.trend === "down"
            ? "bg-black/3"
            : "bg-black/3";

    // Calculate widths for funnel visualization
    const quotesWidth = 100;
    const convertedWidth = quotesCreated > 0 ? (quotesConverted / quotesCreated) * 100 : 0;

    return (
        <Card className={`group relative p-6 overflow-hidden border-black/[0.08] bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500 ${className || ""}`}>
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
                                Conversion Devis → Factures
                            </h3>
                        </div>
                        <p className="text-[13px] text-black/40 ml-3">
                            Performance commerciale
                        </p>
                    </div>

                {/* Trend badge */}
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${trendBgColor}`}>
                    <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} strokeWidth={2} />
                    <span className={`text-[12px] font-medium ${trendColor}`}>
                        {conversionRateComparison.change > 0 ? "+" : ""}
                        {conversionRateComparison.change}%
                    </span>
                </div>
            </div>

            {/* Conversion rate */}
            <div className="mb-6">
                <div className="text-[36px] font-semibold tracking-[-0.02em] text-black leading-none">
                    {conversionRate}%
                </div>
                <div className="text-[13px] text-black/40 mt-1">Taux de conversion</div>
            </div>

            {/* Funnel visualization */}
            <div className="space-y-4 mb-6">
                {/* Quotes step */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-black/40" strokeWidth={2} />
                            <span className="text-[13px] text-black/60">Devis créés</span>
                        </div>
                        <span className="text-[13px] font-medium text-black">{quotesCreated}</span>
                    </div>
                    <div className="h-10 bg-black/5 rounded-md overflow-hidden relative">
                        <div
                            className="absolute inset-0 bg-black/90 flex items-center justify-center transition-all duration-500"
                            style={{ width: `${quotesWidth}%` }}
                        >
                            <span className="text-[11px] font-medium text-white">
                                {quotesCreated} devis
                            </span>
                        </div>
                    </div>
                </div>

                {/* Arrow indicator */}
                <div className="flex justify-center">
                    <div className="text-black/20">↓</div>
                </div>

                {/* Converted step */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-black/40" strokeWidth={2} />
                            <span className="text-[13px] text-black/60">Factures générées</span>
                        </div>
                        <span className="text-[13px] font-medium text-black">
                            {quotesConverted}
                        </span>
                    </div>
                    <div className="h-10 bg-black/5 rounded-md overflow-hidden relative">
                        <div
                            className="absolute inset-0 bg-black flex items-center justify-center transition-all duration-500"
                            style={{ width: `${convertedWidth}%` }}
                        >
                            {quotesConverted > 0 && (
                                <span className="text-[11px] font-medium text-white">
                                    {quotesConverted} factures
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="pt-4 border-t border-black/8">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] text-black/40">Panier moyen facturé</span>
                    <span className="text-[14px] font-medium text-black">
                        {averageTicket.toFixed(0)}€
                    </span>
                </div>
            </div>
            </div>
        </Card>
    );
}
