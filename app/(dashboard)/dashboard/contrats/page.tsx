"use client";

import { ContratCard } from "@/components/contrats/contrat-card";
import { ContratDialog } from "@/components/contrats/contrat-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/ui/filter-bar";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
import { StatsGrid } from "@/components/ui/stats-grid";
import { useContratsPage } from "@/hooks/use-contrats-page";
import {
    STATUT_CONTRAT_LABELS,
    TYPE_CONTRAT_LABELS,
    type StatutContrat,
    type TypeContratEntretien,
} from "@/lib/types/contrats";
import { Calendar, FileText, Plus, TrendingUp } from "lucide-react";

export default function ContratsPage() {
    const {
        dialogOpen,
        setDialogOpen,
        searchInput,
        setSearchInput,
        handleSearch,
        statutFilter,
        setStatutFilter,
        typeFilter,
        setTypeFilter,
        contrats,
        isLoading,
        stats,
    } = useContratsPage();

    return (
        <RouteGuard capability="contrats">
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Contrats d'Entretien"
                    description="Gestion des contrats récurrents et maintenances"
                    actions={
                        <PrimaryActionButton
                            onClick={() => setDialogOpen(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Nouveau contrat
                        </PrimaryActionButton>
                    }
                />

                {/* Stats Cards */}
                <StatsGrid
                    stats={[
                        {
                            icon: FileText,
                            label: "Total contrats",
                            value: stats?.total || 0,
                            description: "contrats signés",
                        },
                        {
                            icon: TrendingUp,
                            label: "Contrats actifs",
                            value: stats?.actifs || 0,
                            description: "en cours",
                        },
                        {
                            icon: Calendar,
                            label: "Révisions ce mois",
                            value: stats?.revisionsDuMois || 0,
                            description: "à planifier",
                        },
                        {
                            icon: TrendingUp,
                            label: "MRR",
                            value: `${(stats?.revenusRecurrents || 0).toFixed(0)}€`,
                            description: "revenus mensuels",
                        },
                    ]}
                    columns={4}
                />

                {/* Filters */}
                <FilterBar
                    filters={[
                        {
                            type: "search",
                            value: searchInput,
                            onChange: setSearchInput,
                            placeholder: "Rechercher par client, numéro...",
                            className: "flex-1 max-w-none",
                        },
                        {
                            type: "select",
                            value: typeFilter,
                            onChange: (value) =>
                                setTypeFilter(
                                    value as TypeContratEntretien | "ALL"
                                ),
                            placeholder: "Type",
                            options: [
                                { value: "ALL", label: "Tous les types" },
                                ...Object.entries(TYPE_CONTRAT_LABELS).map(
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
                                setStatutFilter(value as StatutContrat | "ALL"),
                            placeholder: "Statut",
                            className: "w-[180px]",
                            options: [
                                { value: "ALL", label: "Tous les statuts" },
                                ...Object.entries(STATUT_CONTRAT_LABELS).map(
                                    ([value, label]) => ({
                                        value,
                                        label,
                                    })
                                ),
                            ],
                        },
                        {
                            type: "action",
                            label: "Filtrer",
                            onClick: handleSearch,
                            variant: "outline",
                            className: "border-black/10 hover:bg-black/5",
                        },
                    ]}
                />

                {/* Contrats List */}
                <div className="space-y-3">
                    {isLoading ? (
                        <GridSkeleton
                            itemCount={5}
                            gridColumns={{ default: 1 }}
                            gap={3}
                            itemHeight="h-[140px]"
                        />
                    ) : contrats.length === 0 ? (
                        <EmptyState
                            icon={FileText}
                            title="Aucun contrat"
                            description="Créez votre premier contrat d'entretien"
                            action={{
                                label: "Nouveau contrat",
                                onClick: () => setDialogOpen(true),
                                icon: Plus,
                            }}
                            variant="dashed"
                        />
                    ) : (
                        contrats.map((contrat) => (
                            <ContratCard key={contrat.id} contrat={contrat} />
                        ))
                    )}
                </div>

                {/* Create Dialog */}
                <ContratDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSuccess={() => setDialogOpen(false)}
                />
            </div>
        </RouteGuard>
    );
}
