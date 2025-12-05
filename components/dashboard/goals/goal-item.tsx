"use client";

import { Switch } from "@/components/ui/switch";
import {
    GOAL_PERIODS,
    isAutoCalculated,
} from "@/lib/types/goals";
import type { GoalWithProgress } from "@/lib/types/goals";
import { MoreHorizontal, Pencil, Trash2, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ============================================================================
// Types
// ============================================================================

export interface GoalItemProps {
    goal: GoalWithProgress;
    onToggle: (id: string, enabled: boolean) => void;
    onEdit: (goal: GoalWithProgress) => void;
    onDelete: (id: string) => void;
    isToggling?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function GoalItem({
    goal,
    onToggle,
    onEdit,
    onDelete,
    isToggling,
}: GoalItemProps) {
    const periodConfig = GOAL_PERIODS[goal.period];
    const isAuto = isAutoCalculated(goal.metricType);

    return (
        <div
            className={`group relative rounded-xl border transition-all duration-200 ${
                goal.enabled
                    ? "border-black/[0.08] bg-white shadow-sm"
                    : "border-black/[0.04] bg-white/50"
            }`}
        >
            <div className="p-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span
                                className={`text-[14px] font-medium truncate ${
                                    goal.enabled ? "text-black" : "text-black/40"
                                }`}
                            >
                                {goal.label}
                            </span>
                            {isAuto && (
                                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/[0.04] text-[10px] font-medium text-black/40">
                                    <Zap className="w-2.5 h-2.5" />
                                    Auto
                                </span>
                            )}
                        </div>
                        <p className={`text-[12px] mt-0.5 ${goal.enabled ? "text-black/40" : "text-black/30"}`}>
                            {periodConfig.label}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Switch
                            checked={goal.enabled}
                            onCheckedChange={(checked) => onToggle(goal.id, checked)}
                            disabled={isToggling}
                            className="data-[state=checked]:bg-black"
                        />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-7 h-7 flex items-center justify-center rounded-md text-black/30 hover:text-black/60 hover:bg-black/5 transition-colors opacity-0 group-hover:opacity-100">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                                <DropdownMenuItem onClick={() => onEdit(goal)} className="text-[13px]">
                                    <Pencil className="w-3.5 h-3.5 mr-2 text-black/40" />
                                    Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onDelete(goal.id)}
                                    className="text-[13px] text-red-600 focus:text-red-600"
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                                    Supprimer
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Progress section - only when enabled */}
                {goal.enabled && (
                    <div className="mt-4 pt-4 border-t border-black/[0.04]">
                        {/* Values row */}
                        <div className="flex items-end justify-between mb-3">
                            <div>
                                <p className="text-[11px] text-black/40 mb-0.5">Progression</p>
                                <p className="text-[18px] font-semibold tracking-[-0.02em] text-black">
                                    {goal.formattedCurrent}
                                    <span className="text-[14px] font-normal text-black/30 ml-1">
                                        / {goal.formattedTarget}
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {goal.onTrack ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 text-black/60" />
                                        <span className="text-[13px] font-medium text-black/60">
                                            En bonne voie
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="w-4 h-4 text-black/30" />
                                        <span className="text-[13px] font-medium text-black/30">
                                            En retard
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="relative">
                            <div className="h-2 bg-black/[0.06] rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        goal.onTrack ? "bg-black" : "bg-black/30"
                                    }`}
                                    style={{ width: `${Math.min(100, goal.progress)}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-1.5">
                                <span className="text-[11px] text-black/30">0%</span>
                                <span className={`text-[12px] font-semibold ${goal.onTrack ? "text-black" : "text-black/40"}`}>
                                    {goal.progress}%
                                </span>
                                <span className="text-[11px] text-black/30">100%</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Disabled state indicator */}
                {!goal.enabled && (
                    <div className="mt-3 pt-3 border-t border-black/[0.04]">
                        <p className="text-[12px] text-black/30 text-center">
                            Objectif désactivé
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
