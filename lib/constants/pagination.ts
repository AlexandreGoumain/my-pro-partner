/**
 * Pagination constants
 * Centralized pagination configuration for consistent behavior across the application
 */

/**
 * Default page sizes for different view modes
 */
export const PAGINATION_DEFAULTS = {
  /** Default page size for list view (tables, lists) */
  PAGE_SIZE_LIST: 20,

  /** Default page size for grid view (cards, grids) */
  PAGE_SIZE_GRID: 24,

  /** Page size for compact/small lists (dropdowns, previews) */
  PAGE_SIZE_SMALL: 10,

  /** Page size for large datasets (exports, reports) */
  PAGE_SIZE_LARGE: 50,

  /** Maximum allowed page size (to prevent performance issues) */
  MAX_PAGE_SIZE: 100,

  /** Minimum page size */
  MIN_PAGE_SIZE: 5,

  /** Default starting page number */
  INITIAL_PAGE: 1,
} as const;

/**
 * Page size options for user selection
 */
export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 24, label: "24" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
] as const;

/**
 * Get default page size based on view mode
 * @param viewMode - The current view mode
 * @returns Appropriate page size for the view mode
 */
export function getDefaultPageSize(viewMode: "grid" | "list"): number {
  return viewMode === "grid"
    ? PAGINATION_DEFAULTS.PAGE_SIZE_GRID
    : PAGINATION_DEFAULTS.PAGE_SIZE_LIST;
}

/**
 * Validate and clamp page size to allowed range
 * @param pageSize - Requested page size
 * @returns Valid page size within allowed range
 */
export function validatePageSize(pageSize: number): number {
  return Math.max(
    PAGINATION_DEFAULTS.MIN_PAGE_SIZE,
    Math.min(pageSize, PAGINATION_DEFAULTS.MAX_PAGE_SIZE)
  );
}

/**
 * Calculate total pages from total items
 * @param totalItems - Total number of items
 * @param pageSize - Items per page
 * @returns Total number of pages
 */
export function calculateTotalPages(totalItems: number, pageSize: number): number {
  return Math.ceil(totalItems / pageSize);
}

/**
 * Calculate items range for current page
 * @param page - Current page number (1-indexed)
 * @param pageSize - Items per page
 * @param totalItems - Total number of items
 * @returns Object with start and end indices, and display text
 *
 * @example
 * ```ts
 * const range = getPageRange(2, 20, 45);
 * // { start: 21, end: 40, text: "21-40 of 45" }
 * ```
 */
export function getPageRange(
  page: number,
  pageSize: number,
  totalItems: number
): {
  start: number;
  end: number;
  text: string;
} {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return {
    start,
    end,
    text: totalItems > 0 ? `${start}-${end} sur ${totalItems}` : "0 sur 0",
  };
}

/**
 * Validate and clamp page number to valid range
 * @param page - Requested page number
 * @param totalPages - Total number of pages
 * @returns Valid page number within range
 */
export function validatePageNumber(page: number, totalPages: number): number {
  return Math.max(1, Math.min(page, totalPages || 1));
}
