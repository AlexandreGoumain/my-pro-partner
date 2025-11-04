"use client";

import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export interface AnalyticsKPICardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    className?: string;
}

export function AnalyticsKPICard({
    title,
    value,
    subtitle,
    icon: Icon,
    className = "",
}: AnalyticsKPICardProps) {
    return (
        <Card className={`p-6 border-black/8 shadow-sm ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] text-black/60">{title}</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
                    <Icon className="h-5 w-5 text-black/60" strokeWidth={2} />
                </div>
            </div>
            <div className="text-[28px] font-bold tracking-[-0.02em] text-black mb-1">
                {value}
            </div>
            {subtitle && (
                <div className="text-[13px] text-black/60">{subtitle}</div>
            )}
        </Card>
    );
}
