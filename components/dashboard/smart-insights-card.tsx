"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Insight } from "@/lib/types/dashboard";
import { Lightbulb, AlertCircle, AlertTriangle, Info, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

// ============================================================================
// Types
// ============================================================================

export interface SmartInsightsCardProps {
    insights: Insight[];
    className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function SmartInsightsCard({ insights, className }: SmartInsightsCardProps) {
    // Icon mapping
    const typeIcons = {
        alert: AlertCircle,
        warning: AlertTriangle,
        opportunity: TrendingUp,
        info: Info,
    };

    // Color mapping
    const typeColors = {
        alert: {
            icon: "text-black",
            bg: "bg-black/5",
        },
        warning: {
            icon: "text-black/60",
            bg: "bg-black/3",
        },
        opportunity: {
            icon: "text-black/80",
            bg: "bg-black/5",
        },
        info: {
            icon: "text-black/40",
            bg: "bg-black/3",
        },
    };

    // Priority badges
    const priorityBadges = {
        high: {
            label: "Urgent",
            className: "bg-black text-white",
        },
        medium: {
            label: "Moyen",
            className: "bg-black/20 text-black/80",
        },
        low: {
            label: "Faible",
            className: "bg-black/10 text-black/60",
        },
    };

    return (
        <Card className={`group relative p-6 overflow-hidden border-black/[0.08] bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500 ${className || ""}`}>
            {/* Subtle hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                            Insights & Recommandations
                        </h3>
                    </div>
                    <p className="text-[13px] text-black/40 ml-3">
                        Actions à prioriser
                    </p>
                </div>

            {/* Insights list */}
            <div className="space-y-3">
                {insights.length === 0 ? (
                    <div className="text-center py-8">
                        <Lightbulb className="w-8 h-8 text-black/10 mx-auto mb-3" strokeWidth={2} />
                        <p className="text-[13px] text-black/30">Aucun insight pour le moment</p>
                        <p className="text-[12px] text-black/20 mt-1">
                            Tout semble fonctionner parfaitement !
                        </p>
                    </div>
                ) : (
                    insights.map((insight) => {
                        const Icon = typeIcons[insight.type];
                        const colors = typeColors[insight.type];
                        const priorityBadge = priorityBadges[insight.priority];

                        return (
                            <div
                                key={insight.id}
                                className="p-4 rounded-lg border border-black/8 hover:border-black/15 transition-all duration-200"
                            >
                                {/* Header */}
                                <div className="flex items-start gap-3 mb-2">
                                    {/* Icon */}
                                    <div className={`flex-shrink-0 p-2 rounded-md ${colors.bg}`}>
                                        <Icon className={`w-4 h-4 ${colors.icon}`} strokeWidth={2} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className="text-[13px] font-medium text-black leading-snug">
                                                {insight.title}
                                            </h4>

                                            {/* Priority badge */}
                                            <span
                                                className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${priorityBadge.className}`}
                                            >
                                                {priorityBadge.label}
                                            </span>
                                        </div>

                                        <p className="text-[12px] text-black/60 leading-relaxed">
                                            {insight.description}
                                        </p>

                                        {/* Metric (if available) */}
                                        {insight.metric && (
                                            <div className="mt-2 flex items-baseline gap-2">
                                                <span className="text-[14px] font-semibold text-black">
                                                    {insight.metric.value}
                                                </span>
                                                {insight.metric.change && (
                                                    <span className="text-[11px] text-black/40">
                                                        {insight.metric.change}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action button */}
                                {insight.action && (
                                    <div className="mt-3 pl-14">
                                        <Link href={insight.action.href}>
                                            <Button
                                                variant="ghost"
                                                className="h-auto py-1.5 px-3 text-[12px] font-medium text-black/70 hover:text-black hover:bg-black/5"
                                            >
                                                {insight.action.label}
                                                <ArrowRight
                                                    className="w-3 h-3 ml-1.5"
                                                    strokeWidth={2}
                                                />
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
            </div>
        </Card>
    );
}
