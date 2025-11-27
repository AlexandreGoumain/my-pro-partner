"use client";

import { InterventionDialog } from "@/components/interventions/intervention-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/ui/filter-bar";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useCapabilities } from "@/hooks/use-capabilities";
import {
    useInterventions,
    useInterventionStats,
    type InterventionFilters,
} from "@/hooks/use-interventions";
import { BUSINESS_TYPE_CONFIGS } from "@/lib/config/business-hierarchy.config";
import {
    INTERVENTIONS_PAR_METIER,
    PRIORITE_LABELS,
    STATUT_LABELS,
    TYPE_INTERVENTION_ICONS,
    TYPE_INTERVENTION_LABELS,
    type PrioriteIntervention,
    type StatutIntervention,
    type TypeIntervention,
} from "@/lib/types/intervention";
import { AlertCircle, ClipboardList, Clock, MapPin, Plus } from "lucide-react";
import { useMemo, useState } from "react";

export default function InterventionsPage() {
    const { businessType } = useCapabilities();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statutFilter, setStatutFilter] = useState<
        StatutIntervention | "ALL"
    >("ALL");
    const [prioriteFilter, setPrioriteFilter] = useState<
        PrioriteIntervention | "ALL"
    >("ALL");
    const [typeFilter, setTypeFilter] = useState<TypeIntervention | "ALL">(
        "ALL"
    );

    // Get business config for dynamic labels
    const businessConfig = BUSINESS_TYPE_CONFIGS[businessType];
    const businessLabel = businessConfig?.label || "Intervention";

    // Get filtered intervention types for this business
    const availableInterventionTypes = useMemo(() => {
        return (
            INTERVENTIONS_PAR_METIER[
                businessType as keyof typeof INTERVENTIONS_PAR_METIER
            ] || Object.keys(TYPE_INTERVENTION_LABELS)
        );
    }, [businessType]);

    // Build filters object
    const filters: InterventionFilters = useMemo(
        () => ({
            statut: statutFilter,
            priorite: prioriteFilter,
            type: typeFilter,
            search: searchQuery || undefined,
        }),
        [statutFilter, prioriteFilter, typeFilter, searchQuery]
    );

    // Fetch data with TanStack Query
    const { data: interventions = [], isLoading } = useInterventions(filters);
    const { data: stats } = useInterventionStats();

    const getPriorityBadgeColor = (priorite: PrioriteIntervention) => {
        switch (priorite) {
            case "CRITIQUE":
                return "bg-red-100 text-red-800 border-red-200";
            case "URGENTE":
                return "bg-orange-100 text-orange-800 border-orange-200";
            case "NORMALE":
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatutBadgeColor = (statut: StatutIntervention) => {
        switch (statut) {
            case "DEMANDE":
                return "bg-blue-100 text-blue-800";
            case "PLANIFIEE":
                return "bg-purple-100 text-purple-800";
            case "EN_ROUTE":
                return "bg-yellow-100 text-yellow-800";
            case "SUR_PLACE":
                return "bg-cyan-100 text-cyan-800";
            case "EN_COURS":
                return "bg-orange-100 text-orange-800";
            case "TERMINEE":
                return "bg-green-100 text-green-800";
            case "FACTUREE":
                return "bg-emerald-100 text-emerald-800";
            case "ANNULEE":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

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
                                        label,
                                    })
                                ),
                            ],
                        },
                        {
                            type: "action",
                            label: "Réinitialiser",
                            onClick: () => {
                                setSearchQuery("");
                                setTypeFilter("ALL");
                                setPrioriteFilter("ALL");
                                setStatutFilter("ALL");
                            },
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
                            <div
                                key={intervention.id}
                                className="p-5 rounded-xl bg-white border border-black/8 shadow-sm hover:border-black/20 hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="text-[24px]">
                                            {
                                                TYPE_INTERVENTION_ICONS[
                                                    intervention
                                                        .typeIntervention
                                                ]
                                            }
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-[16px] font-semibold text-black">
                                                    {intervention.numero}
                                                </h3>
                                                <span
                                                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${getPriorityBadgeColor(intervention.priorite)}`}
                                                >
                                                    {
                                                        PRIORITE_LABELS[
                                                            intervention
                                                                .priorite
                                                        ]
                                                    }
                                                </span>
                                            </div>
                                            <p className="text-[13px] text-black/60 mt-0.5">
                                                {intervention.client.prenom}{" "}
                                                {intervention.client.nom}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-lg text-[12px] font-medium ${getStatutBadgeColor(intervention.statut)}`}
                                    >
                                        {STATUT_LABELS[intervention.statut]}
                                    </span>
                                </div>

                                <p className="text-[14px] text-black/70 mb-3 line-clamp-2">
                                    {intervention.description}
                                </p>

                                <div className="flex items-center justify-between text-[13px] text-black/50">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin
                                                className="w-3.5 h-3.5"
                                                strokeWidth={2}
                                            />
                                            <span>{intervention.ville}</span>
                                        </div>
                                        {intervention.plombier && (
                                            <div className="flex items-center gap-1.5">
                                                <span>👤</span>
                                                <span>
                                                    {intervention.plombier.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {intervention.datePrevisionnelle && (
                                            <span>
                                                {new Date(
                                                    intervention.datePrevisionnelle
                                                ).toLocaleDateString("fr-FR")}
                                            </span>
                                        )}
                                        <span className="font-semibold text-black">
                                            {intervention.coutTotal.toFixed(2)}{" "}
                                            €
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Intervention Dialog */}
                <InterventionDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSuccess={() => setDialogOpen(false)}
                />
            </div>
        </RouteGuard>
    );
}
