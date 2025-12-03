import { withApiHandler } from "@/lib/api/api-handler";
import { PLAN_ABONNEMENT } from "@/lib/config/activity-plan-mapping";
import { calculateTrialExpiration } from "@/lib/config/trial.config";
import { NotFoundError, ValidationError, BusinessError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type PlanAbonnement = (typeof PLAN_ABONNEMENT)[keyof typeof PLAN_ABONNEMENT];

const planValues = Object.values(PLAN_ABONNEMENT).filter(
    (p) => p !== "FREE"
) as [string, ...string[]];

const activateTrialSchema = z.object({
    plan: z.enum(planValues, {
        errorMap: () => ({
            message: "Plan must be STARTER, PRO, or ENTERPRISE",
        }),
    }),
});

/**
 * POST /api/trial/activate
 * Active une période d'essai pour l'entreprise authentifiée
 *
 * Body: {
 *   plan: "STARTER" | "PRO" | "ENTERPRISE"
 * }
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            // Validation du corps de la requête
            const body = await request.json();
            const result = activateTrialSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            const { plan } = result.data;

            // Vérifier que l'entreprise existe et récupérer son état
            const entreprise = await prisma.entreprise.findUnique({
                where: { id: ctx.entrepriseId },
                select: { trialActive: true },
            });

            if (!entreprise) {
                throw new NotFoundError("Entreprise not found");
            }

            // Vérifier qu'il n'y a pas déjà un trial actif
            if (entreprise.trialActive) {
                throw new BusinessError("Trial already active");
            }

            // Calculer la date d'expiration
            const now = new Date();
            const trialExpiresAt = calculateTrialExpiration(
                now,
                plan as PlanAbonnement
            );

            // Activer le trial
            const updatedEntreprise = await prisma.entreprise.update({
                where: { id: ctx.entrepriseId },
                data: {
                    trialActive: true,
                    trialPlan: plan as PlanAbonnement,
                    trialStartDate: now,
                    trialExpiresAt,
                },
            });

            return NextResponse.json({
                success: true,
                trial: {
                    active: true,
                    plan: updatedEntreprise.trialPlan,
                    startDate: updatedEntreprise.trialStartDate,
                    expiresAt: updatedEntreprise.trialExpiresAt,
                },
            });
        },
        {
            context: { resourceName: "Trial", operation: "activate" },
        }
    );
}
