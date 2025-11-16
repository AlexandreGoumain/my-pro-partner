import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { SubscriptionService } from "@/lib/services/subscription.service";
import { z } from "zod";

const cancelSchema = z.object({
  reason: z.string().optional(),
});

/**
 * POST /api/subscription/cancel
 * Annuler un abonnement (à la fin de la période en cours)
 */
export async function POST(req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();

    const body = await req.json();
    const validation = cancelSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    await SubscriptionService.cancelSubscription(
      entrepriseId,
      validation.data.reason
    );

    return NextResponse.json({
      success: true,
      message: "Abonnement annulé avec succès. Il restera actif jusqu'à la fin de la période en cours.",
    });
  } catch (error: any) {
    return handleTenantError(error);
  }
}
