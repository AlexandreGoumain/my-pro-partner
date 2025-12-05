"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { GOAL_METRIC_TYPES, isAutoCalculated } from "@/lib/types/goals";
import type { GoalMetricType } from "@/lib/generated/prisma";
import { Zap } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface GoalMetricSelectProps {
    value?: GoalMetricType;
    onChange: (value: GoalMetricType) => void;
    className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function GoalMetricSelect({
    value,
    onChange,
    className,
}: GoalMetricSelectProps) {
    const metrics = Object.entries(GOAL_METRIC_TYPES) as [
        GoalMetricType,
        (typeof GOAL_METRIC_TYPES)[GoalMetricType]
    ][];

    // Separate auto and custom metrics
    const autoMetrics = metrics.filter(([key]) => isAutoCalculated(key));
    const customMetric = metrics.find(([key]) => key === "CUSTOM");

    const selectedConfig = value ? GOAL_METRIC_TYPES[value] : null;

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className={`h-10 border-black/10 text-[14px] ${className || ""}`}>
                <SelectValue placeholder="Sélectionner un type">
                    {selectedConfig && (
                        <div className="flex items-center gap-2">
                            <span>{selectedConfig.label}</span>
                            {value && isAutoCalculated(value) && (
                                <Zap className="w-3 h-3 text-black/30" />
                            )}
                        </div>
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[280px]">
                <SelectGroup>
                    <SelectLabel className="text-[11px] text-black/40 font-medium px-2 py-1.5">
                        Calcul automatique
                    </SelectLabel>
                    {autoMetrics.map(([key, config]) => (
                        <SelectItem
                            key={key}
                            value={key}
                            className="py-2.5"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-[14px]">{config.label}</span>
                                <Zap className="w-3 h-3 text-black/30" />
                            </div>
                        </SelectItem>
                    ))}
                </SelectGroup>

                <div className="h-px bg-black/5 my-1" />

                <SelectGroup>
                    <SelectLabel className="text-[11px] text-black/40 font-medium px-2 py-1.5">
                        Personnalisé
                    </SelectLabel>
                    {customMetric && (
                        <SelectItem
                            value={customMetric[0]}
                            className="py-2.5"
                        >
                            <span className="text-[14px]">{customMetric[1].label}</span>
                        </SelectItem>
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
