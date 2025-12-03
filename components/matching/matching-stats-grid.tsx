import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MatchingStatsGridProps {
    totalRecherches: number;
    totalMatches: number;
    className?: string;
}

export function MatchingStatsGrid({
    totalRecherches,
    totalMatches,
    className,
}: MatchingStatsGridProps) {
    const tauxMatching = totalRecherches > 0
        ? ((totalMatches / totalRecherches) * 100 / 10).toFixed(0)
        : 0;

    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
            <Card className="p-5 border-black/[0.08]">
                <p className="text-[13px] text-black/40 mb-1">Recherches actives</p>
                <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                    {totalRecherches}
                </p>
            </Card>
            <Card className="p-5 border-black/[0.08]">
                <p className="text-[13px] text-black/40 mb-1">Biens matchés</p>
                <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                    {totalMatches}
                </p>
            </Card>
            <Card className="p-5 border-black/[0.08]">
                <p className="text-[13px] text-black/40 mb-1">Taux de matching</p>
                <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                    {tauxMatching}%
                </p>
            </Card>
        </div>
    );
}
