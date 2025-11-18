import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { SubscriptionService } from "@/lib/services/subscription.service";
import { validateRequest } from "@/lib/utils/validation-helper";
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
    const result = validateRequest(cancelSchema, body);
    if (!result.success) return result.response;

    await SubscriptionService.cancelSubscription(
      entrepriseId,
      result.data.reason
    );

    return NextResponse.json({
      success: true,
      message: "Abonnement annulé avec succès. Il restera actif jusqu'à la fin de la période en cours.",
    });
  } catch (error) {
    return handleTenantError(error);
  }
}
