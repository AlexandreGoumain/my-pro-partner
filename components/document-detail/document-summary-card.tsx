import { Card } from "@/components/ui/card";

export interface DocumentSummaryCardProps {
    totalHT: number;
    totalTVA: number;
    totalTTC: number;
    resteAPayer?: number;
    formatAmount: (value: number) => string;
}

/**
 * Reusable component for displaying document financial summary
 */
export function DocumentSummaryCard({
    totalHT,
    totalTVA,
    totalTTC,
    resteAPayer,
    formatAmount,
}: DocumentSummaryCardProps) {
    return (
        <Card className="p-6 border-black/8 shadow-sm">
            <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black mb-4">
                Récapitulatif
            </h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between text-[14px]">
                    <span className="text-black/60">Total HT</span>
                    <span className="font-medium">{formatAmount(totalHT)}</span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                    <span className="text-black/60">TVA</span>
                    <span className="font-medium">{formatAmount(totalTVA)}</span>
                </div>
                <div className="h-px bg-black/8" />
                <div className="flex items-center justify-between text-[18px]">
                    <span className="font-semibold">Total TTC</span>
                    <span className="font-bold">{formatAmount(totalTTC)}</span>
                </div>

                {resteAPayer !== undefined && resteAPayer > 0 && (
                    <>
                        <div className="h-px bg-black/8" />
                        <div className="flex items-center justify-between text-[16px] text-orange-600">
                            <span className="font-semibold">Reste à payer</span>
                            <span className="font-bold">
                                {formatAmount(resteAPayer)}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
}
