"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { GoalMetricSelect } from "./goal-metric-select";
import { GoalPeriodSelect } from "./goal-period-select";
import {
    GOAL_UNITS,
    getDefaultUnit,
    isAutoCalculated,
} from "@/lib/types/goals";
import type { GoalWithProgress, CreateGoalInput } from "@/lib/types/goals";
import type { GoalMetricType, GoalPeriod, GoalUnit } from "@/lib/generated/prisma";
import { Loader2, Zap } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface GoalFormProps {
    goal?: GoalWithProgress;
    onSubmit: (data: CreateGoalInput) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function GoalForm({ goal, onSubmit, onCancel, isLoading }: GoalFormProps) {
    const isEditing = !!goal;

    const [label, setLabel] = useState(goal?.label || "");
    const [metricType, setMetricType] = useState<GoalMetricType>(
        goal?.metricType || "CUSTOM"
    );
    const [period, setPeriod] = useState<GoalPeriod>(goal?.period || "MONTHLY");
    const [unit, setUnit] = useState<GoalUnit>(goal?.unit || "NUMBER");
    const [targetValue, setTargetValue] = useState(
        goal?.targetValue?.toString() || ""
    );

    // When metric type changes, auto-set the unit for auto-calculated metrics
    useEffect(() => {
        if (isAutoCalculated(metricType)) {
            setUnit(getDefaultUnit(metricType));
        }
    }, [metricType]);

    // For revenue metrics, the period is fixed
    const isPeriodFixed =
        metricType === "REVENUE_MONTHLY" ||
        metricType === "REVENUE_QUARTERLY" ||
        metricType === "REVENUE_YEARLY";

    useEffect(() => {
        if (metricType === "REVENUE_MONTHLY") setPeriod("MONTHLY");
        if (metricType === "REVENUE_QUARTERLY") setPeriod("QUARTERLY");
        if (metricType === "REVENUE_YEARLY") setPeriod("YEARLY");
    }, [metricType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!label.trim() || !targetValue || parseFloat(targetValue) <= 0) {
            return;
        }

        onSubmit({
            label: label.trim(),
            metricType,
            period,
            unit,
            targetValue: parseFloat(targetValue),
        });
    };

    const isAuto = isAutoCalculated(metricType);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Identification */}
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="label" className="text-[13px] font-medium text-black">
                        Nom de l'objectif
                    </Label>
                    <Input
                        id="label"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="Ex: Chiffre d'affaires mensuel"
                        className="h-10 border-black/10 text-[14px] placeholder:text-black/30"
                        required
                    />
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-black/5" />

            {/* Section 2: Configuration */}
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label className="text-[13px] font-medium text-black">
                        Type de métrique
                    </Label>
                    <GoalMetricSelect value={metricType} onChange={setMetricType} />
                </div>

                {/* Auto-calculated badge */}
                {isAuto && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/[0.02] border border-black/[0.04]">
                        <Zap className="w-3.5 h-3.5 text-black/40" />
                        <span className="text-[12px] text-black/50">
                            Progression calculée automatiquement à partir de vos données
                        </span>
                    </div>
                )}

                {/* Period & Unit row */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-[13px] font-medium text-black">
                            Période
                        </Label>
                        <GoalPeriodSelect
                            value={period}
                            onChange={setPeriod}
                            disabled={isPeriodFixed}
                        />
                    </div>

                    {metricType === "CUSTOM" ? (
                        <div className="space-y-1.5">
                            <Label className="text-[13px] font-medium text-black">
                                Unité
                            </Label>
                            <Select value={unit} onValueChange={(v) => setUnit(v as GoalUnit)}>
                                <SelectTrigger className="h-10 border-black/10 text-[14px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {(Object.entries(GOAL_UNITS) as [GoalUnit, typeof GOAL_UNITS[GoalUnit]][]).map(
                                        ([key, config]) => (
                                            <SelectItem key={key} value={key} className="text-[14px]">
                                                {config.label}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            <Label className="text-[13px] font-medium text-black/40">
                                Unité
                            </Label>
                            <div className="h-10 px-3 flex items-center rounded-md border border-black/10 bg-black/[0.02] text-[14px] text-black/40">
                                {unit === "CURRENCY" ? "Euros (€)" : unit === "PERCENTAGE" ? "Pourcentage (%)" : "Nombre"}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-black/5" />

            {/* Section 3: Target */}
            <div className="space-y-1.5">
                <Label htmlFor="targetValue" className="text-[13px] font-medium text-black">
                    Valeur cible
                </Label>
                <div className="relative">
                    <Input
                        id="targetValue"
                        type="number"
                        value={targetValue}
                        onChange={(e) => setTargetValue(e.target.value)}
                        placeholder={unit === "CURRENCY" ? "50000" : unit === "PERCENTAGE" ? "80" : "100"}
                        className="h-10 border-black/10 text-[14px] pr-12 placeholder:text-black/30"
                        min={0}
                        step={unit === "PERCENTAGE" ? 1 : 0.01}
                        required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-black/30 font-medium">
                        {unit === "CURRENCY" && "€"}
                        {unit === "PERCENTAGE" && "%"}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    className="h-9 px-4 text-[13px] text-black/60 hover:text-black hover:bg-black/5"
                    disabled={isLoading}
                >
                    Annuler
                </Button>
                <Button
                    type="submit"
                    className="h-9 px-5 bg-black hover:bg-black/90 text-[13px] font-medium"
                    disabled={isLoading || !label.trim() || !targetValue}
                >
                    {isLoading && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />}
                    {isEditing ? "Enregistrer" : "Créer l'objectif"}
                </Button>
            </div>
        </form>
    );
}
