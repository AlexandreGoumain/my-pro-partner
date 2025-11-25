"use client";

import { ContratDialog } from "@/components/contrats/contrat-dialog";
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
    Search,
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
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                            Contrats d&apos;Entretien
                        </h1>
                        <p className="text-[14px] text-black/40 mt-1">
                            Gestion des contrats récurrents et maintenances
                        </p>
                    </div>
                    <Button
                        onClick={() => setDialogOpen(true)}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                        Nouveau contrat
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-5 rounded-xl bg-white border border-black/8 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-medium text-black/40 uppercase tracking-wide">
                                Total contrats
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center">
                                <FileText
                                    className="w-4 h-4 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                        <p className="text-[32px] font-bold text-black tracking-tight">
                            {stats?.total || 0}
                        </p>
                        <p className="text-[12px] text-black/40 mt-1">
                            contrats signés
                        </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white border border-black/8 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-medium text-black/40 uppercase tracking-wide">
                                Contrats actifs
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                <TrendingUp
                                    className="w-4 h-4 text-green-600"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                        <p className="text-[32px] font-bold text-black tracking-tight">
                            {stats?.actifs || 0}
                        </p>
                        <p className="text-[12px] text-black/40 mt-1">
                            en cours
                        </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white border border-black/8 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-medium text-black/40 uppercase tracking-wide">
                                Révisions ce mois
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Calendar
                                    className="w-4 h-4 text-blue-600"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                        <p className="text-[32px] font-bold text-black tracking-tight">
                            {stats?.revisionsDuMois || 0}
                        </p>
                        <p className="text-[12px] text-black/40 mt-1">
                            à planifier
                        </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white border border-black/8 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-medium text-black/40 uppercase tracking-wide">
                                MRR
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <TrendingUp
                                    className="w-4 h-4 text-emerald-600"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                        <p className="text-[32px] font-bold text-black tracking-tight">
                            {(stats?.revenusRecurrents || 0).toFixed(0)}€
                        </p>
                        <p className="text-[12px] text-black/40 mt-1">
                            revenus mensuels
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
                            placeholder="Rechercher par client, numéro..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                            className="pl-9 h-11 border-black/10 bg-white"
                        />
                    </div>

                    <Select
                        value={typeFilter}
                        onValueChange={(value) =>
                            setTypeFilter(value as TypeContratEntretien | "ALL")
                        }
                    >
                        <SelectTrigger className="w-[200px] h-11 border-black/10 bg-white">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tous les types</SelectItem>
                            {Object.entries(TYPE_CONTRAT_LABELS).map(
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
                            setStatutFilter(value as StatutContrat | "ALL")
                        }
                    >
                        <SelectTrigger className="w-[180px] h-11 border-black/10 bg-white">
                            <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">
                                Tous les statuts
                            </SelectItem>
                            {Object.entries(STATUT_CONTRAT_LABELS).map(
                                ([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={handleSearch}
                        variant="outline"
                        className="h-11 px-6 border-black/10 hover:bg-black/5"
                    >
                        Filtrer
                    </Button>
                </div>

                {/* Contrats List */}
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
                    ) : contrats.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-black/10 rounded-xl">
                            <FileText
                                className="w-12 h-12 text-black/20 mx-auto mb-4"
                                strokeWidth={1.5}
                            />
                            <p className="text-[16px] font-medium text-black/60 mb-2">
                                Aucun contrat
                            </p>
                            <p className="text-[14px] text-black/40 mb-4">
                                Créez votre premier contrat d&apos;entretien
                            </p>
                            <Button
                                onClick={() => setDialogOpen(true)}
                                variant="outline"
                                className="h-10"
                            >
                                <Plus
                                    className="w-4 h-4 mr-2"
                                    strokeWidth={2}
                                />
                                Nouveau contrat
                            </Button>
                        </div>
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
