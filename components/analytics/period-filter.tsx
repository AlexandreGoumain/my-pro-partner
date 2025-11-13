"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { AnalyticsPeriod } from "@/lib/types/analytics";

export interface PeriodFilterProps {
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
}

export function PeriodFilter({
    value,
    onValueChange,
    className = "",
}: PeriodFilterProps) {
    return (
        <div
            className={`flex items-center justify-between p-4 border border-black/8 rounded-lg bg-white ${className}`}
        >
            <div className="flex items-center gap-2">
                <span className="text-[14px] text-black/60 font-medium">
                    Période:
                </span>
                <Select value={value} onValueChange={onValueChange}>
                    <SelectTrigger className="w-[180px] h-9 border-black/10">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="month">Ce mois</SelectItem>
                        <SelectItem value="quarter">Ce trimestre</SelectItem>
                        <SelectItem value="year">Cette année</SelectItem>
                        <SelectItem value="all">Toute la période</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
