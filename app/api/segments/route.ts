import { prisma } from "@/lib/prisma";
import {
  createPaginatedResponse,
  getPaginationParams,
} from "@/lib/utils/pagination";
import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { TypeSegment } from "@/lib/generated/prisma";
import { applySegmentCriteria } from "@/lib/types/segment";

// ============================================
// VALIDATION SCHEMAS
// ============================================

const segmentCreateSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  type: z.nativeEnum(TypeSegment).default("CUSTOM"),
  icone: z.string().optional(),
  couleur: z.string().optional(),
  criteres: z.union([z.record(z.any()), z.array(z.any())]).default({}), // JSON field - can be object or array
  actif: z.boolean().default(true),
});

// ============================================
// GET /api/segments - List all segments
// ============================================

export async function GET(req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const actif = searchParams.get("actif");
    const pagination = getPaginationParams(searchParams);

    const where = {
      entrepriseId,
      ...(type && { type: type as TypeSegment }),
      ...(actif !== null && { actif: actif === "true" }),
    };

    const [segments, total] = await Promise.all([
      prisma.segment.findMany({
        where,
        orderBy: [{ type: "asc" }, { createdAt: "desc" }],
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.segment.count({ where }),
    ]);

    // Calculate client counts for each segment
    const clients = await prisma.client.findMany({
      where: { entrepriseId },
    });

    const segmentsWithCounts = segments.map((segment) => {
      const filteredClients = applySegmentCriteria(
        clients,
        segment.criteres as unknown
      );

      return {
        ...segment,
        nombreClients: filteredClients.length,
      };
    });

    // Update counts in database (async, don't wait)
    Promise.all(
      segmentsWithCounts.map((segment) =>
        prisma.segment.update({
          where: { id: segment.id },
          data: {
            nombreClients: segment.nombreClients,
            derniereCalcul: new Date(),
          },
        })
      )
    ).catch((error) => {
      console.error("Error updating segment counts:", error);
    });

    return NextResponse.json(
      createPaginatedResponse(segmentsWithCounts, total, pagination)
    );
  } catch (error) {
    return handleTenantError(error);
  }
}

// ============================================
// POST /api/segments - Create new segment
// ============================================

export async function POST(req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();

    const body = await req.json();
    const validation = segmentCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    // Check if segment name already exists for this entreprise
    const existing = await prisma.segment.findUnique({
      where: {
        entrepriseId_nom: {
          entrepriseId,
          nom: validation.data.nom,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Un segment avec ce nom existe déjà" },
        { status: 409 }
      );
    }

    // Calculate initial client count
    const clients = await prisma.client.findMany({
      where: { entrepriseId },
    });

    const filteredClients = applySegmentCriteria(
      clients,
      validation.data.criteres as unknown
    );

    const segment = await prisma.segment.create({
      data: {
        ...validation.data,
        entrepriseId,
        nombreClients: filteredClients.length,
        derniereCalcul: new Date(),
      },
    });

    return NextResponse.json(segment, { status: 201 });
  } catch (error) {
    return handleTenantError(error);
  }
}
