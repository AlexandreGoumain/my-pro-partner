"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PlanComparisonTriggerProps {
    onClick: () => void;
    className?: string;
}

export function PlanComparisonTrigger({
    onClick,
    className,
}: PlanComparisonTriggerProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "group inline-flex items-center gap-1 text-[14px] text-black/50 hover:text-black transition-colors",
                className
            )}
        >
            <span className="underline-offset-4 group-hover:underline">
                Comparer toutes les fonctionnalités
            </span>
            <ChevronRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
            />
        </button>
    );
}
