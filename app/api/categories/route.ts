import { requireAuth } from "@/lib/api/auth-middleware";
import { prisma } from "@/lib/prisma";
import { categorieCreateSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

// GET: Récupérer toutes les catégories
export async function GET() {
    try {
        const sessionOrError = await requireAuth();
        if (sessionOrError instanceof NextResponse) return sessionOrError;

        const categories = await prisma.categorie.findMany({
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
        console.error("Erreur lors de la récupération des catégories:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// POST: Créer une nouvelle catégorie
export async function POST(req: NextRequest) {
    try {
        const sessionOrError = await requireAuth();
        if (sessionOrError instanceof NextResponse) return sessionOrError;

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

        // Nettoyer les valeurs vides pour Prisma
        const cleanedData = {
            nom: validation.data.nom,
            description: validation.data.description || null,
            parentId: validation.data.parentId || null,
            ordre: validation.data.ordre,
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
        console.error("Erreur lors de la création de la catégorie:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
