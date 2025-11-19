import {
    PLAN_ABONNEMENT,
    shouldAutoActivateTrial,
} from "@/lib/config/activity-plan-mapping";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import {
    BusinessTemplateService,
    BusinessType,
} from "@/lib/services/business-template.service";
import { prepareTrialData } from "@/lib/services/onboarding.service";
import { validateRequest } from "@/lib/utils/validation-helper";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type PlanAbonnement = (typeof PLAN_ABONNEMENT)[keyof typeof PLAN_ABONNEMENT];

// Dériver les valeurs du schema depuis PLAN_ABONNEMENT
const planValues = Object.values(PLAN_ABONNEMENT) as [string, ...string[]];

const onboardingSchema = z.object({
    nomEntreprise: z
        .string()
        .min(2, "Le nom doit contenir au moins 2 caractères"),
    businessType: z.string().min(1, "Le type de business est requis"),
    selectedPlan: z.enum(planValues).optional(),
    secteur: z.string().optional(),
    siret: z.string().optional(),
    adresse: z.string().optional(),
    telephone: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        // Verify authentication
        const { userId, entrepriseId } = await requireTenantAuth();

        // Parse and validate request body
        const body = await req.json();
        const validationResult = validateRequest(onboardingSchema, body);
        if (!validationResult.success) return validationResult.response;

        const {
            nomEntreprise,
            businessType,
            selectedPlan,
            secteur,
            siret,
            adresse,
            telephone,
        } = validationResult.data;

        // Déterminer le plan final (FREE par défaut)
        const finalPlan = (selectedPlan || "FREE") as PlanAbonnement;

        // Vérifier si un trial doit être activé automatiquement
        const shouldActivateTrial = shouldAutoActivateTrial(
            businessType as BusinessType,
            finalPlan
        );

        // Update entreprise and user in a transaction
        const transactionResult = await prisma.$transaction(async (tx) => {
            // Préparer les données de trial
            const trialData = prepareTrialData(
                shouldActivateTrial,
                businessType as BusinessType
            );

            // Update entreprise information
            const updatedEntreprise = await tx.entreprise.update({
                where: { id: entrepriseId },
                data: {
                    nom: nomEntreprise,
                    businessType: businessType as BusinessType,
                    plan: finalPlan,
                    secteur: secteur || null,
                    siret: siret || null,
                    ...trialData,
                },
            });

            // Upsert parametres avec les informations additionnelles
            await tx.parametresEntreprise.upsert({
                where: { entrepriseId },
                update: {
                    nom_entreprise: nomEntreprise,
                    adresse: adresse || null,
                    telephone: telephone || null,
                },
                create: {
                    entrepriseId,
                    nom_entreprise: nomEntreprise,
                    adresse: adresse || null,
                    telephone: telephone || null,
                },
            });

            // Mark onboarding as complete
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: { onboardingComplete: true },
            });

            return { user: updatedUser, entreprise: updatedEntreprise };
        });

        // Apply business template variant selon le plan (categories, loyalty levels, etc.)
        try {
            // Utiliser applyTemplateVariant au lieu de applyTemplate
            await BusinessTemplateService.applyTemplateVariant(
                entrepriseId,
                businessType as BusinessType,
                finalPlan,
                shouldActivateTrial
            );
        } catch (error) {
            console.error("Erreur lors de l'application du template:", error);
            // Continue even if template application fails
        }

        return NextResponse.json(
            {
                message: "Onboarding complété avec succès",
                user: {
                    id: transactionResult.user.id,
                    email: transactionResult.user.email,
                    onboardingComplete:
                        transactionResult.user.onboardingComplete,
                },
                entreprise: {
                    id: transactionResult.entreprise.id,
                    nom: transactionResult.entreprise.nom,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        return handleTenantError(error);
    }
}
