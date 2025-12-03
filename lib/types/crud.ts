import { PermissionName } from "@/lib/middleware/permissions";
import { type PlanLimits } from "@/lib/config/plans.config";
import { NextRequest } from "next/server";
import { z } from "zod";

/**
 * Prisma model delegate type
 */
export type PrismaModelDelegate = Record<string, any>;

/**
 * Resource with entrepriseId for tenant isolation
 */
export interface TenantResource {
    id: string;
    entrepriseId: string;
}

/**
 * Pagination parameters from URL search params
 */
export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}

/**
 * Hook callbacks for CRUD operations
 */
export interface CrudHooks<TData = any, TResource = any> {
    /**
     * Transform data before creation
     */
    beforeCreate?: (
        data: TData,
        entrepriseId: string
    ) => Promise<TData> | TData;

    /**
     * Transform data before update
     */
    beforeUpdate?: (
        data: TData,
        resourceId: string,
        entrepriseId: string
    ) => Promise<TData> | TData;

    /**
     * Hook after creation
     */
    afterCreate?: (
        resource: TResource,
        entrepriseId: string
    ) => Promise<void> | void;

    /**
     * Hook after update
     */
    afterUpdate?: (
        resource: TResource,
        entrepriseId: string
    ) => Promise<void> | void;

    /**
     * Hook before deletion (can throw error to prevent deletion)
     */
    beforeDelete?: (
        resourceId: string,
        entrepriseId: string
    ) => Promise<void> | void;

    /**
     * Hook after deletion
     */
    afterDelete?: (
        resourceId: string,
        entrepriseId: string
    ) => Promise<void> | void;
}

/**
 * Permissions configuration for CRUD operations
 */
export interface CrudPermissions {
    /** Permission required to list resources (GET) */
    list?: PermissionName;
    /** Permission required to create resources (POST) */
    create?: PermissionName;
    /** Permission required to read a single resource (GET /[id]) */
    read?: PermissionName;
    /** Permission required to update resources (PUT) */
    update?: PermissionName;
    /** Permission required to delete resources (DELETE) */
    delete?: PermissionName;
}

/**
 * Configuration for CRUD routes
 */
export interface CrudConfig<TData = any, TResource = any> {
    /**
     * Prisma model name (e.g., 'client', 'article')
     */
    modelName: string;

    /**
     * Human-readable resource name for error messages (e.g., 'Client', 'Article')
     */
    resourceName: string;

    /**
     * Zod schema for create validation
     */
    createSchema: z.ZodSchema<TData>;

    /**
     * Zod schema for update validation
     */
    updateSchema: z.ZodSchema<TData>;

    /**
     * Fields to search across (for search query parameter)
     */
    searchFields?: string[];

    /**
     * Prisma include clause for relationships
     */
    include?: Record<string, unknown>;

    /**
     * Default order by clause (can be a single object or array of objects for multi-column sorting)
     */
    orderBy?: Record<string, unknown> | Record<string, unknown>[];

    /**
     * Plan limit key (e.g., 'maxClients', 'maxProducts')
     * If provided, will check feature limits before creation
     */
    limitKey?: keyof PlanLimits | undefined;

    /**
     * Permissions configuration
     * If provided, will check permissions before allowing operations
     */
    permissions?: CrudPermissions;

    /**
     * Custom where clause builder
     * Allows adding custom filters beyond standard search
     */
    customWhere?: (
        searchParams: URLSearchParams,
        entrepriseId: string
    ) => Record<string, unknown>;

    /**
     * Lifecycle hooks
     */
    beforeCreate?: CrudHooks<TData, TResource>["beforeCreate"];
    beforeUpdate?: CrudHooks<TData, TResource>["beforeUpdate"];
    afterCreate?: CrudHooks<TData, TResource>["afterCreate"];
    afterUpdate?: CrudHooks<TData, TResource>["afterUpdate"];
    beforeDelete?: CrudHooks<TData, TResource>["beforeDelete"];
    afterDelete?: CrudHooks<TData, TResource>["afterDelete"];
}

/**
 * CRUD route handlers for collection endpoints
 */
export interface CrudRouteHandlers {
    GET: (req: NextRequest) => Promise<Response>;
    POST: (req: NextRequest) => Promise<Response>;
}

/**
 * CRUD route handlers for resource-by-id endpoints
 */
export interface ResourceByIdRouteHandlers {
    GET: (
        req: NextRequest,
        context: { params: Promise<{ id: string }> }
    ) => Promise<Response>;
    PUT: (
        req: NextRequest,
        context: { params: Promise<{ id: string }> }
    ) => Promise<Response>;
    DELETE: (
        req: NextRequest,
        context: { params: Promise<{ id: string }> }
    ) => Promise<Response>;
}

/**
 * Context for error handling
 */
export interface ErrorContext {
    resourceName: string;
    operation: "list" | "create" | "get" | "update" | "delete";
}
