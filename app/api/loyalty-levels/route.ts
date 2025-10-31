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

        // Vérifier si l'ordre existe déjà
        const existingOrdre = await prisma.niveauFidelite.findFirst({
            where: {
                entrepriseId,
                ordre: validation.data.ordre,
            },
        });

        if (existingOrdre) {
            return NextResponse.json(
                { message: "Un niveau avec cet ordre existe déjà" },
                { status: 400 }
            );
        }

        const niveau = await prisma.niveauFidelite.create({
            data: {
                ...validation.data,
                entrepriseId,
            },
        });

        return NextResponse.json(niveau, { status: 201 });
    } catch (error) {
        return handleTenantError(error);
    }
}
