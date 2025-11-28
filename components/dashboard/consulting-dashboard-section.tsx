"use client";

import {
    ConsultingStatsCards,
    RecentMissionsList,
    RecentTimeEntries,
} from "@/components/consulting";
import { EcheancesWidget } from "@/components/dashboard/echeances-widget";
import { TimerWidget } from "@/components/temps";
import { useCapabilities } from "@/hooks/use-capabilities";
import { useMissions } from "@/hooks/use-missions";
import { useTemps, useTempsStats } from "@/hooks/use-temps";
import { Loader2 } from "lucide-react";

export interface ConsultingDashboardSectionProps {
    period?: number;
}

export function ConsultingDashboardSection({
    period = 30,
}: ConsultingDashboardSectionProps) {
    const { businessType } = useCapabilities();
    const isComptabilite = businessType === "COMPTABILITE";

    // Fetch consulting data
    const { data: stats, isLoading: statsLoading } = useTempsStats(period);
    const { data: missions = [], isLoading: missionsLoading } = useMissions({
        statut: ["EN_COURS", "VALIDEE", "LIVREE"] as any,
    });
    const { data: recentEntries = [], isLoading: entriesLoading } = useTemps(
        {}
    );

    const isLoading = statsLoading || missionsLoading || entriesLoading;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-black/20" />
                </div>
            </div>
        );
    }

    // Filter active missions for timer
    const activeMissions = missions.filter(
        (m) => m.statut === "EN_COURS" || m.statut === "VALIDEE"
    );

    return (
        <div className="space-y-6">
            {/* Échéances Widget - Only for COMPTABILITE */}
            {isComptabilite && <EcheancesWidget />}

            {/* Timer Widget */}
            <TimerWidget missions={activeMissions} />

            {/* Consulting Stats */}
            {stats && <ConsultingStatsCards stats={stats} />}

            {/* Missions and Time Entries */}
            <div className="grid gap-5 lg:grid-cols-2">
                <RecentMissionsList missions={missions} />
                <RecentTimeEntries entries={recentEntries} />
            </div>
        </div>
    );
}
