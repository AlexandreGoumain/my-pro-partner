import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { requireTenantAuth, verifyResourceAccess } from "@/lib/middleware/tenant-isolation";
import { requireBusinessType } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET: Get a specific rachat by ID
export const GET = withErrorHandling(
  async (_req: NextRequest, { params }: RouteParams) => {
    // Check business type
    const businessTypeCheck = await requireBusinessType("INFORMATIQUE");
    if (businessTypeCheck) return businessTypeCheck;

    const { entrepriseId } = await requireTenantAuth();
    const { id } = params;

    const rachat = await prisma.rachatArticle.findUnique({
      where: { id },
      include: {
        article: {
          include: {
            categorie: true,
          },
        },
        client: true,
      },
    });

    if (!rachat) {
      return NextResponse.json(
        { message: "Rachat non trouvé" },
        { status: 404 }
      );
    }

    // Verify access
    await verifyResourceAccess(rachat.entrepriseId, entrepriseId, "Rachat");

    return NextResponse.json(rachat);
  },
  { resourceName: "Rachat", operation: "read" }
);

// DELETE: Delete a rachat (and optionally its article)
export const DELETE = withErrorHandling(
  async (_req: NextRequest, { params }: RouteParams) => {
    // Check business type
    const businessTypeCheck = await requireBusinessType("INFORMATIQUE");
    if (businessTypeCheck) return businessTypeCheck;

    const { entrepriseId } = await requireTenantAuth();
    const { id } = params;

    const rachat = await prisma.rachatArticle.findUnique({
      where: { id },
      include: {
        article: true,
      },
    });

    if (!rachat) {
      return NextResponse.json(
        { message: "Rachat non trouvé" },
        { status: 404 }
      );
    }

    // Verify access
    await verifyResourceAccess(rachat.entrepriseId, entrepriseId, "Rachat");

    // Delete rachat (cascade will handle related records)
    await prisma.rachatArticle.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Rachat supprimé avec succès" },
      { status: 200 }
    );
  },
  { resourceName: "Rachat", operation: "delete" }
);
