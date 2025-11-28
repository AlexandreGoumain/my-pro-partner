"use client";

import { EntretienDialog, EntretienVehiculeCard } from "@/components/flotte";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/ui/filter-bar";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
import { StatCard } from "@/components/ui/stat-card";
import {
    useDeleteEntretienVehicule,
    useEntretiensVehicules,
} from "@/hooks/use-entretiens-vehicules";
import { useFlotte } from "@/hooks/use-flotte";
import type { EntretienVehicule } from "@/lib/types/flotte";
import { TYPE_ENTRETIEN_LABELS } from "@/lib/types/flotte";
import { Calendar, Euro, Plus, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function EntretiensPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedEntretien, setSelectedEntretien] =
        useState<EntretienVehicule | null>(null);
    const [filterVehicule, setFilterVehicule] = useState<string>("all");
    const [filterType, setFilterType] = useState<string>("all");

    const { data: camionnettes = [] } = useFlotte();
    const { data: entretiens = [], isLoading } = useEntretiensVehicules({
        camionnetteId: filterVehicule !== "all" ? filterVehicule : undefined,
        type: filterType !== "all" ? filterType : undefined,
    });
    const deleteEntretien = useDeleteEntretienVehicule();

    // Stats
    const stats = useMemo(() => {
        const total = entretiens.length;
        const coutTotal = entretiens.reduce(
            (acc, e) => acc + (Number(e.cout) || 0),
            0
        );
        const thisMonth = entretiens.filter((e) => {
            const date = new Date(e.dateEntretien);
            const now = new Date();
            return (
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear()
            );
        }).length;
        return { total, coutTotal, thisMonth };
    }, [entretiens]);

    const handleCreate = () => {
        setSelectedEntretien(null);
        setDialogOpen(true);
    };

    const handleEdit = (entretien: EntretienVehicule) => {
        setSelectedEntretien(entretien);
        setDialogOpen(true);
    };

    const handleDelete = (entretien: EntretienVehicule) => {
        setSelectedEntretien(entretien);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedEntretien) return;

        deleteEntretien.mutate(selectedEntretien.id, {
            onSuccess: () => {
                toast.success("Entretien supprimé", {
                    description: "L'entretien a été supprimé",
                });
                setDeleteDialogOpen(false);
                setSelectedEntretien(null);
            },
            onError: (error) => {
                toast.error("Erreur", {
                    description:
                        error instanceof Error
                            ? error.message
                            : "Impossible de supprimer l'entretien",
                });
            },
        });
    };

    return (
        <RouteGuard capability="stock_camionnette">
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Entretiens véhicules"
                    description="Suivi des entretiens et réparations de votre flotte"
                    actions={
                        <PrimaryActionButton onClick={handleCreate}>
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Nouvel entretien
                        </PrimaryActionButton>
                    }
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        icon={Wrench}
                        label="Total entretiens"
                        value={stats.total}
                        description="entretiens enregistrés"
                    />
                    <StatCard
                        icon={Calendar}
                        label="Ce mois"
                        value={stats.thisMonth}
                        description="entretiens ce mois"
                    />
                    <StatCard
                        icon={Euro}
                        label="Coût total"
                        value={`${stats.coutTotal.toLocaleString("fr-FR")} €`}
                        description="dépenses d'entretien"
                    />
                </div>

                {/* Filters */}
                <FilterBar
                    filters={[
                        {
                            type: "select",
                            value: filterVehicule,
                            onChange: setFilterVehicule,
                            placeholder: "Véhicule",
                            options: [
                                { value: "all", label: "Tous les véhicules" },
                                ...camionnettes.map((c) => ({
                                    value: c.id,
                                    label: c.immatriculation,
                                })),
                            ],
                            className: "w-[200px]",
                        },
                        {
                            type: "select",
                            value: filterType,
                            onChange: setFilterType,
                            placeholder: "Type",
                            options: [
                                { value: "all", label: "Tous les types" },
                                ...Object.entries(TYPE_ENTRETIEN_LABELS).map(
                                    ([value, label]) => ({
                                        value,
                                        label: label as string,
                                    })
                                ),
                            ],
                            className: "w-[180px]",
                        },
                    ]}
                />

                {/* Entretiens List */}
                <div className="space-y-3">
                    {isLoading ? (
                        <GridSkeleton
                            itemCount={3}
                            gridColumns={{ default: 1 }}
                            gap={3}
                            itemHeight="h-[100px]"
                        />
                    ) : entretiens.length === 0 ? (
                        <EmptyState
                            icon={Wrench}
                            title="Aucun entretien"
                            description="Enregistrez le premier entretien d'un véhicule"
                            action={{
                                label: "Ajouter un entretien",
                                onClick: handleCreate,
                                icon: Plus,
                            }}
                            variant="dashed"
                        />
                    ) : (
                        entretiens.map((entretien) => (
                            <EntretienVehiculeCard
                                key={entretien.id}
                                entretien={entretien}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </div>

                {/* Create/Edit Dialog */}
                <EntretienDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSuccess={() => setDialogOpen(false)}
                    entretien={selectedEntretien}
                    camionnettes={camionnettes}
                />

                {/* Delete Confirmation Dialog */}
                <ConfirmDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={confirmDelete}
                    title="Supprimer cet entretien ?"
                    description="Cette action est irréversible. L'entretien sera définitivement supprimé."
                    confirmLabel="Supprimer"
                    isLoading={deleteEntretien.isPending}
                />
            </div>
        </RouteGuard>
    );
}
