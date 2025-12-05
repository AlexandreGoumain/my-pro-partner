"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { GOAL_PERIODS } from "@/lib/types/goals";
import type { GoalPeriod } from "@/lib/generated/prisma";

// ============================================================================
// Types
// ============================================================================

export interface GoalPeriodSelectProps {
    value?: GoalPeriod;
    onChange: (value: GoalPeriod) => void;
    disabled?: boolean;
    className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function GoalPeriodSelect({
    value,
    onChange,
    disabled,
    className,
}: GoalPeriodSelectProps) {
    const periods = Object.entries(GOAL_PERIODS) as [
        GoalPeriod,
        (typeof GOAL_PERIODS)[GoalPeriod]
    ][];

    return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className={`h-10 border-black/10 text-[14px] ${disabled ? "bg-black/[0.02] text-black/40" : ""} ${className || ""}`}>
                <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
                {periods.map(([key, config]) => (
                    <SelectItem key={key} value={key} className="py-2.5">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-[14px]">{config.label}</span>
                            <span className="text-[11px] text-black/30">{config.shortLabel}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
