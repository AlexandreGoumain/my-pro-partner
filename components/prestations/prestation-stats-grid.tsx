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
                    title: "Total prestations",
                    value: stats.total,
                    icon: Scissors,
                },
                {
                    title: "Actives",
                    value: stats.actives,
                    icon: CheckCircle,
                },
                {
                    title: "Inactives",
                    value: stats.inactives,
                    icon: XCircle,
                },
                {
                    title: "Catégories",
                    value: stats.categories,
                    icon: FolderOpen,
                },
            ]}
        />
    );
}
