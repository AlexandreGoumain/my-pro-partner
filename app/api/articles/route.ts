import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import {
    createPaginatedResponse,
    getPaginationParams,
} from "@/lib/utils/pagination";
import { articleCreateSchema } from "@/lib/validation";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

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
                    { nom: { contains: search, mode: "insensitive" as const } },
                    {
                        reference: {
                            contains: search,
                            mode: "insensitive" as const,
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
        const validation = articleCreateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

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
            data: {
                ...validation.data,
                categorieId: validation.data.categorieId || null,
            },
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
