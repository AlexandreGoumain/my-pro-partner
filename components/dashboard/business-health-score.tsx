"use client";

import { Card } from "@/components/ui/card";
import type { BusinessHealth } from "@/lib/types/dashboard";
import {
    Activity,
    BarChart3,
    Package,
    ShoppingCart,
    TrendingUp,
    Users,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface BusinessHealthScoreProps {
    health: BusinessHealth;
    className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function BusinessHealthScore({
    health,
    className,
}: BusinessHealthScoreProps) {
    const { score, level, factors, isEmpty } = health;

    // Visual configuration based on level
    const config = {
        excellent: {
            label: "Excellent",
            gradient: "from-black via-black/90 to-black/80",
            glowColor: "rgba(0, 0, 0, 0.1)",
        },
        good: {
            label: "Bon",
            gradient: "from-black/80 via-black/70 to-black/60",
            glowColor: "rgba(0, 0, 0, 0.08)",
        },
        poor: {
            label: "À surveiller",
            gradient: "from-black/60 via-black/50 to-black/40",
            glowColor: "rgba(0, 0, 0, 0.05)",
        },
        critical: {
            label: "Critique",
            gradient: "from-black/40 via-black/30 to-black/20",
            glowColor: "rgba(0, 0, 0, 0.03)",
        },
    };

    const currentConfig = config[level];

    // Calculate stroke offset for circular progress
    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    const strokeOffset = circumference - (score / 100) * circumference;

    // Factor icons
    const factorIcons = {
        revenue: TrendingUp,
        cashflow: Activity,
        clientGrowth: Users,
        conversion: ShoppingCart,
        stock: Package,
    };

    const factorLabels = {
        revenue: "Revenus",
        cashflow: "Trésorerie",
        clientGrowth: "Croissance",
        conversion: "Conversion",
        stock: "Stock",
    };

    // Empty state when no data
    if (isEmpty) {
        return (
            <Card
                className={`group relative p-6 overflow-hidden border-black/[0.08] bg-white hover:shadow-sm transition-all duration-300 ${
                    className || ""
                }`}
            >
                <div className="relative">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1 h-4 bg-gradient-to-b from-black/20 to-black/10 rounded-full" />
                            <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                                Santé du Business
                            </h3>
                        </div>
                        <p className="text-[13px] text-black/40 ml-3">
                            Vue d&apos;ensemble de vos performances
                        </p>
                    </div>

                    {/* Empty State Content */}
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="p-4 bg-black/[0.03] rounded-full mb-4">
                            <BarChart3
                                className="w-8 h-8 text-black/20"
                                strokeWidth={1.5}
                            />
                        </div>
                        <h4 className="text-[15px] font-medium text-black/70 mb-1">
                            Pas encore de données
                        </h4>
                        <p className="text-[13px] text-black/40 max-w-[240px]">
                            Ajoutez des clients, articles ou documents pour voir
                            votre score de santé
                        </p>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card
            className={`group relative p-6 overflow-hidden border-black/[0.08] bg-white hover:shadow-sm transition-all duration-300 ${
                className || ""
            }`}
        >
            {/* Subtle hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                            Santé du Business
                        </h3>
                    </div>
                    <p className="text-[13px] text-black/40 ml-3">
                        Vue d'ensemble de vos performances
                    </p>
                </div>

                <div className="flex items-start gap-8">
                    {/* Enhanced Circular Progress */}
                    <div className="relative flex-shrink-0">
                        {/* Glow effect */}
                        <div
                            className="absolute inset-0 blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                            style={{
                                background: `radial-gradient(circle, ${currentConfig.glowColor} 0%, transparent 70%)`,
                            }}
                        />

                        <svg className="w-[140px] h-[140px] -rotate-90 relative">
                            {/* Background circle */}
                            <circle
                                cx="70"
                                cy="70"
                                r={radius}
                                fill="none"
                                stroke="rgba(0, 0, 0, 0.04)"
                                strokeWidth="10"
                            />
                            {/* Progress circle with gradient */}
                            <defs>
                                <linearGradient
                                    id={`health-gradient-${level}`}
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="100%"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="rgba(0, 0, 0, 0.95)"
                                    />
                                    <stop
                                        offset="50%"
                                        stopColor="rgba(0, 0, 0, 0.85)"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="rgba(0, 0, 0, 0.7)"
                                    />
                                </linearGradient>
                            </defs>
                            <circle
                                cx="70"
                                cy="70"
                                r={radius}
                                fill="none"
                                stroke={`url(#health-gradient-${level})`}
                                strokeWidth="10"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeOffset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out drop-shadow-sm"
                            />
                        </svg>

                        {/* Score in center */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[36px] font-bold tracking-[-0.04em] text-black bg-gradient-to-br from-black to-black/70 bg-clip-text">
                                {score}
                            </span>
                            <span className="text-[11px] text-black/30 font-medium mt-0.5">
                                / 100
                            </span>
                        </div>
                    </div>

                    {/* Factors breakdown */}
                    <div className="flex-1 space-y-3.5">
                        {/* Status badge */}
                        <div className="mb-5">
                            <span
                                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-gradient-to-r ${currentConfig.gradient} text-white shadow-sm`}
                            >
                                {currentConfig.label}
                            </span>
                        </div>

                        {/* Factors list */}
                        <div className="space-y-3">
                            {Object.entries(factors).map(([key, value]) => {
                                const Icon =
                                    factorIcons[
                                        key as keyof typeof factorIcons
                                    ];
                                const label =
                                    factorLabels[
                                        key as keyof typeof factorLabels
                                    ];

                                return (
                                    <div
                                        key={key}
                                        className="group/factor flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-black/[0.02] transition-all duration-200"
                                    >
                                        <div className="p-1.5 bg-black/[0.04] rounded-md group-hover/factor:bg-black/[0.06] transition-colors duration-200">
                                            <Icon
                                                className="w-3.5 h-3.5 text-black/40 group-hover/factor:text-black/60 transition-colors duration-200"
                                                strokeWidth={2.5}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-[12px] font-medium text-black/70">
                                                    {label}
                                                </span>
                                                <span className="text-[12px] font-semibold text-black tabular-nums">
                                                    {value}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-black/[0.04] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-black/90 to-black/70 rounded-full transition-all duration-1000 ease-out shadow-sm"
                                                    style={{
                                                        width: `${value}%`,
                                                        transitionDelay:
                                                            "100ms",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
