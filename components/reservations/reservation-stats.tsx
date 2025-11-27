import { StatConfig, StatisticsGrid } from "@/components/ui/statistics-grid";
import { Calendar, CheckCircle2, Clock, Users } from "lucide-react";

// Simple stats interface for display
export interface SimpleReservationStats {
    total: number;
    confirmees: number;
    enAttente: number;
    couverts: number;
}

export interface ReservationStatsProps {
    stats: SimpleReservationStats;
}

export function ReservationStats({ stats }: ReservationStatsProps) {
    const statsConfig: StatConfig[] = [
        {
            id: "total",
            icon: Calendar,
            label: "Total réservations",
            value: stats.total,
        },
        {
            id: "confirmees",
            icon: CheckCircle2,
            label: "Confirmées",
            value: stats.confirmees,
        },
        {
            id: "enAttente",
            icon: Clock,
            label: "En attente",
            value: stats.enAttente,
        },
        {
            id: "couverts",
            icon: Users,
            label: "Couverts",
            value: stats.couverts,
        },
    ];

    return <StatisticsGrid stats={statsConfig} columns={{ md: 4 }} gap={4} />;
}
