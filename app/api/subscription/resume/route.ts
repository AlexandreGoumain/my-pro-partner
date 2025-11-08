import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SubscriptionService } from "@/lib/services/subscription.service";

/**
 * POST /api/subscription/resume
 * Réactiver un abonnement qui était en attente d'annulation
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    await SubscriptionService.resumeSubscription(session.user.entrepriseId);

    return NextResponse.json({
      success: true,
      message: "Abonnement réactivé avec succès",
    });
  } catch (error: any) {
    console.error("[SUBSCRIPTION_RESUME_ERROR]", error);

    return NextResponse.json(
      { error: error.message || "Erreur lors de la réactivation de l'abonnement" },
      { status: 500 }
    );
  }
}
