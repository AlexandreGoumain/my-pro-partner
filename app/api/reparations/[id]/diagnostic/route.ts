import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { requireTenantAuth, verifyResourceAccess } from "@/lib/middleware/tenant-isolation";
import { requireBusinessType } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { reparationDiagnosticSchema } from "@/lib/validation";
import { ReparationService } from "@/lib/services/reparation.service";
import { RepairNotificationService } from "@/lib/services/repair-notification.service";

// POST: Submit diagnostic for repair
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandling(async () => {
    // Check business type
    const businessTypeCheck = await requireBusinessType("INFORMATIQUE");
    if (businessTypeCheck) return businessTypeCheck;

    const { user } = await requireTenantAuth();
    const { id } = await params;

    // Verify ownership
    const { resource: reparation } = await verifyResourceAccess(
      id,
      (id) => prisma.reparation.findUnique({
        where: { id },
      }),
      "Reparation"
    );

    const body = await req.json();
    const result = reparationDiagnosticSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { diagnosticDetail, devisEstime, delaiReparation } = result.data;

    // Calculate estimated return date
    const dateEstimeeRetour = delaiReparation
      ? ReparationService.calculateEstimatedReturn(reparation.dateDepot, delaiReparation)
      : null;

    // Update repair with diagnostic
    const updatedReparation = await prisma.reparation.update({
      where: { id },
      data: {
        diagnosticEffectue: true,
        diagnosticDetail,
        diagnosticDate: new Date(),
        diagnosticParId: user.id,
        devisEstime,
        delaiReparation: delaiReparation || reparation.delaiReparation,
        dateEstimeeRetour: dateEstimeeRetour || reparation.dateEstimeeRetour,
        // Automatically move to diagnostic status if not already
        statut: reparation.statut === "DEPOSE" ? "DIAGNOSTIC" : reparation.statut,
      },
      include: {
        client: true,
        store: true,
        technicien: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create history entry
    await prisma.reparationHistorique.create({
      data: {
        reparationId: id,
        action: "DIAGNOSTIC_SUBMITTED",
        description: `Diagnostic effectué - Devis estimé : ${devisEstime}€${
          delaiReparation ? ` - Délai : ${delaiReparation}h` : ""
        }`,
        metadata: {
          devisEstime,
          delaiReparation,
          diagnosticParId: user.id,
        },
        createdBy: user.id,
      },
    });

    // Send notification to client with diagnostic + quote
    await RepairNotificationService.notifyDiagnosticComplete(
      updatedReparation,
      diagnosticDetail,
      devisEstime,
      delaiReparation
    );

    return NextResponse.json(updatedReparation);
  }, { resourceName: "Reparation", operation: "diagnostic" });
}
