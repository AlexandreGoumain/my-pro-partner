"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BienCard } from "@/components/immobilier/bien-card";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/ui/filter-bar";
import { PageHeader } from "@/components/ui/page-header";
import { SuspensePage } from "@/components/ui/suspense-page";
import { EmptyState } from "@/components/ui/empty-state";
import { useBiens, type BiensFilters, type BienWithRelations } from "@/hooks/immobilier/use-biens";
import { Home, Plus, Search } from "lucide-react";

const TYPE_BIEN_OPTIONS = [
    { value: "ALL", label: "Tous les types" },
    { value: "APPARTEMENT", label: "Appartement" },
    { value: "MAISON", label: "Maison" },
    { value: "TERRAIN", label: "Terrain" },
    { value: "LOCAL_COMMERCIAL", label: "Local commercial" },
    { value: "BUREAU", label: "Bureau" },
    { value: "IMMEUBLE", label: "Immeuble" },
    { value: "PARKING", label: "Parking" },
];

const STATUT_OPTIONS = [
    { value: "ALL", label: "Tous les statuts" },
    { value: "DISPONIBLE", label: "Disponible" },
    { value: "EN_MANDAT", label: "En mandat" },
    { value: "SOUS_COMPROMIS", label: "Sous compromis" },
    { value: "VENDU", label: "Vendu" },
    { value: "LOUE", label: "Loué" },
];

function BiensImmoPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<BiensFilters>({
        typeBien: "ALL",
        statut: "ALL",
        search: "",
    });

    const { data: biens = [], isLoading } = useBiens(filters);

    const handleFilterChange = useCallback(
        (key: keyof BiensFilters, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleView = useCallback((bien: BienWithRelations) => {
        router.push(`/dashboard/biens-immo/${bien.id}`);
    }, [router]);

    const handleEdit = useCallback((bien: BienWithRelations) => {
        router.push(`/dashboard/biens-immo/${bien.id}/edit`);
    }, [router]);

    const handleDelete = useCallback((_bien: BienWithRelations) => {
        // Handled via confirmation dialog in the component
    }, []);

    const handleDiffuse = useCallback((bien: BienWithRelations) => {
        router.push(`/dashboard/diffusion/nouveau?bienId=${bien.id}`);
    }, [router]);

    const handleCreate = useCallback(() => {
        router.push("/dashboard/biens-immo/nouveau");
    }, [router]);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Portefeuille de biens"
                description="Gérez vos biens immobiliers et suivez leur statut"
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                        Nouveau bien
                    </Button>
                }
            />

            <FilterBar
                variant="card"
                filters={[
                    {
                        type: "search",
                        value: filters.search || "",
                        onChange: (value) => handleFilterChange("search", value),
                        placeholder: "Rechercher par référence, titre, ville...",
                        className: "flex-1",
                    },
                    {
                        type: "select",
                        value: filters.typeBien || "ALL",
                        onChange: (value) => handleFilterChange("typeBien", value),
                        options: TYPE_BIEN_OPTIONS,
                        label: "Type de bien",
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
                            className="h-[380px] bg-black/5 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : biens.length === 0 ? (
                <EmptyState
                    icon={Home}
                    title="Aucun bien immobilier"
                    description={
                        filters.search || filters.typeBien !== "ALL" || filters.statut !== "ALL"
                            ? "Aucun bien ne correspond à vos critères de recherche"
                            : "Commencez par ajouter votre premier bien immobilier"
                    }
                    action={
                        filters.search || filters.typeBien !== "ALL" || filters.statut !== "ALL"
                            ? undefined
                            : {
                                label: "Ajouter un bien",
                                onClick: handleCreate,
                            }
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {biens.map((bien) => (
                        <BienCard
                            key={bien.id}
                            bien={bien}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onDiffuse={handleDiffuse}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function BiensImmoPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "grid",
                headerActionsCount: 1,
            }}
        >
            <BiensImmoPageContent />
        </SuspensePage>
    );
}
