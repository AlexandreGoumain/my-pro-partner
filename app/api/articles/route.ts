import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import {
    createPaginatedResponse,
    getPaginationParams,
} from "@/lib/utils/pagination";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const articleSchema = z.object({
    reference: z.string().min(1, "Référence requise"),
    nom: z.string().min(1, "Nom requis"),
    description: z.string().optional(),
    prix_ht: z.number().positive("Le prix doit être positif"),
    tva_taux: z.number().default(20),
    unite: z.string().default("unité"),
    categorieId: z.string().optional(),
    stock_actuel: z.number().int().default(0),
    stock_min: z.number().int().default(0),
    gestion_stock: z.boolean().default(false),
    actif: z.boolean().default(true),
});

// GET: Récupérer tous les articles
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");
        const categorieId = searchParams.get("categorieId");
        const pagination = getPaginationParams(searchParams);

        const where = {
            ...(search && {
                OR: [
                    { nom: { contains: search, mode: "insensitive" } },
                    {
                        reference: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }),
            ...(categorieId && { categorieId }),
            actif: true,
        };

        const [articles, total] = await Promise.all([
            prisma.article.findMany({
                where,
                include: {
                    categorie: true,
                },
                orderBy: { createdAt: "desc" },
                skip: pagination.skip,
                take: pagination.limit,
            }),
            prisma.article.count({ where }),
        ]);

        return NextResponse.json(
            createPaginatedResponse(articles, total, pagination)
        );
    } catch (error) {
        console.error("Erreur lors de la récupération des articles:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// POST: Créer un nouvel article
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
        const validation = articleSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        // Vérifier si la référence existe déjà
        const existingArticle = await prisma.article.findUnique({
            where: { reference: validation.data.reference },
        });

        if (existingArticle) {
            return NextResponse.json(
                { message: "Cette référence existe déjà" },
                { status: 400 }
            );
        }

        const article = await prisma.article.create({
            data: validation.data,
            include: {
                categorie: true,
            },
        });

        return NextResponse.json(article, { status: 201 });
    } catch (error) {
        console.error("Erreur lors de la création de l'article:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
