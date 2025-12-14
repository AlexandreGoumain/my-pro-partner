"use client";

import { Sparkline } from "@/components/ui/sparkline";
import { Star } from "lucide-react";
import { KpiCardWrapper } from "./kpi-card-wrapper";

export interface PointsBalanceCardProps {
    points: number;
    trendData?: number[];
    className?: string;
}

/**
 * KPI card showing points balance with sparkline trend
 */
export function PointsBalanceCard({
    points,
    trendData,
    className,
}: PointsBalanceCardProps) {
    const formattedPoints = new Intl.NumberFormat("fr-FR").format(points);

    return (
        <KpiCardWrapper
            icon={Star}
            label="Mes points"
            className={className}
        >
            <div className="flex items-end justify-between gap-2">
                <p className="text-[24px] font-semibold tracking-[-0.01em] text-black">
                    {formattedPoints}
                </p>
                {trendData && trendData.length >= 2 && (
                    <Sparkline
                        data={trendData}
                        width={60}
                        height={20}
                        className="mb-1"
                    />
                )}
            </div>
        </KpiCardWrapper>
    );
}
