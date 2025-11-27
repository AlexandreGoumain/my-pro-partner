"use client";

import { StatsGrid } from "@/components/ui/stats-grid";
import { UserCheck, Users, UserX } from "lucide-react";

interface EmployeStatsGridProps {
    stats: {
        total: number;
        actifs: number;
        inactifs: number;
    };
}

export function EmployeStatsGrid({ stats }: EmployeStatsGridProps) {
    return (
        <StatsGrid
            stats={[
                {
                    label: "Total employés",
                    value: stats.total,
                    icon: Users,
                },
                {
                    label: "Actifs",
                    value: stats.actifs,
                    icon: UserCheck,
                },
                {
                    label: "Inactifs",
                    value: stats.inactifs,
                    icon: UserX,
                },
            ]}
        />
    );
}
