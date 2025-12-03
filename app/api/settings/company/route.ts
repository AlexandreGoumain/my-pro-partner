import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";
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

/**
 * GET /api/settings/company
 * Get company settings
 */
export async function GET(_req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            // Get or create settings
            let settings = await prisma.parametresEntreprise.findUnique({
                where: { entrepriseId: ctx.entrepriseId },
            });

            if (!settings) {
                // Create default settings
                const entreprise = await prisma.entreprise.findUnique({
                    where: { id: ctx.entrepriseId },
                    select: { nom: true, email: true },
                });

                settings = await prisma.parametresEntreprise.create({
                    data: {
                        entrepriseId: ctx.entrepriseId,
                        nom_entreprise: entreprise?.nom || "Mon Entreprise",
                        email: entreprise?.email || null,
                    },
                });
            }

            return NextResponse.json({ settings });
        },
        {
            context: { resourceName: "ParametresEntreprise", operation: "get" },
        }
    );
}

/**
 * PUT /api/settings/company
 * Update company settings
 */
export async function PUT(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await req.json();

            // Validate input
            const result = companySettingsSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            // Upsert settings
            const settings = await prisma.parametresEntreprise.upsert({
                where: { entrepriseId: ctx.entrepriseId },
                create: {
                    entrepriseId: ctx.entrepriseId,
                    ...result.data,
                },
                update: result.data,
            });

            return NextResponse.json({ settings });
        },
        {
            context: { resourceName: "ParametresEntreprise", operation: "update" },
        }
    );
}
