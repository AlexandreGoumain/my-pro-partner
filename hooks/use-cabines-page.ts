import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCabines, useDeleteCabine, type Cabine } from "./use-cabines";

export function useCabinesPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCabine, setSelectedCabine] = useState<Cabine | null>(null);

    const { data: cabines = [], isLoading, refetch } = useCabines();
    const deleteCabine = useDeleteCabine();

    // Handle ?action=new from quick actions
    useEffect(() => {
        if (searchParams.get("action") === "new") {
            setDialogOpen(true);
            router.replace("/dashboard/cabines", { scroll: false });
        }
    }, [searchParams, router]);

    // Filtrage local
    const filteredCabines = cabines.filter((cabine) => {
        if (!search) return true;
        const searchLower = search.toLowerCase();
        return (
            cabine.nom.toLowerCase().includes(searchLower) ||
            cabine.type?.toLowerCase().includes(searchLower) ||
            cabine.description?.toLowerCase().includes(searchLower)
        );
    });

    // Actions
    const openCreateDialog = useCallback(() => {
        setSelectedCabine(null);
        setDialogOpen(true);
    }, []);

    const openEditDialog = useCallback((cabine: Cabine) => {
        setSelectedCabine(cabine);
        setDialogOpen(true);
    }, []);

    const openDeleteDialog = useCallback((cabine: Cabine) => {
        setSelectedCabine(cabine);
        setDeleteDialogOpen(true);
    }, []);

    const handleDialogSuccess = useCallback(() => {
        setDialogOpen(false);
        setSelectedCabine(null);
        refetch();
    }, [refetch]);

    const handleDelete = useCallback(async () => {
        if (!selectedCabine) return;
        try {
            await deleteCabine.mutateAsync(selectedCabine.id);
            setDeleteDialogOpen(false);
            setSelectedCabine(null);
        } catch {
            // Error handled by mutation
        }
    }, [selectedCabine, deleteCabine]);

    return {
        // Data
        cabines: filteredCabines,
        allCabines: cabines,
        isLoading,
        search,
        setSearch,

        // Dialog state
        dialogOpen,
        setDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        selectedCabine,

        // Actions
        openCreateDialog,
        openEditDialog,
        openDeleteDialog,
        handleDialogSuccess,
        handleDelete,
        isDeleting: deleteCabine.isPending,
    };
}
