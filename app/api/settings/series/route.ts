import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateRequest } from "@/lib/utils/validation-helper";

const serieSchema = z.object({
    code: z.string().min(1, "Le code est requis").max(10, "Le code ne peut pas dépasser 10 caractères"),
    nom: z.string().min(1, "Le nom est requis"),
    description: z.string().optional().nullable(),
    couleur: z.string().optional().nullable(),
    pour_devis: z.boolean().default(true),
    pour_factures: z.boolean().default(true),
    pour_avoirs: z.boolean().default(false),
    format_numero: z.string().default("{CODE}{NUM5}"),
    reset_compteur: z.enum(["AUCUN", "ANNUEL", "MENSUEL"]).default("AUCUN"),
    est_defaut_devis: z.boolean().default(false),
    est_defaut_factures: z.boolean().default(false),
    est_defaut_avoirs: z.boolean().default(false),
});

// GET: Récupérer toutes les séries de documents
export async function GET(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const { searchParams } = new URL(req.url);
        const activeOnly = searchParams.get("active") === "true";
        const typeFilter = searchParams.get("type"); // "devis", "factures", "avoirs"

        // Build where clause
        const where: Record<string, unknown> = {
            entrepriseId,
        };

        if (activeOnly) {
            where.active = true;
        }

        if (typeFilter === "devis") {
            where.pour_devis = true;
        } else if (typeFilter === "factures") {
            where.pour_factures = true;
        } else if (typeFilter === "avoirs") {
            where.pour_avoirs = true;
        }

        const series = await prisma.serieDocument.findMany({
            where,
            include: {
                _count: {
                    select: { documents: true },
                },
            },
            orderBy: [
                { code: "asc" },
            ],
        });

        return NextResponse.json({ series });
    } catch (error) {
        return handleTenantError(error);
    }
}

// POST: Créer une nouvelle série de documents
export async function POST(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const body = await req.json();

        // Validate input
        const result = validateRequest(serieSchema, body);
        if (!result.success) return result.response;

        // Vérifier que le code n'existe pas déjà
        const existingSerie = await prisma.serieDocument.findUnique({
            where: {
                entrepriseId_code: {
                    entrepriseId,
                    code: result.data.code.toUpperCase(),
                },
            },
        });

        if (existingSerie) {
            return NextResponse.json(
                { message: "Une série avec ce code existe déjà" },
                { status: 400 }
            );
        }

        // Gérer les séries par défaut par type
        if (result.data.est_defaut_devis) {
            await prisma.serieDocument.updateMany({
                where: {
                    entrepriseId,
                    est_defaut_devis: true,
                },
                data: {
                    est_defaut_devis: false,
                },
            });
        }
        if (result.data.est_defaut_factures) {
            await prisma.serieDocument.updateMany({
                where: {
                    entrepriseId,
                    est_defaut_factures: true,
                },
                data: {
                    est_defaut_factures: false,
                },
            });
        }
        if (result.data.est_defaut_avoirs) {
            await prisma.serieDocument.updateMany({
                where: {
                    entrepriseId,
                    est_defaut_avoirs: true,
                },
                data: {
                    est_defaut_avoirs: false,
                },
            });
        }

        // Create serie
        const serie = await prisma.serieDocument.create({
            data: {
                ...result.data,
                code: result.data.code.toUpperCase(),
                entrepriseId,
            },
            include: {
                _count: {
                    select: { documents: true },
                },
            },
        });

        return NextResponse.json({ serie }, { status: 201 });
    } catch (error) {
        return handleTenantError(error);
    }
}
