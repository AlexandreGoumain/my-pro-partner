import { useDeleteCamionnette, useFlotte } from "@/hooks/use-flotte";
import type { Camionnette } from "@/lib/types/flotte";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface FlotteStats {
    total: number;
    actifs: number;
    inactifs: number;
    totalStock: number;
}

export interface UseFlottePageReturn {
    // Dialog states
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    selectedCamionnette: Camionnette | null;

    // Handlers
    handleCreate: () => void;
    handleEdit: (camionnette: Camionnette) => void;
    handleDelete: (camionnette: Camionnette) => void;
    handleDialogSuccess: () => void;
    confirmDelete: () => void;

    // Data
    camionnettes: Camionnette[];
    isLoading: boolean;
    stats: FlotteStats;
    isDeleting: boolean;
}

export function useFlottePage(): UseFlottePageReturn {
    // Dialog states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCamionnette, setSelectedCamionnette] =
        useState<Camionnette | null>(null);

    // Data fetching
    const { data: camionnettes = [], isLoading } = useFlotte();
    const deleteCamionnette = useDeleteCamionnette();

    // Compute stats
    const stats = useMemo(() => {
        const actifs = camionnettes.filter((c) => c.actif).length;
        const inactifs = camionnettes.length - actifs;
        const totalStock = camionnettes.reduce(
            (acc, c) => acc + (c._count?.stock || 0),
            0
        );
        return { total: camionnettes.length, actifs, inactifs, totalStock };
    }, [camionnettes]);

    // Handlers
    const handleCreate = useCallback(() => {
        setSelectedCamionnette(null);
        setDialogOpen(true);
    }, []);

    const handleEdit = useCallback((camionnette: Camionnette) => {
        setSelectedCamionnette(camionnette);
        setDialogOpen(true);
    }, []);

    const handleDelete = useCallback((camionnette: Camionnette) => {
        setSelectedCamionnette(camionnette);
        setDeleteDialogOpen(true);
    }, []);

    const handleDialogSuccess = useCallback(() => {
        setDialogOpen(false);
    }, []);

    const confirmDelete = useCallback(() => {
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
    }, [selectedCamionnette, deleteCamionnette]);

    return {
        // Dialog states
        dialogOpen,
        setDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        selectedCamionnette,

        // Handlers
        handleCreate,
        handleEdit,
        handleDelete,
        handleDialogSuccess,
        confirmDelete,

        // Data
        camionnettes,
        isLoading,
        stats,
        isDeleting: deleteCamionnette.isPending,
    };
}
