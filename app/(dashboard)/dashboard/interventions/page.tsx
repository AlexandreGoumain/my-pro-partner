"use client";

import { InterventionCard, InterventionDialog } from "@/components/interventions";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/ui/filter-bar";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useInterventionsPage } from "@/hooks/use-interventions-page";
import {
    PRIORITE_LABELS,
    STATUT_LABELS,
    TYPE_INTERVENTION_LABELS,
    type PrioriteIntervention,
    type StatutIntervention,
    type TypeIntervention,
} from "@/lib/types/intervention";
import { AlertCircle, ClipboardList, Clock, MapPin, Plus } from "lucide-react";

export default function InterventionsPage() {
    const {
        dialogOpen,
        setDialogOpen,
        handleDialogSuccess,
        searchQuery,
        setSearchQuery,
        statutFilter,
        setStatutFilter,
        prioriteFilter,
        setPrioriteFilter,
        typeFilter,
        setTypeFilter,
        handleResetFilters,
        interventions,
        isLoading,
        stats,
        businessLabel,
        availableInterventionTypes,
        getPriorityBadgeColor,
        getStatutBadgeColor,
    } = useInterventionsPage();

    return (
        <RouteGuard anyCapability={["domicile", "atelier"]}>
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Interventions"
                    description={`Gestion des interventions ${businessLabel.toLowerCase()}`}
                    actions={
                        <PrimaryActionButton
                            onClick={() => setDialogOpen(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Nouvelle intervention
                        </PrimaryActionButton>
                    }
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        icon={ClipboardList}
                        label="Total"
                        value={stats?.total ?? 0}
                        description="interventions"
                    />
                    <StatCard
                        icon={Clock}
                        label="En cours"
                        value={stats?.enCours ?? 0}
                        description="interventions actives"
                    />
                    <StatCard
                        icon={AlertCircle}
                        label="Urgentes"
                        value={stats?.urgentes ?? 0}
                        description="nécessitent attention"
                    />
                    <StatCard
                        icon={MapPin}
                        label="En retard"
                        value={stats?.enRetard ?? 0}
                        description="dépassent l'échéance"
                    />
                </div>

                {/* Filters */}
                <FilterBar
                    filters={[
                        {
                            type: "search",
                            value: searchQuery,
                            onChange: setSearchQuery,
                            placeholder:
                                "Rechercher par client, adresse, numéro...",
                            className: "flex-1",
                        },
                        {
                            type: "select",
                            value: typeFilter,
                            onChange: (value) =>
                                setTypeFilter(
                                    value as TypeIntervention | "ALL"
                                ),
                            placeholder: "Type",
                            className: "w-[180px]",
                            options: [
                                { value: "ALL", label: "Tous les types" },
                                ...availableInterventionTypes.map((type) => ({
                                    value: type,
                                    label: TYPE_INTERVENTION_LABELS[
                                        type as TypeIntervention
                                    ],
                                })),
                            ],
                        },
                        {
                            type: "select",
                            value: prioriteFilter,
                            onChange: (value) =>
                                setPrioriteFilter(
                                    value as PrioriteIntervention | "ALL"
                                ),
                            placeholder: "Priorité",
                            className: "w-[180px]",
                            options: [
                                { value: "ALL", label: "Toutes priorités" },
                                ...Object.entries(PRIORITE_LABELS).map(
                                    ([value, label]) => ({
                                        value,
                                        label,
                                    })
                                ),
                            ],
                        },
                        {
                            type: "select",
                            value: statutFilter,
                            onChange: (value) =>
                                setStatutFilter(
                                    value as StatutIntervention | "ALL"
                                ),
                            placeholder: "Statut",
                            options: [
                                { value: "ALL", label: "Tous les statuts" },
                                ...Object.entries(STATUT_LABELS).map(
                                    ([value, label]) => ({
                                        value,
                                        label: label as string,
                                    })
                                ),
                            ],
                        },
                        {
                            type: "action",
                            label: "Réinitialiser",
                            onClick: handleResetFilters,
                            variant: "outline",
                            className: "border-black/10 hover:bg-black/5",
                        },
                    ]}
                />

                {/* Interventions List */}
                <div className="space-y-3">
                    {isLoading ? (
                        <GridSkeleton
                            itemCount={5}
                            gridColumns={{ default: 1 }}
                            gap={3}
                            itemHeight="h-[140px]"
                        />
                    ) : interventions.length === 0 ? (
                        <EmptyState
                            icon={ClipboardList}
                            title="Aucune intervention"
                            description="Créez votre première intervention"
                            action={{
                                label: "Nouvelle intervention",
                                onClick: () => setDialogOpen(true),
                                icon: Plus,
                            }}
                            variant="dashed"
                        />
                    ) : (
                        interventions.map((intervention) => (
                            <InterventionCard
                                key={intervention.id}
                                intervention={intervention}
                                getPriorityBadgeColor={getPriorityBadgeColor}
                                getStatutBadgeColor={getStatutBadgeColor}
                            />
                        ))
                    )}
                </div>

                {/* Intervention Dialog */}
                <InterventionDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSuccess={handleDialogSuccess}
                />
            </div>
        </RouteGuard>
    );
}
