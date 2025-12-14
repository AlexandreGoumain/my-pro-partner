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
        <Card
            className={`group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-sm transition-all duration-300 ${className}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-6">
                <div className="mb-5">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <span className="text-[13px] font-medium tracking-[-0.01em] text-black/60 flex items-center gap-1.5">
                            <Icon
                                className="h-4 w-4 text-black/60"
                                strokeWidth={2}
                            />
                            {title}
                        </span>
                    </div>
                </div>
                <div className="text-[28px] font-bold tracking-[-0.02em] text-black mb-1">
                    {value}
                </div>
                {subtitle && (
                    <div className="text-[13px] text-black/60">{subtitle}</div>
                )}
            </div>
        </Card>
    );
}
