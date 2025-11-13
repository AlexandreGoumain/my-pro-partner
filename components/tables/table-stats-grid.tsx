import { LayoutGrid, CircleCheckBig, CircleDashed, Clock } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";

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
    return (
        <div className="grid gap-4 md:grid-cols-4">
            <StatCard
                icon={LayoutGrid}
                label="Total tables"
                value={total}
                size="md"
            />
            <StatCard
                icon={CircleCheckBig}
                label="Libres"
                value={libres}
                size="md"
            />
            <StatCard
                icon={CircleDashed}
                label="Occupées"
                value={occupees}
                size="md"
            />
            <StatCard
                icon={Clock}
                label="Réservées"
                value={reservees}
                size="md"
            />
        </div>
    );
}
