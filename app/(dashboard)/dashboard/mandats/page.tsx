"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MandatCard } from "@/components/immobilier/mandat-card";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/ui/filter-bar";
import { PageHeader } from "@/components/ui/page-header";
import { SuspensePage } from "@/components/ui/suspense-page";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { useMandats, useMandatsExpiring, type MandatsFilters, type MandatWithRelations } from "@/hooks/immobilier/use-mandats";
import { FileSignature, Plus, AlertTriangle } from "lucide-react";

const TYPE_MANDAT_OPTIONS = [
    { value: "ALL", label: "Tous les types" },
    { value: "VENTE_SIMPLE", label: "Vente simple" },
    { value: "VENTE_EXCLUSIF", label: "Vente exclusif" },
    { value: "LOCATION_SIMPLE", label: "Location simple" },
    { value: "LOCATION_EXCLUSIF", label: "Location exclusif" },
    { value: "RECHERCHE", label: "Recherche" },
];

const STATUT_OPTIONS = [
    { value: "ALL", label: "Tous les statuts" },
    { value: "EN_COURS", label: "En cours" },
    { value: "SOUS_COMPROMIS", label: "Sous compromis" },
    { value: "VENDU", label: "Vendu" },
    { value: "LOUE", label: "Loué" },
    { value: "EXPIRE", label: "Expiré" },
    { value: "ANNULE", label: "Annulé" },
];

function MandatsPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<MandatsFilters>({
        typeMandat: "ALL",
        statut: "ALL",
        search: "",
    });

    const { data: mandats = [], isLoading } = useMandats(filters);
    const { data: expiringMandats = [] } = useMandatsExpiring();

    const handleFilterChange = useCallback(
        (key: keyof MandatsFilters, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value as any }));
        },
        []
    );

    const handleView = useCallback((mandat: MandatWithRelations) => {
        router.push(`/dashboard/mandats/${mandat.id}`);
    }, [router]);

    const handleEdit = useCallback((mandat: MandatWithRelations) => {
        router.push(`/dashboard/mandats/${mandat.id}/edit`);
    }, [router]);

    const handleRenew = useCallback((mandat: MandatWithRelations) => {
        router.push(`/dashboard/mandats/${mandat.id}/renouveler`);
    }, [router]);

    const handleCreate = useCallback(() => {
        router.push("/dashboard/mandats/nouveau");
    }, [router]);

    // Stats
    const activeCount = mandats.filter((m) => m.statut === "EN_COURS").length;
    const exclusifCount = mandats.filter(
        (m) => m.statut === "EN_COURS" && m.typeMandat?.includes("EXCLUSIF")
    ).length;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Gestion des mandats"
                description="Suivez vos mandats de vente et leurs échéances"
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                        Nouveau mandat
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Mandats actifs</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {activeCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Mandats exclusifs</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {exclusifCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">À renouveler (30j)</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-amber-600">
                        {expiringMandats.length}
                    </p>
                </Card>
            </div>

            {/* Alerte mandats expirants */}
            {expiringMandats.length > 0 && (
                <Card className="p-4 bg-amber-50 border-amber-200">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600" strokeWidth={2} />
                        <div className="flex-1">
                            <p className="text-[14px] font-medium text-amber-800">
                                {expiringMandats.length} mandat
                                {expiringMandats.length > 1 ? "s" : ""} expire
                                {expiringMandats.length > 1 ? "nt" : ""} dans les 30 prochains
                                jours
                            </p>
                            <p className="text-[12px] text-amber-600">
                                Pensez à contacter vos mandants pour renouveler
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-amber-300 text-amber-700 hover:bg-amber-100"
                            onClick={() => setFilters((prev) => ({ ...prev, expiresSoon: true }))}
                        >
                            Voir les mandats
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
                        placeholder: "Rechercher par numéro, bien, mandant...",
                        className: "flex-1",
                    },
                    {
                        type: "select",
                        value: filters.typeMandat || "ALL",
                        onChange: (value) => handleFilterChange("typeMandat", value),
                        options: TYPE_MANDAT_OPTIONS,
                        label: "Type de mandat",
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
            ) : mandats.length === 0 ? (
                <EmptyState
                    icon={FileSignature}
                    title="Aucun mandat"
                    description={
                        filters.search ||
                        filters.typeMandat !== "ALL" ||
                        filters.statut !== "ALL"
                            ? "Aucun mandat ne correspond à vos critères"
                            : "Commencez par créer votre premier mandat de vente"
                    }
                    action={
                        filters.search ||
                        filters.typeMandat !== "ALL" ||
                        filters.statut !== "ALL"
                            ? undefined
                            : {
                                label: "Créer un mandat",
                                onClick: handleCreate,
                            }
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mandats.map((mandat) => (
                        <MandatCard
                            key={mandat.id}
                            mandat={mandat}
                            onView={handleView}
                            onEdit={handleEdit}
                            onRenew={handleRenew}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function MandatsPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "grid",
                headerActionsCount: 1,
                statsCount: 3,
            }}
        >
            <MandatsPageContent />
        </SuspensePage>
    );
}
