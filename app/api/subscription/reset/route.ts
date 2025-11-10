import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/subscription/reset
 *
 * Nettoyer complètement l'état de l'abonnement et remettre en FREE
 * À utiliser UNIQUEMENT en cas d'état incohérent
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const entrepriseId = session.user.entrepriseId;

    // 1. Supprimer toutes les subscriptions dans la DB
    await prisma.subscription.deleteMany({
      where: { entrepriseId },
    });

    // 2. Remettre l'entreprise en FREE et supprimer les IDs Stripe
    await prisma.entreprise.update({
      where: { id: entrepriseId },
      data: {
        plan: "FREE",
        stripeCustomerId: null,
      },
    });

    console.log(`[RESET_SUBSCRIPTION] ✅ Subscription reset for entreprise ${entrepriseId}`);

    return NextResponse.json({
      success: true,
      message: "Abonnement remis à zéro. Vous êtes maintenant en plan FREE.",
      actions: [
        "✅ Toutes les subscriptions supprimées de la DB",
        "✅ Entreprise remise en plan FREE",
        "✅ IDs Stripe supprimés",
        "ℹ️  Vous pouvez maintenant souscrire à nouveau à un plan",
      ],
    });
  } catch (error: any) {
    console.error("[RESET_SUBSCRIPTION_ERROR]", error);

    return NextResponse.json(
      { error: error.message || "Erreur lors du reset" },
      { status: 500 }
    );
  }
}
