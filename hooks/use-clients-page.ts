import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import {
    Client,
    useClientsPaginated,
    useClientsStats,
    useDeleteClient,
    useImportClients,
} from "@/hooks/use-clients";
import { useSegment, useSegmentClients } from "@/hooks/use-segments";
import { createColumns } from "@/app/(dashboard)/dashboard/clients/_components/data-table/columns";
import { useLimitDialog } from "@/components/providers/limit-dialog-provider";
import type { PaginationInfo } from "@/components/ui/data-table/pagination";
import type { Segment } from "@/lib/generated/prisma";
import type { PlanType } from "@/lib/pricing-config";

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
    pagination: PaginationInfo | undefined;
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
    segment: Segment | null | undefined;
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
    inviteDialogOpen: boolean;
    setInviteDialogOpen: (open: boolean) => void;
    selectedClient: Client | null;

    // Handlers
    handleCreate: () => void;
    handleCreateWithLimitCheck: () => void;
    handleInviteWithLimitCheck: () => void;
    handleInviteSuccess: () => void;
    handleView: (client: Client) => void;
    handleEdit: (client: Client) => void;
    handleDelete: (client: Client) => void;
    confirmDelete: () => void;
    handleCreateSuccess: () => void;
    handleEditSuccess: () => void;
    handleImport: (data: Record<string, unknown>[]) => Promise<void>;

    // Navigation helpers
    navigateToSegments: () => void;
    navigateToStatistics: () => void;
    navigateToImportExport: () => void;

    // Table columns
    columns: ColumnDef<Client>[];

    // Delete state
    isDeleting: boolean;

    // Plan limits
    userPlan: PlanType;
}

export function useClientsPage(): ClientsPageHandlers {
    const router = useRouter();
    const searchParams = useSearchParams();
    const segmentId = searchParams.get("segment");

    // Pricing limit check
    const { checkLimit, userPlan } = useLimitDialog();

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
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
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

    // Navigation helpers
    const navigateToSegments = useCallback(() => {
        router.push("/dashboard/clients/segments");
    }, [router]);

    const navigateToStatistics = useCallback(() => {
        router.push("/dashboard/clients/statistiques");
    }, [router]);

    const navigateToImportExport = useCallback(() => {
        router.push("/dashboard/clients/import-export");
    }, [router]);

    const handleCreate = useCallback(() => {
        setCreateDialogOpen(true);
    }, []);

    // Wrapper to check limit before creating
    const handleCreateWithLimitCheck = useCallback(() => {
        if (!checkLimit("maxClients", intelligence.total)) {
            return; // Limit reached - dialog shows automatically
        }
        handleCreate();
    }, [checkLimit, intelligence.total, handleCreate]);

    // Wrapper to check limit before inviting
    const handleInviteWithLimitCheck = useCallback(() => {
        if (!checkLimit("maxClients", intelligence.total)) {
            return; // Limit reached - dialog shows automatically
        }
        setInviteDialogOpen(true);
    }, [checkLimit, intelligence.total]);

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

    const handleInviteSuccess = useCallback(() => {
        setInviteDialogOpen(false);
        toast.success("Invitation envoyée", {
            description: "L'invitation a été envoyée avec succès",
        });
    }, []);

    const handleImport = useCallback(
        async (data: Record<string, unknown>[]): Promise<void> => {
            await importClients.mutateAsync(data);
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
        pagination: pagination,
        showPagination: !segmentId && !!pagination,
        isLoading,
        intelligence,
        segmentId,
        segment: segment || null,
        clearSegmentFilter,
        createDialogOpen,
        setCreateDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        importDialogOpen,
        setImportDialogOpen,
        inviteDialogOpen,
        setInviteDialogOpen,
        selectedClient,
        handleCreate,
        handleCreateWithLimitCheck,
        handleInviteWithLimitCheck,
        handleInviteSuccess,
        handleView,
        handleEdit,
        handleDelete,
        confirmDelete,
        handleCreateSuccess,
        handleEditSuccess,
        handleImport,
        navigateToSegments,
        navigateToStatistics,
        navigateToImportExport,
        columns,
        isDeleting: deleteClient.isPending,
        userPlan,
    };
}
