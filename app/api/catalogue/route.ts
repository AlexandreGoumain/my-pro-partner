import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { requireTenantAuth } from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { ArticleType } from "@/lib/generated/prisma";

// GET: List all catalogue items with filtering
export async function GET(req: NextRequest) {
  return withErrorHandling(async () => {
    const { entrepriseId } = await requireTenantAuth();

    // Get query params
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") as ArticleType | null;
    const categorieId = searchParams.get("categorieId") || "";

    // Build where clause
    const where: any = {
      entrepriseId,
      actif: true,
    };

    // Add type filter
    if (type && ["PRODUIT", "SERVICE", "OCCASION", "PIECE"].includes(type)) {
      where.type = type;
    }

    // Add category filter
    if (categorieId) {
      where.categorieId = categorieId;
    }

    // Add search filter
    if (search) {
      where.OR = [
        {
          nom: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          reference: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Get total count
    const total = await prisma.article.count({ where });

    // Get articles with pagination
    const articles = await prisma.article.findMany({
      where,
      include: {
        categorie: true,
        rachat: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      items: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  }, { resourceName: "Catalogue", operation: "list" });
}
