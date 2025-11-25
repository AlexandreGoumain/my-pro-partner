"use client";

import { InterventionDialog } from "@/components/interventions/intervention-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RouteGuard } from "@/components/ui/route-guard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useInterventions,
    useInterventionStats,
    type InterventionFilters,
} from "@/hooks/use-interventions";
import {
    PRIORITE_LABELS,
    STATUT_LABELS,
    TYPE_INTERVENTION_ICONS,
    TYPE_INTERVENTION_LABELS,
    type PrioriteIntervention,
    type StatutIntervention,
    type TypeIntervention,
} from "@/lib/types/intervention";
import { AlertCircle, Clock, Filter, MapPin, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function InterventionsPage() {
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
        <RouteGuard capability="domicile">
            <div className="flex-1 space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                            Interventions
                        </h1>
                        <p className="text-[14px] text-black/40 mt-1">
                            Gestion des interventions plomberie
                        </p>
                    </div>
                    <Button
                        onClick={() => setDialogOpen(true)}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                        Nouvelle intervention
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-5 rounded-xl bg-white border border-black/8 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-medium text-black/40 uppercase tracking-wide">
                                Total
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center">
                                <span className="text-[16px]">📋</span>
                            </div>
                        </div>
                        <p className="text-[32px] font-bold text-black tracking-tight">
                            {stats?.total ?? 0}
                        </p>
                        <p className="text-[12px] text-black/40 mt-1">
                            interventions
                        </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white border border-black/8 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-medium text-black/40 uppercase tracking-wide">
                                En cours
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                <Clock
                                    className="w-4 h-4 text-orange-600"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                        <p className="text-[32px] font-bold text-black tracking-tight">
                            {stats?.enCours ?? 0}
                        </p>
                        <p className="text-[12px] text-black/40 mt-1">
                            interventions actives
                        </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white border border-black/8 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-medium text-black/40 uppercase tracking-wide">
                                Urgentes
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                <AlertCircle
                                    className="w-4 h-4 text-red-600"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                        <p className="text-[32px] font-bold text-black tracking-tight">
                            {stats?.urgentes ?? 0}
                        </p>
                        <p className="text-[12px] text-black/40 mt-1">
                            nécessitent attention
                        </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white border border-black/8 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-medium text-black/40 uppercase tracking-wide">
                                En retard
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                                <MapPin
                                    className="w-4 h-4 text-yellow-600"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                        <p className="text-[32px] font-bold text-black tracking-tight">
                            {stats?.enRetard ?? 0}
                        </p>
                        <p className="text-[12px] text-black/40 mt-1">
                            dépassent l&apos;échéance
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40"
                            strokeWidth={2}
                        />
                        <Input
                            placeholder="Rechercher par client, adresse, numéro..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-11 border-black/10 bg-white"
                        />
                    </div>

                    <Select
                        value={typeFilter}
                        onValueChange={(value) =>
                            setTypeFilter(value as TypeIntervention | "ALL")
                        }
                    >
                        <SelectTrigger className="w-[180px] h-11 border-black/10 bg-white">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tous les types</SelectItem>
                            {Object.entries(TYPE_INTERVENTION_LABELS).map(
                                ([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>

                    <Select
                        value={prioriteFilter}
                        onValueChange={(value) =>
                            setPrioriteFilter(
                                value as PrioriteIntervention | "ALL"
                            )
                        }
                    >
                        <SelectTrigger className="w-[180px] h-11 border-black/10 bg-white">
                            <SelectValue placeholder="Priorité" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">
                                Toutes priorités
                            </SelectItem>
                            {Object.entries(PRIORITE_LABELS).map(
                                ([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>

                    <Select
                        value={statutFilter}
                        onValueChange={(value) =>
                            setStatutFilter(value as StatutIntervention | "ALL")
                        }
                    >
                        <SelectTrigger className="w-[200px] h-11 border-black/10 bg-white">
                            <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">
                                Tous les statuts
                            </SelectItem>
                            {Object.entries(STATUT_LABELS).map(
                                ([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        className="h-11 px-6 border-black/10 hover:bg-black/5"
                        onClick={() => {
                            setSearchQuery("");
                            setTypeFilter("ALL");
                            setPrioriteFilter("ALL");
                            setStatutFilter("ALL");
                        }}
                    >
                        <Filter className="w-4 h-4 mr-2" strokeWidth={2} />
                        Réinitialiser
                    </Button>
                </div>

                {/* Interventions List */}
                <div className="space-y-3">
                    {isLoading ? (
                        <>
                            {[...Array(5)].map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className="h-[140px] rounded-xl"
                                />
                            ))}
                        </>
                    ) : interventions.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-[14px] text-black/40">
                                Aucune intervention trouvée
                            </p>
                        </div>
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
