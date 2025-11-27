"use client";

import { AgendaHeader, RdvCard, RdvDialog } from "@/components/agenda";
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
            <div className="flex gap-3 flex-wrap">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Rechercher un client..."
                    className="max-w-md"
                />
                <Select
                    value={statutFilter}
                    onValueChange={(value) =>
                        setStatutFilter(value as RendezVousStatut | "all")
                    }
                >
                    <SelectTrigger className="w-[180px] h-11 text-[14px] border-black/10">
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        {RENDEZ_VOUS_STATUTS.map((statut) => (
                            <SelectItem key={statut.value} value={statut.value}>
                                {statut.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={employeFilter}
                    onValueChange={(value) => setEmployeFilter(value)}
                >
                    <SelectTrigger className="w-[200px] h-11 text-[14px] border-black/10">
                        <SelectValue placeholder="Employé" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les employés</SelectItem>
                        {employes.map((employe) => (
                            <SelectItem key={employe.id} value={employe.id}>
                                {employe.prenom} {employe.nom}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* RDV List */}
            {isLoading ? (
                <GridSkeleton
                    itemCount={6}
                    gridColumns={{ md: 1, lg: 2 }}
                    gap={4}
                    itemHeight="h-[120px]"
                />
            ) : rendezVous.length === 0 ? (
                <CardSection
                    title="Rendez-vous"
                    className="border-black/8 shadow-sm"
                    titleClassName="text-[20px] tracking-[-0.02em]"
                >
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-4">
                            <Calendar className="w-6 h-6 text-black/40" />
                        </div>
                        <p className="text-[14px] text-black/40 mb-4">
                            Aucun rendez-vous pour cette période
                        </p>
                        <PrimaryActionButton icon={Plus} onClick={handleCreate}>
                            Ajouter un rendez-vous
                        </PrimaryActionButton>
                    </div>
                </CardSection>
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
