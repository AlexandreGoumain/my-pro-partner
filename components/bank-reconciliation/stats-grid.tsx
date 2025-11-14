import { Card } from "@/components/ui/card";
import type { BankReconciliationStats } from "@/lib/types/bank-reconciliation";
import { cn } from "@/lib/utils";

export interface StatsGridProps {
    stats: BankReconciliationStats | null;
    className?: string;
}

/**
 * Grille de statistiques pour le rapprochement bancaire
 * Note: Utilise des couleurs vives (vert/orange/rouge) pour indiquer les statuts
 * contrairement au style Apple minimal, mais nécessaire pour la clarté des statuts bancaires
 */
export function StatsGrid({ stats, className }: StatsGridProps) {
    if (!stats) return null;

    return (
        <div className={cn("grid gap-4 md:grid-cols-5", className)}>
            <Card className="p-4 border-black/8">
                <div className="text-[13px] text-black/60 mb-1">Total</div>
                <div className="text-[24px] font-semibold text-black">
                    {stats.total}
                </div>
            </Card>
            <Card className="p-4 border-black/8">
                <div className="text-[13px] text-black/60 mb-1">Rapprochés</div>
                <div className="text-[24px] font-semibold text-green-600">
                    {stats.matched}
                </div>
            </Card>
            <Card className="p-4 border-black/8">
                <div className="text-[13px] text-black/60 mb-1">En attente</div>
                <div className="text-[24px] font-semibold text-orange-600">
                    {stats.pending}
                </div>
            </Card>
            <Card className="p-4 border-black/8">
                <div className="text-[13px] text-black/60 mb-1">Anomalies</div>
                <div className="text-[24px] font-semibold text-red-600">
                    {stats.anomalies}
                </div>
            </Card>
            <Card className="p-4 border-black/8">
                <div className="text-[13px] text-black/60 mb-1">
                    Taux de matching
                </div>
                <div className="text-[24px] font-semibold text-black">
                    {stats.matchRate}%
                </div>
            </Card>
        </div>
    );
}
