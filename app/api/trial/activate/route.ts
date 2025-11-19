import { PLAN_ABONNEMENT } from "@/lib/config/activity-plan-mapping";
import { calculateTrialExpiration } from "@/lib/config/trial.config";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/utils/validation-helper";
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
    try {
        // Authentification et récupération de l'entrepriseId
        const { entrepriseId } = await requireTenantAuth();

        // Validation du corps de la requête
        const body = await request.json();
        const validationResult = validateRequest(activateTrialSchema, body);
        if (!validationResult.success) return validationResult.response;

        const { plan } = validationResult.data;

        // Vérifier que l'entreprise existe et récupérer son état
        const entreprise = await prisma.entreprise.findUnique({
            where: { id: entrepriseId },
            select: { trialActive: true },
        });

        if (!entreprise) {
            return NextResponse.json(
                { error: "Entreprise not found" },
                { status: 404 }
            );
        }

        // Vérifier qu'il n'y a pas déjà un trial actif
        if (entreprise.trialActive) {
            return NextResponse.json(
                { error: "Trial already active" },
                { status: 400 }
            );
        }

        // Calculer la date d'expiration
        const now = new Date();
        const trialExpiresAt = calculateTrialExpiration(
            now,
            plan as PlanAbonnement
        );

        // Activer le trial
        const updatedEntreprise = await prisma.entreprise.update({
            where: { id: entrepriseId },
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
    } catch (error) {
        return handleTenantError(error);
    }
}
