import { createCrudRoutes } from "@/lib/api/crud-factory";
import { rachatCreateSchema } from "@/lib/validation";
import { requireBusinessType } from "@/lib/middleware/business-type-check";
import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { requireTenantAuth } from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { ArticleService } from "@/lib/services/article.service";

// GET: List all rachats
export async function GET(req: NextRequest) {
  return withErrorHandling(async () => {
    // Check business type
    const businessTypeCheck = await requireBusinessType("INFORMATIQUE");
    if (businessTypeCheck) return businessTypeCheck;

    const { entrepriseId } = await requireTenantAuth();

    // Get query params
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    // Build where clause
    const where: any = {
      entrepriseId,
    };

    if (search) {
      where.OR = [
        {
          article: {
            nom: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          article: {
            reference: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          numeroSerie: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Get total count
    const total = await prisma.rachatArticle.count({ where });

    // Get rachats with pagination
    const rachats = await prisma.rachatArticle.findMany({
      where,
      include: {
        article: {
          include: {
            categorie: true,
          },
        },
        client: true,
      },
      orderBy: {
        dateRachat: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      items: rachats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  }, { resourceName: "Rachat", operation: "list" });
}

// POST: Create a new rachat with article
export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    // Check business type
    const businessTypeCheck = await requireBusinessType("INFORMATIQUE");
    if (businessTypeCheck) return businessTypeCheck;

    const { entrepriseId } = await requireTenantAuth();

    const body = await req.json();
    const result = rachatCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { articleData, ...rachatData } = result.data;

    // Generate reference for the article (OCCASION articles use OCC prefix)
    const reference = await ArticleService.generateReference("OCCASION", entrepriseId);

    // Create article with rachat in a transaction
    const article = await prisma.article.create({
      data: {
        ...articleData,
        type: "OCCASION",
        reference,
        categorieId: articleData.categorieId || null,
        entrepriseId,
        rachat: {
          create: {
            ...rachatData,
            entrepriseId,
          },
        },
      },
      include: {
        rachat: true,
        categorie: true,
      },
    });

    return NextResponse.json(article, { status: 201 });
  }, { resourceName: "Rachat", operation: "create" });
}
