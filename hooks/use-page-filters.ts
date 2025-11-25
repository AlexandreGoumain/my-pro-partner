import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Options de configuration pour usePageFilters
 */
export interface UsePageFiltersOptions<TSort = string, TFilter = string> {
    /** Délai de debounce pour la recherche (ms) */
    debounceMs?: number;
    /** Taille de page initiale pour le mode grid */
    gridPageSize?: number;
    /** Taille de page initiale pour le mode liste */
    listPageSize?: number;
    /** Mode de vue initial */
    initialViewMode?: "grid" | "list";
    /** Valeur de tri initiale */
    initialSort?: TSort;
    /** Filtres initiaux (ex: type, segment, status) */
    initialFilters?: Record<string, TFilter>;
    /** Callback quand la page change (ex: scroll to top) */
    onPageChange?: (page: number) => void;
}

/**
 * État de pagination
 */
export interface PaginationState {
    page: number;
    pageSize: number;
}

/**
 * État de recherche avec debounce
 */
export interface SearchState {
    searchTerm: string;
    debouncedSearch: string;
}

/**
 * État du mode de vue
 */
export interface ViewModeState {
    viewMode: "grid" | "list";
}

/**
 * Valeur retournée par usePageFilters
 */
export interface UsePageFiltersReturn<TSort = string, TFilter = string> {
    // Pagination
    page: number;
    pageSize: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (size: number) => void;
    resetPage: () => void;

    // Search
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    debouncedSearch: string;
    clearSearch: () => void;

    // View mode
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
    handleViewModeChange: (mode: "grid" | "list") => void;
    isGridView: boolean;
    isListView: boolean;

    // Sort
    sortBy: TSort | undefined;
    setSortBy: (sort: TSort) => void;

    // Generic filters
    filters: Record<string, TFilter>;
    setFilter: (key: string, value: TFilter) => void;
    setFilters: (filters: Record<string, TFilter>) => void;
    clearFilter: (key: string) => void;
    clearAllFilters: () => void;
    hasActiveFilters: boolean;

    // Combined reset
    resetAll: () => void;
}

/**
 * Hook générique pour gérer pagination, recherche, tri et filtres
 *
 * Centralise la logique commune à toutes les pages de liste :
 * - Pagination avec gestion de la taille de page
 * - Recherche avec debounce automatique
 * - Mode de vue (grid/list) avec ajustement automatique de la taille de page
 * - Tri et filtres génériques
 *
 * @example
 * ```tsx
 * function ArticlesPage() {
 *   const {
 *     page, pageSize, handlePageChange, handlePageSizeChange,
 *     searchTerm, setSearchTerm, debouncedSearch,
 *     viewMode, handleViewModeChange,
 *     sortBy, setSortBy,
 *     filters, setFilter,
 *   } = usePageFilters({
 *     initialSort: "Nom A-Z",
 *     initialFilters: { type: "TOUS" },
 *   });
 *
 *   const { data } = useArticlesPaginated({
 *     page,
 *     limit: pageSize,
 *     search: debouncedSearch,
 *   });
 *
 *   return (
 *     <div>
 *       <SearchInput value={searchTerm} onChange={setSearchTerm} />
 *       <ViewModeToggle value={viewMode} onChange={handleViewModeChange} />
 *       <SortSelect value={sortBy} onChange={setSortBy} />
 *       <DataTable data={data} />
 *       <Pagination page={page} onChange={handlePageChange} />
 *     </div>
 *   );
 * }
 * ```
 */
export function usePageFilters<TSort = string, TFilter = string>(
    options: UsePageFiltersOptions<TSort, TFilter> = {}
): UsePageFiltersReturn<TSort, TFilter> {
    const {
        debounceMs = 300,
        gridPageSize = 24,
        listPageSize = 20,
        initialViewMode = "grid",
        initialSort,
        initialFilters = {},
        onPageChange,
    } = options;

    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(
        initialViewMode === "grid" ? gridPageSize : listPageSize
    );

    // Search state
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // View mode state
    const [viewMode, setViewModeState] = useState<"grid" | "list">(
        initialViewMode
    );

    // Sort state
    const [sortBy, setSortBy] = useState<TSort | undefined>(initialSort);

    // Generic filters state
    const [filters, setFiltersState] = useState<Record<string, TFilter>>(
        initialFilters as Record<string, TFilter>
    );

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset to first page when searching
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [searchTerm, debounceMs]);

    // Reset page helper
    const resetPage = useCallback(() => {
        setPage(1);
    }, []);

    // Page change handler with optional callback
    const handlePageChange = useCallback(
        (newPage: number) => {
            setPage(newPage);
            onPageChange?.(newPage);
        },
        [onPageChange]
    );

    // Page size change handler (resets to page 1)
    const handlePageSizeChange = useCallback((newSize: number) => {
        setPageSize(newSize);
        setPage(1);
    }, []);

    // View mode change handler (adjusts page size)
    const handleViewModeChange = useCallback(
        (mode: "grid" | "list") => {
            setViewModeState(mode);
            setPage(1);
            setPageSize(mode === "grid" ? gridPageSize : listPageSize);
        },
        [gridPageSize, listPageSize]
    );

    // Direct setViewMode (without automatic page size adjustment)
    const setViewMode = useCallback((mode: "grid" | "list") => {
        setViewModeState(mode);
    }, []);

    // Clear search
    const clearSearch = useCallback(() => {
        setSearchTerm("");
        setDebouncedSearch("");
        setPage(1);
    }, []);

    // Set single filter
    const setFilter = useCallback((key: string, value: TFilter) => {
        setFiltersState((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    }, []);

    // Set multiple filters at once
    const setFilters = useCallback((newFilters: Record<string, TFilter>) => {
        setFiltersState(newFilters);
        setPage(1);
    }, []);

    // Clear single filter
    const clearFilter = useCallback((key: string) => {
        setFiltersState((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
        setPage(1);
    }, []);

    // Clear all filters
    const clearAllFilters = useCallback(() => {
        setFiltersState(initialFilters as Record<string, TFilter>);
        setPage(1);
    }, [initialFilters]);

    // Check if any filter is active (different from initial)
    const hasActiveFilters = useMemo(() => {
        const filterKeys = Object.keys(filters);
        const initialKeys = Object.keys(initialFilters);

        if (filterKeys.length !== initialKeys.length) return true;

        return filterKeys.some(
            (key) =>
                filters[key] !==
                (initialFilters as Record<string, TFilter>)[key]
        );
    }, [filters, initialFilters]);

    // Reset everything
    const resetAll = useCallback(() => {
        setPage(1);
        setPageSize(initialViewMode === "grid" ? gridPageSize : listPageSize);
        setSearchTerm("");
        setDebouncedSearch("");
        setViewModeState(initialViewMode);
        setSortBy(initialSort);
        setFiltersState(initialFilters as Record<string, TFilter>);
    }, [
        initialViewMode,
        gridPageSize,
        listPageSize,
        initialSort,
        initialFilters,
    ]);

    // Computed values
    const isGridView = viewMode === "grid";
    const isListView = viewMode === "list";

    return {
        // Pagination
        page,
        pageSize,
        setPage,
        setPageSize,
        handlePageChange,
        handlePageSizeChange,
        resetPage,

        // Search
        searchTerm,
        setSearchTerm,
        debouncedSearch,
        clearSearch,

        // View mode
        viewMode,
        setViewMode,
        handleViewModeChange,
        isGridView,
        isListView,

        // Sort
        sortBy,
        setSortBy,

        // Filters
        filters,
        setFilter,
        setFilters,
        clearFilter,
        clearAllFilters,
        hasActiveFilters,

        // Reset
        resetAll,
    };
}

/**
 * Version simplifiée pour les cas d'usage basiques
 * (pagination + search uniquement)
 */
export function useSimplePageFilters(debounceMs = 300) {
    return usePageFilters({
        debounceMs,
        initialViewMode: "list",
    });
}

/**
 * Hook spécialisé pour les pages avec scroll to top automatique
 */
export function usePageFiltersWithScroll<TSort = string, TFilter = string>(
    options: Omit<UsePageFiltersOptions<TSort, TFilter>, "onPageChange"> = {}
) {
    return usePageFilters({
        ...options,
        onPageChange: () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
    });
}
