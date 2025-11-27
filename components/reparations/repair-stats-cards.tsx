"use client";

import { StatCard } from "@/components/ui/stat-card";
import { AlertCircle, CheckCircle2, Clock, Wrench } from "lucide-react";

interface RepairStatsCardsProps {
    stats: {
        totalReparations: number;
        enCours: number;
        pretes: number;
        enRetard: number;
    };
}

export function RepairStatsCards({ stats }: RepairStatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                icon={Wrench}
                label="Total"
                value={stats.totalReparations}
                description="Réparations"
            />
            <StatCard
                icon={Clock}
                label="En cours"
                value={stats.enCours}
                description="En traitement"
            />
            <StatCard
                icon={CheckCircle2}
                label="Prêtes"
                value={stats.pretes}
                description="À récupérer"
            />
            <StatCard
                icon={AlertCircle}
                label="En retard"
                value={stats.enRetard}
                description="Dépassé le délai"
                badge={
                    stats.enRetard > 0
                        ? {
                              text: "Action requise",
                              className: "bg-red-100 text-red-700",
                          }
                        : undefined
                }
            />
        </div>
    );
}
