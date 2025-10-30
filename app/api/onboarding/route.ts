import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

const onboardingSchema = z.object({
    nomEntreprise: z.string().min(2, "Le nom de l'entreprise est requis"),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    nom: z.string().min(2, "Le nom est requis"),
    prenom: z.string().optional(),
    siret: z.string().optional(),
    telephone: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validation = onboardingSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const {
            nomEntreprise,
            email,
            password,
            nom,
            prenom,
            siret,
            telephone,
        } = validation.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Un compte existe déjà avec cet email" },
                { status: 400 }
            );
        }

        if (siret) {
            const existingEntreprise = await prisma.entreprise.findUnique({
                where: { siret },
            });

            if (existingEntreprise) {
                return NextResponse.json(
                    { message: "Une entreprise avec ce SIRET existe déjà" },
                    { status: 400 }
                );
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await prisma.$transaction(async (tx) => {
            const entreprise = await tx.entreprise.create({
                data: {
                    nom: nomEntreprise,
                    email,
                    siret: siret || null,
                    plan: "FREE",
                    abonnementActif: true,
                },
            });

            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: prenom ? `${prenom} ${nom}` : nom,
                    role: "admin",
                    entrepriseId: entreprise.id,
                },
            });

            const parametres = await tx.parametresEntreprise.create({
                data: {
                    entrepriseId: entreprise.id,
                    nom_entreprise: nomEntreprise,
                    siret: siret || null,
                    telephone: telephone || null,
                    email,
                },
            });

            return { entreprise, user, parametres };
        });

        return NextResponse.json(
            {
                message: "Compte créé avec succès",
                entreprise: {
                    id: result.entreprise.id,
                    nom: result.entreprise.nom,
                    plan: result.entreprise.plan,
                },
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    name: result.user.name,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erreur lors de l'onboarding:", error);
        return NextResponse.json(
            { message: "Erreur lors de la création du compte" },
            { status: 500 }
        );
    }
}
