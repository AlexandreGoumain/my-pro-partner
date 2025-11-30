"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/ui/filter-bar";
import { PageHeader } from "@/components/ui/page-header";
import { SuspensePage } from "@/components/ui/suspense-page";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Users, Plus, Building2, Calendar, MapPin, Clock,
    CheckCircle, FileText, Send, Download, Vote
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface AssembleeGenerale {
    id: string;
    reference: string;
    type: "ORDINAIRE" | "EXTRAORDINAIRE" | "MIXTE";
    dateAG: string;
    heureDebut: string;
    lieu: string;
    copropriete: {
        id: string;
        nom: string;
    };
    statut: "PLANIFIEE" | "CONVOCATIONS_ENVOYEES" | "EN_COURS" | "TERMINEE" | "PV_ENVOYE";
    nbResolutions: number;
    nbResolutionsVotees?: number;
    quorum?: number;
    nbPresents?: number;
    nbRepresentes?: number;
    dateConvocation?: string;
    dateLimitePouvoir?: string;
}

interface AGFilters {
    copropriete: string;
    type: string;
    statut: string;
    search: string;
}

const TYPE_OPTIONS = [
    { value: "ALL", label: "Tous les types" },
    { value: "ORDINAIRE", label: "AG Ordinaire" },
    { value: "EXTRAORDINAIRE", label: "AG Extraordinaire" },
    { value: "MIXTE", label: "AG Mixte" },
];

const STATUT_OPTIONS = [
    { value: "ALL", label: "Tous les statuts" },
    { value: "PLANIFIEE", label: "Planifiée" },
    { value: "CONVOCATIONS_ENVOYEES", label: "Convocations envoyées" },
    { value: "EN_COURS", label: "En cours" },
    { value: "TERMINEE", label: "Terminée" },
    { value: "PV_ENVOYE", label: "PV envoyé" },
];

const TYPE_LABELS: Record<string, string> = {
    ORDINAIRE: "AG Ordinaire",
    EXTRAORDINAIRE: "AG Extraordinaire",
    MIXTE: "AG Mixte",
};

const STATUT_CONFIG: Record<string, { label: string; variant: "default" | "outline" | "secondary" }> = {
    PLANIFIEE: { label: "Planifiée", variant: "outline" },
    CONVOCATIONS_ENVOYEES: { label: "Convoquée", variant: "secondary" },
    EN_COURS: { label: "En cours", variant: "default" },
    TERMINEE: { label: "Terminée", variant: "secondary" },
    PV_ENVOYE: { label: "PV envoyé", variant: "default" },
};

// Mock data
const mockAGs: AssembleeGenerale[] = [
    {
        id: "1",
        reference: "AG-2024-001",
        type: "ORDINAIRE",
        dateAG: new Date(Date.now() + 86400000 * 45).toISOString(),
        heureDebut: "19:00",
        lieu: "Salle des fêtes, 15 rue de la Mairie, 75015 Paris",
        copropriete: { id: "c1", nom: "Résidence Les Jardins" },
        statut: "PLANIFIEE",
        nbResolutions: 12,
        dateConvocation: new Date(Date.now() + 86400000 * 24).toISOString(),
        dateLimitePouvoir: new Date(Date.now() + 86400000 * 42).toISOString(),
    },
    {
        id: "2",
        reference: "AG-2024-002",
        type: "EXTRAORDINAIRE",
        dateAG: new Date(Date.now() + 86400000 * 15).toISOString(),
        heureDebut: "18:30",
        lieu: "Hall de l'immeuble, 8 allée des Chênes, 69003 Lyon",
        copropriete: { id: "c2", nom: "Le Clos des Tilleuls" },
        statut: "CONVOCATIONS_ENVOYEES",
        nbResolutions: 5,
        dateConvocation: new Date(Date.now() - 86400000 * 7).toISOString(),
        dateLimitePouvoir: new Date(Date.now() + 86400000 * 12).toISOString(),
    },
    {
        id: "3",
        reference: "AG-2023-012",
        type: "ORDINAIRE",
        dateAG: new Date(Date.now() - 86400000 * 30).toISOString(),
        heureDebut: "19:00",
        lieu: "Salle polyvalente, 22 avenue de la République, 13008 Marseille",
        copropriete: { id: "c3", nom: "Domaine du Parc" },
        statut: "PV_ENVOYE",
        nbResolutions: 18,
        nbResolutionsVotees: 18,
        quorum: 68,
        nbPresents: 42,
        nbRepresentes: 28,
    },
    {
        id: "4",
        reference: "AG-2023-011",
        type: "MIXTE",
        dateAG: new Date(Date.now() - 86400000 * 60).toISOString(),
        heureDebut: "18:00",
        lieu: "Salle de réunion, 15 rue des Fleurs, 75015 Paris",
        copropriete: { id: "c1", nom: "Résidence Les Jardins" },
        statut: "TERMINEE",
        nbResolutions: 15,
        nbResolutionsVotees: 14,
        quorum: 72,
        nbPresents: 28,
        nbRepresentes: 12,
    },
];

function AGCard({ ag, onView, onAction }: {
    ag: AssembleeGenerale;
    onView: (a: AssembleeGenerale) => void;
    onAction: (a: AssembleeGenerale, action: string) => void;
}) {
    const statutConfig = STATUT_CONFIG[ag.statut];
    const agDate = new Date(ag.dateAG);
    const isFuture = agDate > new Date();
    const isToday = agDate.toDateString() === new Date().toDateString();
    const daysUntil = Math.ceil((agDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return (
        <Card
            className={cn(
                "p-5 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer",
                isToday && "border-l-4 border-l-black"
            )}
            onClick={() => onView(ag)}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] text-black/40">{ag.reference}</span>
                        <Badge variant={statutConfig.variant} className="text-[10px] h-5">
                            {statutConfig.label}
                        </Badge>
                    </div>
                    <h3 className="text-[15px] font-medium text-black">
                        {TYPE_LABELS[ag.type]}
                    </h3>
                </div>
                <Badge variant="outline" className="text-[10px]">
                    {ag.nbResolutions} résolutions
                </Badge>
            </div>

            {/* Copropriété */}
            <div className="flex items-center gap-2 text-[13px] text-black/60 mb-3">
                <Building2 className="w-4 h-4 text-black/40" />
                <span>{ag.copropriete.nom}</span>
            </div>

            {/* Date et heure */}
            <div className="flex items-center gap-2 text-[13px] mb-2">
                <Calendar className="w-4 h-4 text-black/40" />
                <span className={cn(
                    isToday ? "text-black font-medium" : isFuture ? "text-black/60" : "text-black/40"
                )}>
                    {agDate.toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    })}
                </span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-black/40 mb-3">
                <Clock className="w-3.5 h-3.5" />
                <span>{ag.heureDebut}</span>
            </div>

            {/* Lieu */}
            <div className="flex items-start gap-2 text-[12px] text-black/40 mb-4">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{ag.lieu}</span>
            </div>

            {/* Countdown ou résultats */}
            {isFuture && daysUntil <= 30 && (
                <div className="bg-black/[0.02] rounded-lg p-2 mb-4">
                    <p className="text-[12px] text-black/60 text-center">
                        {isToday ? "Aujourd'hui" : `Dans ${daysUntil} jour${daysUntil > 1 ? "s" : ""}`}
                    </p>
                </div>
            )}

            {ag.statut === "TERMINEE" || ag.statut === "PV_ENVOYE" ? (
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-black/[0.02] rounded-lg p-2 text-center">
                        <p className="text-[14px] font-bold text-black">{ag.quorum}%</p>
                        <p className="text-[10px] text-black/40">Quorum</p>
                    </div>
                    <div className="bg-black/[0.02] rounded-lg p-2 text-center">
                        <p className="text-[14px] font-bold text-black">{ag.nbPresents}</p>
                        <p className="text-[10px] text-black/40">Présents</p>
                    </div>
                    <div className="bg-black/[0.02] rounded-lg p-2 text-center">
                        <p className="text-[14px] font-bold text-black">{ag.nbRepresentes}</p>
                        <p className="text-[10px] text-black/40">Représentés</p>
                    </div>
                </div>
            ) : null}

            {/* Actions */}
            <div className="flex gap-2">
                {ag.statut === "PLANIFIEE" && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-black/90 text-white text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(ag, "convoquer");
                        }}
                    >
                        <Send className="w-3 h-3 mr-1" />
                        Convoquer
                    </Button>
                )}
                {ag.statut === "CONVOCATIONS_ENVOYEES" && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-black/90 text-white text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(ag, "feuille_presence");
                        }}
                    >
                        <FileText className="w-3 h-3 mr-1" />
                        Feuille présence
                    </Button>
                )}
                {ag.statut === "TERMINEE" && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-black/90 text-white text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(ag, "envoyer_pv");
                        }}
                    >
                        <Send className="w-3 h-3 mr-1" />
                        Envoyer PV
                    </Button>
                )}
                {ag.statut === "PV_ENVOYE" && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(ag, "telecharger_pv");
                        }}
                    >
                        <Download className="w-3 h-3 mr-1" />
                        Télécharger PV
                    </Button>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7"
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(ag);
                    }}
                >
                    Détails
                </Button>
            </div>
        </Card>
    );
}

function AGPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<AGFilters>({
        copropriete: "ALL",
        type: "ALL",
        statut: "ALL",
        search: "",
    });

    const ags = mockAGs;
    const isLoading = false;

    const handleFilterChange = useCallback(
        (key: keyof AGFilters, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleView = useCallback((ag: AssembleeGenerale) => {
        router.push(`/dashboard/ag/${ag.id}`);
    }, [router]);

    const handleAction = useCallback((_ag: AssembleeGenerale, _action: string) => {
        // Action handled via mutation
    }, []);

    const handleCreate = useCallback(() => {
        router.push("/dashboard/ag/nouveau");
    }, [router]);

    // Generate copropriete options
    const coproOptions = [
        { value: "ALL", label: "Toutes les copropriétés" },
        ...Array.from(new Set(ags.map((a) => a.copropriete.id))).map((id) => {
            const copro = ags.find((a) => a.copropriete.id === id)?.copropriete;
            return { value: id, label: copro?.nom || id };
        }),
    ];

    // Filter
    const filteredAGs = ags.filter((a) => {
        if (filters.copropriete !== "ALL" && a.copropriete.id !== filters.copropriete) return false;
        if (filters.type !== "ALL" && a.type !== filters.type) return false;
        if (filters.statut !== "ALL" && a.statut !== filters.statut) return false;
        if (filters.search) {
            const search = filters.search.toLowerCase();
            return (
                a.reference.toLowerCase().includes(search) ||
                a.copropriete.nom.toLowerCase().includes(search) ||
                a.lieu.toLowerCase().includes(search)
            );
        }
        return true;
    });

    // Stats
    const aVenirCount = ags.filter((a) =>
        ["PLANIFIEE", "CONVOCATIONS_ENVOYEES"].includes(a.statut)
    ).length;
    const termineesCount = ags.filter((a) =>
        ["TERMINEE", "PV_ENVOYE"].includes(a.statut)
    ).length;
    const prochaineAG = ags
        .filter((a) => new Date(a.dateAG) > new Date())
        .sort((a, b) => new Date(a.dateAG).getTime() - new Date(b.dateAG).getTime())[0];
    const prochaineDate = prochaineAG
        ? Math.ceil((new Date(prochaineAG.dateAG).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Assemblées générales"
                description="Organisez et suivez les AG de vos copropriétés"
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                        Convoquer une AG
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">AG à venir</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {aVenirCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">AG terminées</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {termineesCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Prochaine AG</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {prochaineDate !== null ? `${prochaineDate}j` : "-"}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Total cette année</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {ags.filter((a) =>
                            new Date(a.dateAG).getFullYear() === new Date().getFullYear()
                        ).length}
                    </p>
                </Card>
            </div>

            <FilterBar
                variant="card"
                filters={[
                    {
                        type: "search",
                        value: filters.search || "",
                        onChange: (value) => handleFilterChange("search", value),
                        placeholder: "Rechercher par référence, copropriété...",
                        className: "flex-1",
                    },
                    {
                        type: "select",
                        value: filters.copropriete || "ALL",
                        onChange: (value) => handleFilterChange("copropriete", value),
                        options: coproOptions,
                        label: "Copropriété",
                    },
                    {
                        type: "select",
                        value: filters.type || "ALL",
                        onChange: (value) => handleFilterChange("type", value),
                        options: TYPE_OPTIONS,
                        label: "Type",
                    },
                    {
                        type: "select",
                        value: filters.statut || "ALL",
                        onChange: (value) => handleFilterChange("statut", value),
                        options: STATUT_OPTIONS,
                        label: "Statut",
                    },
                ]}
            />

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="h-[320px] bg-black/5 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : filteredAGs.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="Aucune assemblée générale"
                    description={
                        filters.search ||
                        filters.copropriete !== "ALL" ||
                        filters.type !== "ALL" ||
                        filters.statut !== "ALL"
                            ? "Aucune AG ne correspond à vos critères"
                            : "Convoquez votre première assemblée générale"
                    }
                    action={
                        filters.search ||
                        filters.copropriete !== "ALL" ||
                        filters.type !== "ALL" ||
                        filters.statut !== "ALL"
                            ? undefined
                            : {
                                label: "Convoquer une AG",
                                onClick: handleCreate,
                            }
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredAGs.map((ag) => (
                        <AGCard
                            key={ag.id}
                            ag={ag}
                            onView={handleView}
                            onAction={handleAction}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function AGPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "grid",
                headerActionsCount: 1,
                statsCount: 4,
            }}
        >
            <AGPageContent />
        </SuspensePage>
    );
}
