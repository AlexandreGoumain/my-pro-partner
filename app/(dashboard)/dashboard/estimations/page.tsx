"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/ui/filter-bar";
import { PageHeader } from "@/components/ui/page-header";
import { SuspensePage } from "@/components/ui/suspense-page";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { Calculator, Plus, MapPin, Calendar, User } from "lucide-react";
import { useEstimations, type EstimationWithRelations, type EstimationsFilters as ApiEstimationsFilters } from "@/hooks/immobilier/use-estimations";

interface PageFilters {
    search: string;
}

const TYPE_BIEN_LABELS: Record<string, string> = {
    APPARTEMENT: "Appartement",
    MAISON: "Maison",
    TERRAIN: "Terrain",
    LOCAL_COMMERCIAL: "Local commercial",
    IMMEUBLE: "Immeuble",
    PARKING: "Parking",
};

function EstimationCard({ estimation, onView }: {
    estimation: EstimationWithRelations;
    onView: (e: EstimationWithRelations) => void;
}) {
    const prixBas = Number(estimation.prixEstimeBas);
    const prixHaut = Number(estimation.prixEstimeHaut);
    const prixRecommande = Number(estimation.prixRecommande);
    const fourchette = prixHaut - prixBas;
    const variance = prixRecommande > 0 ? ((fourchette / prixRecommande) * 100).toFixed(1) : "0";
    const surface = estimation.bien?.surface ? Number(estimation.bien.surface) : 0;
    const prixM2 = surface > 0 ? Math.round(prixRecommande / surface) : 0;

    return (
        <Card
            className="p-5 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer"
            onClick={() => onView(estimation)}
        >
            <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                    {estimation.bien && (
                        <>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[12px] text-black/40">{estimation.bien.reference}</span>
                            </div>
                            <h3 className="text-[15px] font-medium text-black">
                                {TYPE_BIEN_LABELS[estimation.bien.typeBien] || estimation.bien.typeBien}
                                {surface > 0 && ` - ${surface} m²`}
                                {estimation.bien.nbPieces && ` - ${estimation.bien.nbPieces} pièces`}
                            </h3>
                        </>
                    )}
                </div>
            </div>

            {/* Adresse */}
            {estimation.bien && (
                <div className="flex items-center gap-2 text-[13px] text-black/60 mb-4">
                    <MapPin className="w-4 h-4 text-black/40" />
                    <span>{estimation.bien.adresse}, {estimation.bien.ville}</span>
                </div>
            )}

            {/* Estimation */}
            <div className="bg-black/[0.02] rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] text-black/40">Estimation</span>
                    <span className="text-[12px] text-black/40">± {variance}%</span>
                </div>
                <div className="flex items-end gap-2 mb-2">
                    <span className="text-[24px] font-bold tracking-[-0.02em] text-black">
                        {prixRecommande.toLocaleString("fr-FR")} €
                    </span>
                </div>
                <div className="flex items-center gap-2 text-[12px]">
                    <span className="text-black/40">Fourchette :</span>
                    <span className="text-black/60">
                        {prixBas.toLocaleString("fr-FR")} € - {prixHaut.toLocaleString("fr-FR")} €
                    </span>
                </div>
                {prixM2 > 0 && (
                    <div className="flex items-center gap-2 text-[12px] mt-1">
                        <span className="text-black/40">Prix/m² :</span>
                        <span className="text-black/60">
                            {prixM2.toLocaleString("fr-FR")} €/m²
                        </span>
                    </div>
                )}
            </div>

            {/* Agent */}
            {estimation.agent && (
                <div className="flex items-center gap-2 text-[13px] text-black/60 mb-4">
                    <User className="w-4 h-4 text-black/40" />
                    <span>{estimation.agent.prenom} {estimation.agent.nom}</span>
                </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-2 text-[12px] text-black/40 mb-4">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                    {new Date(estimation.dateEstimation).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    })}
                </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[12px] h-8"
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(estimation);
                    }}
                >
                    Voir détails
                </Button>
            </div>
        </Card>
    );
}

function EstimationsPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<PageFilters>({
        search: "",
    });

    const apiFilters: ApiEstimationsFilters = {
        search: filters.search || undefined,
    };

    const { data: estimations = [], isLoading } = useEstimations(apiFilters);

    const handleFilterChange = useCallback(
        (key: keyof PageFilters, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleView = useCallback((estimation: EstimationWithRelations) => {
        router.push(`/dashboard/estimations/${estimation.id}`);
    }, [router]);

    const handleCreate = useCallback(() => {
        router.push("/dashboard/estimations/nouveau");
    }, [router]);

    // Stats
    const totalCount = estimations.length;
    const thisMonthCount = estimations.filter((e) => {
        const date = new Date(e.dateEstimation);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
    const totalValeur = estimations.reduce((acc, e) => acc + Number(e.prixRecommande), 0);

    // Filter by search (client-side)
    const filteredEstimations = estimations;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Estimations"
                description="Réalisez des estimations de biens et convertissez-les en mandats"
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                        Nouvelle estimation
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Total estimations</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {totalCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Ce mois</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {thisMonthCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Valeur totale estimée</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {(totalValeur / 1000000).toFixed(1)}M €
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
                        placeholder: "Rechercher par bien, agent...",
                        className: "flex-1",
                    },
                ]}
            />

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="h-[320px] bg-black/5 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : filteredEstimations.length === 0 ? (
                <EmptyState
                    icon={Calculator}
                    title="Aucune estimation"
                    description={
                        filters.search
                            ? "Aucune estimation ne correspond à vos critères"
                            : "Commencez par créer votre première estimation"
                    }
                    action={
                        filters.search
                            ? undefined
                            : {
                                label: "Créer une estimation",
                                onClick: handleCreate,
                            }
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEstimations.map((estimation) => (
                        <EstimationCard
                            key={estimation.id}
                            estimation={estimation}
                            onView={handleView}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function EstimationsPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "grid",
                headerActionsCount: 1,
                statsCount: 3,
            }}
        >
            <EstimationsPageContent />
        </SuspensePage>
    );
}
