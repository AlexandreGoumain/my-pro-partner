"use client";

import { ProgressRing } from "@/components/ui/progress-ring";
import { Award } from "lucide-react";
import { KpiCardWrapper } from "./kpi-card-wrapper";

export interface LoyaltyLevelCardProps {
    levelName: string | null;
    levelColor?: string;
    progressToNext: number; // 0-100
    className?: string;
}

/**
 * KPI card showing loyalty level with progress ring to next level
 */
export function LoyaltyLevelCard({
    levelName,
    levelColor,
    progressToNext,
    className,
}: LoyaltyLevelCardProps) {
    const displayName = levelName || "Aucun";
    const bgColor = levelColor ? `${levelColor}15` : "bg-black/5";
    const textColor = levelColor || undefined;

    return (
        <KpiCardWrapper
            icon={Award}
            label="Mon niveau"
            className={className}
            iconBgColor={levelColor ? undefined : "bg-black/5"}
            iconColor={levelColor ? undefined : "text-black/60"}
        >
            <div className="flex items-center justify-between gap-2">
                <p
                    className="text-[24px] font-semibold tracking-[-0.01em] text-black"
                    style={textColor ? { color: textColor } : undefined}
                >
                    {displayName}
                </p>
                {levelName && progressToNext < 100 && (
                    <ProgressRing
                        value={progressToNext}
                        size={32}
                        strokeWidth={2.5}
                    >
                        <span className="text-[9px] font-medium text-black/60">
                            {Math.round(progressToNext)}%
                        </span>
                    </ProgressRing>
                )}
            </div>
        </KpiCardWrapper>
    );
}
