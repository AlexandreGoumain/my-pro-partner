"use client";

import { Button } from "@/components/ui/button";

export interface PeriodOption {
    label: string;
    value: string;
}

export interface PeriodFilterProps {
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
}

const PERIOD_OPTIONS: PeriodOption[] = [
    { label: "Mois", value: "month" },
    { label: "Trimestre", value: "quarter" },
    { label: "Année", value: "year" },
    { label: "Total", value: "all" },
];

export function PeriodFilter({
    value,
    onValueChange,
    className = "",
}: PeriodFilterProps) {
    return (
        <div className={`flex items-center gap-2.5 ${className || ""}`}>
            <span className="text-[12px] font-medium text-black/40">Période:</span>
            <div className="flex items-center gap-1 bg-black/[0.04] p-1 rounded-lg border border-black/[0.06]">
                {PERIOD_OPTIONS.map((option) => (
                    <Button
                        key={option.value}
                        variant="ghost"
                        size="sm"
                        onClick={() => onValueChange(option.value)}
                        className={`h-7 px-3 text-[12px] font-semibold transition-all duration-200 ${
                            value === option.value
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
