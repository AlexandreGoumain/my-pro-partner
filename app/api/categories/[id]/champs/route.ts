import { prisma } from "@/lib/prisma";
import { champPersonnaliseCreateSchema } from "@/lib/validation";
import {
    handleTenantError,
    requireTenantAuth,
    validateTenantAccess,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { entrepriseId } = await requireTenantAuth();
        const { id } = await params;

        const categorie = await prisma.categorie.findUnique({
            where: { id },
            select: { entrepriseId: true },
        });

        if (!categorie) {
            return NextResponse.json(
                { message: "Catégorie introuvable" },
                { status: 404 }
            );
        }

        validateTenantAccess(categorie.entrepriseId, entrepriseId);

        const champs = await prisma.champPersonnalise.findMany({
            where: { categorieId: id },
            orderBy: { ordre: "asc" },
        });

        return NextResponse.json(champs);
    } catch (error) {
        return handleTenantError(error);
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { entrepriseId } = await requireTenantAuth();
        const { id } = await params;

        const categorie = await prisma.categorie.findUnique({
            where: { id },
            select: { entrepriseId: true },
        });

        if (!categorie) {
            return NextResponse.json(
                { message: "Catégorie introuvable" },
                { status: 404 }
            );
        }

        validateTenantAccess(categorie.entrepriseId, entrepriseId);

        const body = await req.json();
        const validation = champPersonnaliseCreateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const existingChamp = await prisma.champPersonnalise.findUnique({
            where: {
                categorieId_code: {
                    categorieId: id,
                    code: validation.data.code,
                },
            },
        });

        if (existingChamp) {
            return NextResponse.json(
                {
                    message:
                        "Un champ avec ce code existe déjà pour cette catégorie",
                },
                { status: 400 }
            );
        }

        const cleanedData = {
            ...validation.data,
            categorieId: id,
            placeholder: validation.data.placeholder || null,
            description: validation.data.description || null,
            options: validation.data.options
                ? validation.data.options
                : undefined,
            validation: validation.data.validation
                ? validation.data.validation
                : undefined,
        };

        const champ = await prisma.champPersonnalise.create({
            data: cleanedData,
        });

        return NextResponse.json(champ, { status: 201 });
    } catch (error) {
        return handleTenantError(error);
    }
}
