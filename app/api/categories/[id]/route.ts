import { prisma } from "@/lib/prisma";
import { categorieUpdateSchema } from "@/lib/validation";
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
            include: {
                parent: true,
                enfants: true,
                articles: {
                    where: { actif: true },
                    select: {
                        id: true,
                        nom: true,
                        reference: true,
                    },
                },
            },
        });

        if (!categorie) {
            return NextResponse.json(
                { message: "Catégorie non trouvée" },
                { status: 404 }
            );
        }

        validateTenantAccess(categorie.entrepriseId, entrepriseId);

        return NextResponse.json(categorie);
    } catch (error) {
        return handleTenantError(error);
    }
}

async function updateCategorie(
    req: NextRequest,
    params: Promise<{ id: string }>
) {
    const { entrepriseId } = await requireTenantAuth();
    const { id } = await params;
    const body = await req.json();
    const validation = categorieUpdateSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(
            {
                message: "Données invalides",
                errors: validation.error.errors,
            },
            { status: 400 }
        );
    }

    const existingCategorie = await prisma.categorie.findUnique({
        where: { id },
    });

    if (!existingCategorie) {
        return NextResponse.json(
            { message: "Catégorie non trouvée" },
            { status: 404 }
        );
    }

    validateTenantAccess(existingCategorie.entrepriseId, entrepriseId);

    if (validation.data.parentId) {
        const parentCategorie = await prisma.categorie.findUnique({
            where: { id: validation.data.parentId },
            include: {
                parent: true,
            },
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

        if (validation.data.parentId === id) {
            return NextResponse.json(
                { message: "Une catégorie ne peut pas être son propre parent" },
                { status: 400 }
            );
        }

        if (parentCategorie?.parentId === id) {
            return NextResponse.json(
                {
                    message:
                        "Cette opération créerait une boucle de catégories",
                },
                { status: 400 }
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

    const categorie = await prisma.categorie.update({
        where: { id },
        data: validation.data,
        include: {
            parent: true,
            enfants: true,
            articles: {
                where: { actif: true },
                select: { id: true },
            },
        },
    });

    return NextResponse.json(categorie);
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        return await updateCategorie(req, params);
    } catch (error) {
        return handleTenantError(error);
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        return await updateCategorie(req, params);
    } catch (error) {
        return handleTenantError(error);
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { entrepriseId } = await requireTenantAuth();
        const { id } = await params;

        const categorie = await prisma.categorie.findUnique({
            where: { id },
            include: {
                enfants: true,
                articles: true,
            },
        });

        if (!categorie) {
            return NextResponse.json(
                { message: "Catégorie non trouvée" },
                { status: 404 }
            );
        }

        validateTenantAccess(categorie.entrepriseId, entrepriseId);

        if (categorie.enfants.length > 0) {
            return NextResponse.json(
                {
                    message: `Impossible de supprimer cette catégorie car elle contient ${categorie.enfants.length} sous-catégorie(s)`,
                },
                { status: 400 }
            );
        }

        if (categorie.articles.length > 0) {
            return NextResponse.json(
                {
                    message: `Impossible de supprimer cette catégorie car elle contient ${categorie.articles.length} article(s)`,
                },
                { status: 400 }
            );
        }

        await prisma.categorie.delete({
            where: { id },
        });

        return NextResponse.json({
            message: "Catégorie supprimée avec succès",
        });
    } catch (error) {
        return handleTenantError(error);
    }
}
