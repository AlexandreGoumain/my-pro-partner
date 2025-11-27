"use client";

import {
    DisponibilitesDialog,
    EmployeCard,
    EmployeDialog,
    EmployeStatsGrid,
} from "@/components/employes";
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
import { useEquipePage } from "@/hooks/use-equipe-page";
import { Plus, Users } from "lucide-react";

function EquipeContent() {
    const {
        searchTerm,
        setSearchTerm,
        actifFilter,
        setActifFilter,
        employes,
        isLoading,
        stats,
        handleCreate,
        handleEdit,
        handleDelete,
        handleDisponibilites,
        confirmDelete,
        createDialogOpen,
        setCreateDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        disponibilitesDialogOpen,
        setDisponibilitesDialogOpen,
        selectedEmploye,
        handleCreateSuccess,
        handleEditSuccess,
        handleDisponibilitesSuccess,
        isDeleting,
    } = useEquipePage();

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Équipe"
                description="Gérez vos employés et leurs disponibilités"
                actions={
                    <PrimaryActionButton icon={Plus} onClick={handleCreate}>
                        Nouvel employé
                    </PrimaryActionButton>
                }
            />

            {/* Statistics */}
            <EmployeStatsGrid stats={stats} />

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Rechercher un employé..."
                    className="max-w-md"
                />
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
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="active">Actifs</SelectItem>
                        <SelectItem value="inactive">Inactifs</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Employees Grid */}
            {isLoading ? (
                <GridSkeleton
                    itemCount={6}
                    gridColumns={{ md: 2, lg: 3 }}
                    gap={4}
                    itemHeight="h-[100px]"
                />
            ) : employes.length === 0 ? (
                <CardSection
                    title="Équipe"
                    className="border-black/8 shadow-sm"
                    titleClassName="text-[20px] tracking-[-0.02em]"
                >
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-4">
                            <Users className="w-6 h-6 text-black/40" />
                        </div>
                        <p className="text-[14px] text-black/40 mb-4">
                            Aucun employé enregistré
                        </p>
                        <PrimaryActionButton icon={Plus} onClick={handleCreate}>
                            Ajouter un employé
                        </PrimaryActionButton>
                    </div>
                </CardSection>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {employes.map((employe) => (
                        <EmployeCard
                            key={employe.id}
                            employe={employe}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onDisponibilites={handleDisponibilites}
                        />
                    ))}
                </div>
            )}

            {/* Create Dialog */}
            <EmployeDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={handleCreateSuccess}
            />

            {/* Edit Dialog */}
            <EmployeDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSuccess={handleEditSuccess}
                employe={selectedEmploye}
            />

            {/* Disponibilites Dialog */}
            <DisponibilitesDialog
                open={disponibilitesDialogOpen}
                onOpenChange={setDisponibilitesDialogOpen}
                onSuccess={handleDisponibilitesSuccess}
                employe={selectedEmploye}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Supprimer l'employé"
                description={`Êtes-vous sûr de vouloir supprimer ${selectedEmploye?.prenom} ${selectedEmploye?.nom} ? Cette action est irréversible.`}
                confirmLabel="Supprimer"
                onConfirm={confirmDelete}
                isLoading={isDeleting}
                variant="destructive"
            />
        </div>
    );
}

export default function EquipePage() {
    return (
        <RouteGuard capability="agenda">
            <SuspensePage
                skeletonProps={{
                    layout: "stats-grid",
                    statsCount: 3,
                    gridColumns: 3,
                    itemCount: 6,
                    itemHeight: "h-[100px]",
                }}
            >
                <EquipeContent />
            </SuspensePage>
        </RouteGuard>
    );
}
