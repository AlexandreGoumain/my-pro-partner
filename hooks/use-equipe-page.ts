import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type { PaginationInfo } from "@/components/ui/data-table/pagination";
import {
    useDeleteEmploye,
    useEmployesPaginated,
    type Employe,
} from "@/hooks/use-employes";

export interface EquipePageHandlers {
    // Search & Filters
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    actifFilter: "all" | "active" | "inactive";
    setActifFilter: (filter: "all" | "active" | "inactive") => void;

    // Pagination
    page: number;
    pageSize: number;
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (size: number) => void;

    // Data
    employes: Employe[];
    pagination: PaginationInfo | undefined;
    isLoading: boolean;
    stats: {
        total: number;
        actifs: number;
        inactifs: number;
    };

    // Dialogs
    createDialogOpen: boolean;
    setCreateDialogOpen: (open: boolean) => void;
    editDialogOpen: boolean;
    setEditDialogOpen: (open: boolean) => void;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    disponibilitesDialogOpen: boolean;
    setDisponibilitesDialogOpen: (open: boolean) => void;
    selectedEmploye: Employe | null;

    // Handlers
    handleCreate: () => void;
    handleEdit: (employe: Employe) => void;
    handleDelete: (employe: Employe) => void;
    handleDisponibilites: (employe: Employe) => void;
    confirmDelete: () => void;
    handleCreateSuccess: () => void;
    handleEditSuccess: () => void;
    handleDisponibilitesSuccess: () => void;

    // Delete state
    isDeleting: boolean;
}

export function useEquipePage(): EquipePageHandlers {
    const searchParams = useSearchParams();
    const router = useRouter();

    // State management
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [actifFilter, setActifFilter] = useState<
        "all" | "active" | "inactive"
    >("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(24);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [disponibilitesDialogOpen, setDisponibilitesDialogOpen] =
        useState(false);
    const [selectedEmploye, setSelectedEmploye] = useState<Employe | null>(
        null
    );

    // Handle ?action=new from quick actions
    useEffect(() => {
        if (searchParams.get("action") === "new") {
            setCreateDialogOpen(true);
            router.replace("/dashboard/equipe", { scroll: false });
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
    const { data: paginatedData, isLoading } = useEmployesPaginated({
        page,
        limit: pageSize,
        search: debouncedSearch,
        actif:
            actifFilter === "all"
                ? undefined
                : actifFilter === "active"
                  ? true
                  : false,
    });

    const deleteEmploye = useDeleteEmploye();

    const employes = paginatedData?.data || [];
    const pagination = paginatedData?.pagination;

    // Statistics
    const stats = useMemo(() => {
        const actifs = employes.filter((e) => e.actif).length;
        return {
            total: pagination?.total || employes.length,
            actifs,
            inactifs: employes.length - actifs,
        };
    }, [employes, pagination]);

    const handleCreate = useCallback(() => {
        setCreateDialogOpen(true);
    }, []);

    const handleCreateSuccess = useCallback(() => {
        toast.success("Employé créé", {
            description: "L'employé a été créé avec succès",
        });
        setCreateDialogOpen(false);
    }, []);

    const handleEdit = useCallback((employe: Employe) => {
        setSelectedEmploye(employe);
        setEditDialogOpen(true);
    }, []);

    const handleEditSuccess = useCallback(() => {
        toast.success("Employé modifié", {
            description: "L'employé a été modifié avec succès",
        });
        setEditDialogOpen(false);
        setSelectedEmploye(null);
    }, []);

    const handleDelete = useCallback((employe: Employe) => {
        setSelectedEmploye(employe);
        setDeleteDialogOpen(true);
    }, []);

    const handleDisponibilites = useCallback((employe: Employe) => {
        setSelectedEmploye(employe);
        setDisponibilitesDialogOpen(true);
    }, []);

    const handleDisponibilitesSuccess = useCallback(() => {
        toast.success("Disponibilités mises à jour", {
            description: "Les horaires ont été enregistrés",
        });
        setDisponibilitesDialogOpen(false);
        setSelectedEmploye(null);
    }, []);

    const confirmDelete = useCallback(() => {
        if (!selectedEmploye) return;

        deleteEmploye.mutate(selectedEmploye.id, {
            onSuccess: () => {
                toast.success("Employé supprimé", {
                    description: "L'employé a été supprimé avec succès",
                });
                setDeleteDialogOpen(false);
                setSelectedEmploye(null);
            },
            onError: (error) => {
                toast.error("Erreur", {
                    description:
                        error instanceof Error
                            ? error.message
                            : "Impossible de supprimer l'employé",
                });
            },
        });
    }, [selectedEmploye, deleteEmploye]);

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
        actifFilter,
        setActifFilter,
        page,
        pageSize,
        handlePageChange,
        handlePageSizeChange,
        employes,
        pagination,
        isLoading,
        stats,
        createDialogOpen,
        setCreateDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        disponibilitesDialogOpen,
        setDisponibilitesDialogOpen,
        selectedEmploye,
        handleCreate,
        handleEdit,
        handleDelete,
        handleDisponibilites,
        confirmDelete,
        handleCreateSuccess,
        handleEditSuccess,
        handleDisponibilitesSuccess,
        isDeleting: deleteEmploye.isPending,
    };
}
