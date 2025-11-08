import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SubscriptionService } from "@/lib/services/subscription.service";

/**
 * GET /api/subscription/portal
 * Créer une session Stripe Billing Portal et retourner l'URL
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const portalUrl = await SubscriptionService.createBillingPortalSession(
      session.user.entrepriseId
    );

    return NextResponse.json({ url: portalUrl });
  } catch (error: any) {
    console.error("[SUBSCRIPTION_PORTAL_ERROR]", error);

    return NextResponse.json(
      { error: error.message || "Erreur lors de la création de la session portal" },
      { status: 500 }
    );
  }
}
