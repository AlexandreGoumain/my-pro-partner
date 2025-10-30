import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]/route";

const onboardingSchema = z.object({
    nomEntreprise: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    siret: z.string().optional(),
    adresse: z.string().optional(),
    telephone: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        // Verify authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        // Parse and validate request body
        const body = await req.json();
        const validation = onboardingSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { message: "Données invalides", errors: validation.error.errors },
                { status: 400 }
            );
        }

        const { nomEntreprise, siret, adresse, telephone } = validation.data;

        // Get user with entreprise
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { entreprise: true },
        });

        if (!user || !user.entreprise) {
            return NextResponse.json(
                { message: "Utilisateur ou entreprise introuvable" },
                { status: 404 }
            );
        }

        // Update entreprise and user in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update entreprise information
            const updatedEntreprise = await tx.entreprise.update({
                where: { id: user.entrepriseId },
                data: {
                    nom: nomEntreprise,
                    siret: siret || null,
                },
            });

            // Update or create parametres with additional info
            const existingParametres = await tx.parametresEntreprise.findUnique({
                where: { entrepriseId: user.entrepriseId },
            });

            if (existingParametres) {
                await tx.parametresEntreprise.update({
                    where: { entrepriseId: user.entrepriseId },
                    data: {
                        nom_entreprise: nomEntreprise,
                        adresse: adresse || null,
                        telephone: telephone || null,
                    },
                });
            } else {
                await tx.parametresEntreprise.create({
                    data: {
                        entrepriseId: user.entrepriseId,
                        nom_entreprise: nomEntreprise,
                        adresse: adresse || null,
                        telephone: telephone || null,
                    },
                });
            }

            // Mark onboarding as complete
            const updatedUser = await tx.user.update({
                where: { id: user.id },
                data: { onboardingComplete: true },
            });

            return { user: updatedUser, entreprise: updatedEntreprise };
        });

        return NextResponse.json(
            {
                message: "Onboarding complété avec succès",
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    onboardingComplete: result.user.onboardingComplete,
                },
                entreprise: {
                    id: result.entreprise.id,
                    nom: result.entreprise.nom,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur lors de la complétion de l'onboarding:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
