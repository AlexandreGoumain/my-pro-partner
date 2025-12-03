import { withApiHandler } from "@/lib/api/api-handler";
import { SubscriptionService } from "@/lib/services/subscription.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/subscription/resume
 * Réactiver un abonnement qui était en attente d'annulation
 */
export async function POST(_req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            await SubscriptionService.resumeSubscription(ctx.entrepriseId);

            return NextResponse.json({
                success: true,
                message: "Abonnement réactivé avec succès",
            });
        },
        {
            context: { resourceName: "Subscription", operation: "resume" },
        }
    );
}
