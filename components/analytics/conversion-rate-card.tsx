import { Card } from "@/components/ui/card";

export interface ConversionRateCardProps {
    conversionRate: number;
}

export function ConversionRateCard({
    conversionRate,
}: ConversionRateCardProps) {
    return (
        <Card className="group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-sm transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-6">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                            Taux de conversion
                        </h3>
                    </div>
                </div>
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
            </div>
        </Card>
    );
}
