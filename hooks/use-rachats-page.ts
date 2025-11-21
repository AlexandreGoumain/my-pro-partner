import { useState } from "react";
import { useDeleteRachat, useRachats } from "./use-rachats";

/**
 * Custom hook to manage all the logic for the Rachats page
 * Handles search, pagination, dialogs, and CRUD operations
 */
export function useRachatsPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [viewId, setViewId] = useState<string | null>(null);
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
        setViewId(id);
    };

    const handleViewClose = () => {
        setViewId(null);
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

        // View dialog
        viewId,
        handleView,
        handleViewClose,
    };
}
