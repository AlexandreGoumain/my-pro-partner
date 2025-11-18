import { prisma } from "@/lib/prisma";
import { articleRepository } from "@/lib/repositories";
import { NotFoundError, BusinessError } from "@/lib/errors";
import type { Article } from "@/lib/generated/prisma/client";

/**
 * Options for creating an article
 */
export interface CreateArticleOptions {
  entrepriseId: string;
  nom: string;
  type: "PRODUIT" | "SERVICE";
  prix: number;
  description?: string;
  categorieId?: string;
  stock?: number;
  actif?: boolean;
}

/**
 * Options for updating an article
 */
export interface UpdateArticleOptions {
  nom?: string;
  prix?: number;
  description?: string;
  categorieId?: string;
  stock?: number;
  actif?: boolean;
}

/**
 * Stock movement reasons
 */
export type StockMovementReason =
  | "AJUSTEMENT"
  | "VENTE"
  | "ACHAT"
  | "RETOUR"
  | "INVENTAIRE"
  | "PERTE"
  | "AUTRE";

/**
 * Article Service
 * Handles all business logic related to articles (products and services)
 */
export class ArticleService {
  /**
   * Low stock threshold
   */
  private static readonly LOW_STOCK_THRESHOLD = 10;

  /**
   * Generate a unique reference for an article
   * Format: PREFIX-XXX (e.g., PROD-001, SERV-001)
   */
  static async generateReference(
    type: "PRODUIT" | "SERVICE",
    entrepriseId: string
  ): Promise<string> {
    const parametres = await prisma.parametresEntreprise.findUnique({
      where: { entrepriseId },
    });

    if (!parametres) {
      throw new NotFoundError("Paramètres de l'entreprise", entrepriseId);
    }

    const isProduit = type === "PRODUIT";
    const prefix = isProduit ? parametres.prefixe_produit : parametres.prefixe_service;
    const currentNumber = isProduit
      ? parametres.prochain_numero_produit
      : parametres.prochain_numero_service;

    // Increment the counter
    await prisma.parametresEntreprise.update({
      where: { entrepriseId },
      data: {
        [isProduit ? "prochain_numero_produit" : "prochain_numero_service"]: {
          increment: 1,
        },
      },
    });

    return `${prefix}-${String(currentNumber).padStart(3, "0")}`;
  }

  /**
   * Create a new article
   * Generates unique reference automatically
   */
  static async createArticle(options: CreateArticleOptions): Promise<Article> {
    const { entrepriseId, type, stock, ...data } = options;

    // Generate unique reference
    const reference = await this.generateReference(type, entrepriseId);

    // Validate stock for products
    if (type === "PRODUIT" && stock === undefined) {
      throw new BusinessError("Le stock est obligatoire pour les produits");
    }

    // Services don't have stock
    const finalStock = type === "SERVICE" ? null : (stock || 0);

    // Create article
    const article = await articleRepository.create({
      ...data,
      reference,
      type,
      stock: finalStock,
      entrepriseId,
      actif: options.actif !== undefined ? options.actif : true,
    });

    // Create initial stock movement if product with stock
    if (type === "PRODUIT" && finalStock && finalStock > 0) {
      await this.recordStockMovement({
        articleId: article.id,
        entrepriseId,
        quantite: finalStock,
        type: "ENTREE",
        motif: "INVENTAIRE",
        description: "Stock initial",
      });
    }

    return article;
  }

  /**
   * Update an article
   */
  static async updateArticle(
    articleId: string,
    entrepriseId: string,
    options: UpdateArticleOptions
  ): Promise<Article> {
    // Verify article exists and belongs to entreprise
    const existingArticle = await articleRepository.findByIdOrFail(articleId);
    if (existingArticle.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Article", articleId);
    }

    // Don't allow direct stock updates through this method
    const { stock, ...updateData } = options;
    if (stock !== undefined) {
      throw new BusinessError(
        "Utilisez adjustStock() pour modifier le stock d'un article"
      );
    }

    return articleRepository.update(articleId, updateData);
  }

  /**
   * Delete an article
   * Checks for usage in documents before deletion
   */
  static async deleteArticle(
    articleId: string,
    entrepriseId: string
  ): Promise<void> {
    // Verify article exists and belongs to entreprise
    const article = await articleRepository.findByIdOrFail(articleId);
    if (article.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Article", articleId);
    }

    // Check if article is used in any documents
    const usageCount = await prisma.ligneDocument.count({
      where: { articleId },
    });

    if (usageCount > 0) {
      throw new BusinessError(
        `Impossible de supprimer cet article car il est utilisé dans ${usageCount} document(s)`
      );
    }

    await articleRepository.delete(articleId);
  }

  /**
   * Adjust article stock
   * Records the movement and updates stock
   */
  static async adjustStock(
    articleId: string,
    entrepriseId: string,
    quantity: number,
    motif: StockMovementReason,
    description?: string
  ): Promise<Article> {
    // Verify article exists and is a product
    const article = await articleRepository.findByIdOrFail(articleId);
    if (article.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Article", articleId);
    }

    if (article.type !== "PRODUIT") {
      throw new BusinessError("Les services n'ont pas de stock à gérer");
    }

    const currentStock = article.stock || 0;
    const newStock = currentStock + quantity;

    if (newStock < 0) {
      throw new BusinessError("Le stock ne peut pas être négatif");
    }

    // Record stock movement
    await this.recordStockMovement({
      articleId,
      entrepriseId,
      quantite: Math.abs(quantity),
      type: quantity > 0 ? "ENTREE" : "SORTIE",
      motif,
      description,
    });

    // Update stock
    return articleRepository.updateStock(articleId, newStock);
  }

  /**
   * Record a stock movement
   */
  private static async recordStockMovement(data: {
    articleId: string;
    entrepriseId: string;
    quantite: number;
    type: "ENTREE" | "SORTIE";
    motif: StockMovementReason;
    description?: string;
    documentId?: string;
  }) {
    await prisma.mouvementStock.create({
      data: {
        ...data,
        date: new Date(),
      },
    });
  }

  /**
   * Decrease stock (for sales)
   */
  static async decreaseStock(
    articleId: string,
    entrepriseId: string,
    quantity: number,
    documentId?: string
  ): Promise<Article> {
    return this.adjustStock(
      articleId,
      entrepriseId,
      -quantity,
      "VENTE",
      documentId ? `Vente - Document ${documentId}` : "Vente"
    );
  }

  /**
   * Increase stock (for purchases/returns)
   */
  static async increaseStock(
    articleId: string,
    entrepriseId: string,
    quantity: number,
    motif: StockMovementReason = "ACHAT",
    description?: string
  ): Promise<Article> {
    return this.adjustStock(articleId, entrepriseId, quantity, motif, description);
  }

  /**
   * Get articles with low stock
   */
  static async getLowStockArticles(
    entrepriseId: string,
    threshold?: number
  ): Promise<Article[]> {
    return articleRepository.findLowStock(
      entrepriseId,
      threshold || this.LOW_STOCK_THRESHOLD
    );
  }

  /**
   * Get out of stock articles
   */
  static async getOutOfStockArticles(entrepriseId: string): Promise<Article[]> {
    return articleRepository.findOutOfStock(entrepriseId);
  }

  /**
   * Bulk price update
   * Useful for applying price increases across categories or types
   */
  static async bulkUpdatePrices(
    entrepriseId: string,
    percentageIncrease: number,
    filters?: {
      categorieId?: string;
      type?: "PRODUIT" | "SERVICE";
    }
  ): Promise<{ count: number }> {
    if (percentageIncrease <= -100) {
      throw new BusinessError("L'augmentation ne peut pas être inférieure à -100%");
    }

    return articleRepository.bulkUpdatePrices(entrepriseId, percentageIncrease, filters);
  }

  /**
   * Activate an article
   */
  static async activateArticle(
    articleId: string,
    entrepriseId: string
  ): Promise<Article> {
    const article = await articleRepository.findByIdOrFail(articleId);
    if (article.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Article", articleId);
    }

    return articleRepository.activate(articleId);
  }

  /**
   * Deactivate an article
   */
  static async deactivateArticle(
    articleId: string,
    entrepriseId: string
  ): Promise<Article> {
    const article = await articleRepository.findByIdOrFail(articleId);
    if (article.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Article", articleId);
    }

    return articleRepository.deactivate(articleId);
  }

  /**
   * Get article statistics
   */
  static async getArticleStatistics(entrepriseId: string) {
    const [totalProducts, totalServices, lowStockCount, outOfStockCount] =
      await Promise.all([
        articleRepository.countByType(entrepriseId, "PRODUIT"),
        articleRepository.countByType(entrepriseId, "SERVICE"),
        articleRepository.findLowStock(entrepriseId, this.LOW_STOCK_THRESHOLD).then((items) => items.length),
        articleRepository.findOutOfStock(entrepriseId).then((items) => items.length),
      ]);

    return {
      products: totalProducts,
      services: totalServices,
      total: totalProducts + totalServices,
      lowStock: lowStockCount,
      outOfStock: outOfStockCount,
    };
  }

  /**
   * Get stock movement history for an article
   */
  static async getStockHistory(
    articleId: string,
    entrepriseId: string,
    limit?: number
  ) {
    // Verify article exists
    const article = await articleRepository.findByIdOrFail(articleId);
    if (article.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Article", articleId);
    }

    if (article.type !== "PRODUIT") {
      return [];
    }

    return prisma.mouvementStock.findMany({
      where: {
        articleId,
        entrepriseId,
      },
      orderBy: { date: "desc" },
      take: limit || 50,
    });
  }
}
