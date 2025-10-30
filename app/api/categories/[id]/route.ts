import { requireAuth } from "@/lib/api/auth-middleware";
import { prisma } from "@/lib/prisma";
import { categorieUpdateSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

// GET: Récupérer une catégorie par ID
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const sessionOrError = await requireAuth();
        if (sessionOrError instanceof NextResponse) return sessionOrError;

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

        return NextResponse.json(categorie);
    } catch (error) {
        console.error("Erreur lors de la récupération de la catégorie:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// Shared update logic for PUT and PATCH
async function updateCategorie(
    req: NextRequest,
    params: Promise<{ id: string }>
) {
    const sessionOrError = await requireAuth();
    if (sessionOrError instanceof NextResponse) return sessionOrError;

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

    // Vérifier que la catégorie existe
    const existingCategorie = await prisma.categorie.findUnique({
        where: { id },
    });

    if (!existingCategorie) {
        return NextResponse.json(
            { message: "Catégorie non trouvée" },
            { status: 404 }
        );
    }

    // Vérifier qu'on ne crée pas de boucle de parenté
    if (validation.data.parentId) {
        const parentCategorie = await prisma.categorie.findUnique({
            where: { id: validation.data.parentId },
            include: {
                parent: true,
            },
        });

        // Empêcher de se mettre soi-même comme parent
        if (validation.data.parentId === id) {
            return NextResponse.json(
                { message: "Une catégorie ne peut pas être son propre parent" },
                { status: 400 }
            );
        }

        // Empêcher les boucles (vérification simplifiée)
        if (parentCategorie?.parentId === id) {
            return NextResponse.json(
                {
                    message:
                        "Cette opération créerait une boucle de catégories",
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

// PUT: Mettre à jour une catégorie
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        return await updateCategorie(req, params);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la catégorie:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// PATCH: Mettre à jour partiellement une catégorie
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        return await updateCategorie(req, params);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la catégorie:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// DELETE: Supprimer une catégorie
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const sessionOrError = await requireAuth();
        if (sessionOrError instanceof NextResponse) return sessionOrError;

        const { id } = await params;
        // Vérifier que la catégorie existe
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

        // Empêcher la suppression si la catégorie a des enfants
        if (categorie.enfants.length > 0) {
            return NextResponse.json(
                {
                    message: `Impossible de supprimer cette catégorie car elle contient ${categorie.enfants.length} sous-catégorie(s)`,
                },
                { status: 400 }
            );
        }

        // Empêcher la suppression si la catégorie contient des articles
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
        console.error("Erreur lors de la suppression de la catégorie:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
