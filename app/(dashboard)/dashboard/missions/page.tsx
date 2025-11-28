"use client";

import { MissionCard, MissionDialog } from "@/components/missions";
import { Button } from "@/components/ui/button";
import { DataStateRenderer } from "@/components/ui/data-state-renderer";
import { FilterBar } from "@/components/ui/filter-bar";
import { NoAccessState } from "@/components/ui/no-access-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatsGrid } from "@/components/ui/stats-grid";
import { useMissionsPage } from "@/hooks/use-missions-page";
import {
    formatDuree,
    STATUT_MISSION,
    STATUT_MISSION_LABELS,
} from "@/lib/types/mission";
import { Briefcase, Clock, FileText, Plus, TrendingUp } from "lucide-react";

export default function MissionsPage() {
    const {
        hasAccess,
        dialogOpen,
        setDialogOpen,
        filters,
        handleSearchChange,
        handleStatutChange,
        missions,
        isLoading,
        error,
        stats,
        clients,
        navigateToMission,
    } = useMissionsPage();

    if (!hasAccess) {
        return <NoAccessState icon={Briefcase} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Missions"
                description="Gérez vos missions de consulting et suivez le temps passé"
                actions={
                    <Button
                        onClick={() => setDialogOpen(true)}
                        className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle mission
                    </Button>
                }
            />

            {/* Stats */}
            {stats && (
                <StatsGrid
                    stats={[
                        {
                            icon: Briefcase,
                            label: "Missions totales",
                            value: stats.total,
                        },
                        {
                            icon: TrendingUp,
                            label: "En cours",
                            value: stats.enCours,
                        },
                        {
                            icon: FileText,
                            label: "À facturer",
                            value: stats.aFacturer,
                        },
                        {
                            icon: Clock,
                            label: "Heures non facturées",
                            value: formatDuree(stats.heuresNonFacturees),
                        },
                    ]}
                    columns={4}
                />
            )}

            {/* Filters */}
            <FilterBar
                filters={[
                    {
                        type: "search",
                        value: filters.search || "",
                        onChange: handleSearchChange,
                        placeholder: "Rechercher une mission...",
                        className: "flex-1 max-w-sm",
                    },
                    {
                        type: "select",
                        value: typeof filters.statut === "string" ? filters.statut : "ALL",
                        onChange: handleStatutChange,
                        placeholder: "Tous les statuts",
                        options: [
                            { value: "ALL", label: "Tous les statuts" },
                            ...STATUT_MISSION.map((statut) => ({
                                value: statut,
                                label: STATUT_MISSION_LABELS[statut],
                            })),
                        ],
                        className: "w-[180px]",
                    },
                ]}
            />

            {/* Mission list */}
            <DataStateRenderer
                isLoading={isLoading}
                error={error}
                data={missions}
                errorMessage="Erreur lors du chargement des missions"
                emptyState={{
                    icon: Briefcase,
                    title: "Aucune mission",
                    description:
                        filters.search || filters.statut
                            ? "Aucune mission ne correspond à vos critères"
                            : "Créez votre première mission pour commencer",
                    action:
                        !filters.search && !filters.statut ? (
                            <Button
                                onClick={() => setDialogOpen(true)}
                                className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Créer une mission
                            </Button>
                        ) : undefined,
                }}
            >
                {(data) => (
                    <div className="space-y-3">
                        {data.map((mission) => (
                            <MissionCard
                                key={mission.id}
                                mission={mission}
                                onClick={() => navigateToMission(mission.id)}
                            />
                        ))}
                    </div>
                )}
            </DataStateRenderer>

            {/* Create dialog */}
            <MissionDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                clients={clients}
            />
        </div>
    );
}
