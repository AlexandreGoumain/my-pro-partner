"use client";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export interface RevenueItem {
    label: string;
    revenue: number;
    count: number;
    percentage: number;
    color?: string;
}

export interface RevenueBreakdownProps {
    title: string;
    items: RevenueItem[];
    totalRevenue: number;
    className?: string;
}

export function RevenueBreakdown({
    title,
    items,
    className = "",
}: RevenueBreakdownProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(value);
    };

    const formatPercentage = (value: number) => {
        return `${value.toFixed(1)}%`;
    };

    return (
        <Card
            className={`group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-sm transition-all duration-300 ${className}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-6">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                            {title}
                        </h3>
                    </div>
                </div>

                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-black" />
                                    <span className="text-[14px] font-medium text-black">
                                        {item.label}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-[14px] font-semibold text-black">
                                        {formatCurrency(item.revenue)}
                                    </div>
                                    <div className="text-[12px] text-black/60">
                                        {formatPercentage(item.percentage)}
                                    </div>
                                </div>
                            </div>
                            <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-300 bg-black"
                                    style={{
                                        width: `${Math.min(item.percentage, 100)}%`,
                                    }}
                                />
                            </div>
                            <div className="text-[12px] text-black/40 mt-1">
                                {item.count} vente{item.count > 1 ? "s" : ""}
                            </div>
                        </div>
                    ))}
                </div>

                {items.length === 0 && (
                    <EmptyState
                        title="Aucune donnée disponible"
                        variant="inline"
                    />
                )}
            </div>
        </Card>
    );
}
