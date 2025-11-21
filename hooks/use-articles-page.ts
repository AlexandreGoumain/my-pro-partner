import { createColumns } from "@/app/(dashboard)/dashboard/catalogue/_components/data-table/columns";
import { useLimitDialog } from "@/components/providers/limit-dialog-provider";
import type { PaginationInfo } from "@/components/ui/data-table/pagination";
import { useArticleFilters } from "@/hooks/use-article-filters";
import { useArticleHandlers } from "@/hooks/use-article-handlers";
import { useArticlesPaginated, useArticlesStats } from "@/hooks/use-articles";
import { useCategories } from "@/hooks/use-categories";
import { type PlanLimits, type PlanType } from "@/lib/pricing-config";
import { type Article, type ArticleTypeFilter } from "@/lib/types/article";
import { expandCategoryIds } from "@/lib/types/category";
import { getArticleEmptyStateMessage } from "@/lib/utils/article-helpers";
import { type ColumnDef } from "@tanstack/react-table";
import { type LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface ArticlesPageHandlers {
    // Data
    articles: Article[];
    filteredAndSortedArticles: Article[];
    isLoading: boolean;
    articlesCount: number;

    // Pagination
    page: number;
    pageSize: number;
    pagination: PaginationInfo | undefined;
    showPagination: boolean;
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (size: number) => void;

    // UI States
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategoryIds: string[];
    setSelectedCategoryIds: (ids: string[]) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
    handleViewModeChange: (mode: "grid" | "list") => void;
    typeFilter: ArticleTypeFilter;
    setTypeFilter: (type: ArticleTypeFilter) => void;

    // Handlers
    handleTypeFilterToggle: (type: ArticleTypeFilter) => void;
    handleCreateWithLimitCheck: () => void;

    // Article handlers from useArticleHandlers
    handleCreate: () => void;
    handleCreateSuccess: () => void;
    handleView: (article: Article) => void;
    handleEdit: (article: Article) => void;
    handleDuplicate: (article: Article) => void;
    handleDelete: (article: Article) => void;
    handleEditSuccess: () => void;
    confirmDelete: () => void;

    // Modal states
    createDialogOpen: boolean;
    setCreateDialogOpen: (open: boolean) => void;
    viewDialogOpen: boolean;
    setViewDialogOpen: (open: boolean) => void;
    editDialogOpen: boolean;
    setEditDialogOpen: (open: boolean) => void;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    selectedArticle: Article | null;
    isDeleting: boolean;

    // Computed data
    stats: {
        total: number;
        produits: number;
        services: number;
        actifs: number;
        stockFaible: number;
    };
    emptyState: {
        title: string;
        description: string;
        buttonText: string;
        icon: LucideIcon;
    };
    columns: ColumnDef<Article>[];

    // Pricing
    userPlan: PlanType;
    checkLimit: (limitKey: keyof PlanLimits, currentValue: number) => boolean;
}

export function useArticlesPage(): ArticlesPageHandlers {
    // Pricing limit check
    const { checkLimit, userPlan } = useLimitDialog();

    // Article handlers and modal states
    const handlers = useArticleHandlers();

    // Categories for filtering
    const { data: categories = [] } = useCategories();

    // UI states
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
        []
    );
    const [sortBy, setSortBy] = useState("Nom A-Z");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(viewMode === "grid" ? 24 : 20);
    const [typeFilter, setTypeFilter] = useState<ArticleTypeFilter>("TOUS");

    // Debounce search term to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset to first page when searching
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Always use server-side pagination for better performance
    const { data: paginatedData, isLoading } = useArticlesPaginated({
        page,
        limit: pageSize,
        search: debouncedSearch,
    });

    // Get stats from backend API
    const { data: statsData } = useArticlesStats();

    const articles = paginatedData?.data || [];
    const pagination = paginatedData?.pagination;
    const articlesCount = statsData?.total || 0;

    // Stats from backend (more efficient than client-side computation)
    const stats = useMemo(() => {
        if (statsData) {
            return {
                total: statsData.total,
                produits: statsData.produits,
                services: statsData.services,
                actifs: statsData.actifs,
                stockFaible: statsData.stockFaible,
            };
        }
        // Fallback to empty stats while loading
        return {
            total: 0,
            produits: 0,
            services: 0,
            actifs: 0,
            stockFaible: 0,
        };
    }, [statsData]);

    // Filter handlers with toggle functionality
    const handleTypeFilterToggle = useCallback(
        (type: ArticleTypeFilter) => {
            if (typeFilter === type && type !== "TOUS") {
                setTypeFilter("TOUS");
            } else {
                setTypeFilter(type);
            }
        },
        [typeFilter]
    );

    // Wrapper pour vérifier la limite avant de créer
    const handleCreateWithLimitCheck = useCallback(() => {
        if (!checkLimit("maxProducts", articlesCount)) {
            return; // Limite atteinte - dialog s'affiche automatiquement
        }
        handlers.handleCreate();
    }, [checkLimit, articlesCount, handlers]);

    // Obtenir tous les IDs de catégories incluant les enfants
    const getAllCategoryIds = useMemo(() => {
        return expandCategoryIds(selectedCategoryIds, categories);
    }, [selectedCategoryIds, categories]);

    // Filtrer et trier les articles
    const filteredAndSortedArticles = useArticleFilters({
        articles,
        searchTerm: debouncedSearch,
        selectedCategoryIds,
        allCategoryIds: getAllCategoryIds,
        sortBy,
        typeFilter,
    });

    // Messages d'état vide personnalisés
    const emptyState = useMemo(
        () => getArticleEmptyStateMessage(typeFilter, articlesCount === 0),
        [typeFilter, articlesCount]
    );

    // Pagination handlers
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

    // Create columns with handlers
    const columns = useMemo(
        () =>
            createColumns({
                onView: handlers.handleView,
                onEdit: handlers.handleEdit,
                onDuplicate: handlers.handleDuplicate,
                onDelete: handlers.handleDelete,
            }),
        [
            handlers.handleView,
            handlers.handleEdit,
            handlers.handleDuplicate,
            handlers.handleDelete,
        ]
    );

    return {
        // Data
        articles,
        filteredAndSortedArticles,
        isLoading,
        articlesCount,

        // Pagination
        page,
        pageSize,
        pagination,
        showPagination: !!pagination,
        handlePageChange,
        handlePageSizeChange,

        // UI States
        searchTerm,
        setSearchTerm,
        selectedCategoryIds,
        setSelectedCategoryIds,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        handleViewModeChange,
        typeFilter,
        setTypeFilter,

        // Handlers
        handleTypeFilterToggle,
        handleCreateWithLimitCheck,

        // Article handlers
        handleCreate: handlers.handleCreate,
        handleCreateSuccess: handlers.handleCreateSuccess,
        handleView: handlers.handleView,
        handleEdit: handlers.handleEdit,
        handleDuplicate: handlers.handleDuplicate,
        handleDelete: handlers.handleDelete,
        handleEditSuccess: handlers.handleEditSuccess,
        confirmDelete: handlers.confirmDelete,

        // Modal states
        createDialogOpen: handlers.createDialogOpen,
        setCreateDialogOpen: handlers.setCreateDialogOpen,
        viewDialogOpen: handlers.viewDialogOpen,
        setViewDialogOpen: handlers.setViewDialogOpen,
        editDialogOpen: handlers.editDialogOpen,
        setEditDialogOpen: handlers.setEditDialogOpen,
        deleteDialogOpen: handlers.deleteDialogOpen,
        setDeleteDialogOpen: handlers.setDeleteDialogOpen,
        selectedArticle: handlers.selectedArticle,
        isDeleting: handlers.isDeleting,

        // Computed data
        stats,
        emptyState,
        columns,

        // Pricing
        userPlan,
        checkLimit,
    };
}
