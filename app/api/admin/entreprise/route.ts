import { NextRequest, NextResponse } from "next/server";
import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/entreprise
 * Get current entreprise information
 */
export async function GET(req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();

    const entreprise = await prisma.entreprise.findUnique({
      where: {
        id: entrepriseId,
      },
      select: {
        id: true,
        nom: true,
        slug: true,
        siret: true,
        email: true,
        plan: true,
        abonnementActif: true,
        dateAbonnement: true,
        dateExpiration: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!entreprise) {
      return NextResponse.json(
        { message: "Entreprise non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      entreprise,
    });
  } catch (error) {
    return handleTenantError(error);
  }
}
