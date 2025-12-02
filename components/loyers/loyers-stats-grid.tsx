import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface LoyersStatsGridProps {
    totalAppels: number;
    totalMontant: number;
    tauxEncaissement: string;
    impayesCount: number;
    className?: string;
}

export function LoyersStatsGrid({
    totalAppels,
    totalMontant,
    tauxEncaissement,
    impayesCount,
    className,
}: LoyersStatsGridProps) {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-4", className)}>
            <Card className="p-5 border-black/[0.08]">
                <p className="text-[13px] text-black/40 mb-1">Appels du mois</p>
                <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                    {totalAppels}
                </p>
            </Card>
            <Card className="p-5 border-black/[0.08]">
                <p className="text-[13px] text-black/40 mb-1">Montant attendu</p>
                <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                    {totalMontant.toLocaleString("fr-FR")} €
                </p>
            </Card>
            <Card className="p-5 border-black/[0.08]">
                <p className="text-[13px] text-black/40 mb-1">Taux encaissement</p>
                <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                    {tauxEncaissement}%
                </p>
            </Card>
            <Card className="p-5 border-black/[0.08]">
                <p className="text-[13px] text-black/40 mb-1">Impayés / Partiels</p>
                <p className={cn(
                    "text-[28px] font-bold tracking-[-0.02em]",
                    impayesCount > 0 ? "text-red-600" : "text-black"
                )}>
                    {impayesCount}
                </p>
            </Card>
        </div>
    );
}
