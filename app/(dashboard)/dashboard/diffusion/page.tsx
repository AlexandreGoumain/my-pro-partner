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
    Share2, Plus, Home, CheckCircle, XCircle, Clock, RefreshCcw,
    Globe, ExternalLink, Eye, MousePointer, Phone, AlertTriangle, Pause
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    useDiffusions,
    useSyncDiffusion,
    type DiffusionWithRelations,
    type DiffusionsFilters
} from "@/hooks/immobilier/use-diffusion";
import type { PortailDiffusion, StatutDiffusion } from "@/lib/generated/prisma";

interface PageFilters {
    portail: PortailDiffusion | "ALL";
    statut: StatutDiffusion | "ALL";
    search: string;
}

const PORTAIL_LABELS: Record<string, string> = {
    SELOGER: "SeLoger",
    LEBONCOIN: "LeBonCoin",
    BIEN_ICI: "Bien'ici",
    LOGIC_IMMO: "Logic-Immo",
    PAP: "PAP",
    FIGARO_IMMO: "Figaro Immo",
    GREEN_ACRES: "Green-Acres",
    SITE_AGENCE: "Site Agence",
    AUTRE: "Autre",
};

const PORTAIL_OPTIONS = [
    { value: "ALL", label: "Tous les portails" },
    { value: "SELOGER", label: "SeLoger" },
    { value: "LEBONCOIN", label: "LeBonCoin" },
    { value: "BIEN_ICI", label: "Bien'ici" },
    { value: "LOGIC_IMMO", label: "Logic-Immo" },
    { value: "PAP", label: "PAP" },
    { value: "FIGARO_IMMO", label: "Figaro Immo" },
    { value: "GREEN_ACRES", label: "Green-Acres" },
    { value: "SITE_AGENCE", label: "Site Agence" },
];

const STATUT_OPTIONS = [
    { value: "ALL", label: "Tous les statuts" },
    { value: "ACTIVE", label: "Active" },
    { value: "EN_ATTENTE", label: "En attente" },
    { value: "PAUSE", label: "En pause" },
    { value: "ERREUR", label: "Erreur" },
    { value: "REFUSEE", label: "Refusée" },
    { value: "EXPIREE", label: "Expirée" },
];

const STATUT_CONFIG: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive"; icon: typeof CheckCircle }> = {
    BROUILLON: { label: "Brouillon", variant: "outline", icon: Clock },
    EN_ATTENTE: { label: "En attente", variant: "outline", icon: Clock },
    ACTIVE: { label: "Active", variant: "default", icon: CheckCircle },
    PAUSE: { label: "En pause", variant: "secondary", icon: Pause },
    EXPIREE: { label: "Expirée", variant: "outline", icon: Clock },
    REFUSEE: { label: "Refusée", variant: "destructive", icon: XCircle },
    ERREUR: { label: "Erreur", variant: "destructive", icon: AlertTriangle },
};

function DiffusionCard({ diffusion, onRefresh, onView }: {
    diffusion: DiffusionWithRelations;
    onRefresh: (d: DiffusionWithRelations) => void;
    onView: (d: DiffusionWithRelations) => void;
}) {
    const statutConfig = STATUT_CONFIG[diffusion.statut] || STATUT_CONFIG.BROUILLON;
    const StatutIcon = statutConfig.icon;
    const portailLabel = PORTAIL_LABELS[diffusion.portail] || diffusion.portail;

    return (
        <Card className="p-4 border-black/[0.08] hover:border-black/20 transition-all">
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-black/40" />
                    </div>
                    <div>
                        <h4 className="text-[14px] font-medium text-black">
                            {portailLabel}
                        </h4>
                        <Badge variant={statutConfig.variant} className="text-[10px] h-5 mt-1">
                            <StatutIcon className="w-3 h-3 mr-1" />
                            {statutConfig.label}
                        </Badge>
                    </div>
                </div>
                {diffusion.urlAnnonce && (
                    <a
                        href={diffusion.urlAnnonce}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black/40 hover:text-black"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                )}
            </div>

            {/* Bien */}
            {diffusion.bien && (
                <div className="bg-black/[0.02] rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Home className="w-4 h-4 text-black/40" />
                        <span className="text-[12px] text-black/40">{diffusion.bien.reference}</span>
                    </div>
                    <p className="text-[13px] font-medium text-black line-clamp-1">
                        {diffusion.bien.titre}
                    </p>
                    <div className="flex items-center gap-2 text-[12px] text-black/40 mt-1">
                        <span>{diffusion.bien.ville}</span>
                        {diffusion.bien.prixVente && (
                            <>
                                <span>·</span>
                                <span className="font-medium text-black/60">
                                    {Number(diffusion.bien.prixVente).toLocaleString("fr-FR")} €
                                </span>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Stats */}
            {diffusion.statut === "ACTIVE" && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center p-2 bg-black/[0.02] rounded-lg">
                        <Eye className="w-4 h-4 text-black/40 mx-auto mb-1" />
                        <p className="text-[14px] font-medium text-black">{diffusion.nbVues || 0}</p>
                        <p className="text-[10px] text-black/40">Vues</p>
                    </div>
                    <div className="text-center p-2 bg-black/[0.02] rounded-lg">
                        <MousePointer className="w-4 h-4 text-black/40 mx-auto mb-1" />
                        <p className="text-[14px] font-medium text-black">{diffusion.nbClicsContact || 0}</p>
                        <p className="text-[10px] text-black/40">Clics</p>
                    </div>
                    <div className="text-center p-2 bg-black/[0.02] rounded-lg">
                        <Phone className="w-4 h-4 text-black/40 mx-auto mb-1" />
                        <p className="text-[14px] font-medium text-black">{diffusion.nbClicsTelephone || 0}</p>
                        <p className="text-[10px] text-black/40">Appels</p>
                    </div>
                </div>
            )}

            {/* Erreur / Refus */}
            {(diffusion.statut === "ERREUR" || diffusion.statut === "REFUSEE") && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-3">
                    <p className="text-[12px] text-red-600">
                        {diffusion.statut === "ERREUR" ? "Erreur technique lors de la diffusion" : "L'annonce a été refusée par le portail"}
                    </p>
                </div>
            )}

            {/* Date */}
            {diffusion.datePublication && (
                <p className="text-[11px] text-black/40 mb-3">
                    Publié le {new Date(diffusion.datePublication).toLocaleDateString("fr-FR")}
                    {diffusion.derniereSynchro && (
                        <> · Sync le {new Date(diffusion.derniereSynchro).toLocaleDateString("fr-FR")}</>
                    )}
                </p>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[12px] h-8 flex-1"
                    onClick={() => onRefresh(diffusion)}
                >
                    <RefreshCcw className="w-3 h-3 mr-1.5" />
                    Synchroniser
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[12px] h-8"
                    onClick={() => onView(diffusion)}
                >
                    Détails
                </Button>
            </div>
        </Card>
    );
}

function DiffusionPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<PageFilters>({
        portail: "ALL",
        statut: "ALL",
        search: "",
    });

    const apiFilters: DiffusionsFilters = {
        portail: filters.portail !== "ALL" ? filters.portail : undefined,
        statut: filters.statut !== "ALL" ? filters.statut : undefined,
    };

    const { data: diffusions = [], isLoading } = useDiffusions(apiFilters);
    const syncMutation = useSyncDiffusion();

    const handleFilterChange = useCallback(
        (key: keyof PageFilters, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleRefresh = useCallback((diffusion: DiffusionWithRelations) => {
        syncMutation.mutate(diffusion.id);
    }, [syncMutation]);

    const handleView = useCallback((diffusion: DiffusionWithRelations) => {
        router.push(`/dashboard/diffusion/${diffusion.id}`);
    }, [router]);

    const handleDiffuser = useCallback(() => {
        router.push("/dashboard/diffusion/nouveau");
    }, [router]);

    // Stats
    const actives = diffusions.filter((d) => d.statut === "ACTIVE").length;
    const totalVues = diffusions.reduce((acc, d) => acc + (d.nbVues || 0), 0);
    const totalContacts = diffusions.reduce((acc, d) => acc + (d.nbClicsContact || 0) + (d.nbClicsTelephone || 0), 0);
    const portailsUtilises = new Set(diffusions.map((d) => d.portail)).size;

    // Filter by search (client-side for search)
    const filteredDiffusions = filters.search
        ? diffusions.filter((d) => {
            const search = filters.search.toLowerCase();
            return (
                d.bien?.reference?.toLowerCase().includes(search) ||
                d.bien?.titre?.toLowerCase().includes(search) ||
                PORTAIL_LABELS[d.portail]?.toLowerCase().includes(search)
            );
        })
        : diffusions;

    // Group by bien
    const groupedByBien = filteredDiffusions.reduce((acc, d) => {
        const bienId = d.bienId;
        if (!acc[bienId]) {
            acc[bienId] = {
                bien: d.bien,
                diffusions: [],
            };
        }
        acc[bienId].diffusions.push(d);
        return acc;
    }, {} as Record<string, { bien: DiffusionWithRelations["bien"]; diffusions: DiffusionWithRelations[] }>);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Diffusion annonces"
                description="Gérez la diffusion de vos biens sur les portails immobiliers"
                actions={
                    <Button
                        onClick={handleDiffuser}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                        Diffuser un bien
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Annonces actives</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {actives}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Vues totales</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {totalVues.toLocaleString("fr-FR")}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Contacts générés</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {totalContacts}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Portails utilisés</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {portailsUtilises}
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
                        placeholder: "Rechercher par bien, portail...",
                        className: "flex-1",
                    },
                    {
                        type: "select",
                        value: filters.portail || "ALL",
                        onChange: (value) => handleFilterChange("portail", value),
                        options: PORTAIL_OPTIONS,
                        label: "Portail",
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
                <div className="space-y-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <div className="h-6 w-48 bg-black/5 rounded animate-pulse" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[...Array(3)].map((_, j) => (
                                    <div
                                        key={j}
                                        className="h-[280px] bg-black/5 rounded-lg animate-pulse"
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredDiffusions.length === 0 ? (
                <EmptyState
                    icon={Share2}
                    title="Aucune diffusion"
                    description={
                        filters.search ||
                        filters.portail !== "ALL" ||
                        filters.statut !== "ALL"
                            ? "Aucune diffusion ne correspond à vos critères"
                            : "Commencez par diffuser vos biens sur les portails"
                    }
                    action={
                        filters.search ||
                        filters.portail !== "ALL" ||
                        filters.statut !== "ALL"
                            ? undefined
                            : {
                                label: "Diffuser un bien",
                                onClick: handleDiffuser,
                            }
                    }
                />
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedByBien).map(([bienId, { bien, diffusions }]) => (
                        <div key={bienId}>
                            <div className="flex items-center gap-3 mb-4">
                                <Home className="w-5 h-5 text-black/40" />
                                <div>
                                    <h3 className="text-[15px] font-medium text-black">
                                        {bien?.titre || "Bien inconnu"}
                                    </h3>
                                    <p className="text-[12px] text-black/40">
                                        {bien?.reference} · {bien?.ville}
                                        {bien?.prixVente && (
                                            <> · {Number(bien.prixVente).toLocaleString("fr-FR")} €</>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {diffusions.map((diffusion) => (
                                    <DiffusionCard
                                        key={diffusion.id}
                                        diffusion={diffusion}
                                        onRefresh={handleRefresh}
                                        onView={handleView}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function DiffusionPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "grid",
                headerActionsCount: 1,
                statsCount: 4,
            }}
        >
            <DiffusionPageContent />
        </SuspensePage>
    );
}
