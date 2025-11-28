/**
 * Utility for building URL query parameters from filter objects
 *
 * Replaces 47+ inline URLSearchParams constructions across the codebase
 *
 * @example
 * ```ts
 * const queryString = buildQueryParams({
 *   search: "test",
 *   page: 1,
 *   statut: ["ACTIVE", "PENDING"],
 *   clientId: "123"
 * });
 * // Returns: "search=test&page=1&statut=ACTIVE,PENDING&clientId=123"
 * ```
 */

export type FilterValue =
    | string
    | number
    | boolean
    | string[]
    | number[]
    | Date
    | null
    | undefined;

export interface QueryParamsOptions {
    /** Separator for array values. Default: "," */
    arraySeparator?: string;
    /** Whether to include null/undefined values. Default: false */
    includeEmpty?: boolean;
    /** Date format function. Default: ISO string */
    formatDate?: (date: Date) => string;
}

/**
 * Build URL query string from a filters object
 *
 * @param filters - Object containing filter key-value pairs
 * @param options - Configuration options
 * @returns URL-encoded query string (without leading "?")
 */
export function buildQueryParams(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters?: Record<string, any>,
    options: QueryParamsOptions = {}
): string {
    if (!filters) return "";

    const {
        arraySeparator = ",",
        includeEmpty = false,
        formatDate = (date: Date) => date.toISOString(),
    } = options;

    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(filters)) {
        // Skip null/undefined unless includeEmpty is true
        if (value === null || value === undefined) {
            if (includeEmpty) {
                params.append(key, "");
            }
            continue;
        }

        // Handle arrays
        if (Array.isArray(value)) {
            if (value.length > 0) {
                params.append(key, value.join(arraySeparator));
            }
            continue;
        }

        // Handle dates
        if (value instanceof Date) {
            params.append(key, formatDate(value));
            continue;
        }

        // Handle booleans
        if (typeof value === "boolean") {
            params.append(key, value.toString());
            continue;
        }

        // Handle numbers
        if (typeof value === "number") {
            params.append(key, value.toString());
            continue;
        }

        // Handle strings (skip empty strings unless includeEmpty)
        if (typeof value === "string") {
            if (value || includeEmpty) {
                params.append(key, value);
            }
            continue;
        }
    }

    return params.toString();
}

/**
 * Build full URL with query params
 *
 * @param baseUrl - Base URL path
 * @param filters - Filter object
 * @param options - Query params options
 * @returns Full URL with query string
 *
 * @example
 * ```ts
 * buildUrl("/api/articles", { search: "test", page: 1 });
 * // Returns: "/api/articles?search=test&page=1"
 * ```
 */
export function buildUrl(
    baseUrl: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters?: Record<string, any>,
    options?: QueryParamsOptions
): string {
    const queryString = buildQueryParams(filters, options);
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Parse URL query string into object
 *
 * @param queryString - URL query string (with or without leading "?")
 * @returns Parsed object with string values
 */
export function parseQueryParams(queryString: string): Record<string, string> {
    const cleanString = queryString.startsWith("?")
        ? queryString.slice(1)
        : queryString;

    if (!cleanString) return {};

    const params = new URLSearchParams(cleanString);
    const result: Record<string, string> = {};

    params.forEach((value, key) => {
        result[key] = value;
    });

    return result;
}
