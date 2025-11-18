import { PrismaClient, Article } from "@/lib/generated/prisma/client";
import { BaseRepository } from "./base.repository";

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
      type?: "PRODUIT" | "SERVICE";
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

    // Add stock filter (only for products)
    if (filters?.enStock !== undefined && filters.type === "PRODUIT") {
      where.stock = filters.enStock ? { gt: 0 } : { lte: 0 };
    }

    return this.findAll(
      where,
      pagination,
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
    pagination?: Record<string, unknown>
  ) {
    return this.findByEntreprise(entrepriseId, search, pagination, {
      type: "PRODUIT",
    });
  }

  /**
   * Find services (exclude products)
   */
  async findServices(
    entrepriseId: string,
    search?: string,
    pagination?: Record<string, unknown>
  ) {
    return this.findByEntreprise(entrepriseId, search, pagination, {
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
      type: "PRODUIT",
      stock: { lte: threshold, gt: 0 },
    });

    return result.items;
  }

  /**
   * Find out of stock articles
   */
  async findOutOfStock(entrepriseId: string): Promise<Article[]> {
    const result = await this.findAll({
      entrepriseId,
      type: "PRODUIT",
      stock: { lte: 0 },
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
    return this.update(articleId, { stock: newStock });
  }

  /**
   * Increment article stock
   */
  async incrementStock(
    articleId: string,
    quantity: number
  ): Promise<Article> {
    const article = await this.findByIdOrFail(articleId);
    const newStock = (article.stock || 0) + quantity;
    return this.update(articleId, { stock: newStock });
  }

  /**
   * Decrement article stock
   */
  async decrementStock(
    articleId: string,
    quantity: number
  ): Promise<Article> {
    const article = await this.findByIdOrFail(articleId);
    const newStock = Math.max(0, (article.stock || 0) - quantity);
    return this.update(articleId, { stock: newStock });
  }

  /**
   * Count articles by type
   */
  async countByType(
    entrepriseId: string,
    type: "PRODUIT" | "SERVICE"
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
      type?: "PRODUIT" | "SERVICE";
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
      const newPrice = article.prix * (1 + percentageIncrease / 100);
      return this.update(article.id, { prix: newPrice });
    });

    await Promise.all(updatePromises);

    return { count: articles.length };
  }
}
