import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface AGStatsGridProps {
    aVenirCount: number;
    termineesCount: number;
    prochaineDate: number | null;
    totalYear: number;
    className?: string;
}

export function AGStatsGrid({
    aVenirCount,
    termineesCount,
    prochaineDate,
    totalYear,
    className,
}: AGStatsGridProps) {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-4", className)}>
            <Card className="p-5 border-black/[0.08]">
                <p className="text-[13px] text-black/40 mb-1">AG à venir</p>
                <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                    {aVenirCount}
                </p>
            </Card>
            <Card className="p-5 border-black/[0.08]">
                <p className="text-[13px] text-black/40 mb-1">AG terminées</p>
                <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                    {termineesCount}
                </p>
            </Card>
            <Card className="p-5 border-black/[0.08]">
                <p className="text-[13px] text-black/40 mb-1">Prochaine AG</p>
                <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                    {prochaineDate !== null ? `${prochaineDate}j` : "-"}
                </p>
            </Card>
            <Card className="p-5 border-black/[0.08]">
                <p className="text-[13px] text-black/40 mb-1">Total cette année</p>
                <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                    {totalYear}
                </p>
            </Card>
        </div>
    );
}
