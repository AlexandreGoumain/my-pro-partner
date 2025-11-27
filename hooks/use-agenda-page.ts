import type { PaginationInfo } from "@/components/ui/data-table/pagination";
import { useActiveEmployes } from "@/hooks/use-employes";
import {
    RENDEZ_VOUS_STATUTS,
    useCancelRendezVous,
    useConfirmRendezVous,
    useDeleteRendezVous,
    useRendezVousPaginated,
    type RendezVous,
    type RendezVousStatut,
} from "@/hooks/use-rendez-vous";
import {
    addDays,
    endOfDay,
    endOfWeek,
    format,
    startOfDay,
    startOfWeek,
} from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export type ViewMode = "day" | "week" | "list";

export interface AgendaPageHandlers {
    // View & Date
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    goToToday: () => void;
    goToPrevious: () => void;
    goToNext: () => void;

    // Filters
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statutFilter: RendezVousStatut | "all";
    setStatutFilter: (statut: RendezVousStatut | "all") => void;
    employeFilter: string | "all";
    setEmployeFilter: (employeId: string | "all") => void;

    // Pagination (for list view)
    page: number;
    pageSize: number;
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (size: number) => void;

    // Data
    rendezVous: RendezVous[];
    pagination: PaginationInfo | undefined;
    isLoading: boolean;
    employes: {
        id: string;
        nom: string;
        prenom: string;
        couleur: string | null;
    }[];
    dateRange: { debut: string; fin: string };

    // Dialogs
    createDialogOpen: boolean;
    setCreateDialogOpen: (open: boolean) => void;
    editDialogOpen: boolean;
    setEditDialogOpen: (open: boolean) => void;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    selectedRdv: RendezVous | null;

    // Handlers
    handleCreate: () => void;
    handleEdit: (rdv: RendezVous) => void;
    handleDelete: (rdv: RendezVous) => void;
    handleConfirm: (rdv: RendezVous) => void;
    handleCancel: (rdv: RendezVous) => void;
    confirmDelete: () => void;
    handleCreateSuccess: () => void;
    handleEditSuccess: () => void;

    // State
    isDeleting: boolean;
    isConfirming: boolean;
    isCancelling: boolean;

    // Statuts
    availableStatuts: typeof RENDEZ_VOUS_STATUTS;
}

export function useAgendaPage(): AgendaPageHandlers {
    const searchParams = useSearchParams();
    const router = useRouter();

    // View & Date state
    const [viewMode, setViewMode] = useState<ViewMode>("day");
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Filter state
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statutFilter, setStatutFilter] = useState<RendezVousStatut | "all">(
        "all"
    );
    const [employeFilter, setEmployeFilter] = useState<string | "all">("all");

    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);

    // Dialog state
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRdv, setSelectedRdv] = useState<RendezVous | null>(null);

    // Handle ?action=new from quick actions
    useEffect(() => {
        if (searchParams.get("action") === "new") {
            setCreateDialogOpen(true);
            router.replace("/dashboard/agenda", { scroll: false });
        }
    }, [searchParams, router]);

    // Calculate date range based on view mode
    const dateRange = useMemo(() => {
        if (viewMode === "day") {
            return {
                debut: format(startOfDay(selectedDate), "yyyy-MM-dd"),
                fin: format(endOfDay(selectedDate), "yyyy-MM-dd"),
            };
        } else if (viewMode === "week") {
            const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
            const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
            return {
                debut: format(weekStart, "yyyy-MM-dd"),
                fin: format(weekEnd, "yyyy-MM-dd"),
            };
        }
        // List mode - show next 30 days or all
        return {
            debut: format(startOfDay(new Date()), "yyyy-MM-dd"),
            fin: format(addDays(new Date(), 30), "yyyy-MM-dd"),
        };
    }, [viewMode, selectedDate]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch data
    const { data: paginatedData, isLoading } = useRendezVousPaginated({
        page,
        limit: pageSize,
        search: debouncedSearch,
        statut: statutFilter !== "all" ? statutFilter : undefined,
        employeId: employeFilter !== "all" ? employeFilter : undefined,
        dateDebut: dateRange.debut,
        dateFin: dateRange.fin,
    });

    const { data: employesData } = useActiveEmployes();
    const deleteRdv = useDeleteRendezVous();
    const confirmRdv = useConfirmRendezVous();
    const cancelRdv = useCancelRendezVous();

    const rendezVous = paginatedData?.data || [];
    const pagination = paginatedData?.pagination;
    const employes = employesData || [];

    // Navigation
    const goToToday = useCallback(() => {
        setSelectedDate(new Date());
    }, []);

    const goToPrevious = useCallback(() => {
        if (viewMode === "day") {
            setSelectedDate((prev) => addDays(prev, -1));
        } else if (viewMode === "week") {
            setSelectedDate((prev) => addDays(prev, -7));
        }
    }, [viewMode]);

    const goToNext = useCallback(() => {
        if (viewMode === "day") {
            setSelectedDate((prev) => addDays(prev, 1));
        } else if (viewMode === "week") {
            setSelectedDate((prev) => addDays(prev, 7));
        }
    }, [viewMode]);

    // Handlers
    const handleCreate = useCallback(() => {
        setCreateDialogOpen(true);
    }, []);

    const handleCreateSuccess = useCallback(() => {
        toast.success("Rendez-vous créé", {
            description: "Le rendez-vous a été créé avec succès",
        });
        setCreateDialogOpen(false);
    }, []);

    const handleEdit = useCallback((rdv: RendezVous) => {
        setSelectedRdv(rdv);
        setEditDialogOpen(true);
    }, []);

    const handleEditSuccess = useCallback(() => {
        toast.success("Rendez-vous modifié", {
            description: "Le rendez-vous a été modifié avec succès",
        });
        setEditDialogOpen(false);
        setSelectedRdv(null);
    }, []);

    const handleDelete = useCallback((rdv: RendezVous) => {
        setSelectedRdv(rdv);
        setDeleteDialogOpen(true);
    }, []);

    const confirmDelete = useCallback(() => {
        if (!selectedRdv) return;

        deleteRdv.mutate(selectedRdv.id, {
            onSuccess: () => {
                toast.success("Rendez-vous supprimé", {
                    description: "Le rendez-vous a été supprimé avec succès",
                });
                setDeleteDialogOpen(false);
                setSelectedRdv(null);
            },
            onError: (error) => {
                toast.error("Erreur", {
                    description:
                        error instanceof Error
                            ? error.message
                            : "Impossible de supprimer le rendez-vous",
                });
            },
        });
    }, [selectedRdv, deleteRdv]);

    const handleConfirm = useCallback(
        (rdv: RendezVous) => {
            confirmRdv.mutate(rdv.id, {
                onSuccess: () => {
                    toast.success("Rendez-vous confirmé");
                },
                onError: (error) => {
                    toast.error("Erreur", {
                        description:
                            error instanceof Error
                                ? error.message
                                : "Impossible de confirmer le rendez-vous",
                    });
                },
            });
        },
        [confirmRdv]
    );

    const handleCancel = useCallback(
        (rdv: RendezVous) => {
            cancelRdv.mutate(rdv.id, {
                onSuccess: () => {
                    toast.success("Rendez-vous annulé");
                },
                onError: (error) => {
                    toast.error("Erreur", {
                        description:
                            error instanceof Error
                                ? error.message
                                : "Impossible d'annuler le rendez-vous",
                    });
                },
            });
        },
        [cancelRdv]
    );

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const handlePageSizeChange = useCallback((newSize: number) => {
        setPageSize(newSize);
        setPage(1);
    }, []);

    return {
        viewMode,
        setViewMode,
        selectedDate,
        setSelectedDate,
        goToToday,
        goToPrevious,
        goToNext,
        searchTerm,
        setSearchTerm,
        statutFilter,
        setStatutFilter,
        employeFilter,
        setEmployeFilter,
        page,
        pageSize,
        handlePageChange,
        handlePageSizeChange,
        rendezVous,
        pagination,
        isLoading,
        employes,
        dateRange,
        createDialogOpen,
        setCreateDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        selectedRdv,
        handleCreate,
        handleEdit,
        handleDelete,
        handleConfirm,
        handleCancel,
        confirmDelete,
        handleCreateSuccess,
        handleEditSuccess,
        isDeleting: deleteRdv.isPending,
        isConfirming: confirmRdv.isPending,
        isCancelling: cancelRdv.isPending,
        availableStatuts: RENDEZ_VOUS_STATUTS,
    };
}
