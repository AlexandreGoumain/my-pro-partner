"use client";

import { CamionnetteDialog } from "@/components/flotte/camionnette-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RouteGuard } from "@/components/ui/route-guard";
import { Skeleton } from "@/components/ui/skeleton";
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
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                            Flotte de véhicules
                        </h1>
                        <p className="text-[14px] text-black/40 mt-1">
                            Gestion de vos camionnettes et véhicules
                        </p>
                    </div>
                    <Button
                        onClick={handleCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                        Nouveau véhicule
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-5 rounded-xl bg-white border border-black/8 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-medium text-black/40 uppercase tracking-wide">
                                Total véhicules
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center">
                                <Truck
                                    className="w-4 h-4 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                        <p className="text-[32px] font-bold text-black tracking-tight">
                            {stats.total}
                        </p>
                        <p className="text-[12px] text-black/40 mt-1">
                            dans la flotte
                        </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white border border-black/8 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-medium text-black/40 uppercase tracking-wide">
                                Actifs
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                <Car
                                    className="w-4 h-4 text-green-600"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                        <p className="text-[32px] font-bold text-black tracking-tight">
                            {stats.actifs}
                        </p>
                        <p className="text-[12px] text-black/40 mt-1">
                            véhicules en service
                        </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white border border-black/8 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-medium text-black/40 uppercase tracking-wide">
                                Inactifs
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center">
                                <Car
                                    className="w-4 h-4 text-black/40"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                        <p className="text-[32px] font-bold text-black tracking-tight">
                            {stats.inactifs}
                        </p>
                        <p className="text-[12px] text-black/40 mt-1">
                            hors service
                        </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white border border-black/8 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-medium text-black/40 uppercase tracking-wide">
                                Stock total
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Package
                                    className="w-4 h-4 text-blue-600"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                        <p className="text-[32px] font-bold text-black tracking-tight">
                            {stats.totalStock}
                        </p>
                        <p className="text-[12px] text-black/40 mt-1">
                            articles en stock mobile
                        </p>
                    </div>
                </div>

                {/* Vehicle List */}
                <div className="space-y-3">
                    {isLoading ? (
                        <>
                            {[...Array(3)].map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className="h-[120px] rounded-xl"
                                />
                            ))}
                        </>
                    ) : camionnettes.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-black/10 rounded-xl">
                            <Truck
                                className="w-12 h-12 text-black/20 mx-auto mb-4"
                                strokeWidth={1.5}
                            />
                            <p className="text-[16px] font-medium text-black/60 mb-2">
                                Aucun véhicule
                            </p>
                            <p className="text-[14px] text-black/40 mb-4">
                                Ajoutez votre premier véhicule à la flotte
                            </p>
                            <Button
                                onClick={handleCreate}
                                variant="outline"
                                className="h-10"
                            >
                                <Plus
                                    className="w-4 h-4 mr-2"
                                    strokeWidth={2}
                                />
                                Ajouter un véhicule
                            </Button>
                        </div>
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
                                                    {camionnette.immatriculation}
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
                <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Supprimer ce véhicule ?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Cette action est irréversible. Le véhicule{" "}
                                <span className="font-medium font-mono">
                                    {selectedCamionnette?.immatriculation}
                                </span>{" "}
                                sera définitivement supprimé de votre flotte.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {deleteCamionnette.isPending
                                    ? "Suppression..."
                                    : "Supprimer"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </RouteGuard>
    );
}
