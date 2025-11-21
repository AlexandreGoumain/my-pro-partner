import { CRUD_OPERATIONS, DEFAULT_ORDER_BY } from "@/lib/constants/crud";
import { withErrorHandling } from "@/lib/errors";
import { validateLimit } from "@/lib/middleware/feature-validation";
import { requirePermission } from "@/lib/middleware/permissions";
import {
    requireTenantAuth,
    verifyResourceAccess,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import type {
    CrudConfig,
    CrudRouteHandlers,
    PrismaModelDelegate,
    ResourceByIdRouteHandlers,
    TenantResource,
} from "@/lib/types/crud";
import {
    createPaginatedResponse,
    getPaginationParams,
} from "@/lib/utils/pagination";
import { validateRequest } from "@/lib/utils/validation-helper";
import { NextRequest, NextResponse } from "next/server";

/**
 * Get Prisma model delegate from model name
 * @param modelName - Name of the Prisma model (e.g., 'client', 'article')
 * @returns Prisma model delegate for database operations
 */
function getPrismaModel(modelName: string): PrismaModelDelegate {
    const model = (prisma as unknown as Record<string, unknown>)[modelName];

    if (!model) {
        throw new Error(`Prisma model "${modelName}" not found`);
    }

    return model as PrismaModelDelegate;
}

/**
 * Build where clause for list queries
 * @param config - CRUD configuration
 * @param searchParams - URL search parameters
 * @param entrepriseId - Company ID for tenant isolation
 * @returns Prisma where clause object
 */
function buildWhereClause(
    config: CrudConfig,
    searchParams: URLSearchParams,
    entrepriseId: string
): Record<string, unknown> {
    let where: Record<string, unknown> = { entrepriseId };

    // Add search filter
    const search = searchParams.get("search");
    if (search && config.searchFields && config.searchFields.length > 0) {
        where.OR = config.searchFields.map((field) => ({
            [field]: {
                contains: search,
                mode: "insensitive" as const,
            },
        }));
    }

    // Add custom filters
    if (config.customWhere) {
        const customFilters = config.customWhere(searchParams, entrepriseId);
        where = { ...where, ...customFilters };
    }

    return where;
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
export function createCrudRoutes(config: CrudConfig): CrudRouteHandlers {
    const model = getPrismaModel(config.modelName);

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
                const where = buildWhereClause(
                    config,
                    searchParams,
                    entrepriseId
                );

                // Fetch resources with pagination
                const [items, total] = await Promise.all([
                    model.findMany({
                        where,
                        orderBy: config.orderBy || DEFAULT_ORDER_BY,
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
            {
                resourceName: config.resourceName,
                operation: CRUD_OPERATIONS.LIST,
            }
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
                        config.limitKey
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
            {
                resourceName: config.resourceName,
                operation: CRUD_OPERATIONS.CREATE,
            }
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
 *   createSchema: clientCreateSchema, // Required by type but not used
 *   updateSchema: clientUpdateSchema,
 *   include: {
 *     documents: true,
 *   },
 *   beforeDelete: async (id, entrepriseId) => {
 *     // Check if resource can be deleted
 *     const hasDocuments = await prisma.document.count({
 *       where: { clientId: id }
 *     });
 *     if (hasDocuments > 0) {
 *       throw new BusinessError('Cannot delete client with documents');
 *     }
 *   },
 * });
 * ```
 */
export function createResourceByIdRoutes(
    config: CrudConfig
): ResourceByIdRouteHandlers {
    const model = getPrismaModel(config.modelName);

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

                const { resource } = await verifyResourceAccess<TenantResource>(
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
            {
                resourceName: config.resourceName,
                operation: CRUD_OPERATIONS.GET,
            }
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

                const { context } = await verifyResourceAccess<TenantResource>(
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
                        context.entrepriseId
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
                    await config.afterUpdate(updated, context.entrepriseId);
                }

                return NextResponse.json(updated);
            },
            {
                resourceName: config.resourceName,
                operation: CRUD_OPERATIONS.UPDATE,
            }
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

                const { context } = await verifyResourceAccess<TenantResource>(
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
                    await config.beforeDelete(id, context.entrepriseId);
                }

                // Delete resource
                await model.delete({ where: { id } });

                // Apply after delete hook
                if (config.afterDelete) {
                    await config.afterDelete(id, context.entrepriseId);
                }

                return NextResponse.json({ success: true });
            },
            {
                resourceName: config.resourceName,
                operation: CRUD_OPERATIONS.DELETE,
            }
        );
    };

    return { GET, PUT, DELETE };
}
