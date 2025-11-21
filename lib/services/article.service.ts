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
  type: "PRODUIT" | "SERVICE" | "OCCASION" | "PIECE";
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
   * Format: PREFIX-XXX (e.g., PRD-001, SRV-001, OCC-001, PCE-001)
   */
  static async generateReference(
    type: "PRODUIT" | "SERVICE" | "OCCASION" | "PIECE",
    entrepriseId: string
  ): Promise<string> {
    const parametres = await prisma.parametresEntreprise.findUnique({
      where: { entrepriseId },
    });

    if (!parametres) {
      throw new NotFoundError("Paramètres de l'entreprise", entrepriseId);
    }

    // Get prefix and counter based on type
    let prefix: string;
    let currentNumber: number;
    let counterField: string;

    switch (type) {
      case "PRODUIT":
        prefix = parametres.prefixe_produit;
        currentNumber = parametres.prochain_numero_produit;
        counterField = "prochain_numero_produit";
        break;
      case "SERVICE":
        prefix = parametres.prefixe_service;
        currentNumber = parametres.prochain_numero_service;
        counterField = "prochain_numero_service";
        break;
      case "OCCASION":
        prefix = parametres.prefixe_occasion;
        currentNumber = parametres.prochain_numero_occasion;
        counterField = "prochain_numero_occasion";
        break;
      case "PIECE":
        prefix = parametres.prefixe_piece;
        currentNumber = parametres.prochain_numero_piece;
        counterField = "prochain_numero_piece";
        break;
    }

    // Increment the counter
    await prisma.parametresEntreprise.update({
      where: { entrepriseId },
      data: {
        [counterField]: {
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

    // Validate stock for types that require it (all except SERVICE)
    const requiresStock = type !== "SERVICE";
    if (requiresStock && stock === undefined) {
      throw new BusinessError(`Le stock est obligatoire pour les ${type === "PRODUIT" ? "produits" : type === "OCCASION" ? "articles d'occasion" : "pièces détachées"}`);
    }

    // Services don't have stock
    const finalStock = type === "SERVICE" ? null : (stock || 0);

    // Create article
    const article = await articleRepository.create({
      ...data,
      reference,
      type,
      stock_actuel: finalStock,
      entrepriseId,
      actif: options.actif !== undefined ? options.actif : true,
    });

    // Create initial stock movement for items with stock
    if (requiresStock && finalStock && finalStock > 0) {
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
    // Verify article exists and has stock management
    const article = await articleRepository.findByIdOrFail(articleId);
    if (article.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Article", articleId);
    }

    if (article.type === "SERVICE") {
      throw new BusinessError("Les services n'ont pas de stock à gérer");
    }

    const currentStock = article.stock_actuel || 0;
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
      type?: "PRODUIT" | "SERVICE" | "OCCASION" | "PIECE";
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
    const [totalProducts, totalServices, totalOccasion, totalPieces, lowStockCount, outOfStockCount] =
      await Promise.all([
        articleRepository.countByType(entrepriseId, "PRODUIT"),
        articleRepository.countByType(entrepriseId, "SERVICE"),
        articleRepository.countByType(entrepriseId, "OCCASION"),
        articleRepository.countByType(entrepriseId, "PIECE"),
        articleRepository.findLowStock(entrepriseId, this.LOW_STOCK_THRESHOLD).then((items) => items.length),
        articleRepository.findOutOfStock(entrepriseId).then((items) => items.length),
      ]);

    return {
      products: totalProducts,
      services: totalServices,
      occasion: totalOccasion,
      pieces: totalPieces,
      total: totalProducts + totalServices + totalOccasion + totalPieces,
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

    if (article.type === "SERVICE") {
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
