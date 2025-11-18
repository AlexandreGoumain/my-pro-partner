/**
 * Permission Middleware
 * Provides permission checking functionality for API routes
 */

import { ForbiddenError } from "@/lib/errors";
import { userHasPermission } from "@/lib/personnel/personnel.service";
import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth } from "./tenant-isolation";

/**
 * Permission names (should match UserPermissions model)
 */
export type PermissionName =
    | "canViewUsers"
    | "canManageUsers"
    | "canViewReports"
    | "canManageInventory"
    | "canManageFinance"
    | "canManageSettings"
    | "canDeleteData"
    | "canExportData"
    | "canManageRoles";

/**
 * Check if the current user has a specific permission
 * Throws ForbiddenError if user doesn't have permission
 *
 * @param req - Next request object
 * @param permission - Permission to check
 * @throws ForbiddenError if user doesn't have permission
 *
 * @example
 * ```ts
 * await requirePermission(req, "canViewUsers");
 * ```
 */
export async function requirePermission(
    req: NextRequest,
    permission: PermissionName
): Promise<void> {
    const { userId } = await requireTenantAuth();

    const hasPermission = await userHasPermission(userId, permission);

    if (!hasPermission) {
        throw new ForbiddenError(
            `Permission requise : ${permission}. Vous n'avez pas les droits nécessaires pour effectuer cette action.`
        );
    }
}

/**
 * Create a permission check function for CRUD factory hooks
 * Returns a function that can be used in beforeRequest hooks
 *
 * @param permission - Permission to check
 * @returns Function that checks permission and throws if not authorized
 *
 * @example
 * ```ts
 * export const { GET, POST } = createCrudRoutes({
 *   modelName: 'user',
 *   resourceName: 'User',
 *   // ... other config
 *   beforeCreate: createPermissionCheck("canManageUsers"),
 * });
 * ```
 */
export function createPermissionCheck(permission: PermissionName) {
    return async (data: unknown, entrepriseId: string, req?: NextRequest) => {
        if (!req) {
            // If no request object, we need to get userId another way
            // This is a fallback, normally req should be passed
            throw new Error("Request object required for permission check");
        }

        await requirePermission(req, permission);
        return data;
    };
}

/**
 * Create a permission middleware for route handlers
 * Can be used to wrap route handlers with permission checks
 *
 * @param permission - Permission to check
 * @param handler - Route handler function
 * @returns Wrapped handler with permission check
 *
 * @example
 * ```ts
 * export const GET = withPermission("canViewUsers", async (req) => {
 *   // Only users with canViewUsers permission can access this
 *   const data = await fetchData();
 *   return NextResponse.json(data);
 * });
 * ```
 */
export function withPermission<T extends unknown[]>(
    permission: PermissionName,
    handler: (...args: T) => Promise<NextResponse>
) {
    return async (...args: T): Promise<NextResponse> => {
        try {
            // First argument should be NextRequest
            const req = args[0] as unknown as NextRequest;

            await requirePermission(req, permission);

            return await handler(...args);
        } catch (error) {
            if (error instanceof ForbiddenError) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 403 }
                );
            }
            throw error;
        }
    };
}

/**
 * Check multiple permissions (user must have ALL of them)
 *
 * @param req - Next request object
 * @param permissions - Array of permissions to check
 * @throws ForbiddenError if user doesn't have all permissions
 *
 * @example
 * ```ts
 * await requireAllPermissions(req, ["canViewUsers", "canManageUsers"]);
 * ```
 */
export async function requireAllPermissions(
    req: NextRequest,
    permissions: PermissionName[]
): Promise<void> {
    const { userId } = await requireTenantAuth();

    for (const permission of permissions) {
        const hasPermission = await userHasPermission(userId, permission);

        if (!hasPermission) {
            throw new ForbiddenError(
                `Permission requise : ${permission}. Vous n'avez pas les droits nécessaires pour effectuer cette action.`
            );
        }
    }
}

/**
 * Check multiple permissions (user must have AT LEAST ONE)
 *
 * @param req - Next request object
 * @param permissions - Array of permissions to check
 * @throws ForbiddenError if user doesn't have any of the permissions
 *
 * @example
 * ```ts
 * await requireAnyPermission(req, ["canViewReports", "canManageFinance"]);
 * ```
 */
export async function requireAnyPermission(
    req: NextRequest,
    permissions: PermissionName[]
): Promise<void> {
    const { userId } = await requireTenantAuth();

    for (const permission of permissions) {
        const hasPermission = await userHasPermission(userId, permission);

        if (hasPermission) {
            return; // User has at least one permission
        }
    }

    throw new ForbiddenError(
        `Vous devez avoir au moins une de ces permissions : ${permissions.join(", ")}`
    );
}

/**
 * Get all permissions for the current user
 *
 * @param req - Next request object
 * @returns Object with all user permissions
 *
 * @example
 * ```ts
 * const permissions = await getUserPermissions(req);
 * if (permissions.canViewUsers) { ... }
 * ```
 */
export async function getUserPermissions(req: NextRequest) {
    const { userId } = await requireTenantAuth();

    const { prisma } = await import("@/lib/prisma");

    const userPerms = await prisma.userPermissions.findUnique({
        where: { userId },
    });

    return userPerms || {};
}
