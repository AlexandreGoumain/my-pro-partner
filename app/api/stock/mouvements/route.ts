import { createCrudRoutes } from "@/lib/api/crud-factory";
import { mouvementStockCreateSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/middleware/tenant-isolation";

export const { GET, POST } = createCrudRoutes({
  modelName: "mouvementStock",
  resourceName: "Mouvement de stock",
  createSchema: mouvementStockCreateSchema,
  updateSchema: mouvementStockCreateSchema, // Not used for stock movements

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

  // Custom filters for articleId, type, and date range
  customWhere: (searchParams) => {
    const articleId = searchParams.get("articleId");
    const type = searchParams.get("type");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: Record<string, unknown> = {};

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

    return where;
  },

  // Business logic for creating a stock movement
  beforeCreate: async (data) => {
    const { articleId, type, quantite, motif, reference, notes } = data;

    // Vérifier que l'article existe et a la gestion de stock activée
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new Error("Article non trouvé");
    }

    if (!article.gestion_stock) {
      throw new Error("La gestion de stock n'est pas activée pour cet article");
    }

    // Calculer le nouveau stock
    const stock_avant = article.stock_actuel;
    const stock_apres = stock_avant + quantite;

    // Vérifier que le stock ne devient pas négatif
    if (stock_apres < 0) {
      throw new Error(
        `Stock insuffisant. Stock actuel: ${stock_avant}, quantité demandée: ${Math.abs(quantite)}`
      );
    }

    // Get current user email for createdBy
    const { user } = await requireTenantAuth();

    return {
      articleId,
      type,
      quantite,
      stock_avant,
      stock_apres,
      motif: motif || undefined,
      reference: reference || undefined,
      notes: notes || undefined,
      createdBy: user?.email || undefined,
      entrepriseId: article.entrepriseId,
      _stockApres: stock_apres, // Store for afterCreate
    };
  },

  // Update article stock after creating movement (using transaction)
  afterCreate: async (mouvement) => {
    await prisma.article.update({
      where: { id: mouvement.articleId },
      data: { stock_actuel: (mouvement as unknown as { _stockApres: number })._stockApres },
    });
  },
});
