import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { SubscriptionService } from "@/lib/services/subscription.service";
import { validateRequest } from "@/lib/utils/validation-helper";
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
  try {
    const { entrepriseId } = await requireTenantAuth();

    const body = await req.json();
    const result = validateRequest(changePlanSchema, body);
    if (!result.success) return result.response;

    const { plan, interval, prorate } = result.data;

    await SubscriptionService.changePlan({
      entrepriseId,
      newPlan: plan,
      newInterval: interval,
      prorate,
    });

    return NextResponse.json({
      success: true,
      message: "Plan modifié avec succès",
    });
  } catch (error) {
    return handleTenantError(error);
  }
}
