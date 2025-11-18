import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { validateRequest } from "@/lib/utils/validation-helper";
import {
  BusinessTemplateService,
  BusinessType,
} from "@/lib/services/business-template.service";

const onboardingSchema = z.object({
    nomEntreprise: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    businessType: z.string().min(1, "Le type de business est requis"),
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

        const { nomEntreprise, businessType, secteur, siret, adresse, telephone } =
            validationResult.data;

        // Update entreprise and user in a transaction
        const transactionResult = await prisma.$transaction(async (tx) => {
            // Update entreprise information
            const updatedEntreprise = await tx.entreprise.update({
                where: { id: entrepriseId },
                data: {
                    nom: nomEntreprise,
                    businessType: businessType as BusinessType,
                    secteur: secteur || null,
                    siret: siret || null,
                },
            });

            // Update or create parametres with additional info
            const existingParametres = await tx.parametresEntreprise.findUnique({
                where: { entrepriseId },
            });

            if (existingParametres) {
                await tx.parametresEntreprise.update({
                    where: { entrepriseId },
                    data: {
                        nom_entreprise: nomEntreprise,
                        adresse: adresse || null,
                        telephone: telephone || null,
                    },
                });
            } else {
                await tx.parametresEntreprise.create({
                    data: {
                        entrepriseId,
                        nom_entreprise: nomEntreprise,
                        adresse: adresse || null,
                        telephone: telephone || null,
                    },
                });
            }

            // Mark onboarding as complete
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: { onboardingComplete: true },
            });

            return { user: updatedUser, entreprise: updatedEntreprise };
        });

        // Apply business template (categories, loyalty levels, etc.)
        try {
            await BusinessTemplateService.applyTemplate(
                entrepriseId,
                businessType as BusinessType
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
                    onboardingComplete: transactionResult.user.onboardingComplete,
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
