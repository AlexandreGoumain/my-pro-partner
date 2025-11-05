import { prisma } from "@/lib/prisma";
import {
    createPaginatedResponse,
    getPaginationParams,
} from "@/lib/utils/pagination";
import { articleCreateSchema } from "@/lib/validation";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { validateLimit } from "@/lib/middleware/feature-validation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");
        const categorieId = searchParams.get("categorieId");
        const pagination = getPaginationParams(searchParams);

        const where = {
            entrepriseId,
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
        return handleTenantError(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const { entrepriseId, entreprise } = await requireTenantAuth();

        // Check if user has reached maxProducts limit
        const limitCheck = await validateLimit(entreprise.plan, entrepriseId, "maxProducts");
        if (limitCheck) return limitCheck;

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
            where: {
                entrepriseId_reference: {
                    entrepriseId,
                    reference: validation.data.reference,
                },
            },
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
                entrepriseId,
                categorieId: validation.data.categorieId || null,
            },
            include: {
                categorie: true,
            },
        });

        return NextResponse.json(article, { status: 201 });
    } catch (error) {
        return handleTenantError(error);
    }
}
