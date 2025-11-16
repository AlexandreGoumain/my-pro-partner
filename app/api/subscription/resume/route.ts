import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { SubscriptionService } from "@/lib/services/subscription.service";

/**
 * POST /api/subscription/resume
 * Réactiver un abonnement qui était en attente d'annulation
 */
export async function POST(req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();

    await SubscriptionService.resumeSubscription(entrepriseId);

    return NextResponse.json({
      success: true,
      message: "Abonnement réactivé avec succès",
    });
  } catch (error: any) {
    return handleTenantError(error);
  }
}
