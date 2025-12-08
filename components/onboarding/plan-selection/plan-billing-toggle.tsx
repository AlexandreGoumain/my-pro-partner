"use client";

import { cn } from "@/lib/utils";

export interface PlanBillingToggleProps {
    billingPeriod: "monthly" | "yearly";
    onBillingChange: (period: "monthly" | "yearly") => void;
    className?: string;
}

export function PlanBillingToggle({
    billingPeriod,
    onBillingChange,
    className,
}: PlanBillingToggleProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-lg border border-black/10 bg-black/[0.02] p-1",
                className
            )}
        >
            <button
                type="button"
                onClick={() => onBillingChange("monthly")}
                className={cn(
                    "px-4 py-2 text-[14px] font-medium rounded-md transition-all duration-200",
                    billingPeriod === "monthly"
                        ? "bg-white text-black shadow-sm"
                        : "text-black/50 hover:text-black/70"
                )}
            >
                Mensuel
            </button>
            <button
                type="button"
                onClick={() => onBillingChange("yearly")}
                className={cn(
                    "px-4 py-2 text-[14px] font-medium rounded-md transition-all duration-200 flex items-center gap-2",
                    billingPeriod === "yearly"
                        ? "bg-white text-black shadow-sm"
                        : "text-black/50 hover:text-black/70"
                )}
            >
                Annuel
                <span
                    className={cn(
                        "text-[11px] font-semibold px-1.5 py-0.5 rounded",
                        billingPeriod === "yearly"
                            ? "bg-black/10 text-black"
                            : "bg-black/5 text-black/50"
                    )}
                >
                    -20%
                </span>
            </button>
        </div>
    );
}
