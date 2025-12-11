"use client";

import { LucideIcon } from "lucide-react";

export interface EmployeeStatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        label: string;
    };
}

export function EmployeeStatsCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
}: EmployeeStatsCardProps) {
    return (
        <div className="group relative overflow-hidden bg-white border border-black/[0.08] rounded-lg p-6 hover:shadow-sm transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <p className="text-[13px] font-medium text-black/60 tracking-[-0.01em]">
                            {title}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[28px] font-semibold text-black tracking-[-0.02em]">
                            {value}
                        </p>
                        {subtitle && (
                            <p className="text-[13px] text-black/40">
                                {subtitle}
                            </p>
                        )}
                        {trend && (
                            <p className="text-[13px] text-black/60">
                                <span
                                    className={
                                        trend.value >= 0
                                            ? "text-black"
                                            : "text-black/40"
                                    }
                                >
                                    {trend.value >= 0 ? "+" : ""}
                                    {trend.value}
                                </span>{" "}
                                {trend.label}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black/[0.03] group-hover:bg-black/[0.05] transition-colors duration-300">
                    <Icon className="h-5 w-5 text-black/60" strokeWidth={2} />
                </div>
            </div>
        </div>
    );
}
