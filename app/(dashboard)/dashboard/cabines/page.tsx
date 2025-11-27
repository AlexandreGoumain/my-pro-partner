"use client";

import {
    CabineCard,
    CabineDialog,
    CabineStatsGrid,
} from "@/components/cabines";
import { CardSection } from "@/components/ui/card-section";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
import { SearchBar } from "@/components/ui/search-bar";
import { useCabinesPage } from "@/hooks/use-cabines-page";
import { DoorOpen, Plus } from "lucide-react";

export default function CabinesPage() {
    const {
        cabines,
        allCabines,
        isLoading,
        search,
        setSearch,
        dialogOpen,
        setDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        selectedCabine,
        openCreateDialog,
        openEditDialog,
        openDeleteDialog,
        handleDialogSuccess,
        handleDelete,
        isDeleting,
    } = useCabinesPage();

    return (
        <RouteGuard capability="agenda">
            <div className="space-y-8">
                {/* Header */}
                <PageHeader
                    title="Cabines"
                    description="Gérez vos cabines et salles de soins"
                    actions={
                        <PrimaryActionButton onClick={openCreateDialog}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvelle cabine
                        </PrimaryActionButton>
                    }
                />

                {/* Stats */}
                <CabineStatsGrid cabines={allCabines} isLoading={isLoading} />

                {/* Search & List */}
                <CardSection
                    title="Toutes les cabines"
                    description="Liste de vos cabines et salles de soins"
                    action={
                        <SearchBar
                            value={search}
                            onChange={setSearch}
                            placeholder="Rechercher une cabine..."
                            className="w-[280px]"
                            inputClassName="h-10"
                        />
                    }
                >
                    {isLoading ? (
                        <GridSkeleton
                            itemCount={4}
                            gridColumns={{ md: 2, lg: 3 }}
                        />
                    ) : cabines.length === 0 ? (
                        <EmptyState
                            icon={DoorOpen}
                            title={search ? "Aucun résultat" : "Aucune cabine"}
                            description={
                                search
                                    ? "Modifiez votre recherche"
                                    : "Créez votre première cabine pour organiser votre planning"
                            }
                            action={
                                !search
                                    ? {
                                          label: "Créer une cabine",
                                          onClick: openCreateDialog,
                                          icon: Plus,
                                      }
                                    : undefined
                            }
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {cabines.map((cabine) => (
                                <CabineCard
                                    key={cabine.id}
                                    cabine={cabine}
                                    onEdit={openEditDialog}
                                    onDelete={openDeleteDialog}
                                />
                            ))}
                        </div>
                    )}
                </CardSection>

                {/* Dialogs */}
                <CabineDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSuccess={handleDialogSuccess}
                    cabine={selectedCabine}
                />

                <ConfirmDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={handleDelete}
                    title="Supprimer la cabine"
                    description={`Êtes-vous sûr de vouloir supprimer "${selectedCabine?.nom}" ? Cette action est irréversible.`}
                    confirmLabel="Supprimer"
                    isLoading={isDeleting}
                />
            </div>
        </RouteGuard>
    );
}
