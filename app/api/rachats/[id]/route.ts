import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { requireTenantAuth, verifyResourceAccess } from "@/lib/middleware/tenant-isolation";
import { requireBusinessType } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";

// GET: Get a specific rachat by ID
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandling(async () => {
    // Check business type
    const businessTypeCheck = await requireBusinessType("INFORMATIQUE");
    if (businessTypeCheck) return businessTypeCheck;

    const { id } = await params;

    // Use verifyResourceAccess to check auth and ownership in one call
    const { resource: rachat } = await verifyResourceAccess(
      id,
      (id) => prisma.rachatArticle.findUnique({
        where: { id },
        include: {
          article: {
            include: {
              categorie: true,
            },
          },
          client: true,
        },
      }),
      "Rachat"
    );

    return NextResponse.json(rachat);
  }, { resourceName: "Rachat", operation: "read" });
}

// DELETE: Delete a rachat (and optionally its article)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandling(async () => {
    // Check business type
    const businessTypeCheck = await requireBusinessType("INFORMATIQUE");
    if (businessTypeCheck) return businessTypeCheck;

    const { id } = await params;

    // Use verifyResourceAccess to check auth and ownership in one call
    await verifyResourceAccess(
      id,
      (id) => prisma.rachatArticle.findUnique({
        where: { id },
        include: {
          article: true,
        },
      }),
      "Rachat"
    );

    // Delete rachat (cascade will handle related records)
    await prisma.rachatArticle.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Rachat supprimé avec succès" },
      { status: 200 }
    );
  }, { resourceName: "Rachat", operation: "delete" });
}
