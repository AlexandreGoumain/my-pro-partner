import { PrismaClient, Article } from "@/lib/generated/prisma";
import { BaseRepository, PaginationParams } from "./base.repository";

/**
 * Article repository
 * Handles all database operations for articles (products and services)
 */
export class ArticleRepository extends BaseRepository<Article> {
  constructor(prisma: PrismaClient) {
    super(prisma, "article");
  }

  /**
   * Find article by reference within a specific entreprise
   */
  async findByReference(
    reference: string,
    entrepriseId: string
  ): Promise<Article | null> {
    return this.findFirst({
      reference,
      entrepriseId,
    });
  }

  /**
   * Find all articles for an entreprise with search and filters
   */
  async findByEntreprise(
    entrepriseId: string,
    search?: string,
    pagination?: Record<string, unknown>,
    filters?: {
      type?: "PRODUIT" | "SERVICE" | "OCCASION" | "PIECE";
      categorieId?: string;
      actif?: boolean;
      enStock?: boolean;
    }
  ) {
    const where: Record<string, unknown> = {
      entrepriseId,
    };

    // Add search filter
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: "insensitive" } },
        { reference: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Add type filter
    if (filters?.type) {
      where.type = filters.type;
    }

    // Add category filter
    if (filters?.categorieId) {
      where.categorieId = filters.categorieId;
    }

    // Add active filter
    if (filters?.actif !== undefined) {
      where.actif = filters.actif;
    }

    // Add stock filter (for items with stock: PRODUIT, OCCASION, PIECE)
    if (filters?.enStock !== undefined && filters.type !== "SERVICE") {
      where.stock_actuel = filters.enStock ? { gt: 0 } : { lte: 0 };
    }

    return this.findAll(
      where,
      pagination as PaginationParams | undefined,
      {
        categorie: true,
      },
      { createdAt: "desc" }
    );
  }

  /**
   * Find products (exclude services)
   */
  async findProducts(
    entrepriseId: string,
    search?: string,
    pagination?: PaginationParams
  ) {
    return this.findByEntreprise(entrepriseId, search, pagination as PaginationParams | undefined, {
      type: "PRODUIT",
    });
  }

  /**
   * Find services (exclude products)
   */
  async findServices(
    entrepriseId: string,
    search?: string,
    pagination?: PaginationParams
  ) {
    return this.findByEntreprise(entrepriseId, search, pagination as PaginationParams | undefined, {
      type: "SERVICE",
    });
  }

  /**
   * Find articles with low stock
   */
  async findLowStock(
    entrepriseId: string,
    threshold: number = 10
  ): Promise<Article[]> {
    const result = await this.findAll({
      entrepriseId,
      type: { not: "SERVICE" },
      stock_actuel: { lte: threshold, gt: 0 },
    });

    return result.items;
  }

  /**
   * Find out of stock articles
   */
  async findOutOfStock(entrepriseId: string): Promise<Article[]> {
    const result = await this.findAll({
      entrepriseId,
      type: { not: "SERVICE" },
      stock_actuel: { lte: 0 },
    });

    return result.items;
  }

  /**
   * Update article stock
   */
  async updateStock(
    articleId: string,
    newStock: number
  ): Promise<Article> {
    return this.update(articleId, { stock_actuel: newStock });
  }

  /**
   * Increment article stock
   */
  async incrementStock(
    articleId: string,
    quantity: number
  ): Promise<Article> {
    const article = await this.findByIdOrFail(articleId);
    const newStock = (article.stock_actuel || 0) + quantity;
    return this.update(articleId, { stock_actuel: newStock });
  }

  /**
   * Decrement article stock
   */
  async decrementStock(
    articleId: string,
    quantity: number
  ): Promise<Article> {
    const article = await this.findByIdOrFail(articleId);
    const newStock = Math.max(0, (article.stock_actuel || 0) - quantity);
    return this.update(articleId, { stock_actuel: newStock });
  }

  /**
   * Count articles by type
   */
  async countByType(
    entrepriseId: string,
    type: "PRODUIT" | "SERVICE" | "OCCASION" | "PIECE"
  ): Promise<number> {
    return this.count({
      entrepriseId,
      type,
    });
  }

  /**
   * Count articles by category
   */
  async countByCategory(categorieId: string): Promise<number> {
    return this.count({ categorieId });
  }

  /**
   * Deactivate an article
   */
  async deactivate(articleId: string): Promise<Article> {
    return this.update(articleId, { actif: false });
  }

  /**
   * Activate an article
   */
  async activate(articleId: string): Promise<Article> {
    return this.update(articleId, { actif: true });
  }

  /**
   * Bulk update prices (e.g., for price increases)
   */
  async bulkUpdatePrices(
    entrepriseId: string,
    percentageIncrease: number,
    filters?: {
      categorieId?: string;
      type?: "PRODUIT" | "SERVICE" | "OCCASION" | "PIECE";
    }
  ): Promise<{ count: number }> {
    const where: Record<string, unknown> = { entrepriseId };

    if (filters?.categorieId) {
      where.categorieId = filters.categorieId;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    // Get all matching articles
    const articles = (await this.findAll(where)).items;

    // Update each article's price
    const updatePromises = articles.map((article) => {
      const currentPrice = parseFloat(article.prix_ht.toString());
      const newPrice = currentPrice * (1 + percentageIncrease / 100);
      return this.update(article.id, { prix_ht: newPrice });
    });

    await Promise.all(updatePromises);

    return { count: articles.length };
  }
}
