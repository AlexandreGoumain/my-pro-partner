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
    HardHat, Plus, Building2, Calendar,
    CheckCircle, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    useTravauxCopro,
    useUpdateTravaux,
    type TravauxWithRelations,
    type TravauxFilters
} from "@/hooks/syndic/use-travaux";
import type { StatutTravauxCopro } from "@/lib/generated/prisma";

interface PageFilters {
    copropriete: string;
    categorie: string;
    statut: StatutTravauxCopro | "ALL";
    search: string;
}

const CATEGORIE_OPTIONS = [
    { value: "ALL", label: "Toutes catégories" },
    { value: "FACADE", label: "Façade / Ravalement" },
    { value: "TOITURE", label: "Toiture" },
    { value: "PARTIES_COMMUNES", label: "Parties communes" },
    { value: "ASCENSEUR", label: "Ascenseur" },
    { value: "CHAUFFAGE", label: "Chauffage collectif" },
    { value: "SECURITE", label: "Sécurité" },
    { value: "AUTRE", label: "Autre" },
];

const STATUT_OPTIONS = [
    { value: "ALL", label: "Tous les statuts" },
    { value: "PROJET", label: "En étude" },
    { value: "VOTE", label: "À voter en AG" },
    { value: "EN_COURS", label: "En cours" },
    { value: "TERMINE", label: "Terminé" },
];

const CATEGORIE_LABELS: Record<string, string> = {
    FACADE: "Façade",
    TOITURE: "Toiture",
    PARTIES_COMMUNES: "Parties communes",
    ASCENSEUR: "Ascenseur",
    CHAUFFAGE: "Chauffage",
    SECURITE: "Sécurité",
    AUTRE: "Autre",
};

const STATUT_CONFIG: Record<string, { label: string; variant: "default" | "outline" | "secondary" }> = {
    PROJET: { label: "En étude", variant: "outline" },
    VOTE: { label: "À voter", variant: "secondary" },
    EN_COURS: { label: "En cours", variant: "default" },
    TERMINE: { label: "Terminé", variant: "default" },
    ANNULE: { label: "Annulé", variant: "outline" },
};

function TravauxCard({ travaux, onView, onAction }: {
    travaux: TravauxWithRelations;
    onView: (t: TravauxWithRelations) => void;
    onAction: (t: TravauxWithRelations, action: string) => void;
}) {
    const statutConfig = STATUT_CONFIG[travaux.statut] || STATUT_CONFIG.PROJET;
    const budgetEstime = travaux.budgetEstime ? Number(travaux.budgetEstime) : 0;
    const budgetVote = travaux.budgetVote ? Number(travaux.budgetVote) : null;
    const coutFinal = travaux.coutFinal ? Number(travaux.coutFinal) : null;

    return (
        <Card
            className="p-5 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer"
            onClick={() => onView(travaux)}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] text-black/40">{travaux.id.slice(0, 8)}</span>
                        <Badge variant={statutConfig.variant} className="text-[10px] h-5">
                            {statutConfig.label}
                        </Badge>
                    </div>
                    <h3 className="text-[15px] font-medium text-black">
                        {travaux.titre}
                    </h3>
                </div>
                <Badge variant="outline" className="text-[10px] flex-shrink-0">
                    {CATEGORIE_LABELS[travaux.categorie] || travaux.categorie}
                </Badge>
            </div>

            {/* Description */}
            {travaux.description && (
                <p className="text-[13px] text-black/60 line-clamp-2 mb-3">
                    {travaux.description}
                </p>
            )}

            {/* Copropriété */}
            {travaux.copropriete && (
                <div className="flex items-center gap-2 text-[13px] text-black/60 mb-4">
                    <Building2 className="w-4 h-4 text-black/40" />
                    <span>{travaux.copropriete.nom}</span>
                </div>
            )}

            {/* Montants */}
            <div className="bg-black/[0.02] rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-black/40">Budget estimé</span>
                    <span className="text-[14px] font-medium text-black">
                        {budgetEstime.toLocaleString("fr-FR")} €
                    </span>
                </div>
                {budgetVote && (
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] text-black/40">Voté AG</span>
                        <span className="text-[14px] font-medium text-black">
                            {budgetVote.toLocaleString("fr-FR")} €
                        </span>
                    </div>
                )}
                {coutFinal && (
                    <div className="flex items-center justify-between">
                        <span className="text-[12px] text-black/40">Coût final</span>
                        <span className="text-[14px] font-medium text-black/60">
                            {coutFinal.toLocaleString("fr-FR")} €
                        </span>
                    </div>
                )}
            </div>

            {/* Dates */}
            {(travaux.dateDebutPrevue || travaux.dateFinReelle) && (
                <div className="flex items-center gap-2 text-[12px] text-black/40 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    {travaux.statut === "TERMINE" && travaux.dateFinReelle ? (
                        <span>Terminé le {new Date(travaux.dateFinReelle).toLocaleDateString("fr-FR")}</span>
                    ) : travaux.dateDebutPrevue && travaux.dateFinPrevue ? (
                        <span>
                            {new Date(travaux.dateDebutPrevue).toLocaleDateString("fr-FR")} -{" "}
                            {new Date(travaux.dateFinPrevue).toLocaleDateString("fr-FR")}
                        </span>
                    ) : travaux.dateDebutPrevue ? (
                        <span>Début prévu: {new Date(travaux.dateDebutPrevue).toLocaleDateString("fr-FR")}</span>
                    ) : null}
                </div>
            )}

            {/* Entreprise */}
            {travaux.prestataire && (
                <div className="flex items-center gap-2 text-[12px] text-black/40 mb-3">
                    <HardHat className="w-3.5 h-3.5" />
                    <span>{travaux.prestataire}</span>
                </div>
            )}

            {/* AG Vote */}
            {travaux.assembleeVote && (
                <div className="flex items-center gap-2 text-[11px] text-black/40 mb-4">
                    <CheckCircle className="w-3 h-3 text-black/60" />
                    <span>Voté en AG</span>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                {travaux.statut === "PROJET" && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-black/90 text-white text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(travaux, "inscrire_ag");
                        }}
                    >
                        Inscrire à l'AG
                    </Button>
                )}
                {travaux.statut === "VOTE" && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(travaux, "voir_devis");
                        }}
                    >
                        <FileText className="w-3 h-3 mr-1" />
                        Voir devis
                    </Button>
                )}
                {travaux.statut === "EN_COURS" && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-black/90 text-white text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(travaux, "terminer");
                        }}
                    >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Terminer
                    </Button>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7"
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(travaux);
                    }}
                >
                    Détails
                </Button>
            </div>
        </Card>
    );
}

function TravauxCoproPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<PageFilters>({
        copropriete: "ALL",
        categorie: "ALL",
        statut: "ALL",
        search: "",
    });

    const apiFilters: TravauxFilters = {
        coproprieteId: filters.copropriete !== "ALL" ? filters.copropriete : undefined,
        statut: filters.statut !== "ALL" ? filters.statut : undefined,
        categorie: filters.categorie !== "ALL" ? filters.categorie : undefined,
    };

    const { data: travaux = [], isLoading } = useTravauxCopro(apiFilters);
    const updateMutation = useUpdateTravaux();

    const handleFilterChange = useCallback(
        (key: keyof PageFilters, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleView = useCallback((t: TravauxWithRelations) => {
        router.push(`/dashboard/travaux-copro/${t.id}`);
    }, [router]);

    const handleAction = useCallback((t: TravauxWithRelations, action: string) => {
        if (action === "terminer") {
            updateMutation.mutate({
                id: t.id,
                data: { statut: "TERMINE", dateFinReelle: new Date().toISOString() }
            });
        } else if (action === "inscrire_ag") {
            updateMutation.mutate({
                id: t.id,
                data: { statut: "VOTE" }
            });
        } else if (action === "voir_devis") {
            router.push(`/dashboard/travaux-copro/${t.id}?tab=devis`);
        }
    }, [updateMutation, router]);

    const handleCreate = useCallback(() => {
        router.push("/dashboard/travaux-copro/nouveau");
    }, [router]);

    // Generate copropriete options from data
    const coproOptions = [
        { value: "ALL", label: "Toutes les copropriétés" },
        ...Array.from(new Map(travaux.filter(t => t.copropriete).map((t) => [t.copropriete!.id, t.copropriete!]))).map(([id, copro]) => ({
            value: id,
            label: copro.nom,
        })),
    ];

    // Filter by search (client-side)
    const filteredTravaux = filters.search
        ? travaux.filter((t) => {
            const search = filters.search.toLowerCase();
            return (
                t.id.toLowerCase().includes(search) ||
                t.titre.toLowerCase().includes(search) ||
                t.copropriete?.nom.toLowerCase().includes(search)
            );
        })
        : travaux;

    // Stats
    const enCoursCount = travaux.filter((t) => t.statut === "EN_COURS").length;
    const aVoterCount = travaux.filter((t) => t.statut === "VOTE").length;
    const montantEnCours = travaux
        .filter((t) => t.statut === "EN_COURS")
        .reduce((acc, t) => acc + Number(t.budgetVote || t.budgetEstime || 0), 0);
    const projetsCount = travaux.filter((t) => t.statut === "PROJET").length;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Travaux collectifs"
                description="Gérez les travaux des parties communes"
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                        Nouveau projet
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">En cours</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {enCoursCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">À voter en AG</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {aVoterCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Montant en cours</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {montantEnCours > 0 ? `${(montantEnCours / 1000).toFixed(0)}k €` : "0 €"}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Projets en étude</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {projetsCount}
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
                        placeholder: "Rechercher par titre, copropriété...",
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
                        value: filters.categorie || "ALL",
                        onChange: (value) => handleFilterChange("categorie", value),
                        options: CATEGORIE_OPTIONS,
                        label: "Catégorie",
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
            ) : filteredTravaux.length === 0 ? (
                <EmptyState
                    icon={HardHat}
                    title="Aucun projet de travaux"
                    description={
                        filters.search ||
                        filters.copropriete !== "ALL" ||
                        filters.categorie !== "ALL" ||
                        filters.statut !== "ALL"
                            ? "Aucun projet ne correspond à vos critères"
                            : "Créez votre premier projet de travaux"
                    }
                    action={
                        filters.search ||
                        filters.copropriete !== "ALL" ||
                        filters.categorie !== "ALL" ||
                        filters.statut !== "ALL"
                            ? undefined
                            : {
                                label: "Créer un projet",
                                onClick: handleCreate,
                            }
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTravaux.map((t) => (
                        <TravauxCard
                            key={t.id}
                            travaux={t}
                            onView={handleView}
                            onAction={handleAction}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function TravauxCoproPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "grid",
                headerActionsCount: 1,
                statsCount: 4,
            }}
        >
            <TravauxCoproPageContent />
        </SuspensePage>
    );
}
