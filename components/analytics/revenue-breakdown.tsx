"use client";

import { Card } from "@/components/ui/card";

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
    totalRevenue,
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
        <Card className={`p-6 border-black/8 shadow-sm ${className}`}>
            <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black mb-4">
                {title}
            </h3>

            <div className="space-y-4">
                {items.map((item, index) => (
                    <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-2 w-2 rounded-full"
                                    style={{
                                        backgroundColor:
                                            item.color || "#000000",
                                    }}
                                />
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
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                    width: `${Math.min(item.percentage, 100)}%`,
                                    backgroundColor: item.color || "#000000",
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
                <div className="text-center py-8">
                    <p className="text-[14px] text-black/40">
                        Aucune donnée disponible
                    </p>
                </div>
            )}
        </Card>
    );
}
