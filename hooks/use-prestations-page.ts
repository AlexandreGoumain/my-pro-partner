import type { PaginationInfo } from "@/components/ui/data-table/pagination";
import {
    PRESTATION_CATEGORIES,
    useDeletePrestation,
    usePrestationsPaginated,
    type Prestation,
    type PrestationCategorie,
} from "@/hooks/use-prestations";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export interface PrestationsPageHandlers {
    // Search & Filters
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    categoryFilter: PrestationCategorie | "all";
    setCategoryFilter: (category: PrestationCategorie | "all") => void;
    actifFilter: "all" | "active" | "inactive";
    setActifFilter: (filter: "all" | "active" | "inactive") => void;

    // Pagination
    page: number;
    pageSize: number;
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (size: number) => void;

    // Data
    prestations: Prestation[];
    groupedPrestations: [string, Prestation[]][];
    pagination: PaginationInfo | undefined;
    isLoading: boolean;
    stats: {
        total: number;
        actives: number;
        inactives: number;
        categories: number;
    };

    // Dialogs
    createDialogOpen: boolean;
    setCreateDialogOpen: (open: boolean) => void;
    editDialogOpen: boolean;
    setEditDialogOpen: (open: boolean) => void;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    selectedPrestation: Prestation | null;

    // Handlers
    handleCreate: () => void;
    handleEdit: (prestation: Prestation) => void;
    handleDelete: (prestation: Prestation) => void;
    confirmDelete: () => void;
    handleCreateSuccess: () => void;
    handleEditSuccess: () => void;

    // Delete state
    isDeleting: boolean;

    // Available categories
    availableCategories: typeof PRESTATION_CATEGORIES;
}

export function usePrestationsPage(): PrestationsPageHandlers {
    const searchParams = useSearchParams();
    const router = useRouter();

    // State management
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<
        PrestationCategorie | "all"
    >("all");
    const [actifFilter, setActifFilter] = useState<
        "all" | "active" | "inactive"
    >("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(24);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPrestation, setSelectedPrestation] =
        useState<Prestation | null>(null);

    // Handle ?action=new from quick actions
    useEffect(() => {
        if (searchParams.get("action") === "new") {
            setCreateDialogOpen(true);
            // Clear the URL param
            router.replace("/dashboard/prestations", { scroll: false });
        }
    }, [searchParams, router]);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch data with pagination
    const { data: paginatedData, isLoading } = usePrestationsPaginated({
        page,
        limit: pageSize,
        search: debouncedSearch,
        categorie: categoryFilter !== "all" ? categoryFilter : undefined,
        actif:
            actifFilter === "all"
                ? undefined
                : actifFilter === "active"
                  ? true
                  : false,
    });

    const deletePrestation = useDeletePrestation();

    const prestations = paginatedData?.data || [];
    const pagination = paginatedData?.pagination;

    // Group prestations by category
    const groupedPrestations = useMemo(() => {
        const grouped: Record<string, Prestation[]> = {};
        for (const prestation of prestations) {
            const cat = prestation.categorie || "Autre";
            if (!grouped[cat]) {
                grouped[cat] = [];
            }
            grouped[cat].push(prestation);
        }
        // Sort by category order in PRESTATION_CATEGORIES
        return Object.entries(grouped).sort(([a], [b]) => {
            const indexA = PRESTATION_CATEGORIES.indexOf(
                a as PrestationCategorie
            );
            const indexB = PRESTATION_CATEGORIES.indexOf(
                b as PrestationCategorie
            );
            if (indexA === -1 && indexB === -1) return a.localeCompare(b);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
    }, [prestations]);

    // Statistics
    const stats = useMemo(() => {
        const actives = prestations.filter((p) => p.actif).length;
        const uniqueCategories = new Set(
            prestations.map((p) => p.categorie).filter(Boolean)
        );

        return {
            total: pagination?.total || prestations.length,
            actives,
            inactives: prestations.length - actives,
            categories: uniqueCategories.size,
        };
    }, [prestations, pagination]);

    const handleCreate = useCallback(() => {
        setCreateDialogOpen(true);
    }, []);

    const handleCreateSuccess = useCallback(() => {
        toast.success("Prestation créée", {
            description: "La prestation a été créée avec succès",
        });
        setCreateDialogOpen(false);
    }, []);

    const handleEdit = useCallback((prestation: Prestation) => {
        setSelectedPrestation(prestation);
        setEditDialogOpen(true);
    }, []);

    const handleEditSuccess = useCallback(() => {
        toast.success("Prestation modifiée", {
            description: "La prestation a été modifiée avec succès",
        });
        setEditDialogOpen(false);
        setSelectedPrestation(null);
    }, []);

    const handleDelete = useCallback((prestation: Prestation) => {
        setSelectedPrestation(prestation);
        setDeleteDialogOpen(true);
    }, []);

    const confirmDelete = useCallback(() => {
        if (!selectedPrestation) return;

        deletePrestation.mutate(selectedPrestation.id, {
            onSuccess: () => {
                toast.success("Prestation supprimée", {
                    description: "La prestation a été supprimée avec succès",
                });
                setDeleteDialogOpen(false);
                setSelectedPrestation(null);
            },
            onError: (error) => {
                toast.error("Erreur", {
                    description:
                        error instanceof Error
                            ? error.message
                            : "Impossible de supprimer la prestation",
                });
            },
        });
    }, [selectedPrestation, deletePrestation]);

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
        categoryFilter,
        setCategoryFilter,
        actifFilter,
        setActifFilter,
        page,
        pageSize,
        handlePageChange,
        handlePageSizeChange,
        prestations,
        groupedPrestations,
        pagination,
        isLoading,
        stats,
        createDialogOpen,
        setCreateDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        selectedPrestation,
        handleCreate,
        handleEdit,
        handleDelete,
        confirmDelete,
        handleCreateSuccess,
        handleEditSuccess,
        isDeleting: deletePrestation.isPending,
        availableCategories: PRESTATION_CATEGORIES,
    };
}
