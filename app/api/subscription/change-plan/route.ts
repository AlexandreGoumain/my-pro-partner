import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SubscriptionService } from "@/lib/services/subscription.service";
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const validation = changePlanSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { plan, interval, prorate } = validation.data;

    await SubscriptionService.changePlan({
      entrepriseId: session.user.entrepriseId,
      newPlan: plan,
      newInterval: interval,
      prorate,
    });

    return NextResponse.json({
      success: true,
      message: "Plan modifié avec succès",
    });
  } catch (error: any) {
    console.error("[SUBSCRIPTION_CHANGE_PLAN_ERROR]", error);

    return NextResponse.json(
      { error: error.message || "Erreur lors du changement de plan" },
      { status: 500 }
    );
  }
}
