"use client";

import { AgendaHeader, RdvCard, RdvDialog } from "@/components/agenda";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/ui/filter-bar";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
import { SuspensePage } from "@/components/ui/suspense-page";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAgendaPage, type ViewMode } from "@/hooks/use-agenda-page";
import {
    RENDEZ_VOUS_STATUTS,
    type RendezVousStatut,
} from "@/hooks/use-rendez-vous";
import { Calendar, Plus } from "lucide-react";

function AgendaContent() {
    const {
        viewMode,
        setViewMode,
        selectedDate,
        goToToday,
        goToPrevious,
        goToNext,
        searchTerm,
        setSearchTerm,
        statutFilter,
        setStatutFilter,
        employeFilter,
        setEmployeFilter,
        rendezVous,
        isLoading,
        employes,
        handleCreate,
        handleEdit,
        handleDelete,
        handleConfirm,
        handleCancel,
        confirmDelete,
        createDialogOpen,
        setCreateDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        selectedRdv,
        handleCreateSuccess,
        handleEditSuccess,
        isDeleting,
    } = useAgendaPage();

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Agenda"
                description="Gérez vos rendez-vous"
                actions={
                    <PrimaryActionButton icon={Plus} onClick={handleCreate}>
                        Nouveau RDV
                    </PrimaryActionButton>
                }
            />

            {/* View Mode Tabs & Date Navigation */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <AgendaHeader
                    selectedDate={selectedDate}
                    viewMode={viewMode}
                    onToday={goToToday}
                    onPrevious={goToPrevious}
                    onNext={goToNext}
                />
                <Tabs
                    value={viewMode}
                    onValueChange={(v) => setViewMode(v as ViewMode)}
                >
                    <TabsList className="h-9">
                        <TabsTrigger value="day" className="text-[13px] px-4">
                            Jour
                        </TabsTrigger>
                        <TabsTrigger value="week" className="text-[13px] px-4">
                            Semaine
                        </TabsTrigger>
                        <TabsTrigger value="list" className="text-[13px] px-4">
                            Liste
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Filters */}
            <FilterBar
                filters={[
                    {
                        type: "search",
                        value: searchTerm,
                        onChange: setSearchTerm,
                        placeholder: "Rechercher un client...",
                        className: "max-w-md",
                    },
                    {
                        type: "select",
                        value: statutFilter,
                        onChange: (value) => setStatutFilter(value as RendezVousStatut | "all"),
                        placeholder: "Statut",
                        options: [
                            { value: "all", label: "Tous les statuts" },
                            ...RENDEZ_VOUS_STATUTS.map((statut) => ({
                                value: statut.value,
                                label: statut.label,
                            })),
                        ],
                        className: "w-[180px]",
                    },
                    {
                        type: "select",
                        value: employeFilter,
                        onChange: setEmployeFilter,
                        placeholder: "Employé",
                        options: [
                            { value: "all", label: "Tous les employés" },
                            ...employes.map((employe) => ({
                                value: employe.id,
                                label: `${employe.prenom} ${employe.nom}`,
                            })),
                        ],
                        className: "w-[200px]",
                    },
                ]}
            />

            {/* RDV List */}
            {isLoading ? (
                <GridSkeleton
                    itemCount={6}
                    gridColumns={{ md: 1, lg: 2 }}
                    gap={4}
                    itemHeight="h-[120px]"
                />
            ) : rendezVous.length === 0 ? (
                <EmptyState
                    icon={Calendar}
                    title="Aucun rendez-vous"
                    description="Aucun rendez-vous pour cette période"
                    action={{
                        label: "Ajouter un rendez-vous",
                        onClick: handleCreate,
                        icon: Plus,
                    }}
                    variant="dashed"
                />
            ) : (
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                    {rendezVous.map((rdv) => (
                        <RdvCard
                            key={rdv.id}
                            rdv={rdv}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onConfirm={handleConfirm}
                            onCancel={handleCancel}
                            showDate={viewMode !== "day"}
                        />
                    ))}
                </div>
            )}

            {/* Create Dialog */}
            <RdvDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={handleCreateSuccess}
                defaultDate={selectedDate}
            />

            {/* Edit Dialog */}
            <RdvDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSuccess={handleEditSuccess}
                rdv={selectedRdv}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Supprimer le rendez-vous"
                description={`Êtes-vous sûr de vouloir supprimer ce rendez-vous avec ${selectedRdv?.nomClient} ? Cette action est irréversible.`}
                confirmLabel="Supprimer"
                onConfirm={confirmDelete}
                isLoading={isDeleting}
                variant="destructive"
            />
        </div>
    );
}

export default function AgendaPage() {
    return (
        <RouteGuard capability="agenda">
            <SuspensePage
                skeletonProps={{
                    layout: "list",
                    gridColumns: 2,
                    itemCount: 6,
                    itemHeight: "h-[120px]",
                }}
            >
                <AgendaContent />
            </SuspensePage>
        </RouteGuard>
    );
}
