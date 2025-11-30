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
    ClipboardCheck, Plus, User, Calendar, Camera,
    Download, CheckCircle, ArrowRight, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEtatsLieux, type EtatDesLieuxWithRelations, type EtatDesLieuxFilters } from "@/hooks/gestion-locative/use-etats-lieux";

// Computed status based on signatures
function getStatut(etat: EtatDesLieuxWithRelations): "PLANIFIE" | "EN_COURS" | "TERMINE" | "SIGNE" {
    if (etat.signatureLocataire && etat.signatureProprietaire) return "SIGNE";
    if (etat.signatureLocataire || etat.signatureProprietaire) return "TERMINE";
    if (etat.constatations || (etat.photos && (etat.photos as string[]).length > 0)) return "EN_COURS";
    return "PLANIFIE";
}

interface EtatsLieuxPageFilters {
    type: string;
    statut: string;
    search: string;
}

const TYPE_OPTIONS = [
    { value: "ALL", label: "Tous les types" },
    { value: "ENTREE", label: "Entrée" },
    { value: "SORTIE", label: "Sortie" },
];

const STATUT_OPTIONS = [
    { value: "ALL", label: "Tous les statuts" },
    { value: "PLANIFIE", label: "Planifié" },
    { value: "EN_COURS", label: "En cours" },
    { value: "TERMINE", label: "Terminé" },
    { value: "SIGNE", label: "Signé" },
];

const STATUT_CONFIG: Record<string, { label: string; variant: "default" | "outline" | "secondary" }> = {
    PLANIFIE: { label: "Planifié", variant: "outline" },
    EN_COURS: { label: "En cours", variant: "secondary" },
    TERMINE: { label: "Terminé", variant: "secondary" },
    SIGNE: { label: "Signé", variant: "default" },
};

function EtatDesLieuxCard({ etat, onView, onEdit, onDownload }: {
    etat: EtatDesLieuxWithRelations;
    onView: (e: EtatDesLieuxWithRelations) => void;
    onEdit: (e: EtatDesLieuxWithRelations) => void;
    onDownload: (e: EtatDesLieuxWithRelations) => void;
}) {
    const statut = getStatut(etat);
    const statutConfig = STATUT_CONFIG[statut];
    const dateEtat = new Date(etat.dateEtat);
    const isToday = dateEtat.toDateString() === new Date().toDateString();
    const isFuture = dateEtat > new Date();
    const photos = (etat.photos as string[]) || [];
    const locataire = etat.bail.locatairePrincipal;

    return (
        <Card
            className={cn(
                "p-5 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer",
                isToday && statut === "PLANIFIE" && "border-l-4 border-l-black"
            )}
            onClick={() => onView(etat)}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] text-black/40">{etat.bail.reference}</span>
                        <Badge
                            variant={etat.typeEtat === "ENTREE" ? "outline" : "secondary"}
                            className="text-[10px] h-5"
                        >
                            {etat.typeEtat === "ENTREE" ? (
                                <><ArrowRight className="w-3 h-3 mr-1" /> Entrée</>
                            ) : (
                                <><ArrowLeft className="w-3 h-3 mr-1" /> Sortie</>
                            )}
                        </Badge>
                        <Badge variant={statutConfig.variant} className="text-[10px] h-5">
                            {statutConfig.label}
                        </Badge>
                    </div>
                    <h3 className="text-[15px] font-medium text-black">
                        {etat.bail.bien.titre}
                    </h3>
                </div>
            </div>

            {/* Bien info */}
            <div className="flex items-center gap-3 text-[12px] text-black/40 mb-3">
                {etat.bail.bien.surface && <span>{etat.bail.bien.surface} m²</span>}
                {etat.bail.bien.ville && (
                    <>
                        <span>·</span>
                        <span>{etat.bail.bien.ville}</span>
                    </>
                )}
            </div>

            {/* Locataire */}
            {locataire && (
                <div className="flex items-center gap-2 text-[13px] text-black/60 mb-3">
                    <User className="w-4 h-4 text-black/40" />
                    <span>{locataire.prenom} {locataire.nom}</span>
                </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-2 text-[12px] mb-4">
                <Calendar className="w-3.5 h-3.5 text-black/40" />
                <span className={cn(
                    isToday ? "text-black font-medium" : isFuture ? "text-black/60" : "text-black/40"
                )}>
                    {isToday ? "Aujourd'hui" : dateEtat.toLocaleDateString("fr-FR", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    })}
                </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-[12px] text-black/40">
                    <Camera className="w-3.5 h-3.5" />
                    <span>{photos.length} photos</span>
                </div>
            </div>

            {/* Notes */}
            {etat.notes && (
                <p className="text-[12px] text-black/40 line-clamp-2 mb-4">
                    {etat.notes}
                </p>
            )}

            {/* Signatures */}
            {statut === "SIGNE" && (
                <div className="flex items-center gap-2 text-[11px] text-emerald-600 mb-4">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Signé par les deux parties</span>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                {(statut === "PLANIFIE" || statut === "EN_COURS") && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-black/90 text-white text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(etat);
                        }}
                    >
                        {statut === "PLANIFIE" ? "Commencer" : "Continuer"}
                    </Button>
                )}
                {(statut === "TERMINE" || statut === "SIGNE") && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDownload(etat);
                        }}
                    >
                        <Download className="w-3 h-3 mr-1" />
                        Télécharger PDF
                    </Button>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7"
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(etat);
                    }}
                >
                    Voir
                </Button>
            </div>
        </Card>
    );
}

function EtatsLieuxPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<EtatsLieuxPageFilters>({
        type: "ALL",
        statut: "ALL",
        search: "",
    });

    const apiFilters: EtatDesLieuxFilters = {
        type: filters.type !== "ALL" ? filters.type : undefined,
        search: filters.search || undefined,
    };

    const { data: etatsLieux = [], isLoading } = useEtatsLieux(apiFilters);

    const handleFilterChange = useCallback(
        (key: keyof EtatsLieuxPageFilters, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleView = useCallback((etat: EtatDesLieuxWithRelations) => {
        router.push(`/dashboard/etats-lieux/${etat.id}`);
    }, [router]);

    const handleEdit = useCallback((etat: EtatDesLieuxWithRelations) => {
        router.push(`/dashboard/etats-lieux/${etat.id}/edit`);
    }, [router]);

    const handleDownload = useCallback((etat: EtatDesLieuxWithRelations) => {
        if (etat.documentUrl) {
            window.open(etat.documentUrl, "_blank");
        }
    }, []);

    const handleCreate = useCallback(() => {
        router.push("/dashboard/etats-lieux/nouveau");
    }, [router]);

    // Filter by statut (client-side since statut is computed)
    const filteredEtats = etatsLieux.filter((e) => {
        if (filters.statut !== "ALL" && getStatut(e) !== filters.statut) return false;
        return true;
    });

    // Stats
    const planifiesCount = etatsLieux.filter((e) => {
        const s = getStatut(e);
        return s === "PLANIFIE" || s === "EN_COURS";
    }).length;
    const entreesCount = etatsLieux.filter((e) => e.typeEtat === "ENTREE").length;
    const sortiesCount = etatsLieux.filter((e) => e.typeEtat === "SORTIE").length;
    const signesCount = etatsLieux.filter((e) => getStatut(e) === "SIGNE").length;

    return (
        <div className="space-y-6">
            <PageHeader
                title="États des lieux"
                description="Réalisez vos états des lieux d'entrée et de sortie"
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                        Nouvel état des lieux
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">À réaliser</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {planifiesCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Entrées</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {entreesCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Sorties</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {sortiesCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Signés</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {signesCount}
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
                        placeholder: "Rechercher par bien, locataire...",
                        className: "flex-1",
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="h-[280px] bg-black/5 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : filteredEtats.length === 0 ? (
                <EmptyState
                    icon={ClipboardCheck}
                    title="Aucun état des lieux"
                    description={
                        filters.search ||
                        filters.type !== "ALL" ||
                        filters.statut !== "ALL"
                            ? "Aucun état des lieux ne correspond à vos critères"
                            : "Créez votre premier état des lieux"
                    }
                    action={
                        filters.search ||
                        filters.type !== "ALL" ||
                        filters.statut !== "ALL"
                            ? undefined
                            : {
                                label: "Créer un état des lieux",
                                onClick: handleCreate,
                            }
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEtats.map((etat) => (
                        <EtatDesLieuxCard
                            key={etat.id}
                            etat={etat}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDownload={handleDownload}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function EtatsLieuxPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "grid",
                headerActionsCount: 1,
                statsCount: 4,
            }}
        >
            <EtatsLieuxPageContent />
        </SuspensePage>
    );
}
