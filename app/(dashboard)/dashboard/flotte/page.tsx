"use client";

import { CamionnetteCard, CamionnetteDialog } from "@/components/flotte";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useFlottePage } from "@/hooks/use-flotte-page";
import { Car, Package, Plus, Truck } from "lucide-react";

export default function FlottePage() {
    const {
        dialogOpen,
        setDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        selectedCamionnette,
        handleCreate,
        handleEdit,
        handleDelete,
        handleDialogSuccess,
        confirmDelete,
        camionnettes,
        isLoading,
        stats,
        isDeleting,
    } = useFlottePage();

    return (
        <RouteGuard capability="stock_camionnette">
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Flotte de véhicules"
                    description="Gestion de vos camionnettes et véhicules"
                    actions={
                        <PrimaryActionButton onClick={handleCreate}>
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Nouveau véhicule
                        </PrimaryActionButton>
                    }
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        icon={Truck}
                        label="Total véhicules"
                        value={stats.total}
                        description="dans la flotte"
                    />
                    <StatCard
                        icon={Car}
                        label="Actifs"
                        value={stats.actifs}
                        description="véhicules en service"
                    />
                    <StatCard
                        icon={Car}
                        label="Inactifs"
                        value={stats.inactifs}
                        description="hors service"
                    />
                    <StatCard
                        icon={Package}
                        label="Stock total"
                        value={stats.totalStock}
                        description="articles en stock mobile"
                    />
                </div>

                {/* Vehicle List */}
                <div className="space-y-3">
                    {isLoading ? (
                        <GridSkeleton
                            itemCount={3}
                            gridColumns={{ default: 1 }}
                            gap={3}
                            itemHeight="h-[120px]"
                        />
                    ) : camionnettes.length === 0 ? (
                        <EmptyState
                            icon={Truck}
                            title="Aucun véhicule"
                            description="Ajoutez votre premier véhicule à la flotte"
                            action={{
                                label: "Ajouter un véhicule",
                                onClick: handleCreate,
                                icon: Plus,
                            }}
                            variant="dashed"
                        />
                    ) : (
                        camionnettes.map((camionnette) => (
                            <CamionnetteCard
                                key={camionnette.id}
                                camionnette={camionnette}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </div>

                {/* Create/Edit Dialog */}
                <CamionnetteDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSuccess={handleDialogSuccess}
                    camionnette={selectedCamionnette}
                />

                {/* Delete Confirmation Dialog */}
                <ConfirmDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={confirmDelete}
                    title="Supprimer ce véhicule ?"
                    description={`Cette action est irréversible. Le véhicule ${selectedCamionnette?.immatriculation} sera définitivement supprimé de votre flotte.`}
                    confirmLabel="Supprimer"
                    isLoading={isDeleting}
                />
            </div>
        </RouteGuard>
    );
}
