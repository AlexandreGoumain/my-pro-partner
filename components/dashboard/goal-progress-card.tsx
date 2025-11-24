"use client";

import { Card } from "@/components/ui/card";
import type { Goal } from "@/lib/types/dashboard";
import { Target, CheckCircle2, AlertCircle } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface GoalProgressCardProps {
    goals: Goal[];
    className?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatGoalValue(value: number, unit: Goal["unit"]): string {
    if (unit === "currency") {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M€`;
        }
        if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}k€`;
        }
        return `${value.toFixed(0)}€`;
    }

    if (unit === "percentage") {
        return `${value}%`;
    }

    return value.toString();
}

function getPeriodLabel(period: Goal["period"]): string {
    const labels = {
        day: "aujourd'hui",
        week: "cette semaine",
        month: "ce mois",
        year: "cette année",
    };
    return labels[period] || "";
}

// ============================================================================
// Component
// ============================================================================

export function GoalProgressCard({ goals, className }: GoalProgressCardProps) {
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
                            Objectifs
                        </h3>
                    </div>
                    <p className="text-[13px] text-black/40 ml-3">Suivez vos progrès</p>
                </div>

            {/* Goals list */}
            <div className="space-y-5">
                {goals.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-[13px] text-black/30">Aucun objectif défini</p>
                    </div>
                ) : (
                    goals.map((goal) => (
                        <div key={goal.id} className="space-y-2.5">
                            {/* Goal header */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[13px] font-medium text-black">
                                            {goal.label}
                                        </span>
                                        {goal.onTrack ? (
                                            <CheckCircle2
                                                className="w-3.5 h-3.5 text-black/60"
                                                strokeWidth={2}
                                            />
                                        ) : (
                                            <AlertCircle
                                                className="w-3.5 h-3.5 text-black/30"
                                                strokeWidth={2}
                                            />
                                        )}
                                    </div>
                                    <p className="text-[11px] text-black/40 mt-0.5">
                                        {getPeriodLabel(goal.period)}
                                    </p>
                                </div>

                                {/* Values */}
                                <div className="text-right">
                                    <div className="text-[14px] font-medium text-black">
                                        {formatGoalValue(goal.current, goal.unit)}
                                    </div>
                                    <div className="text-[11px] text-black/40">
                                        / {formatGoalValue(goal.target, goal.unit)}
                                    </div>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="space-y-1.5">
                                <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            goal.onTrack ? "bg-black" : "bg-black/40"
                                        }`}
                                        style={{ width: `${Math.min(100, goal.progress)}%` }}
                                    />
                                </div>

                                {/* Progress percentage */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-black/40">
                                        {goal.progress}% complété
                                    </span>
                                    {goal.onTrack ? (
                                        <span className="text-[11px] font-medium text-black/60">
                                            Sur la bonne voie
                                        </span>
                                    ) : (
                                        <span className="text-[11px] font-medium text-black/30">
                                            En retard
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            </div>
        </Card>
    );
}
