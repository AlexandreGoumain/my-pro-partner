import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
    Client,
    useClientsPaginated,
    useClientsStats,
    useDeleteClient,
    useImportClients,
} from "@/hooks/use-clients";
import { useSegment, useSegmentClients } from "@/hooks/use-segments";
import { createColumns } from "@/app/(dashboard)/dashboard/clients/_components/data-table/columns";

export interface ClientsPageHandlers {
    // Search & View Mode
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
    handleViewModeChange: (mode: "grid" | "list") => void;

    // Pagination
    page: number;
    pageSize: number;
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (size: number) => void;

    // Data
    clients: Client[];
    displayClients: Client[];
    pagination: any;
    showPagination: boolean;
    isLoading: boolean;
    intelligence: {
        total: number;
        newThisMonth: number;
        inactive: number;
        inactiveList: Client[];
        active: number;
        complete: number;
        completionRate: number;
    };

    // Segment filter
    segmentId: string | null;
    segment: any;
    clearSegmentFilter: () => void;

    // Dialogs
    createDialogOpen: boolean;
    setCreateDialogOpen: (open: boolean) => void;
    editDialogOpen: boolean;
    setEditDialogOpen: (open: boolean) => void;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    importDialogOpen: boolean;
    setImportDialogOpen: (open: boolean) => void;
    selectedClient: Client | null;

    // Handlers
    handleCreate: () => void;
    handleView: (client: Client) => void;
    handleEdit: (client: Client) => void;
    handleDelete: (client: Client) => void;
    confirmDelete: () => void;
    handleCreateSuccess: () => void;
    handleEditSuccess: () => void;
    handleImport: (data: Record<string, unknown>[]) => Promise<void>;

    // Table columns
    columns: any[];

    // Delete state
    isDeleting: boolean;
}

export function useClientsPage(): ClientsPageHandlers {
    const router = useRouter();
    const searchParams = useSearchParams();
    const segmentId = searchParams.get("segment");

    // State management
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(viewMode === "grid" ? 24 : 20);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    // Debounce search term to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset to first page when searching
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Always use server-side pagination for better performance
    const { data: paginatedData, isLoading } = useClientsPaginated({
        page,
        limit: pageSize,
        search: debouncedSearch,
    });

    const { data: stats } = useClientsStats();
    const deleteClient = useDeleteClient();
    const importClients = useImportClients();
    const { data: segment } = useSegment(segmentId || "");
    const { data: segmentClientsData } = useSegmentClients(segmentId || "");

    const clients = paginatedData?.data || [];
    const pagination = paginatedData?.pagination;

    // Determine which clients to show (segments override pagination)
    const displayClients =
        segmentId && segmentClientsData ? segmentClientsData.data : clients;

    // Use segment data for display when filtering by segment
    const showPagination = !segmentId && pagination;

    // Intelligence metrics - use stats from backend for efficiency
    const intelligence = useMemo(() => {
        if (stats) {
            // New clients this month from backend
            const newThisMonth = stats.currentMonth;

            return {
                total: stats.total,
                newThisMonth,
                inactive: stats.inactive,
                inactiveList: [], // Will be populated on demand if needed
                active: stats.active,
                complete: stats.complete,
                completionRate: stats.completionRate,
            };
        }

        // Fallback to empty stats while loading
        return {
            total: 0,
            newThisMonth: 0,
            inactive: 0,
            inactiveList: [],
            active: 0,
            complete: 0,
            completionRate: 0,
        };
    }, [stats]);

    const clearSegmentFilter = useCallback(() => {
        router.push("/dashboard/clients");
    }, [router]);

    const handleCreate = useCallback(() => {
        setCreateDialogOpen(true);
    }, []);

    const handleCreateSuccess = useCallback(() => {
        toast.success("Client créé", {
            description: "Le client a été créé avec succès",
        });
    }, []);

    const handleView = useCallback(
        (client: Client) => {
            router.push(`/dashboard/clients/${client.id}`);
        },
        [router]
    );

    const handleEdit = useCallback((client: Client) => {
        setSelectedClient(client);
        setEditDialogOpen(true);
    }, []);

    const handleDelete = useCallback((client: Client) => {
        setSelectedClient(client);
        setDeleteDialogOpen(true);
    }, []);

    const confirmDelete = useCallback(() => {
        if (!selectedClient) return;

        deleteClient.mutate(selectedClient.id, {
            onSuccess: () => {
                toast.success("Client supprimé", {
                    description: "Le client a été supprimé avec succès",
                });
                setDeleteDialogOpen(false);
                setSelectedClient(null);
            },
            onError: (error) => {
                toast.error("Erreur", {
                    description:
                        error instanceof Error
                            ? error.message
                            : "Impossible de supprimer le client",
                });
            },
        });
    }, [selectedClient, deleteClient]);

    const handleEditSuccess = useCallback(() => {
        toast.success("Client modifié", {
            description: "Le client a été modifié avec succès",
        });
    }, []);

    const handleImport = useCallback(
        async (data: Record<string, unknown>[]) => {
            return await importClients.mutateAsync(data);
        },
        [importClients]
    );

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const handlePageSizeChange = useCallback((newSize: number) => {
        setPageSize(newSize);
        setPage(1); // Reset to first page when changing page size
    }, []);

    const handleViewModeChange = useCallback((mode: "grid" | "list") => {
        setViewMode(mode);
        setPage(1); // Reset to first page when changing view mode
        // Adjust page size based on view mode
        setPageSize(mode === "grid" ? 24 : 20);
    }, []);

    // Create columns for DataTable
    const columns = useMemo(
        () =>
            createColumns({
                onView: handleView,
                onEdit: handleEdit,
                onDelete: handleDelete,
            }),
        [handleView, handleEdit, handleDelete]
    );

    return {
        searchTerm,
        setSearchTerm,
        viewMode,
        setViewMode,
        handleViewModeChange,
        page,
        pageSize,
        handlePageChange,
        handlePageSizeChange,
        clients,
        displayClients,
        pagination,
        showPagination,
        isLoading,
        intelligence,
        segmentId,
        segment,
        clearSegmentFilter,
        createDialogOpen,
        setCreateDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        importDialogOpen,
        setImportDialogOpen,
        selectedClient,
        handleCreate,
        handleView,
        handleEdit,
        handleDelete,
        confirmDelete,
        handleCreateSuccess,
        handleEditSuccess,
        handleImport,
        columns,
        isDeleting: deleteClient.isPending,
    };
}
