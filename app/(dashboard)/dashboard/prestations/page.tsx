"use client";

import {
    PrestationCard,
    PrestationDialog,
    PrestationStatsGrid,
} from "@/components/prestations";
import { CardSection } from "@/components/ui/card-section";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
import { SearchBar } from "@/components/ui/search-bar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SuspensePage } from "@/components/ui/suspense-page";
import {
    PRESTATION_CATEGORIES,
    type PrestationCategorie,
} from "@/hooks/use-prestations";
import { usePrestationsPage } from "@/hooks/use-prestations-page";
import { Plus, Scissors } from "lucide-react";

function PrestationsContent() {
    const {
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        actifFilter,
        setActifFilter,
        prestations,
        groupedPrestations,
        isLoading,
        stats,
        handleCreate,
        handleEdit,
        handleDelete,
        confirmDelete,
        createDialogOpen,
        setCreateDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        selectedPrestation,
        handleCreateSuccess,
        handleEditSuccess,
        isDeleting,
    } = usePrestationsPage();

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Prestations"
                description="Gérez vos services et tarifs"
                actions={
                    <PrimaryActionButton icon={Plus} onClick={handleCreate}>
                        Nouvelle prestation
                    </PrimaryActionButton>
                }
            />

            {/* Statistics */}
            <PrestationStatsGrid stats={stats} />

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Rechercher une prestation..."
                    className="max-w-md"
                />
                <Select
                    value={categoryFilter}
                    onValueChange={(value) =>
                        setCategoryFilter(value as PrestationCategorie | "all")
                    }
                >
                    <SelectTrigger className="w-[200px] h-11 text-[14px] border-black/10">
                        <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            Toutes les catégories
                        </SelectItem>
                        {PRESTATION_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={actifFilter}
                    onValueChange={(value) =>
                        setActifFilter(value as "all" | "active" | "inactive")
                    }
                >
                    <SelectTrigger className="w-[180px] h-11 text-[14px] border-black/10">
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        <SelectItem value="active">Actives</SelectItem>
                        <SelectItem value="inactive">Inactives</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Prestations Grid */}
            {isLoading ? (
                <GridSkeleton
                    itemCount={8}
                    gridColumns={{ md: 2, lg: 3 }}
                    gap={4}
                    itemHeight="h-[120px]"
                />
            ) : prestations.length === 0 ? (
                <CardSection
                    title="Prestations"
                    className="border-black/8 shadow-sm"
                    titleClassName="text-[20px] tracking-[-0.02em]"
                >
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-4">
                            <Scissors className="w-6 h-6 text-black/40" />
                        </div>
                        <p className="text-[14px] text-black/40 mb-4">
                            Aucune prestation configurée
                        </p>
                        <PrimaryActionButton icon={Plus} onClick={handleCreate}>
                            Ajouter une prestation
                        </PrimaryActionButton>
                    </div>
                </CardSection>
            ) : categoryFilter === "all" ? (
                // Show grouped by category
                <div className="space-y-6">
                    {groupedPrestations.map(([category, items]) => (
                        <CardSection
                            key={category}
                            title={category}
                            className="border-black/8 shadow-sm"
                            titleClassName="text-[20px] tracking-[-0.02em]"
                        >
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {items.map((prestation) => (
                                    <PrestationCard
                                        key={prestation.id}
                                        prestation={prestation}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        </CardSection>
                    ))}
                </div>
            ) : (
                // Show flat list when filtered by category
                <CardSection
                    title={categoryFilter}
                    className="border-black/8 shadow-sm"
                    titleClassName="text-[20px] tracking-[-0.02em]"
                >
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {prestations.map((prestation) => (
                            <PrestationCard
                                key={prestation.id}
                                prestation={prestation}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </CardSection>
            )}

            {/* Create Dialog */}
            <PrestationDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={handleCreateSuccess}
            />

            {/* Edit Dialog */}
            <PrestationDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSuccess={handleEditSuccess}
                prestation={selectedPrestation}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Supprimer la prestation"
                description={`Êtes-vous sûr de vouloir supprimer "${selectedPrestation?.nom}" ? Cette action est irréversible.`}
                confirmLabel="Supprimer"
                onConfirm={confirmDelete}
                isLoading={isDeleting}
                variant="destructive"
            />
        </div>
    );
}

export default function PrestationsPage() {
    return (
        <RouteGuard capability="agenda">
            <SuspensePage
                skeletonProps={{
                    layout: "stats-grid",
                    statsCount: 4,
                    gridColumns: 3,
                    itemCount: 6,
                    itemHeight: "h-[120px]",
                }}
            >
                <PrestationsContent />
            </SuspensePage>
        </RouteGuard>
    );
}
