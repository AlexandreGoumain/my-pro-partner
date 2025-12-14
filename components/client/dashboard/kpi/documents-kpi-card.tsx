"use client";

import { FileText } from "lucide-react";
import { KpiCardWrapper } from "./kpi-card-wrapper";

export interface DocumentsKpiCardProps {
    count: number;
    recentCount?: number;
    className?: string;
}

/**
 * KPI card showing documents count with recent activity indicator
 */
export function DocumentsKpiCard({
    count,
    recentCount,
    className,
}: DocumentsKpiCardProps) {
    return (
        <KpiCardWrapper icon={FileText} label="Documents" className={className}>
            <div className="flex items-end justify-between gap-2">
                <p className="text-[24px] font-semibold tracking-[-0.01em] text-black">
                    {count}
                </p>
                {recentCount !== undefined && recentCount > 0 && (
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-black/60 animate-pulse" />
                        <span className="text-[11px] text-black/40">
                            {recentCount} récent{recentCount > 1 ? "s" : ""}
                        </span>
                    </div>
                )}
            </div>
        </KpiCardWrapper>
    );
}
