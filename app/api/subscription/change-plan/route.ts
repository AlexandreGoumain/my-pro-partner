import { withApiHandler } from "@/lib/api/api-handler";
import { ValidationError } from "@/lib/errors";
import { SubscriptionService } from "@/lib/services/subscription.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const changePlanSchema = z.object({
    plan: z.enum(["STARTER", "PRO", "ENTERPRISE"]),
    interval: z.enum(["month", "year"]),
    prorate: z.boolean().optional().default(true),
});

/**
 * POST /api/subscription/change-plan
 * Changer de plan (upgrade ou downgrade)
 */
export async function POST(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await req.json();
            const result = changePlanSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            const { plan, interval, prorate } = result.data;

            await SubscriptionService.changePlan({
                entrepriseId: ctx.entrepriseId,
                newPlan: plan,
                newInterval: interval,
                prorate,
            });

            return NextResponse.json({
                success: true,
                message: "Plan modifié avec succès",
            });
        },
        {
            context: { resourceName: "Subscription", operation: "changePlan" },
        }
    );
}
