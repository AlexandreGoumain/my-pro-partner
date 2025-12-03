import { withApiHandler } from "@/lib/api/api-handler";
import { SubscriptionService } from "@/lib/services/subscription.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ValidationError } from "@/lib/errors";

const cancelSchema = z.object({
    reason: z.string().optional(),
});

/**
 * POST /api/subscription/cancel
 * Annuler un abonnement (à la fin de la période en cours)
 */
export async function POST(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await req.json();
            const result = cancelSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            await SubscriptionService.cancelSubscription(
                ctx.entrepriseId,
                result.data.reason
            );

            return NextResponse.json({
                success: true,
                message: "Abonnement annulé avec succès. Il restera actif jusqu'à la fin de la période en cours.",
            });
        },
        {
            context: { resourceName: "Subscription", operation: "cancel" },
        }
    );
}
