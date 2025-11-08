import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const validation = cancelSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    await SubscriptionService.cancelSubscription(
      session.user.entrepriseId,
      validation.data.reason
    );

    return NextResponse.json({
      success: true,
      message: "Abonnement annulé avec succès. Il restera actif jusqu'à la fin de la période en cours.",
    });
  } catch (error: any) {
    console.error("[SUBSCRIPTION_CANCEL_ERROR]", error);

    return NextResponse.json(
      { error: error.message || "Erreur lors de l'annulation de l'abonnement" },
      { status: 500 }
    );
  }
}
