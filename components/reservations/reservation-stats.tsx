import { StatConfig, StatisticsGrid } from "@/components/ui/statistics-grid";
import { ReservationStats as ReservationStatsType } from "@/lib/types/reservation";
import { Calendar, CheckCircle2, Clock, Users } from "lucide-react";

export interface ReservationStatsProps {
    stats: ReservationStatsType;
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
