import { useLocalStorage } from "./use-local-storage";
import { PAGINATION_DEFAULTS, getDefaultPageSize } from "../constants/pagination";

/**
 * Hook to manage view mode (grid/list) with localStorage persistence
 * Also manages page size based on view mode
 *
 * @param storageKey - Unique key for localStorage (e.g., "articles-view-mode")
 * @param defaultMode - Default view mode if not in localStorage
 * @returns View mode state and helpers
 *
 * @example
 * ```tsx
 * const { viewMode, setViewMode, pageSize, toggleViewMode } = useViewMode("articles-view");
 *
 * return (
 *   <button onClick={toggleViewMode}>
 *     {viewMode === "grid" ? <Grid /> : <List />}
 *   </button>
 * );
 * ```
 */
export function useViewMode(
  storageKey: string,
  defaultMode: "grid" | "list" = "grid"
) {
  const [viewMode, setViewMode] = useLocalStorage<"grid" | "list">(
    storageKey,
    defaultMode
  );

  // Automatically determine page size based on view mode
  const pageSize = getDefaultPageSize(viewMode);

  // Toggle between grid and list
  const toggleViewMode = () => {
    setViewMode((current) => (current === "grid" ? "list" : "grid"));
  };

  return {
    viewMode,
    setViewMode,
    pageSize,
    toggleViewMode,
    isGridMode: viewMode === "grid",
    isListMode: viewMode === "list",
  };
}
