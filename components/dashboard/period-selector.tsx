"use client";

import { Button } from "@/components/ui/button";

// ============================================================================
// Types
// ============================================================================

export interface PeriodOption {
    label: string;
    value: number; // Days
}

export interface PeriodSelectorProps {
    selectedPeriod: number;
    onPeriodChange: (period: number) => void;
    className?: string;
}

// ============================================================================
// Constants
// ============================================================================

const PERIOD_OPTIONS: PeriodOption[] = [
    { label: "7j", value: 7 },
    { label: "30j", value: 30 },
    { label: "90j", value: 90 },
    { label: "1an", value: 365 },
];

// ============================================================================
// Component
// ============================================================================

export function PeriodSelector({ selectedPeriod, onPeriodChange, className }: PeriodSelectorProps) {
    return (
        <div className={`flex items-center gap-2.5 ${className || ""}`}>
            <span className="text-[12px] font-medium text-black/40">Période:</span>
            <div className="flex items-center gap-1 bg-black/[0.04] p-1 rounded-lg border border-black/[0.06]">
                {PERIOD_OPTIONS.map((option) => (
                    <Button
                        key={option.value}
                        variant="ghost"
                        size="sm"
                        onClick={() => onPeriodChange(option.value)}
                        className={`h-7 px-3 text-[12px] font-semibold transition-all duration-200 ${
                            selectedPeriod === option.value
                                ? "bg-white text-black shadow-sm hover:bg-white"
                                : "text-black/50 hover:text-black/80 hover:bg-black/[0.04]"
                        }`}
                    >
                        {option.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
