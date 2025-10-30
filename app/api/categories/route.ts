import { prisma } from "@/lib/prisma";
import { categorieCreateSchema } from "@/lib/validation";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const categories = await prisma.categorie.findMany({
            where: { entrepriseId },
            include: {
                enfants: true,
                parent: true,
                articles: {
                    where: { actif: true },
                    select: { id: true },
                },
            },
            orderBy: { ordre: "asc" },
        });

        return NextResponse.json(categories);
    } catch (error) {
        return handleTenantError(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const body = await req.json();
        const validation = categorieCreateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        if (validation.data.parentId) {
            const parentCategorie = await prisma.categorie.findUnique({
                where: { id: validation.data.parentId },
                select: { parentId: true, entrepriseId: true },
            });

            if (!parentCategorie) {
                return NextResponse.json(
                    { message: "Catégorie parente introuvable" },
                    { status: 404 }
                );
            }

            if (parentCategorie.entrepriseId !== entrepriseId) {
                return NextResponse.json(
                    { message: "Catégorie parente invalide" },
                    { status: 403 }
                );
            }

            if (parentCategorie.parentId) {
                return NextResponse.json(
                    {
                        message:
                            "Impossible de créer une sous-sous-catégorie. La hiérarchie est limitée à 2 niveaux (catégorie et sous-catégorie).",
                    },
                    { status: 400 }
                );
            }
        }

        const cleanedData = {
            nom: validation.data.nom,
            description: validation.data.description || null,
            parentId: validation.data.parentId || null,
            ordre: validation.data.ordre,
            entrepriseId,
        };

        const categorie = await prisma.categorie.create({
            data: cleanedData,
            include: {
                parent: true,
                enfants: true,
                articles: {
                    where: { actif: true },
                    select: { id: true },
                },
            },
        });

        return NextResponse.json(categorie, { status: 201 });
    } catch (error) {
        return handleTenantError(error);
    }
}
