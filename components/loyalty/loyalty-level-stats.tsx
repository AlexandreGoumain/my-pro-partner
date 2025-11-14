import { Card } from "@/components/ui/card";
import { Award, Gift } from "lucide-react";

export interface LoyaltyLevelStatsProps {
    activeCount: number;
    totalCount: number;
    maxDiscount: number;
}

/**
 * Statistiques des niveaux de fidélité
 * Note: Layout horizontal custom avec icône à droite, différent du StatCard standard
 */
export function LoyaltyLevelStats({
    activeCount,
    totalCount,
    maxDiscount,
}: LoyaltyLevelStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-black/8">
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[13px] text-black/60">
                                Niveaux actifs
                            </p>
                            <p className="text-[28px] font-bold tracking-[-0.02em]">
                                {activeCount}
                            </p>
                        </div>
                        <Award
                            className="h-8 w-8 text-black/40"
                            strokeWidth={2}
                        />
                    </div>
                </div>
            </Card>

            <Card className="border-black/8">
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[13px] text-black/60">
                                Total niveaux
                            </p>
                            <p className="text-[28px] font-bold tracking-[-0.02em]">
                                {totalCount}
                            </p>
                        </div>
                        <Gift
                            className="h-8 w-8 text-black/40"
                            strokeWidth={2}
                        />
                    </div>
                </div>
            </Card>

            <Card className="border-black/8">
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[13px] text-black/60">
                                Remise max
                            </p>
                            <p className="text-[28px] font-bold tracking-[-0.02em]">
                                {maxDiscount}%
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
