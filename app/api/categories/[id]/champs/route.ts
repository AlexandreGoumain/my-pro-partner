import {
    handleTenantError,
    verifyResourceAccess,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/utils/validation-helper";
import { champPersonnaliseCreateSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await verifyResourceAccess(
            id,
            (id) =>
                prisma.categorie.findUnique({
                    where: { id },
                    select: { id: true, entrepriseId: true },
                }),
            "Catégorie"
        );

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
        const { id } = await params;
        const body = await req.json();

        await verifyResourceAccess(
            id,
            (id) =>
                prisma.categorie.findUnique({
                    where: { id },
                    select: { id: true, entrepriseId: true },
                }),
            "Catégorie"
        );

        const result = validateRequest(champPersonnaliseCreateSchema, body);
        if (!result.success) return result.response;

        const existingChamp = await prisma.champPersonnalise.findUnique({
            where: {
                categorieId_code: {
                    categorieId: id,
                    code: result.data.code,
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
            ...result.data,
            categorieId: id,
            placeholder: result.data.placeholder || null,
            description: result.data.description || null,
            options: result.data.options ? result.data.options : undefined,
            validation: result.data.validation
                ? result.data.validation
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
