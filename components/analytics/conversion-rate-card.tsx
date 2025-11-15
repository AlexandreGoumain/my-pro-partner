import { Card } from "@/components/ui/card";

export interface ConversionRateCardProps {
    conversionRate: number;
}

export function ConversionRateCard({
    conversionRate,
}: ConversionRateCardProps) {
    return (
        <Card className="p-6 border-black/8 shadow-sm">
            <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black mb-4">
                Taux de conversion
            </h3>
            <div className="flex items-center justify-center h-24">
                <div className="text-center">
                    <div className="text-[36px] font-bold tracking-[-0.02em] text-black">
                        {conversionRate.toFixed(1)}%
                    </div>
                    <div className="text-[13px] text-black/60 mt-1">
                        Devis → Factures
                    </div>
                </div>
            </div>
        </Card>
    );
}
