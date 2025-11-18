import { useState, useCallback } from "react";
import { useDebounce } from "./use-debounce";

/**
 * Hook to manage search state with debouncing
 * Provides both immediate search term and debounced search term for API calls
 *
 * @param initialValue - Initial search term
 * @param debounceDelay - Delay in milliseconds for debouncing (default: 300ms)
 * @returns Search state and helpers
 *
 * @example
 * ```tsx
 * const { searchTerm, debouncedSearch, setSearchTerm, clearSearch } = useSearchState();
 *
 * // Use searchTerm for controlled input
 * <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
 *
 * // Use debouncedSearch for API calls
 * const { data } = useQuery(['items', debouncedSearch], () => fetchItems(debouncedSearch));
 * ```
 */
export function useSearchState(
  initialValue: string = "",
  debounceDelay: number = 300
) {
  const [searchTerm, setSearchTermState] = useState(initialValue);
  const debouncedSearch = useDebounce(searchTerm, debounceDelay);

  // Wrapper to allow additional logic when setting search term
  const setSearchTerm = useCallback((value: string) => {
    setSearchTermState(value);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTermState("");
  }, []);

  // Check if search is active
  const hasSearch = searchTerm.length > 0;
  const isSearching = searchTerm !== debouncedSearch;

  return {
    /** Current search term (updates immediately as user types) */
    searchTerm,
    /** Debounced search term (use this for API calls) */
    debouncedSearch,
    /** Set search term */
    setSearchTerm,
    /** Clear search term */
    clearSearch,
    /** Whether search has any value */
    hasSearch,
    /** Whether search is currently debouncing */
    isSearching,
  };
}
