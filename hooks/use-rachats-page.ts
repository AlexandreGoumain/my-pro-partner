import { useState } from "react";
import { useRachats, useDeleteRachat } from "./use-rachats";

/**
 * Custom hook to manage all the logic for the Rachats page
 * Handles search, pagination, dialogs, and CRUD operations
 */
export function useRachatsPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const { data, isLoading } = useRachats({ page, limit: 20, search });
    const deleteRachat = useDeleteRachat();

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const handleDeleteConfirm = async () => {
        if (deleteId) {
            await deleteRachat.mutateAsync(deleteId);
            setDeleteId(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteId(null);
    };

    const handleCreateClick = () => {
        setCreateDialogOpen(true);
    };

    const handleCreateSuccess = () => {
        setCreateDialogOpen(false);
    };

    const handleView = (id: string) => {
        // TODO: Implement view logic when needed
        console.log("View rachat:", id);
    };

    return {
        // Data
        rachats: data?.items || [],
        pagination: data?.pagination,
        isLoading,

        // Search
        search,
        setSearch,

        // Pagination
        page,
        setPage,

        // Delete dialog
        deleteId,
        isDeleting: deleteRachat.isPending,
        handleDelete,
        handleDeleteConfirm,
        handleDeleteCancel,

        // Create dialog
        createDialogOpen,
        setCreateDialogOpen,
        handleCreateClick,
        handleCreateSuccess,

        // View
        handleView,
    };
}
