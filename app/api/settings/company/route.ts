import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
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
        const { entrepriseId } = await requireTenantAuth();

        // Get or create settings
        let settings = await prisma.parametresEntreprise.findUnique({
            where: { entrepriseId },
        });

        if (!settings) {
            // Create default settings
            const entreprise = await prisma.entreprise.findUnique({
                where: { id: entrepriseId },
                select: { nom: true, email: true },
            });

            settings = await prisma.parametresEntreprise.create({
                data: {
                    entrepriseId,
                    nom_entreprise: entreprise?.nom || "Mon Entreprise",
                    email: entreprise?.email || null,
                },
            });
        }

        return NextResponse.json({ settings });
    } catch (error) {
        return handleTenantError(error);
    }
}

// PUT: Mettre à jour les paramètres de l'entreprise
export async function PUT(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

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

        // Upsert settings
        const settings = await prisma.parametresEntreprise.upsert({
            where: { entrepriseId },
            create: {
                entrepriseId,
                ...validation.data,
            },
            update: validation.data,
        });

        return NextResponse.json({ settings });
    } catch (error) {
        return handleTenantError(error);
    }
}
