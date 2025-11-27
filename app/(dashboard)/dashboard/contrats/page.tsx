"use client";

import { ContratDialog } from "@/components/contrats/contrat-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/ui/filter-bar";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useContrats, useContratStats } from "@/hooks/use-contrats";
import {
    STATUT_CONTRAT_LABELS,
    TYPE_CONTRAT_LABELS,
    type StatutContrat,
    type TypeContratEntretien,
} from "@/lib/types/contrats";
import {
    AlertCircle,
    Calendar,
    FileText,
    Plus,
    TrendingUp,
} from "lucide-react";
import { useState } from "react";

export default function ContratsPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statutFilter, setStatutFilter] = useState<StatutContrat | "ALL">(
        "ALL"
    );
    const [typeFilter, setTypeFilter] = useState<TypeContratEntretien | "ALL">(
        "ALL"
    );
    const [searchInput, setSearchInput] = useState("");

    const { data: contrats = [], isLoading } = useContrats({
        statut: statutFilter,
        type: typeFilter,
        search: searchQuery,
    });

    const { data: stats } = useContratStats();

    const handleSearch = () => {
        setSearchQuery(searchInput);
    };

    const getStatutBadgeColor = (statut: StatutContrat) => {
        const colors = {
            ACTIF: "bg-green-100 text-green-800",
            EXPIRE: "bg-red-100 text-red-800",
            RESILIE: "bg-gray-100 text-gray-800",
            EN_ATTENTE: "bg-yellow-100 text-yellow-800",
            SUSPENDU: "bg-orange-100 text-orange-800",
        };
        return colors[statut];
    };

    const isRevisionProche = (prochaineRevision: string | null | undefined) => {
        if (!prochaineRevision) return false;
        const diff =
            new Date(prochaineRevision).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days <= 30 && days >= 0;
    };

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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        icon={FileText}
                        label="Total contrats"
                        value={stats?.total || 0}
                        description="contrats signés"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Contrats actifs"
                        value={stats?.actifs || 0}
                        description="en cours"
                    />
                    <StatCard
                        icon={Calendar}
                        label="Révisions ce mois"
                        value={stats?.revisionsDuMois || 0}
                        description="à planifier"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="MRR"
                        value={`${(stats?.revenusRecurrents || 0).toFixed(0)}€`}
                        description="revenus mensuels"
                    />
                </div>

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
                            <div
                                key={contrat.id}
                                className="p-5 rounded-xl bg-white border border-black/8 shadow-sm hover:border-black/20 hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-[16px] font-semibold text-black">
                                                {contrat.numero} - {contrat.nom}
                                            </h3>
                                            <span
                                                className={`px-3 py-1 rounded-lg text-[12px] font-medium ${getStatutBadgeColor(contrat.statut)}`}
                                            >
                                                {
                                                    STATUT_CONTRAT_LABELS[
                                                        contrat.statut
                                                    ]
                                                }
                                            </span>
                                            {isRevisionProche(
                                                contrat.prochaineRevision
                                            ) && (
                                                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-orange-100 text-orange-800 border border-orange-200 flex items-center gap-1">
                                                    <AlertCircle
                                                        className="w-3 h-3"
                                                        strokeWidth={2}
                                                    />
                                                    Révision proche
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[13px] text-black/60">
                                                {contrat.client?.prenom}{" "}
                                                {contrat.client?.nom}
                                            </span>
                                            <span className="text-[13px] text-black/30">
                                                •
                                            </span>
                                            <span className="text-[13px] text-black/60">
                                                {
                                                    TYPE_CONTRAT_LABELS[
                                                        contrat.typeContrat
                                                    ]
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[20px] font-bold text-black mb-1">
                                            {Number(contrat.montantTTC).toFixed(
                                                2
                                            )}
                                            €
                                        </p>
                                        <p className="text-[12px] text-black/40">
                                            par an
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-[13px] text-black/50">
                                    <div className="flex items-center gap-4">
                                        <span>
                                            Début:{" "}
                                            {new Date(
                                                contrat.dateDebut
                                            ).toLocaleDateString("fr-FR")}
                                        </span>
                                        <span>
                                            Fin:{" "}
                                            {new Date(
                                                contrat.dateFin
                                            ).toLocaleDateString("fr-FR")}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span>
                                            Interventions:{" "}
                                            {contrat.interventionsUtilisees}/
                                            {contrat.interventionsIncluses}
                                        </span>
                                        <span>
                                            {contrat.nombreRevisionsAn}{" "}
                                            révision(s)/an
                                        </span>
                                    </div>
                                </div>
                            </div>
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
