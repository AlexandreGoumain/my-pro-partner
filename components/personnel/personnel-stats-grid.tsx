/**
 * Grille de statistiques du personnel
 * Affiche les KPI principaux avec des cartes stat
 */

import { StatCard } from "@/components/ui/stat-card";
import { Users, UserCheck, Clock, UserX } from "lucide-react";

export interface PersonnelStatsGridProps {
    total: number;
    active: number;
    invited: number;
    inactive: number;
}

export function PersonnelStatsGrid({
    total,
    active,
    invited,
    inactive,
}: PersonnelStatsGridProps) {
    return (
        <div className="grid gap-4 md:grid-cols-4">
            <StatCard
                icon={Users}
                label="Total employés"
                value={total}
                size="md"
            />
            <StatCard
                icon={UserCheck}
                label="Actifs"
                value={active}
                size="md"
            />
            <StatCard
                icon={Clock}
                label="Invités"
                value={invited}
                size="md"
            />
            <StatCard
                icon={UserX}
                label="Inactifs"
                value={inactive}
                size="md"
            />
        </div>
    );
}
