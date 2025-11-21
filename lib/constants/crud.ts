/**
 * Constants for CRUD operations
 */

/**
 * Default pagination values
 */
export const DEFAULT_PAGINATION = {
    PAGE: 1,
    LIMIT: 20,
    MAX_LIMIT: 100,
} as const;

/**
 * Query parameter names
 */
export const QUERY_PARAMS = {
    SEARCH: "search",
    PAGE: "page",
    LIMIT: "limit",
} as const;

/**
 * Default order by
 */
export const DEFAULT_ORDER_BY = {
    createdAt: "desc",
} as const;

/**
 * CRUD operation names
 */
export const CRUD_OPERATIONS = {
    LIST: "list",
    CREATE: "create",
    GET: "get",
    UPDATE: "update",
    DELETE: "delete",
} as const;

export type CrudOperation =
    (typeof CRUD_OPERATIONS)[keyof typeof CRUD_OPERATIONS];
