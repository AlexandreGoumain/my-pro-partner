import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/subscription/reset
 *
 * Nettoyer complètement l'état de l'abonnement et remettre en FREE
 * À utiliser UNIQUEMENT en cas d'état incohérent
 */
export async function POST(_req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();

    // 1. Supprimer toutes les subscriptions dans la DB
    await prisma.subscription.deleteMany({
      where: { entrepriseId },
    });

    // 2. Remettre l'entreprise en FREE
    await prisma.entreprise.update({
      where: { id: entrepriseId },
      data: {
        plan: "FREE",
      },
    });

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
  } catch (error) {
    return handleTenantError(error);
  }
}
