import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import {
  createPaginatedResponse,
  getPaginationParams,
} from "@/lib/utils/pagination";
import { mouvementStockCreateSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET: Récupérer tous les mouvements de stock
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
    const articleId = searchParams.get("articleId");
    const type = searchParams.get("type");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const pagination = getPaginationParams(searchParams);

    const where: Prisma.MouvementStockWhereInput = {};

    if (articleId) {
      where.articleId = articleId;
    }

    if (type) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const [mouvements, total] = await Promise.all([
      prisma.mouvementStock.findMany({
        where,
        include: {
          article: {
            select: {
              id: true,
              reference: true,
              nom: true,
              unite: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.mouvementStock.count({ where }),
    ]);

    return NextResponse.json(
      createPaginatedResponse(mouvements, total, pagination)
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des mouvements:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// POST: Créer un nouveau mouvement de stock
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
    const validation = mouvementStockCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { articleId, type, quantite, motif, reference, notes } = validation.data;

    // Vérifier que l'article existe et a la gestion de stock activée
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return NextResponse.json(
        { message: "Article non trouvé" },
        { status: 404 }
      );
    }

    if (!article.gestion_stock) {
      return NextResponse.json(
        { message: "La gestion de stock n'est pas activée pour cet article" },
        { status: 400 }
      );
    }

    // Calculer le nouveau stock
    const stock_avant = article.stock_actuel;
    const stock_apres = stock_avant + quantite;

    // Vérifier que le stock ne devient pas négatif
    if (stock_apres < 0) {
      return NextResponse.json(
        {
          message: "Stock insuffisant",
          details: `Stock actuel: ${stock_avant}, quantité demandée: ${Math.abs(quantite)}`,
        },
        { status: 400 }
      );
    }

    // Créer le mouvement et mettre à jour le stock en une transaction
    const mouvement = await prisma.$transaction(async (tx) => {
      // Créer le mouvement
      const newMouvement = await tx.mouvementStock.create({
        data: {
          articleId,
          type,
          quantite,
          stock_avant,
          stock_apres,
          motif: motif || null,
          reference: reference || null,
          notes: notes || null,
          createdBy: session.user?.email || null,
        },
        include: {
          article: {
            select: {
              id: true,
              reference: true,
              nom: true,
              unite: true,
            },
          },
        },
      });

      // Mettre à jour le stock de l'article
      await tx.article.update({
        where: { id: articleId },
        data: { stock_actuel: stock_apres },
      });

      return newMouvement;
    });

    return NextResponse.json(mouvement, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du mouvement:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
