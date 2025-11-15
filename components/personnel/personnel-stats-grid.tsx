/**
 * Grille de statistiques du personnel
 * Affiche les KPI principaux avec des cartes stat
 */

import { StatConfig, StatisticsGrid } from "@/components/ui/statistics-grid";
import { Clock, UserCheck, Users, UserX } from "lucide-react";

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
    const stats: StatConfig[] = [
        {
            id: "total",
            icon: Users,
            label: "Total employés",
            value: total,
            size: "md",
        },
        {
            id: "active",
            icon: UserCheck,
            label: "Actifs",
            value: active,
            size: "md",
        },
        {
            id: "invited",
            icon: Clock,
            label: "Invités",
            value: invited,
            size: "md",
        },
        {
            id: "inactive",
            icon: UserX,
            label: "Inactifs",
            value: inactive,
            size: "md",
        },
    ];

    return <StatisticsGrid stats={stats} columns={{ md: 4 }} gap={4} />;
}
