import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const categorieSchema = z.object({
    nom: z.string().min(1, "Nom requis"),
    description: z.string().optional(),
    parentId: z.string().optional(),
    ordre: z.number().int().default(0),
});

// GET: Récupérer toutes les catégories
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

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
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const validation = categorieSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const categorie = await prisma.categorie.create({
            data: validation.data,
            include: {
                parent: true,
                enfants: true,
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
