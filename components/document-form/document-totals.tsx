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
        <Card className={`p-6 border-black/8 shadow-sm ${className || ""}`}>
            <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black mb-4">
                Récapitulatif
            </h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between text-[14px]">
                    <span className="text-black/60">Total HT</span>
                    <span className="font-medium">{formatCurrency(totalHT)}</span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                    <span className="text-black/60">TVA</span>
                    <span className="font-medium">{formatCurrency(totalTVA)}</span>
                </div>
                <div className="h-px bg-black/8" />
                <div className="flex items-center justify-between text-[18px]">
                    <span className="font-semibold">Total TTC</span>
                    <span className="font-bold">{formatCurrency(totalTTC)}</span>
                </div>
            </div>
        </Card>
    );
}
