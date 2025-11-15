import { StatConfig, StatisticsGrid } from "@/components/ui/statistics-grid";
import { CircleCheckBig, CircleDashed, Clock, LayoutGrid } from "lucide-react";

export interface TableStatsGridProps {
    total: number;
    libres: number;
    occupees: number;
    reservees: number;
}

export function TableStatsGrid({
    total,
    libres,
    occupees,
    reservees,
}: TableStatsGridProps) {
    const stats: StatConfig[] = [
        {
            id: "total",
            icon: LayoutGrid,
            label: "Total tables",
            value: total,
            size: "md",
        },
        {
            id: "libres",
            icon: CircleCheckBig,
            label: "Libres",
            value: libres,
            size: "md",
        },
        {
            id: "occupees",
            icon: CircleDashed,
            label: "Occupées",
            value: occupees,
            size: "md",
        },
        {
            id: "reservees",
            icon: Clock,
            label: "Réservées",
            value: reservees,
            size: "md",
        },
    ];

    return <StatisticsGrid stats={stats} columns={{ md: 4 }} gap={4} />;
}
