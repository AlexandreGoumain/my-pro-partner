"use client";

import { StatsGrid } from "@/components/ui/stats-grid";
import { CheckCircle, FolderOpen, Scissors, XCircle } from "lucide-react";

interface PrestationStatsGridProps {
    stats: {
        total: number;
        actives: number;
        inactives: number;
        categories: number;
    };
}

export function PrestationStatsGrid({ stats }: PrestationStatsGridProps) {
    return (
        <StatsGrid
            stats={[
                {
                    label: "Total prestations",
                    value: stats.total,
                    icon: Scissors,
                },
                {
                    label: "Actives",
                    value: stats.actives,
                    icon: CheckCircle,
                },
                {
                    label: "Inactives",
                    value: stats.inactives,
                    icon: XCircle,
                },
                {
                    label: "Catégories",
                    value: stats.categories,
                    icon: FolderOpen,
                },
            ]}
        />
    );
}
