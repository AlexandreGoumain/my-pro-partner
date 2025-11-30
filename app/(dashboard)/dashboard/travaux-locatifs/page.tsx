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
    Wrench, Plus, Home, User, Calendar, Phone,
    AlertTriangle, Clock, CheckCircle, Camera
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    useIncidents,
    useUpdateIncident,
    type IncidentWithRelations,
    type IncidentsFilters
} from "@/hooks/gestion-locative/use-incidents";
import type { StatutIncident } from "@/lib/generated/prisma";

interface PageFilters {
    categorie: string;
    statut: StatutIncident | "ALL";
    urgence: string;
    search: string;
}

const CATEGORIE_OPTIONS = [
    { value: "ALL", label: "Toutes catégories" },
    { value: "PLOMBERIE", label: "Plomberie" },
    { value: "ELECTRICITE", label: "Électricité" },
    { value: "CHAUFFAGE", label: "Chauffage" },
    { value: "SERRURERIE", label: "Serrurerie" },
    { value: "TOITURE", label: "Toiture" },
    { value: "AUTRE", label: "Autre" },
];

const STATUT_OPTIONS = [
    { value: "ALL", label: "Tous les statuts" },
    { value: "SIGNALE", label: "Signalé" },
    { value: "EN_COURS", label: "En cours" },
    { value: "DEVIS_DEMANDE", label: "Devis demandé" },
    { value: "TRAVAUX_PLANIFIES", label: "Travaux planifiés" },
    { value: "RESOLU", label: "Résolu" },
    { value: "ANNULE", label: "Annulé" },
];

const URGENCE_OPTIONS = [
    { value: "ALL", label: "Toutes urgences" },
    { value: "1", label: "Critique" },
    { value: "2", label: "Urgent" },
    { value: "3", label: "Normal" },
    { value: "4", label: "Faible" },
];

const CATEGORIE_LABELS: Record<string, string> = {
    PLOMBERIE: "Plomberie",
    ELECTRICITE: "Électricité",
    CHAUFFAGE: "Chauffage",
    SERRURERIE: "Serrurerie",
    TOITURE: "Toiture",
    AUTRE: "Autre",
};

const STATUT_CONFIG: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
    SIGNALE: { label: "Signalé", variant: "outline" },
    EN_COURS: { label: "En cours", variant: "secondary" },
    DEVIS_DEMANDE: { label: "Devis demandé", variant: "secondary" },
    TRAVAUX_PLANIFIES: { label: "Travaux planifiés", variant: "default" },
    RESOLU: { label: "Résolu", variant: "default" },
    ANNULE: { label: "Annulé", variant: "outline" },
};

const URGENCE_CONFIG: Record<number, { label: string; className: string }> = {
    1: { label: "Critique", className: "bg-red-100 text-red-700 border-red-200" },
    2: { label: "Urgent", className: "bg-black/10 text-black/70 border-black/10" },
    3: { label: "Normal", className: "bg-black/5 text-black/60 border-black/10" },
    4: { label: "Faible", className: "bg-black/[0.02] text-black/40 border-black/5" },
};

function IncidentCard({ incident, onView, onAction }: {
    incident: IncidentWithRelations;
    onView: (i: IncidentWithRelations) => void;
    onAction: (i: IncidentWithRelations, action: string) => void;
}) {
    const statutConfig = STATUT_CONFIG[incident.statut] || STATUT_CONFIG.SIGNALE;
    const urgenceConfig = URGENCE_CONFIG[incident.urgence] || URGENCE_CONFIG[3];
    const joursDepuisSignalement = Math.floor(
        (Date.now() - new Date(incident.dateSignalement).getTime()) / (1000 * 60 * 60 * 24)
    );
    const photos = incident.photos as string[] | null;
    const coutEstime = incident.coutEstime ? Number(incident.coutEstime) : null;
    const coutReel = incident.coutReel ? Number(incident.coutReel) : null;

    return (
        <Card
            className={cn(
                "p-5 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer",
                incident.urgence <= 2 && incident.statut !== "RESOLU" && incident.statut !== "ANNULE" && "border-l-4 border-l-black/20"
            )}
            onClick={() => onView(incident)}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] text-black/40">{incident.id.slice(0, 8)}</span>
                        <Badge variant={statutConfig.variant} className="text-[10px] h-5">
                            {statutConfig.label}
                        </Badge>
                        <Badge variant="outline" className={cn("text-[10px] h-5", urgenceConfig.className)}>
                            {urgenceConfig.label}
                        </Badge>
                    </div>
                    <h3 className="text-[15px] font-medium text-black line-clamp-1">
                        {incident.description.substring(0, 60)}...
                    </h3>
                </div>
                <Badge variant="outline" className="text-[10px] flex-shrink-0">
                    {CATEGORIE_LABELS[incident.categorie] || incident.categorie}
                </Badge>
            </div>

            {/* Description */}
            <p className="text-[13px] text-black/60 line-clamp-2 mb-3">
                {incident.description}
            </p>

            {/* Bien et locataire */}
            {incident.bail && (
                <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-[12px] text-black/40">
                        <Home className="w-3.5 h-3.5" />
                        <span className="line-clamp-1">{incident.bail.bien.titre}</span>
                        <span className="text-black/20">·</span>
                        <span>{incident.bail.bien.ville}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-black/40">
                        <User className="w-3.5 h-3.5" />
                        <span>
                            {incident.bail.locatairePrincipal.prenom}{" "}
                            {incident.bail.locatairePrincipal.nom}
                        </span>
                        {incident.bail.locatairePrincipal.telephone && (
                            <a
                                href={`tel:${incident.bail.locatairePrincipal.telephone}`}
                                className="flex items-center gap-1 hover:text-black"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Phone className="w-3 h-3" />
                                {incident.bail.locatairePrincipal.telephone}
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Infos */}
            <div className="flex items-center gap-4 text-[11px] text-black/40 mb-3">
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                        {joursDepuisSignalement === 0
                            ? "Aujourd'hui"
                            : `Il y a ${joursDepuisSignalement}j`
                        }
                    </span>
                </div>
                {photos && photos.length > 0 && (
                    <div className="flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        <span>{photos.length} photo{photos.length > 1 ? "s" : ""}</span>
                    </div>
                )}
            </div>

            {/* Coût */}
            {(coutEstime || coutReel) && (
                <div className="bg-black/[0.02] rounded-lg p-2 mb-3">
                    {coutEstime && !coutReel && (
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-black/40">Estimé</span>
                            <span className="text-[13px] font-medium text-black">
                                {coutEstime.toLocaleString("fr-FR")} €
                            </span>
                        </div>
                    )}
                    {coutReel && (
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-black/40">Coût réel</span>
                            <span className="text-[13px] font-medium text-black">
                                {coutReel.toLocaleString("fr-FR")} €
                                {incident.aChargeDe && (
                                    <span className="text-[10px] text-black/40 ml-1">
                                        ({incident.aChargeDe})
                                    </span>
                                )}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Prestataire */}
            {incident.prestataire && (
                <div className="flex items-center gap-2 text-[11px] text-black/40 mb-3">
                    <Wrench className="w-3 h-3" />
                    <span>{incident.prestataire}</span>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                {incident.statut === "SIGNALE" && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-black/90 text-white text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(incident, "prendre_en_charge");
                        }}
                    >
                        Prendre en charge
                    </Button>
                )}
                {incident.statut === "EN_COURS" && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-black/90 text-white text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(incident, "planifier");
                        }}
                    >
                        Planifier intervention
                    </Button>
                )}
                {incident.statut === "TRAVAUX_PLANIFIES" && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-black/90 text-white text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(incident, "resoudre");
                        }}
                    >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Résoudre
                    </Button>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7"
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(incident);
                    }}
                >
                    Voir
                </Button>
            </div>
        </Card>
    );
}

function TravauxLocatifsPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<PageFilters>({
        categorie: "ALL",
        statut: "ALL",
        urgence: "ALL",
        search: "",
    });

    const apiFilters: IncidentsFilters = {
        statut: filters.statut !== "ALL" ? filters.statut : undefined,
        categorie: filters.categorie !== "ALL" ? filters.categorie : undefined,
        urgence: filters.urgence !== "ALL" ? parseInt(filters.urgence) : undefined,
    };

    const { data: incidents = [], isLoading } = useIncidents(apiFilters);
    const updateMutation = useUpdateIncident();

    const handleFilterChange = useCallback(
        (key: keyof PageFilters, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleView = useCallback((incident: IncidentWithRelations) => {
        router.push(`/dashboard/travaux-locatifs/${incident.id}`);
    }, [router]);

    const handleAction = useCallback((incident: IncidentWithRelations, action: string) => {
        if (action === "prendre_en_charge") {
            updateMutation.mutate({ id: incident.id, data: { statut: "EN_COURS" } });
        } else if (action === "planifier") {
            updateMutation.mutate({ id: incident.id, data: { statut: "TRAVAUX_PLANIFIES" } });
        } else if (action === "resoudre") {
            updateMutation.mutate({ id: incident.id, data: { statut: "RESOLU" } });
        }
    }, [updateMutation]);

    const handleCreate = useCallback(() => {
        router.push("/dashboard/travaux-locatifs/nouveau");
    }, [router]);

    // Filter by search (client-side)
    const filteredIncidents = filters.search
        ? incidents.filter((i) => {
            const search = filters.search.toLowerCase();
            return (
                i.id.toLowerCase().includes(search) ||
                i.description.toLowerCase().includes(search) ||
                i.bail?.bien.titre.toLowerCase().includes(search) ||
                i.bail?.locatairePrincipal.nom.toLowerCase().includes(search)
            );
        })
        : incidents;

    // Stats
    const enCoursCount = incidents.filter((i) =>
        ["SIGNALE", "EN_COURS", "DEVIS_DEMANDE", "TRAVAUX_PLANIFIES"].includes(i.statut)
    ).length;
    const urgentsCount = incidents.filter((i) =>
        i.urgence <= 2 && i.statut !== "RESOLU" && i.statut !== "ANNULE"
    ).length;
    const signalesCount = incidents.filter((i) => i.statut === "SIGNALE").length;
    const resolusCount = incidents.filter((i) => i.statut === "RESOLU").length;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Travaux & Incidents"
                description="Gérez les incidents locatifs et suivez les travaux"
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                        Signaler un incident
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
                    <p className="text-[13px] text-black/40 mb-1">Urgents</p>
                    <p className={cn(
                        "text-[28px] font-bold tracking-[-0.02em]",
                        urgentsCount > 0 ? "text-black" : "text-black"
                    )}>
                        {urgentsCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">À traiter</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {signalesCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Résolus</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {resolusCount}
                    </p>
                </Card>
            </div>

            {/* Alerte urgents */}
            {urgentsCount > 0 && (
                <Card className="p-4 bg-black/[0.02] border-black/10">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-black/60" strokeWidth={2} />
                        <div className="flex-1">
                            <p className="text-[14px] font-medium text-black">
                                {urgentsCount} incident{urgentsCount > 1 ? "s" : ""} urgent{urgentsCount > 1 ? "s" : ""}
                            </p>
                            <p className="text-[12px] text-black/40">
                                Nécessite une intervention rapide
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-black/10 text-black/60 hover:bg-black/5"
                            onClick={() => handleFilterChange("urgence", "2")}
                        >
                            Voir les urgents
                        </Button>
                    </div>
                </Card>
            )}

            <FilterBar
                variant="card"
                filters={[
                    {
                        type: "search",
                        value: filters.search || "",
                        onChange: (value) => handleFilterChange("search", value),
                        placeholder: "Rechercher par bien, locataire, incident...",
                        className: "flex-1",
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
                    {
                        type: "select",
                        value: filters.urgence || "ALL",
                        onChange: (value) => handleFilterChange("urgence", value),
                        options: URGENCE_OPTIONS,
                        label: "Urgence",
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
            ) : filteredIncidents.length === 0 ? (
                <EmptyState
                    icon={Wrench}
                    title="Aucun incident"
                    description={
                        filters.search ||
                        filters.categorie !== "ALL" ||
                        filters.statut !== "ALL" ||
                        filters.urgence !== "ALL"
                            ? "Aucun incident ne correspond à vos critères"
                            : "Aucun incident signalé pour le moment"
                    }
                    action={
                        filters.search ||
                        filters.categorie !== "ALL" ||
                        filters.statut !== "ALL" ||
                        filters.urgence !== "ALL"
                            ? undefined
                            : {
                                label: "Signaler un incident",
                                onClick: handleCreate,
                            }
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredIncidents.map((incident) => (
                        <IncidentCard
                            key={incident.id}
                            incident={incident}
                            onView={handleView}
                            onAction={handleAction}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function TravauxLocatifsPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "grid",
                headerActionsCount: 1,
                statsCount: 4,
            }}
        >
            <TravauxLocatifsPageContent />
        </SuspensePage>
    );
}
