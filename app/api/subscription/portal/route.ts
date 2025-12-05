import { withApiHandler } from "@/lib/api/api-handler";
import { SubscriptionService } from "@/lib/services/subscription.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/subscription/portal
 */
export async function GET(_req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const portalUrl = await SubscriptionService.createBillingPortalSession(
                ctx.entrepriseId
            );
            return NextResponse.json({ url: portalUrl });
        },
        {
            context: { resourceName: "Subscription", operation: "portal" },
        }
    );
}

/**
 * POST /api/subscription/portal
 */
export async function POST(_req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const portalUrl = await SubscriptionService.createBillingPortalSession(
                ctx.entrepriseId
            );
            return NextResponse.json({ url: portalUrl });
        },
        {
            context: { resourceName: "Subscription", operation: "portal" },
        }
    );
}
