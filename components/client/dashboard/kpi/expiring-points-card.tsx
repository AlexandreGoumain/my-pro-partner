"use client";

import { cn } from "@/lib/utils";
import { TrendingDown } from "lucide-react";
import { KpiCardWrapper } from "./kpi-card-wrapper";

export interface ExpiringPointsCardProps {
    points: number;
    daysUntilExpiry?: number;
    className?: string;
}

/**
 * KPI card showing expiring points with urgency indicator
 */
export function ExpiringPointsCard({
    points,
    daysUntilExpiry,
    className,
}: ExpiringPointsCardProps) {
    const isUrgent = points > 0 && daysUntilExpiry !== undefined && daysUntilExpiry <= 7;
    const formattedPoints = new Intl.NumberFormat("fr-FR").format(points);

    return (
        <KpiCardWrapper
            icon={TrendingDown}
            label="Expirent bientôt"
            className={className}
        >
            <div className="flex items-end justify-between gap-2">
                <p
                    className={cn(
                        "text-[24px] font-semibold tracking-[-0.01em]",
                        isUrgent ? "text-black" : "text-black"
                    )}
                >
                    {formattedPoints}
                </p>
                {points > 0 && daysUntilExpiry !== undefined && (
                    <div
                        className={cn(
                            "flex items-center gap-1 mb-1 px-2 py-0.5 rounded-full text-[11px]",
                            isUrgent
                                ? "bg-black/10 text-black font-medium"
                                : "text-black/40"
                        )}
                    >
                        {isUrgent && (
                            <span className="h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
                        )}
                        <span>
                            {daysUntilExpiry === 0
                                ? "Aujourd'hui"
                                : daysUntilExpiry === 1
                                    ? "Demain"
                                    : `dans ${daysUntilExpiry}j`}
                        </span>
                    </div>
                )}
            </div>
        </KpiCardWrapper>
    );
}
