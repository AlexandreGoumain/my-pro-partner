"use client";

import { Card } from "@/components/ui/card";
import type { PeriodComparison } from "@/lib/types/dashboard";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface MetricComparisonCardProps {
    title: string;
    description?: string;
    value: string | number;
    comparison: PeriodComparison;
    icon?: LucideIcon;
    className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function MetricComparisonCard({
    title,
    description,
    value,
    comparison,
    icon: Icon,
    className,
}: MetricComparisonCardProps) {
    // Trend icon and styling
    const TrendIcon =
        comparison.trend === "up"
            ? TrendingUp
            : comparison.trend === "down"
            ? TrendingDown
            : Minus;

    const trendColor =
        comparison.trend === "up"
            ? "text-black"
            : comparison.trend === "down"
            ? "text-black/40"
            : "text-black/60";

    const trendBgColor =
        comparison.trend === "up"
            ? "bg-black/5"
            : comparison.trend === "down"
            ? "bg-black/3"
            : "bg-black/3";

    return (
        <Card className={`group relative p-6 overflow-hidden border-black/[0.08] bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500 ${className || ""}`}>
            {/* Subtle hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative">
                {/* Header with icon */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        {Icon && <Icon className="w-4 h-4 text-black/40" strokeWidth={2} />}
                        <div>
                            <h3 className="text-[13px] font-medium tracking-[-0.01em] text-black">
                                {title}
                            </h3>
                        {description && (
                            <p className="text-[11px] text-black/40 mt-0.5">{description}</p>
                        )}
                    </div>
                </div>

                {/* Trend badge */}
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${trendBgColor}`}>
                    <TrendIcon className={`w-3 h-3 ${trendColor}`} strokeWidth={2} />
                    <span className={`text-[11px] font-medium ${trendColor}`}>
                        {comparison.change > 0 ? "+" : ""}
                        {comparison.change}%
                    </span>
                </div>
            </div>

            {/* Main value */}
            <div className="mb-2">
                <div className="text-[28px] font-semibold tracking-[-0.02em] text-black leading-none">
                    {value}
                </div>
            </div>

            {/* Comparison details */}
            <div className="flex items-center gap-4 text-[12px] text-black/40">
                <div>
                    <span className="font-medium text-black/60">Actuel:</span>{" "}
                    {typeof comparison.current === "number"
                        ? comparison.current.toFixed(0)
                        : comparison.current}
                </div>
                <div>
                    <span className="font-medium text-black/60">Précédent:</span>{" "}
                    {typeof comparison.previous === "number"
                        ? comparison.previous.toFixed(0)
                        : comparison.previous}
                </div>
            </div>
            </div>
        </Card>
    );
}
