import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/subscription/reset
 *
 * Nettoyer complètement l'état de l'abonnement et remettre en FREE
 * À utiliser UNIQUEMENT en cas d'état incohérent
 */
export async function POST(_req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            // 1. Supprimer toutes les subscriptions dans la DB
            await prisma.subscription.deleteMany({
                where: { entrepriseId: ctx.entrepriseId },
            });

            // 2. Remettre l'entreprise en FREE
            await prisma.entreprise.update({
                where: { id: ctx.entrepriseId },
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
        },
        {
            context: { resourceName: "Subscription", operation: "reset" },
        }
    );
}
