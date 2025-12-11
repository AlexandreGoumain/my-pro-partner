"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface KpiCardWrapperProps {
    icon: LucideIcon;
    label: string;
    children: React.ReactNode;
    className?: string;
    iconBgColor?: string;
    iconColor?: string;
}

/**
 * Base wrapper for KPI cards with consistent styling
 * Includes hover effects and animations
 */
export function KpiCardWrapper({
    icon: Icon,
    label,
    children,
    className,
    iconBgColor = "bg-black/5",
    iconColor = "text-black/60",
}: KpiCardWrapperProps) {
    return (
        <Card
            className={cn(
                "border-black/8 shadow-sm",
                "transition-all duration-200",
                "hover:bg-black/[0.01] hover:shadow-md hover:shadow-black/5",
                className
            )}
        >
            <div className="p-5">
                <div className="flex items-start gap-3">
                    <div
                        className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                            iconBgColor
                        )}
                    >
                        <Icon
                            className={cn("h-5 w-5", iconColor)}
                            strokeWidth={2}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-black/40 mb-0.5">{label}</p>
                        {children}
                    </div>
                </div>
            </div>
        </Card>
    );
}
