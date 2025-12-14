"use client";

import { Card } from "@/components/ui/card";

interface DocumentTotalsProps {
    totalHT: number;
    totalTVA: number;
    totalTTC: number;
    className?: string;
}

export function DocumentTotals({
    totalHT,
    totalTVA,
    totalTTC,
    className,
}: DocumentTotalsProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(value);
    };

    return (
        <Card
            className={`group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-sm transition-all duration-300 ${className || ""}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-6">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                            Récapitulatif
                        </h3>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-[14px]">
                        <span className="text-black/60">Total HT</span>
                        <span className="font-medium">
                            {formatCurrency(totalHT)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-[14px]">
                        <span className="text-black/60">TVA</span>
                        <span className="font-medium">
                            {formatCurrency(totalTVA)}
                        </span>
                    </div>
                    <div className="h-px bg-black/[0.08]" />
                    <div className="flex items-center justify-between text-[18px]">
                        <span className="font-semibold">Total TTC</span>
                        <span className="font-bold">
                            {formatCurrency(totalTTC)}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
