import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { SubscriptionService } from "@/lib/services/subscription.service";

/**
 * Créer une session Stripe Billing Portal et retourner l'URL
 */
async function handlePortalRequest() {
  try {
    const { entrepriseId } = await requireTenantAuth();

    const portalUrl = await SubscriptionService.createBillingPortalSession(
      entrepriseId
    );

    return NextResponse.json({ url: portalUrl });
  } catch (error: any) {
    return handleTenantError(error);
  }
}

/**
 * GET /api/subscription/portal
 */
export async function GET(req: NextRequest) {
  return handlePortalRequest();
}

/**
 * POST /api/subscription/portal
 */
export async function POST(req: NextRequest) {
  return handlePortalRequest();
}
