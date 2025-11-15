import { StatConfig, StatisticsGrid } from "@/components/ui/statistics-grid";
import { CheckCircle2, CreditCard, Store, XCircle } from "lucide-react";

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
    const stats: StatConfig[] = [
        {
            id: "total",
            icon: Store,
            label: "Total magasins",
            value: total,
            size: "sm",
        },
        {
            id: "active",
            icon: CheckCircle2,
            label: "Actifs",
            value: active,
            size: "sm",
        },
        {
            id: "inactive",
            icon: XCircle,
            label: "Inactifs",
            value: inactive,
            size: "sm",
        },
        {
            id: "registers",
            icon: CreditCard,
            label: "Total caisses",
            value: totalRegisters,
            size: "sm",
        },
    ];

    return <StatisticsGrid stats={stats} columns={{ md: 2, lg: 4 }} gap={4} />;
}
