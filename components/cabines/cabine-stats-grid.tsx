"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { StatCardProps } from "@/components/ui/stat-card";
import { StatsGrid } from "@/components/ui/stats-grid";
import type { Cabine } from "@/hooks/use-cabines";
import { CheckCircle, DoorOpen, Users, XCircle } from "lucide-react";

interface CabineStatsGridProps {
    cabines: Cabine[];
    isLoading?: boolean;
}

export function CabineStatsGrid({ cabines, isLoading }: CabineStatsGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[130px] rounded-xl" />
                ))}
            </div>
        );
    }

    const totalCabines = cabines.length;
    const cabinesActives = cabines.filter((c) => c.actif).length;
    const cabinesInactives = totalCabines - cabinesActives;
    const capaciteTotale = cabines
        .filter((c) => c.actif)
        .reduce((sum, c) => sum + c.capacite, 0);

    const stats: StatCardProps[] = [
        {
            label: "Total cabines",
            value: totalCabines,
            icon: DoorOpen,
        },
        {
            label: "Actives",
            value: cabinesActives,
            icon: CheckCircle,
        },
        {
            label: "Inactives",
            value: cabinesInactives,
            icon: XCircle,
        },
        {
            label: "Capacité totale",
            value: `${capaciteTotale} pers.`,
            icon: Users,
        },
    ];

    return <StatsGrid stats={stats} />;
}
