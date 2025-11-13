import { StatCard } from "@/components/ui/stat-card";
import { Store, CheckCircle2, XCircle, CreditCard } from "lucide-react";

export interface StoreStatsGridProps {
    total: number;
    active: number;
    inactive: number;
    totalRegisters: number;
}

export function StoreStatsGrid({
    total,
    active,
    inactive,
    totalRegisters,
}: StoreStatsGridProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                icon={Store}
                label="Total magasins"
                value={total}
                size="sm"
            />
            <StatCard
                icon={CheckCircle2}
                label="Actifs"
                value={active}
                size="sm"
            />
            <StatCard
                icon={XCircle}
                label="Inactifs"
                value={inactive}
                size="sm"
            />
            <StatCard
                icon={CreditCard}
                label="Total caisses"
                value={totalRegisters}
                size="sm"
            />
        </div>
    );
}
