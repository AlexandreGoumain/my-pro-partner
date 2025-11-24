import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { requireTenantAuth, verifyResourceAccess } from "@/lib/middleware/tenant-isolation";
import { requireBusinessType } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { reparationStatusSchema } from "@/lib/validation";
import { ReparationService } from "@/lib/services/reparation.service";
import { RepairNotificationService } from "@/lib/services/repair-notification.service";

// POST: Change repair status
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
    const result = reparationStatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { statut: newStatut, notes } = result.data;

    // Validate status transition
    if (!ReparationService.validateStatusTransition(reparation.statut, newStatut)) {
      return NextResponse.json(
        {
          message: `Transition de statut invalide : impossible de passer de "${ReparationService.getStatusLabel(
            reparation.statut
          )}" à "${ReparationService.getStatusLabel(newStatut)}"`,
        },
        { status: 400 }
      );
    }

    // Get existing status change logs
    const existingLogs = (reparation.statutChangeLogs as any[]) || [];

    // Create new status change log
    const newLog = ReparationService.createStatusChangeLog(
      reparation.statut,
      newStatut,
      user.id
    );

    // Update repair status
    const updatedReparation = await prisma.reparation.update({
      where: { id },
      data: {
        statut: newStatut,
        statutChangeLogs: [...existingLogs, newLog],
        // Set actual return date when delivered
        dateRetourReel: newStatut === "LIVREE" ? new Date() : reparation.dateRetourReel,
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
        action: "STATUS_CHANGE",
        description: `Statut changé : ${ReparationService.getStatusLabel(
          reparation.statut
        )} → ${ReparationService.getStatusLabel(newStatut)}${notes ? ` - ${notes}` : ""}`,
        metadata: {
          oldStatus: reparation.statut,
          newStatus: newStatut,
          notes,
        },
        createdBy: user.id,
      },
    });

    // Send notification to client based on new status
    await RepairNotificationService.sendStatusNotification(
      updatedReparation,
      newStatut,
      notes
    );

    return NextResponse.json(updatedReparation);
  }, { resourceName: "Reparation", operation: "update_status" });
}
