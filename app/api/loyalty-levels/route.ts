import { prisma } from "@/lib/prisma";
import {
    createPaginatedResponse,
    getPaginationParams,
} from "@/lib/utils/pagination";
import { niveauFideliteCreateSchema } from "@/lib/validation";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";

/**
 * Recalcule automatiquement l'ordre de tous les niveaux de fidélité
 * en fonction de leur seuil de points (tri croissant)
 */
async function recalculateOrdres(entrepriseId: string) {
    const niveaux = await prisma.niveauFidelite.findMany({
        where: { entrepriseId },
        orderBy: { seuilPoints: "asc" },
    });

    // Mettre à jour l'ordre de chaque niveau
    const updatePromises = niveaux.map((niveau, index) =>
        prisma.niveauFidelite.update({
            where: { id: niveau.id },
            data: { ordre: index + 1 },
        })
    );

    await Promise.all(updatePromises);
}

export async function GET(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");
        const actifOnly = searchParams.get("actifOnly") === "true";
        const pagination = getPaginationParams(searchParams);

        const where = {
            entrepriseId,
            ...(actifOnly && { actif: true }),
            ...(search && {
                OR: [
                    { nom: { contains: search, mode: "insensitive" as const } },
                    { description: { contains: search, mode: "insensitive" as const } },
                ],
            }),
        };

        const [niveaux, total] = await Promise.all([
            prisma.niveauFidelite.findMany({
                where,
                orderBy: { ordre: "asc" },
                skip: pagination.skip,
                take: pagination.limit,
            }),
            prisma.niveauFidelite.count({ where }),
        ]);

        return NextResponse.json(
            createPaginatedResponse(niveaux, total, pagination)
        );
    } catch (error) {
        return handleTenantError(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const body = await req.json();
        const validation = niveauFideliteCreateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        // Vérifier si le nom existe déjà
        const existingNom = await prisma.niveauFidelite.findFirst({
            where: {
                entrepriseId,
                nom: validation.data.nom,
            },
        });

        if (existingNom) {
            return NextResponse.json(
                { message: "Un niveau avec ce nom existe déjà" },
                { status: 400 }
            );
        }

        // Créer le niveau avec un ordre temporaire
        const niveau = await prisma.niveauFidelite.create({
            data: {
                ...validation.data,
                ordre: 0, // Temporaire, sera recalculé
                entrepriseId,
            },
        });

        // Recalculer automatiquement les ordres de tous les niveaux
        await recalculateOrdres(entrepriseId);

        // Récupérer le niveau avec son ordre final
        const niveauFinal = await prisma.niveauFidelite.findUnique({
            where: { id: niveau.id },
        });

        return NextResponse.json(niveauFinal, { status: 201 });
    } catch (error) {
        return handleTenantError(error);
    }
}
