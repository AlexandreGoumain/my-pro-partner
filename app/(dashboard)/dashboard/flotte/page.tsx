"use client";

import { CamionnetteDialog } from "@/components/flotte/camionnette-dialog";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useDeleteCamionnette, useFlotte } from "@/hooks/use-flotte";
import type { Camionnette } from "@/lib/types/flotte";
import {
    Car,
    Gauge,
    MoreVertical,
    Package,
    Pencil,
    Plus,
    Trash2,
    Truck,
    User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function FlottePage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCamionnette, setSelectedCamionnette] =
        useState<Camionnette | null>(null);

    const { data: camionnettes = [], isLoading } = useFlotte();
    const deleteCamionnette = useDeleteCamionnette();

    // Stats
    const stats = useMemo(() => {
        const actifs = camionnettes.filter((c) => c.actif).length;
        const inactifs = camionnettes.length - actifs;
        const totalStock = camionnettes.reduce(
            (acc, c) => acc + (c._count?.stock || 0),
            0
        );
        return { total: camionnettes.length, actifs, inactifs, totalStock };
    }, [camionnettes]);

    const handleCreate = () => {
        setSelectedCamionnette(null);
        setDialogOpen(true);
    };

    const handleEdit = (camionnette: Camionnette) => {
        setSelectedCamionnette(camionnette);
        setDialogOpen(true);
    };

    const handleDelete = (camionnette: Camionnette) => {
        setSelectedCamionnette(camionnette);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedCamionnette) return;

        deleteCamionnette.mutate(selectedCamionnette.id, {
            onSuccess: () => {
                toast.success("Véhicule supprimé", {
                    description: "Le véhicule a été supprimé de la flotte",
                });
                setDeleteDialogOpen(false);
                setSelectedCamionnette(null);
            },
            onError: (error) => {
                toast.error("Erreur", {
                    description:
                        error instanceof Error
                            ? error.message
                            : "Impossible de supprimer le véhicule",
                });
            },
        });
    };

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
                            <div
                                key={camionnette.id}
                                className={`p-5 rounded-xl bg-white border shadow-sm hover:shadow-md transition-all duration-200 ${
                                    camionnette.actif
                                        ? "border-black/8"
                                        : "border-black/5 opacity-60"
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                                camionnette.actif
                                                    ? "bg-black/5"
                                                    : "bg-black/2"
                                            }`}
                                        >
                                            <Truck
                                                className={`w-6 h-6 ${
                                                    camionnette.actif
                                                        ? "text-black/60"
                                                        : "text-black/30"
                                                }`}
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-[16px] font-semibold text-black font-mono">
                                                    {
                                                        camionnette.immatriculation
                                                    }
                                                </h3>
                                                {!camionnette.actif && (
                                                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/5 text-black/50">
                                                        Inactif
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-[13px] text-black/50">
                                                {camionnette.marque && (
                                                    <span>
                                                        {camionnette.marque}{" "}
                                                        {camionnette.modele}
                                                    </span>
                                                )}
                                                {camionnette.annee && (
                                                    <span>
                                                        {camionnette.annee}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleEdit(camionnette)
                                                }
                                            >
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Modifier
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleDelete(camionnette)
                                                }
                                                className="text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Supprimer
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-black/5">
                                    <div className="flex items-center gap-2 text-[13px] text-black/50">
                                        <User
                                            className="w-4 h-4"
                                            strokeWidth={2}
                                        />
                                        <span>
                                            {camionnette.plombierPrincipal
                                                ?.name || "Non assigné"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[13px] text-black/50">
                                        <Gauge
                                            className="w-4 h-4"
                                            strokeWidth={2}
                                        />
                                        <span>
                                            {camionnette.kilometres?.toLocaleString(
                                                "fr-FR"
                                            ) || 0}{" "}
                                            km
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[13px] text-black/50">
                                        <Package
                                            className="w-4 h-4"
                                            strokeWidth={2}
                                        />
                                        <span>
                                            {camionnette._count?.stock || 0}{" "}
                                            articles en stock
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Create/Edit Dialog */}
                <CamionnetteDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSuccess={() => setDialogOpen(false)}
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
                    isLoading={deleteCamionnette.isPending}
                />
            </div>
        </RouteGuard>
    );
}
