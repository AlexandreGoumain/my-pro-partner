/**
 * Unified API Handler Middleware
 *
 * Combines authentication, capability checks, feature limits, and error handling
 * into a single, easy-to-use wrapper for API routes.
 *
 * @example
 * // Simple authenticated route
 * export async function GET() {
 *   return withApiHandler(async (ctx) => {
 *     const data = await prisma.client.findMany({
 *       where: { entrepriseId: ctx.entrepriseId }
 *     });
 *     return NextResponse.json(data);
 *   });
 * }
 *
 * @example
 * // Route with capability check
 * export async function POST(req: NextRequest) {
 *   return withApiHandler(async (ctx) => {
 *     const body = await req.json();
 *     // ... create logic
 *     return NextResponse.json(data, { status: 201 });
 *   }, { capability: "agenda" });
 * }
 *
 * @example
 * // Route with limit check
 * export async function POST(req: NextRequest) {
 *   return withApiHandler(async (ctx) => {
 *     const body = await req.json();
 *     // ... create client logic
 *     return NextResponse.json(client, { status: 201 });
 *   }, {
 *     capability: "clients",
 *     limitKey: "maxClients",
 *     context: { resourceName: "Client", operation: "create" }
 *   });
 * }
 */

import { NextResponse } from "next/server";
import {
    type TenantContext,
    requireTenantAuth,
    requireAdmin,
} from "@/lib/middleware/tenant-isolation";
import { withErrorHandling, type ErrorContext } from "@/lib/middleware/error-handler";
import { CapabilityService } from "@/lib/services/capability.service";
import { validateLimit } from "@/lib/middleware/feature-validation";
import type { Capability } from "@/lib/types/capability";
import type { BusinessType } from "@/lib/types/business";
import type { PlanLimits } from "@/lib/config/plans.config";
import { ForbiddenError } from "@/lib/errors/custom-errors";

/**
 * Options for the API handler
 */
export interface ApiHandlerOptions {
    /**
     * Whether authentication is required (default: true)
     */
    requireAuth?: boolean;

    /**
     * Require admin role
     */
    requireAdmin?: boolean;

    /**
     * Required capability for the business type
     * If the business doesn't have this capability, returns 403
     */
    capability?: Capability;

    /**
     * Required capabilities (ALL must be present)
     */
    capabilities?: Capability[];

    /**
     * Any of these capabilities (at least one must be present)
     */
    anyCapability?: Capability[];

    /**
     * Plan limit key to check before allowing creation
     * Checks if the user has reached their plan limit
     */
    limitKey?: keyof PlanLimits;

    /**
     * Error context for logging
     */
    context?: ErrorContext;
}

/**
 * Handler function type that receives tenant context
 */
export type ApiHandler = (context: TenantContext) => Promise<NextResponse>;

/**
 * Handler function type for public routes (no auth required)
 */
export type PublicApiHandler = () => Promise<NextResponse>;

/**
 * Unified API handler that combines all middleware
 *
 * @param handler - The route handler function that receives TenantContext
 * @param options - Configuration options for the middleware
 * @returns NextResponse
 */
export async function withApiHandler(
    handler: ApiHandler,
    options: ApiHandlerOptions = {}
): Promise<NextResponse> {
    const {
        requireAuth: needsAuth = true,
        requireAdmin: needsAdmin = false,
        capability,
        capabilities,
        anyCapability,
        limitKey,
        context,
    } = options;

    return withErrorHandling(async () => {
        // 1. Authentication check
        let tenantContext: TenantContext;

        if (needsAdmin) {
            tenantContext = await requireAdmin();
        } else if (needsAuth) {
            tenantContext = await requireTenantAuth();
        } else {
            // Public route - create a minimal context
            // This shouldn't happen often, use withPublicApiHandler instead
            return handler(null as unknown as TenantContext);
        }

        const businessType = tenantContext.entreprise.businessType as BusinessType;

        // 2. Capability check (single)
        if (capability) {
            if (!CapabilityService.hasCapability(businessType, capability)) {
                throw new ForbiddenError(
                    "Fonctionnalité non disponible pour votre type d'entreprise"
                );
            }
        }

        // 3. Capabilities check (all required)
        if (capabilities && capabilities.length > 0) {
            if (!CapabilityService.hasAllCapabilities(businessType, capabilities)) {
                throw new ForbiddenError(
                    "Fonctionnalités requises non disponibles pour votre type d'entreprise"
                );
            }
        }

        // 4. Any capability check (at least one)
        if (anyCapability && anyCapability.length > 0) {
            if (!CapabilityService.hasAnyCapability(businessType, anyCapability)) {
                throw new ForbiddenError(
                    "Aucune des fonctionnalités requises n'est disponible pour votre type d'entreprise"
                );
            }
        }

        // 5. Plan limit check
        if (limitKey) {
            const limitResponse = await validateLimit(
                tenantContext.entreprise.plan,
                tenantContext.entrepriseId,
                limitKey
            );
            if (limitResponse) {
                return limitResponse;
            }
        }

        // 6. Execute the handler
        return handler(tenantContext);
    }, context);
}

/**
 * Handler for public routes (no authentication required)
 * Still provides error handling
 *
 * @example
 * export async function GET() {
 *   return withPublicApiHandler(async () => {
 *     const data = await getPublicData();
 *     return NextResponse.json(data);
 *   }, { context: { resourceName: "PublicData", operation: "get" } });
 * }
 */
export async function withPublicApiHandler(
    handler: PublicApiHandler,
    options: { context?: ErrorContext } = {}
): Promise<NextResponse> {
    return withErrorHandling(handler, options.context);
}

/**
 * Re-export TenantContext for convenience
 */
export type { TenantContext } from "@/lib/middleware/tenant-isolation";
