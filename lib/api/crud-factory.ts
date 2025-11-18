import { withErrorHandling } from "@/lib/errors";
import { validateLimit } from "@/lib/middleware/feature-validation";
import {
    requirePermission,
    type PermissionName,
} from "@/lib/middleware/permissions";
import {
    requireTenantAuth,
    verifyResourceAccess,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import {
    createPaginatedResponse,
    getPaginationParams,
} from "@/lib/utils/pagination";
import { validateRequest } from "@/lib/utils/validation-helper";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * Configuration for CRUD routes
 */
export interface CrudConfig {
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
    createSchema: z.ZodSchema;

    /**
     * Zod schema for update validation
     */
    updateSchema: z.ZodSchema;

    /**
     * Fields to search across (for search query parameter)
     */
    searchFields?: string[];

    /**
     * Prisma include clause for relationships
     */
    include?: Record<string, unknown>;

    /**
     * Default order by clause
     */
    orderBy?: Record<string, unknown>;

    /**
     * Plan limit key (e.g., 'maxClients', 'maxProducts')
     * If provided, will check feature limits before creation
     */
    limitKey?: string;

    /**
     * Permissions configuration
     * If provided, will check permissions before allowing operations
     */
    permissions?: {
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
    };

    /**
     * Custom where clause builder
     * Allows adding custom filters beyond standard search
     */
    customWhere?: (
        searchParams: URLSearchParams,
        entrepriseId: string
    ) => Record<string, unknown>;

    /**
     * Transform data before creation
     */
    beforeCreate?: (data: unknown, entrepriseId: string) => Promise<unknown> | unknown;

    /**
     * Transform data before update
     */
    beforeUpdate?: (
        data: unknown,
        resourceId: string,
        entrepriseId: string
    ) => Promise<unknown> | unknown;

    /**
     * Hook after creation
     */
    afterCreate?: (resource: unknown, entrepriseId: string) => Promise<void> | void;

    /**
     * Hook after update
     */
    afterUpdate?: (resource: unknown, entrepriseId: string) => Promise<void> | void;

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
 * Get Prisma model delegate from model name
 */
function getModel(modelName: string): Record<string, unknown> {
    return (prisma as Record<string, unknown>)[modelName] as Record<string, unknown>;
}

/**
 * Create CRUD routes for a collection endpoint (GET list, POST create)
 *
 * @param config - Configuration for the CRUD routes
 * @returns Object with GET and POST handlers
 *
 * @example
 * ```ts
 * export const { GET, POST } = createCrudRoutes({
 *   modelName: 'client',
 *   resourceName: 'Client',
 *   createSchema: clientCreateSchema,
 *   updateSchema: clientUpdateSchema,
 *   searchFields: ['nom', 'email', 'ville'],
 *   limitKey: 'maxClients',
 *   permissions: {
 *     list: 'canViewUsers',
 *     create: 'canManageUsers',
 *   },
 * });
 * ```
 */
export function createCrudRoutes(config: CrudConfig) {
    const model = getModel(config.modelName);

    /**
     * GET /api/resource
     * List all resources with pagination, search, and filtering
     */
    const GET = async (req: NextRequest) => {
        return withErrorHandling(
            async () => {
                const { entrepriseId } = await requireTenantAuth();

                // Check permissions if configured
                if (config.permissions?.list) {
                    await requirePermission(req, config.permissions.list);
                }

                const { searchParams } = new URL(req.url);

                // Get pagination params
                const pagination = getPaginationParams(searchParams);

                // Build where clause
                const search = searchParams.get("search");
                let where: Record<string, unknown> = { entrepriseId };

                // Add search filter
                if (
                    search &&
                    config.searchFields &&
                    config.searchFields.length > 0
                ) {
                    where.OR = config.searchFields.map((field) => ({
                        [field]: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    }));
                }

                // Add custom filters
                if (config.customWhere) {
                    const customFilters = config.customWhere(
                        searchParams,
                        entrepriseId
                    );
                    where = { ...where, ...customFilters };
                }

                // Fetch resources with pagination
                const [items, total] = await Promise.all([
                    model.findMany({
                        where,
                        orderBy: config.orderBy || { createdAt: "desc" },
                        skip: pagination.skip,
                        take: pagination.limit,
                        ...(config.include && { include: config.include }),
                    }),
                    model.count({ where }),
                ]);

                return NextResponse.json(
                    createPaginatedResponse(items, total, pagination)
                );
            },
            { resourceName: config.resourceName, operation: "list" }
        );
    };

    /**
     * POST /api/resource
     * Create a new resource
     */
    const POST = async (req: NextRequest) => {
        return withErrorHandling(
            async () => {
                const { entrepriseId, entreprise } = await requireTenantAuth();

                // Check permissions if configured
                if (config.permissions?.create) {
                    await requirePermission(req, config.permissions.create);
                }

                // Check feature limits if configured
                if (config.limitKey) {
                    const limitCheck = await validateLimit(
                        entreprise.plan,
                        entrepriseId,
                        config.limitKey as string
                    );
                    if (limitCheck) return limitCheck;
                }

                // Validate request body
                const body = await req.json();
                const result = validateRequest(config.createSchema, body);
                if (!result.success) return result.response;

                // Apply before create hook
                let dataToCreate = { ...result.data, entrepriseId };
                if (config.beforeCreate) {
                    dataToCreate = await config.beforeCreate(
                        dataToCreate,
                        entrepriseId
                    );
                }

                // Create resource
                const resource = await model.create({
                    data: dataToCreate,
                    ...(config.include && { include: config.include }),
                });

                // Apply after create hook
                if (config.afterCreate) {
                    await config.afterCreate(resource, entrepriseId);
                }

                return NextResponse.json(resource, { status: 201 });
            },
            { resourceName: config.resourceName, operation: "create" }
        );
    };

    return { GET, POST };
}

/**
 * Create CRUD routes for a resource-by-id endpoint (GET, PUT, DELETE)
 *
 * @param config - Configuration for the CRUD routes
 * @returns Object with GET, PUT, and DELETE handlers
 *
 * @example
 * ```ts
 * export const { GET, PUT, DELETE } = createResourceByIdRoutes({
 *   modelName: 'client',
 *   resourceName: 'Client',
 *   updateSchema: clientUpdateSchema,
 * });
 * ```
 */
export function createResourceByIdRoutes(config: CrudConfig) {
    const model = getModel(config.modelName);

    /**
     * GET /api/resource/[id]
     * Get a single resource by ID
     */
    const GET = async (
        req: NextRequest,
        { params }: { params: Promise<{ id: string }> }
    ) => {
        return withErrorHandling(
            async () => {
                const { id } = await params;

                // Check permissions if configured
                if (config.permissions?.read) {
                    await requirePermission(req, config.permissions.read);
                }

                const { resource } = await verifyResourceAccess(
                    id,
                    (id) =>
                        model.findUnique({
                            where: { id },
                            ...(config.include && { include: config.include }),
                        }),
                    config.resourceName
                );

                return NextResponse.json(resource);
            },
            { resourceName: config.resourceName, operation: "get" }
        );
    };

    /**
     * PUT /api/resource/[id]
     * Update a resource by ID
     */
    const PUT = async (
        req: NextRequest,
        { params }: { params: Promise<{ id: string }> }
    ) => {
        return withErrorHandling(
            async () => {
                const { id } = await params;

                // Check permissions if configured
                if (config.permissions?.update) {
                    await requirePermission(req, config.permissions.update);
                }

                const { entrepriseId } = await verifyResourceAccess(
                    id,
                    (id) =>
                        model.findUnique({
                            where: { id },
                            select: { id: true, entrepriseId: true },
                        }),
                    config.resourceName
                );

                // Validate request body
                const body = await req.json();
                const result = validateRequest(config.updateSchema, body);
                if (!result.success) return result.response;

                // Apply before update hook
                let dataToUpdate = result.data;
                if (config.beforeUpdate) {
                    dataToUpdate = await config.beforeUpdate(
                        dataToUpdate,
                        id,
                        entrepriseId.entrepriseId
                    );
                }

                // Update resource
                const updated = await model.update({
                    where: { id },
                    data: dataToUpdate,
                    ...(config.include && { include: config.include }),
                });

                // Apply after update hook
                if (config.afterUpdate) {
                    await config.afterUpdate(
                        updated,
                        entrepriseId.entrepriseId
                    );
                }

                return NextResponse.json(updated);
            },
            { resourceName: config.resourceName, operation: "update" }
        );
    };

    /**
     * DELETE /api/resource/[id]
     * Delete a resource by ID
     */
    const DELETE = async (
        req: NextRequest,
        { params }: { params: Promise<{ id: string }> }
    ) => {
        return withErrorHandling(
            async () => {
                const { id } = await params;

                // Check permissions if configured
                if (config.permissions?.delete) {
                    await requirePermission(req, config.permissions.delete);
                }

                const { entrepriseId } = await verifyResourceAccess(
                    id,
                    (id) =>
                        model.findUnique({
                            where: { id },
                            select: { id: true, entrepriseId: true },
                        }),
                    config.resourceName
                );

                // Apply before delete hook
                if (config.beforeDelete) {
                    await config.beforeDelete(id, entrepriseId.entrepriseId);
                }

                // Delete resource
                await model.delete({ where: { id } });

                // Apply after delete hook
                if (config.afterDelete) {
                    await config.afterDelete(id, entrepriseId.entrepriseId);
                }

                return NextResponse.json({ success: true });
            },
            { resourceName: config.resourceName, operation: "delete" }
        );
    };

    return { GET, PUT, DELETE };
}
