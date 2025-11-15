import {
    createColumns,
    type Article,
} from "@/app/(dashboard)/dashboard/articles/_components/data-table/columns";
import { useLimitDialog } from "@/components/providers/limit-dialog-provider";
import { useArticleFilters } from "@/hooks/use-article-filters";
import { useArticleHandlers } from "@/hooks/use-article-handlers";
import { useArticleStats } from "@/hooks/use-article-stats";
import { useArticles } from "@/hooks/use-articles";
import { useCategories } from "@/hooks/use-categories";
import { type PlanLimits } from "@/lib/pricing-config";
import { type ArticleTypeFilter } from "@/lib/types/article";
import { expandCategoryIds } from "@/lib/types/category";
import { getArticleEmptyStateMessage } from "@/lib/utils/article-helpers";
import { useCallback, useMemo, useState } from "react";

export interface ArticlesPageHandlers {
    // Data
    articles: Article[];
    filteredAndSortedArticles: Article[];
    isLoading: boolean;
    articlesCount: number;

    // UI States
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategoryIds: string[];
    setSelectedCategoryIds: (ids: string[]) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
    typeFilter: ArticleTypeFilter;

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
        icon: any;
    };
    columns: any[];

    // Pricing
    userPlan: any;
    checkLimit: (limitKey: keyof PlanLimits, currentValue: number) => boolean;
}

export function useArticlesPage(): ArticlesPageHandlers {
    // React Query hooks
    const { data: articles = [], isLoading } = useArticles();
    const { data: categories = [] } = useCategories();

    // Article handlers and modal states
    const handlers = useArticleHandlers();

    // Pricing limit check
    const { checkLimit, userPlan } = useLimitDialog();
    const articlesCount = articles.length;

    // UI states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
        []
    );
    const [sortBy, setSortBy] = useState("Nom A-Z");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [typeFilter, setTypeFilter] = useState<ArticleTypeFilter>("TOUS");

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

    // Statistiques par type
    const stats = useArticleStats(articles);

    // Obtenir tous les IDs de catégories incluant les enfants
    const getAllCategoryIds = useMemo(() => {
        return expandCategoryIds(selectedCategoryIds, categories);
    }, [selectedCategoryIds, categories]);

    // Filtrer et trier les articles
    const filteredAndSortedArticles = useArticleFilters({
        articles,
        searchTerm,
        selectedCategoryIds,
        allCategoryIds: getAllCategoryIds,
        sortBy,
        typeFilter,
    });

    // Messages d'état vide personnalisés
    const emptyState = useMemo(
        () => getArticleEmptyStateMessage(typeFilter, articles.length === 0),
        [typeFilter, articles.length]
    );

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

        // UI States
        searchTerm,
        setSearchTerm,
        selectedCategoryIds,
        setSelectedCategoryIds,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        typeFilter,

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
