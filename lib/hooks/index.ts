/**
 * Centralized exports for custom hooks
 * Import hooks from this file for better organization
 */

// Core utility hooks
export { useDebounce, useDebouncedCallback } from "./use-debounce";
export { useLocalStorage, useSessionStorage } from "./use-local-storage";

// Page composition hooks
export { useSearchState } from "./use-search-state";
export { useViewMode } from "./use-view-mode";
export {
  useFilteredStats,
  useFilteredStatsWithLabels,
  statAggregators,
  type StatConfig,
  type Stat,
} from "./use-filtered-stats";

/**
 * USAGE EXAMPLES
 *
 * ## Search State
 * ```tsx
 * const { searchTerm, debouncedSearch, setSearchTerm } = useSearchState();
 * ```
 *
 * ## View Mode
 * ```tsx
 * const { viewMode, toggleViewMode, pageSize } = useViewMode("articles-view");
 * ```
 *
 * ## Filtered Stats
 * ```tsx
 * const stats = useFilteredStats(items, [
 *   { key: 'total', label: 'Total', filter: () => true },
 *   { key: 'active', label: 'Active', filter: (item) => item.actif },
 * ]);
 * ```
 *
 * ## Complete Page Hook Example
 * ```tsx
 * export function useResourcePage() {
 *   // Data fetching
 *   const { data: items = [], isLoading } = useItems();
 *   const deleteItem = useDeleteItem();
 *
 *   // CRUD dialogs
 *   const { dialogs, selected, handlers } = useCrudDialogs<Item>();
 *
 *   // Search with debouncing
 *   const { searchTerm, debouncedSearch, setSearchTerm } = useSearchState();
 *
 *   // View mode with persistence
 *   const { viewMode, setViewMode, pageSize } = useViewMode("items-view");
 *
 *   // Stats calculation
 *   const stats = useFilteredStats(items, [
 *     { key: 'total', label: 'Total', filter: () => true },
 *     { key: 'active', label: 'Actifs', filter: (i) => i.actif },
 *   ]);
 *
 *   // Filtered data
 *   const filtered = useMemo(() => {
 *     return items.filter(item =>
 *       item.nom.toLowerCase().includes(debouncedSearch.toLowerCase())
 *     );
 *   }, [items, debouncedSearch]);
 *
 *   return {
 *     items: filtered,
 *     isLoading,
 *     searchTerm,
 *     setSearchTerm,
 *     viewMode,
 *     setViewMode,
 *     pageSize,
 *     stats,
 *     ...handlers,
 *     ...dialogs,
 *     selected,
 *   };
 * }
 * ```
 */
