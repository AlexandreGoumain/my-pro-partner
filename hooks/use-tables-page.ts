import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    TableStatus,
    useTablesPaginated,
    useTablesStats,
    useDeleteTable,
} from "@/hooks/use-tables";
import type { Table, TableZone } from "@/hooks/use-tables";
import type { PaginationInfo } from "@/components/ui/data-table/pagination";

export interface TablesPageHandlers {
    // Search & Filters
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    zoneFilter: TableZone | "all";
    setZoneFilter: (zone: TableZone | "all") => void;
    statusFilter: TableStatus | "all";
    setStatusFilter: (status: TableStatus | "all") => void;

    // Pagination
    page: number;
    pageSize: number;
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (size: number) => void;

    // Data
    tables: Table[];
    pagination: PaginationInfo | undefined;
    isLoading: boolean;
    stats: {
        total: number;
        libres: number;
        occupees: number;
        reservees: number;
        capaciteTotal: number;
        tauxOccupation: number;
    };

    // Dialogs
    createDialogOpen: boolean;
    setCreateDialogOpen: (open: boolean) => void;
    editDialogOpen: boolean;
    setEditDialogOpen: (open: boolean) => void;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    selectedTable: Table | null;

    // Handlers
    handleCreate: () => void;
    handleEdit: (table: Table) => void;
    handleDelete: (table: Table) => void;
    confirmDelete: () => void;
    handleCreateSuccess: () => void;
    handleEditSuccess: () => void;
    handleTableClick: (table: Table) => void;

    // Delete state
    isDeleting: boolean;

    // Available zones
    availableZones: TableZone[];
}

export function useTablesPage(): TablesPageHandlers {
    const router = useRouter();

    // State management
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [zoneFilter, setZoneFilter] = useState<TableZone | "all">("all");
    const [statusFilter, setStatusFilter] = useState<TableStatus | "all">("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(24);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch data with pagination
    const { data: paginatedData, isLoading } = useTablesPaginated({
        page,
        limit: pageSize,
        search: debouncedSearch,
        zone: zoneFilter !== "all" ? zoneFilter : undefined,
        statut: statusFilter !== "all" ? statusFilter : undefined,
    });

    const { data: statsData } = useTablesStats();
    const deleteTable = useDeleteTable();

    const tables = paginatedData?.data || [];
    const pagination = paginatedData?.pagination;

    // Statistics
    const stats = useMemo(() => {
        if (statsData) {
            return {
                total: statsData.total,
                libres: statsData.libres,
                occupees: statsData.occupees,
                reservees: statsData.reservees,
                capaciteTotal: statsData.capaciteTotal,
                tauxOccupation: statsData.tauxOccupation,
            };
        }

        return {
            total: 0,
            libres: 0,
            occupees: 0,
            reservees: 0,
            capaciteTotal: 0,
            tauxOccupation: 0,
        };
    }, [statsData]);

    // Available zones for filter
    const availableZones: TableZone[] = [
        "Terrasse",
        "Salle principale",
        "Salle VIP",
        "Bar",
        "Autre",
    ];

    const handleCreate = useCallback(() => {
        setCreateDialogOpen(true);
    }, []);

    const handleCreateSuccess = useCallback(() => {
        toast.success("Table créée", {
            description: "La table a été créée avec succès",
        });
        setCreateDialogOpen(false);
    }, []);

    const handleEdit = useCallback((table: Table) => {
        setSelectedTable(table);
        setEditDialogOpen(true);
    }, []);

    const handleDelete = useCallback((table: Table) => {
        setSelectedTable(table);
        setDeleteDialogOpen(true);
    }, []);

    const confirmDelete = useCallback(() => {
        if (!selectedTable) return;

        deleteTable.mutate(selectedTable.id, {
            onSuccess: () => {
                toast.success("Table supprimée", {
                    description: "La table a été supprimée avec succès",
                });
                setDeleteDialogOpen(false);
                setSelectedTable(null);
            },
            onError: (error) => {
                toast.error("Erreur", {
                    description:
                        error instanceof Error
                            ? error.message
                            : "Impossible de supprimer la table",
                });
            },
        });
    }, [selectedTable, deleteTable]);

    const handleEditSuccess = useCallback(() => {
        toast.success("Table modifiée", {
            description: "La table a été modifiée avec succès",
        });
        setEditDialogOpen(false);
        setSelectedTable(null);
    }, []);

    const handleTableClick = useCallback((table: Table) => {
        // Could navigate to detail page or open edit dialog
        setSelectedTable(table);
        setEditDialogOpen(true);
    }, []);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const handlePageSizeChange = useCallback((newSize: number) => {
        setPageSize(newSize);
        setPage(1);
    }, []);

    return {
        searchTerm,
        setSearchTerm,
        zoneFilter,
        setZoneFilter,
        statusFilter,
        setStatusFilter,
        page,
        pageSize,
        handlePageChange,
        handlePageSizeChange,
        tables,
        pagination,
        isLoading,
        stats,
        createDialogOpen,
        setCreateDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        selectedTable,
        handleCreate,
        handleEdit,
        handleDelete,
        confirmDelete,
        handleCreateSuccess,
        handleEditSuccess,
        handleTableClick,
        isDeleting: deleteTable.isPending,
        availableZones,
    };
}
