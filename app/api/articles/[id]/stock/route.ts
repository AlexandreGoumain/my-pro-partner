import { requireAuth } from "@/lib/api/auth-middleware";
import { prisma } from "@/lib/prisma";
import { stockAdjustmentSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

// PUT: Ajuster rapidement le stock d'un article
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionOrError = await requireAuth();
    if (sessionOrError instanceof NextResponse) return sessionOrError;
    const session = sessionOrError;

    const { id } = await params;

    const body = await req.json();
    const validation = stockAdjustmentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { quantite, motif } = validation.data;

    // Vérifier que l'article existe et a la gestion de stock activée
    const article = await prisma.article.findUnique({
      where: { id },
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

    // Déterminer le type de mouvement basé sur la quantité
    const type = quantite > 0 ? "ENTREE" : "SORTIE";

    // Créer le mouvement et mettre à jour le stock en une transaction
    const result = await prisma.$transaction(async (tx) => {
      // Créer le mouvement
      await tx.mouvementStock.create({
        data: {
          articleId: id,
          type: "AJUSTEMENT",
          quantite,
          stock_avant,
          stock_apres,
          motif: motif || `Ajustement ${type === "ENTREE" ? "positif" : "négatif"}`,
          createdBy: session.user?.email || null,
        },
      });

      // Mettre à jour le stock de l'article
      const updatedArticle = await tx.article.update({
        where: { id },
        data: { stock_actuel: stock_apres },
        include: {
          categorie: true,
        },
      });

      return updatedArticle;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur lors de l'ajustement du stock:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
