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
    Building2, Plus, MapPin, Calendar
} from "lucide-react";
import { useCoproprietes, type CoproprieteWithRelations, type CoproprietesFilters } from "@/hooks/syndic/use-coproprietes";

interface CoproprietesPageFilters {
    statut: string;
    search: string;
}

const STATUT_OPTIONS = [
    { value: "ALL", label: "Tous les statuts" },
    { value: "ACTIF", label: "Actif" },
    { value: "EN_CREATION", label: "En création" },
    { value: "RESILIE", label: "Résilié" },
];

const STATUT_CONFIG: Record<string, { label: string; variant: "default" | "outline" | "secondary" }> = {
    ACTIF: { label: "Actif", variant: "default" },
    EN_CREATION: { label: "En création", variant: "outline" },
    RESILIE: { label: "Résilié", variant: "secondary" },
};

function CoproprieteCard({ copro, onView, onEdit }: {
    copro: CoproprieteWithRelations;
    onView: (c: CoproprieteWithRelations) => void;
    onEdit: (c: CoproprieteWithRelations) => void;
}) {
    // Default to "ACTIF" since statut is not in the schema
    const statutConfig = STATUT_CONFIG["ACTIF"];
    const lotsCount = copro._count?.lots || copro.nbLots;

    return (
        <Card
            className="p-5 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer"
            onClick={() => onView(copro)}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] text-black/40">{copro.reference}</span>
                        <Badge variant={statutConfig.variant} className="text-[10px] h-5">
                            {statutConfig.label}
                        </Badge>
                    </div>
                    <h3 className="text-[16px] font-medium text-black">
                        {copro.nom}
                    </h3>
                </div>
                <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-black/40" />
                </div>
            </div>

            {/* Adresse */}
            <div className="flex items-center gap-2 text-[13px] text-black/60 mb-4">
                <MapPin className="w-4 h-4 text-black/40" />
                <span>{copro.adresse}, {copro.codePostal} {copro.ville}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-black/[0.02] rounded-lg p-3">
                    <p className="text-[11px] text-black/40 mb-1">Lots</p>
                    <p className="text-[18px] font-bold text-black">{lotsCount}</p>
                    <p className="text-[10px] text-black/40">{copro.nbBatiments} bâtiment{copro.nbBatiments > 1 ? "s" : ""}</p>
                </div>
                <div className="bg-black/[0.02] rounded-lg p-3">
                    <p className="text-[11px] text-black/40 mb-1">Tantièmes</p>
                    <p className="text-[18px] font-bold text-black">{copro.totalTantiemes.toLocaleString("fr-FR")}</p>
                    <p className="text-[10px] text-black/40">total</p>
                </div>
            </div>

            {/* Date prise syndic */}
            <div className="flex items-center gap-2 text-[12px] text-black/40 mb-4">
                <Calendar className="w-3.5 h-3.5" />
                <span>Prise en charge: {new Date(copro.datePriseSyndic).toLocaleDateString("fr-FR")}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[12px] h-8 flex-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(copro);
                    }}
                >
                    Voir détails
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[12px] h-8"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(copro);
                    }}
                >
                    Modifier
                </Button>
            </div>
        </Card>
    );
}

function CoproprietesPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<CoproprietesPageFilters>({
        statut: "ALL",
        search: "",
    });

    const apiFilters: CoproprietesFilters = {
        search: filters.search || undefined,
    };

    const { data: coproprietes = [], isLoading } = useCoproprietes(apiFilters);

    const handleFilterChange = useCallback(
        (key: keyof CoproprietesPageFilters, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleView = useCallback((copro: CoproprieteWithRelations) => {
        router.push(`/dashboard/coproprietes/${copro.id}`);
    }, [router]);

    const handleEdit = useCallback((copro: CoproprieteWithRelations) => {
        router.push(`/dashboard/coproprietes/${copro.id}/edit`);
    }, [router]);

    const handleCreate = useCallback(() => {
        router.push("/dashboard/coproprietes/nouveau");
    }, [router]);

    // No client-side filter for statut since it's not in the schema
    const filteredCopros = coproprietes;

    // Stats
    const totalCopros = coproprietes.length;
    const totalLots = coproprietes.reduce((acc, c) => acc + (c._count?.lots || c.nbLots || 0), 0);
    const totalTantiemes = coproprietes.reduce((acc, c) => acc + c.totalTantiemes, 0);
    const totalAssemblees = coproprietes.reduce((acc, c) => acc + (c._count?.assemblees || 0), 0);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Copropriétés"
                description="Gérez vos copropriétés et leurs comptes"
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                        Nouvelle copropriété
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Copropriétés gérées</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {totalCopros}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Lots totaux</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {totalLots}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Tantièmes totaux</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {totalTantiemes.toLocaleString("fr-FR")}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Assemblées</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {totalAssemblees}
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
                        placeholder: "Rechercher par nom, adresse, ville...",
                        className: "flex-1",
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
                            className="h-[320px] bg-black/5 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : filteredCopros.length === 0 ? (
                <EmptyState
                    icon={Building2}
                    title="Aucune copropriété"
                    description={
                        filters.search || filters.statut !== "ALL"
                            ? "Aucune copropriété ne correspond à vos critères"
                            : "Créez votre première copropriété"
                    }
                    action={
                        filters.search || filters.statut !== "ALL"
                            ? undefined
                            : {
                                label: "Créer une copropriété",
                                onClick: handleCreate,
                            }
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCopros.map((copro) => (
                        <CoproprieteCard
                            key={copro.id}
                            copro={copro}
                            onView={handleView}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CoproprietesPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "grid",
                headerActionsCount: 1,
                statsCount: 4,
            }}
        >
            <CoproprietesPageContent />
        </SuspensePage>
    );
}
