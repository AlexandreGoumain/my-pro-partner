/**
 * MIGRATION EXAMPLE
 * This file shows how to migrate existing CRUD routes to use the new CRUD Factory
 *
 * DO NOT DELETE - This is a reference file for developers
 */

import { createCrudRoutes, createResourceByIdRoutes } from "./crud-factory";
import { clientCreateSchema, clientUpdateSchema } from "@/lib/validation";

/**
 * EXAMPLE 1: Simple CRUD Routes Migration
 *
 * BEFORE (app/api/clients/route.ts - 76 lines):
 * ------------------------------------------------
 * import { prisma } from "@/lib/prisma";
 * import { createPaginatedResponse, getPaginationParams } from "@/lib/utils/pagination";
 * import { clientCreateSchema } from "@/lib/validation";
 * import { handleTenantError, requireTenantAuth } from "@/lib/middleware/tenant-isolation";
 * import { validateLimit } from "@/lib/middleware/feature-validation";
 * import { validateRequest } from "@/lib/utils/validation-helper";
 * import { NextRequest, NextResponse } from "next/server";
 *
 * export async function GET(req: NextRequest) {
 *   try {
 *     const { entrepriseId } = await requireTenantAuth();
 *     const { searchParams } = new URL(req.url);
 *     const search = searchParams.get("search");
 *     const pagination = getPaginationParams(searchParams);
 *
 *     const where = {
 *       entrepriseId,
 *       ...(search && {
 *         OR: [
 *           { nom: { contains: search, mode: "insensitive" as const } },
 *           { email: { contains: search, mode: "insensitive" as const } },
 *           { ville: { contains: search, mode: "insensitive" as const } },
 *         ],
 *       }),
 *     };
 *
 *     const [clients, total] = await Promise.all([
 *       prisma.client.findMany({
 *         where,
 *         orderBy: { createdAt: "desc" },
 *         skip: pagination.skip,
 *         take: pagination.limit,
 *       }),
 *       prisma.client.count({ where }),
 *     ]);
 *
 *     return NextResponse.json(createPaginatedResponse(clients, total, pagination));
 *   } catch (error) {
 *     return handleTenantError(error);
 *   }
 * }
 *
 * export async function POST(req: NextRequest) {
 *   try {
 *     const { entrepriseId, entreprise } = await requireTenantAuth();
 *     const limitCheck = await validateLimit(entreprise.plan, entrepriseId, "maxClients");
 *     if (limitCheck) return limitCheck;
 *
 *     const body = await req.json();
 *     const result = validateRequest(clientCreateSchema, body);
 *     if (!result.success) return result.response;
 *
 *     const client = await prisma.client.create({
 *       data: { ...result.data, entrepriseId },
 *     });
 *
 *     return NextResponse.json(client, { status: 201 });
 *   } catch (error) {
 *     return handleTenantError(error);
 *   }
 * }
 *
 *
 * AFTER (app/api/clients/route.ts - 11 lines):
 * ------------------------------------------------
 * import { createCrudRoutes } from "@/lib/api/crud-factory";
 * import { clientCreateSchema, clientUpdateSchema } from "@/lib/validation";
 *
 * export const { GET, POST } = createCrudRoutes({
 *   modelName: "client",
 *   resourceName: "Client",
 *   createSchema: clientCreateSchema,
 *   updateSchema: clientUpdateSchema,
 *   searchFields: ["nom", "email", "ville", "telephone"],
 *   limitKey: "maxClients",
 *   orderBy: { createdAt: "desc" },
 * });
 *
 * SAVINGS: 76 lines → 11 lines (85% reduction)
 */

/**
 * EXAMPLE 2: Resource by ID Routes Migration
 *
 * BEFORE (app/api/clients/[id]/route.ts - 82 lines):
 * ------------------------------------------------
 * // GET, PUT, DELETE handlers with manual auth, validation, error handling
 *
 *
 * AFTER (app/api/clients/[id]/route.ts - 9 lines):
 * ------------------------------------------------
 * import { createResourceByIdRoutes } from "@/lib/api/crud-factory";
 * import { clientUpdateSchema } from "@/lib/validation";
 *
 * export const { GET, PUT, DELETE } = createResourceByIdRoutes({
 *   modelName: "client",
 *   resourceName: "Client",
 *   updateSchema: clientUpdateSchema,
 *   include: { niveauFidelite: true },
 * });
 *
 * SAVINGS: 82 lines → 9 lines (89% reduction)
 */

/**
 * EXAMPLE 3: Routes with Custom Filters
 *
 * For routes that need custom filtering beyond search:
 */
export const articlesRouteExample = createCrudRoutes({
  modelName: "article",
  resourceName: "Article",
  createSchema: {} as z.ZodSchema, // Replace with actual schema
  updateSchema: {} as z.ZodSchema,
  searchFields: ["nom", "reference", "description"],
  customWhere: (searchParams, entrepriseId) => {
    const filters: Record<string, unknown> = {};

    // Add type filter (PRODUIT or SERVICE)
    const type = searchParams.get("type");
    if (type) {
      filters.type = type;
    }

    // Add category filter
    const categorieId = searchParams.get("categorieId");
    if (categorieId) {
      filters.categorieId = categorieId;
    }

    // Add active filter
    const actif = searchParams.get("actif");
    if (actif !== null) {
      filters.actif = actif === "true";
    }

    return filters;
  },
  include: {
    categorie: true,
  },
  orderBy: { createdAt: "desc" },
});

/**
 * EXAMPLE 4: Routes with Lifecycle Hooks
 *
 * For routes that need custom logic before/after CRUD operations:
 */
export const segmentsRouteExample = createCrudRoutes({
  modelName: "segment",
  resourceName: "Segment",
  createSchema: {} as z.ZodSchema, // Replace with actual schema
  updateSchema: {} as z.ZodSchema,
  searchFields: ["nom", "description"],

  // Run after creating a segment
  afterCreate: async (segment, entrepriseId) => {
    // Calculate initial client count
    // await SegmentService.refreshSegmentCount(segment.id, entrepriseId);
    console.log("Segment created, calculating client count...");
  },

  // Run before deleting a segment
  beforeDelete: async (segmentId, entrepriseId) => {
    // Check if segment is used in campaigns
    // const campaignCount = await prisma.campaign.count({ where: { segmentId } });
    // if (campaignCount > 0) {
    //   throw new BusinessError(`Cannot delete: ${campaignCount} campaigns use this segment`);
    // }
    console.log("Checking segment dependencies before deletion...");
  },
});

/**
 * EXAMPLE 5: Using Services with CRUD Factory
 *
 * For complex business logic, use services in hooks:
 */
export const campaignsRouteExample = createCrudRoutes({
  modelName: "campaign",
  resourceName: "Campaign",
  createSchema: {} as z.ZodSchema,
  updateSchema: {} as z.ZodSchema,
  searchFields: ["nom", "description"],

  // Use service for creation
  beforeCreate: async (data, entrepriseId) => {
    // Use CampaignService for validation and business logic
    // return CampaignService.prepareCampaignData(data, entrepriseId);
    return { ...data, dateCreation: new Date() };
  },

  afterCreate: async (campaign, entrepriseId) => {
    // Trigger notifications, analytics, etc.
    console.log(`Campaign ${campaign.nom} created`);
  },
});

/**
 * MIGRATION CHECKLIST
 *
 * For each route to migrate:
 *
 * 1. ✅ Identify the model name (e.g., 'client', 'article')
 * 2. ✅ Identify search fields (what fields should be searchable?)
 * 3. ✅ Identify custom filters (query parameters beyond search)
 * 4. ✅ Check if there's a plan limit (maxClients, maxProducts, etc.)
 * 5. ✅ Check for relationships (include clause)
 * 6. ✅ Check for custom business logic (use hooks or services)
 * 7. ✅ Replace route with CRUD factory
 * 8. ✅ Test thoroughly
 *
 * ROUTES TO MIGRATE (Priority Order):
 *
 * HIGH PRIORITY (Simple CRUD):
 * - ✅ /api/clients/* (save ~160 lines)
 * - ✅ /api/articles/* (save ~180 lines)
 * - ✅ /api/categories/* (save ~140 lines)
 * - ✅ /api/loyalty-levels/* (save ~150 lines)
 *
 * MEDIUM PRIORITY (With custom logic):
 * - ⏳ /api/segments/* (use SegmentService)
 * - ⏳ /api/campaigns/* (use CampaignService)
 *
 * ESTIMATED TOTAL SAVINGS: ~3,200 lines of code
 */
