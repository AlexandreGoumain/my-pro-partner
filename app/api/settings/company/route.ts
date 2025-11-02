import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const companySettingsSchema = z.object({
    nom_entreprise: z.string().min(1, "Le nom de l'entreprise est requis"),
    siret: z.string().optional().nullable(),
    tva_intra: z.string().optional().nullable(),
    adresse: z.string().optional().nullable(),
    code_postal: z.string().optional().nullable(),
    ville: z.string().optional().nullable(),
    telephone: z.string().optional().nullable(),
    email: z.string().email().optional().nullable(),
    site_web: z.string().url().optional().nullable(),
    logo_url: z.string().optional().nullable(),
    prefixe_devis: z.string().min(1, "Le préfixe des devis est requis"),
    prefixe_facture: z.string().min(1, "Le préfixe des factures est requis"),
    conditions_paiement_defaut: z.string().optional().nullable(),
    mentions_legales: z.string().optional().nullable(),
});

// GET: Récupérer les paramètres de l'entreprise
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        // Get user to find entreprise
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { entrepriseId: true },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Utilisateur non trouvé" },
                { status: 404 }
            );
        }

        // Get or create settings
        let settings = await prisma.parametresEntreprise.findUnique({
            where: { entrepriseId: user.entrepriseId },
        });

        if (!settings) {
            // Create default settings
            const entreprise = await prisma.entreprise.findUnique({
                where: { id: user.entrepriseId },
                select: { nom: true, email: true },
            });

            settings = await prisma.parametresEntreprise.create({
                data: {
                    entrepriseId: user.entrepriseId,
                    nom_entreprise: entreprise?.nom || "Mon Entreprise",
                    email: entreprise?.email || null,
                },
            });
        }

        return NextResponse.json({ settings });
    } catch (error) {
        console.error("Erreur lors de la récupération des paramètres:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// PUT: Mettre à jour les paramètres de l'entreprise
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const body = await req.json();

        // Validate input
        const validation = companySettingsSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        // Get user to find entreprise
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { entrepriseId: true },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Utilisateur non trouvé" },
                { status: 404 }
            );
        }

        // Upsert settings
        const settings = await prisma.parametresEntreprise.upsert({
            where: { entrepriseId: user.entrepriseId },
            create: {
                entrepriseId: user.entrepriseId,
                ...validation.data,
            },
            update: validation.data,
        });

        return NextResponse.json({ settings });
    } catch (error) {
        console.error("Erreur lors de la mise à jour des paramètres:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
