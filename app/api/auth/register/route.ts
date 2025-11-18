import { prisma } from "@/lib/prisma";
import { registerBackendSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/utils/validation-helper";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const validationResult = validateRequest(registerBackendSchema, body);
        if (!validationResult.success) return validationResult.response;

        const { email, password, name } = validationResult.data;

        // Vérifier si l'utilisateur existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Un utilisateur avec cet email existe déjà" },
                { status: 400 }
            );
        }

        // Vérifier si l'email est déjà utilisé par une entreprise
        const existingEntreprise = await prisma.entreprise.findUnique({
            where: { email },
        });

        if (existingEntreprise) {
            return NextResponse.json(
                { message: "Une entreprise avec cet email existe déjà" },
                { status: 400 }
            );
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'entreprise et l'utilisateur atomiquement
        const transactionResult = await prisma.$transaction(async (tx) => {
            // Créer l'entreprise
            const entreprise = await tx.entreprise.create({
                data: {
                    nom: name || "Mon Entreprise",
                    email,
                    plan: "FREE",
                    abonnementActif: true,
                },
            });

            // Créer l'utilisateur propriétaire (premier utilisateur de l'entreprise)
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: "OWNER", // Premier utilisateur = propriétaire
                    status: "ACTIVE", // Actif immédiatement
                    entrepriseId: entreprise.id,
                    onboardingComplete: false, // Doit compléter l'onboarding
                },
            });

            // Créer les paramètres par défaut
            await tx.parametresEntreprise.create({
                data: {
                    entrepriseId: entreprise.id,
                    nom_entreprise: name || "Mon Entreprise",
                },
            });

            return { user, entreprise };
        });

        return NextResponse.json(
            {
                message: "Utilisateur et entreprise créés avec succès",
                user: {
                    id: transactionResult.user.id,
                    email: transactionResult.user.email,
                    name: transactionResult.user.name,
                },
                entreprise: {
                    id: transactionResult.entreprise.id,
                    nom: transactionResult.entreprise.nom,
                    plan: transactionResult.entreprise.plan,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
