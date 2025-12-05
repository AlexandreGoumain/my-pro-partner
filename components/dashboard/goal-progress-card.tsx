"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { GoalWithProgress } from "@/lib/types/goals";
import { GOAL_PERIODS } from "@/lib/types/goals";
import { Target, CheckCircle2, AlertCircle, Settings } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface GoalProgressCardProps {
    /** Goals from the useEnabledGoals hook */
    goals: GoalWithProgress[];
    /** Click handler for the configure button */
    onConfigureClick?: () => void;
    className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function GoalProgressCard({ goals, onConfigureClick, className }: GoalProgressCardProps) {
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
                                Objectifs
                            </h3>
                        </div>
                        <p className="text-[13px] text-black/40 ml-3">Suivez vos progrès</p>
                    </div>
                    {onConfigureClick && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onConfigureClick}
                            className="h-8 px-2.5 text-black/40 hover:text-black hover:bg-black/5"
                        >
                            <Settings className="w-4 h-4 mr-1.5" />
                            <span className="text-[12px]">Configurer</span>
                        </Button>
                    )}
                </div>

                {/* Goals list */}
                <div className="space-y-5">
                    {goals.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-10 h-10 mx-auto rounded-full bg-black/5 flex items-center justify-center mb-3">
                                <Target className="w-4 h-4 text-black/30" />
                            </div>
                            <p className="text-[13px] text-black/30 mb-1">Aucun objectif défini</p>
                            {onConfigureClick && (
                                <button
                                    onClick={onConfigureClick}
                                    className="text-[12px] text-black/50 hover:text-black underline underline-offset-2"
                                >
                                    Configurer vos objectifs
                                </button>
                            )}
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
                                            {GOAL_PERIODS[goal.period]?.shortLabel || goal.period}
                                        </p>
                                    </div>

                                    {/* Values */}
                                    <div className="text-right">
                                        <div className="text-[14px] font-medium text-black">
                                            {goal.formattedCurrent}
                                        </div>
                                        <div className="text-[11px] text-black/40">
                                            / {goal.formattedTarget}
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
