import { StatCard } from "@/components/ui/stat-card";
import { Calendar, CheckCircle2, Clock, Users } from "lucide-react";
import { ReservationStats as ReservationStatsType } from "@/lib/types/reservation";

export interface ReservationStatsProps {
    stats: ReservationStatsType;
}

export function ReservationStats({ stats }: ReservationStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
                icon={Calendar}
                label="Total réservations"
                value={stats.total}
            />
            <StatCard
                icon={CheckCircle2}
                label="Confirmées"
                value={stats.confirmees}
            />
            <StatCard
                icon={Clock}
                label="En attente"
                value={stats.enAttente}
            />
            <StatCard
                icon={Users}
                label="Couverts"
                value={stats.couverts}
            />
        </div>
    );
}
