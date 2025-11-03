import { prisma } from "@/lib/prisma";
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

const segmentUpdateSchema = z.object({
  nom: z.string().min(1).optional(),
  description: z.string().optional(),
  icone: z.string().optional(),
  couleur: z.string().optional(),
  criteres: z.any().optional(),
  actif: z.boolean().optional(),
});

// ============================================
// GET /api/segments/[id] - Get segment by ID
// ============================================

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { entrepriseId } = await requireTenantAuth();
    const { id } = await params;

    const segment = await prisma.segment.findUnique({
      where: { id },
    });

    if (!segment) {
      return NextResponse.json(
        { message: "Segment non trouvé" },
        { status: 404 }
      );
    }

    // Verify tenant access
    if (segment.entrepriseId !== entrepriseId) {
      return NextResponse.json(
        { message: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Calculate current client count
    const clients = await prisma.client.findMany({
      where: { entrepriseId },
    });

    const filteredClients = applySegmentCriteria(
      clients,
      segment.criteres as unknown
    );

    const segmentWithCount = {
      ...segment,
      nombreClients: filteredClients.length,
    };

    // Update count in database (async)
    prisma.segment
      .update({
        where: { id },
        data: {
          nombreClients: filteredClients.length,
          derniereCalcul: new Date(),
        },
      })
      .catch((error) => {
        console.error("Error updating segment count:", error);
      });

    return NextResponse.json(segmentWithCount);
  } catch (error) {
    return handleTenantError(error);
  }
}

// ============================================
// PATCH /api/segments/[id] - Update segment
// ============================================

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { entrepriseId } = await requireTenantAuth();
    const { id } = await params;

    // Check if segment exists and user has access
    const existingSegment = await prisma.segment.findUnique({
      where: { id },
    });

    if (!existingSegment) {
      return NextResponse.json(
        { message: "Segment non trouvé" },
        { status: 404 }
      );
    }

    if (existingSegment.entrepriseId !== entrepriseId) {
      return NextResponse.json(
        { message: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Don't allow editing predefined segments
    if (existingSegment.type === "PREDEFINED") {
      return NextResponse.json(
        { message: "Les segments prédéfinis ne peuvent pas être modifiés" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validation = segmentUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    // If name is being changed, check uniqueness
    if (validation.data.nom && validation.data.nom !== existingSegment.nom) {
      const duplicate = await prisma.segment.findUnique({
        where: {
          entrepriseId_nom: {
            entrepriseId,
            nom: validation.data.nom,
          },
        },
      });

      if (duplicate) {
        return NextResponse.json(
          { message: "Un segment avec ce nom existe déjà" },
          { status: 409 }
        );
      }
    }

    // Recalculate client count if criteria changed
    let nombreClients = existingSegment.nombreClients;
    if (validation.data.criteres) {
      const clients = await prisma.client.findMany({
        where: { entrepriseId },
      });

      const filteredClients = applySegmentCriteria(
        clients,
        validation.data.criteres as unknown
      );

      nombreClients = filteredClients.length;
    }

    const updatedSegment = await prisma.segment.update({
      where: { id },
      data: {
        ...validation.data,
        ...(validation.data.criteres && {
          nombreClients,
          derniereCalcul: new Date(),
        }),
      },
    });

    return NextResponse.json(updatedSegment);
  } catch (error) {
    return handleTenantError(error);
  }
}

// ============================================
// DELETE /api/segments/[id] - Delete segment
// ============================================

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { entrepriseId } = await requireTenantAuth();
    const { id } = await params;

    const segment = await prisma.segment.findUnique({
      where: { id },
    });

    if (!segment) {
      return NextResponse.json(
        { message: "Segment non trouvé" },
        { status: 404 }
      );
    }

    if (segment.entrepriseId !== entrepriseId) {
      return NextResponse.json(
        { message: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Don't allow deleting predefined segments
    if (segment.type === "PREDEFINED") {
      return NextResponse.json(
        { message: "Les segments prédéfinis ne peuvent pas être supprimés" },
        { status: 403 }
      );
    }

    await prisma.segment.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Segment supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleTenantError(error);
  }
}
