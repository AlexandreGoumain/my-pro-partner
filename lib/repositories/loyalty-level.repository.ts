import { PrismaClient, NiveauFidelite } from "@/lib/generated/prisma/client";
import { BaseRepository } from "./base.repository";

/**
 * Loyalty Level repository
 * Handles all database operations for loyalty levels
 */
export class LoyaltyLevelRepository extends BaseRepository<NiveauFidelite> {
  constructor(prisma: PrismaClient) {
    super(prisma, "niveauFidelite");
  }

  /**
   * Find loyalty level by name within a specific entreprise
   */
  async findByName(
    nom: string,
    entrepriseId: string
  ): Promise<NiveauFidelite | null> {
    return this.findFirst({
      nom,
      entrepriseId,
    });
  }

  /**
   * Find all loyalty levels for an entreprise
   */
  async findByEntreprise(
    entrepriseId: string,
    search?: string,
    pagination?: Record<string, unknown>
  ) {
    const where: Record<string, unknown> = {
      entrepriseId,
    };

    // Add search filter
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    return this.findAll(
      where,
      pagination,
      {
        _count: {
          select: { clients: true },
        },
      },
      { seuilPoints: "asc" }
    );
  }

  /**
   * Find loyalty level by points threshold
   */
  async findByPointsThreshold(
    points: number,
    entrepriseId: string
  ): Promise<NiveauFidelite | null> {
    // Find the highest level the client qualifies for
    const levels = await this.findAll(
      {
        entrepriseId,
        seuilPoints: { lte: points },
      },
      undefined,
      undefined,
      { seuilPoints: "desc" }
    );

    return levels.items[0] || null;
  }

  /**
   * Find default loyalty level
   */
  async findDefault(entrepriseId: string): Promise<NiveauFidelite | null> {
    // Return the level with the lowest threshold (Bronze, etc.)
    const levels = await this.findAll(
      { entrepriseId },
      undefined,
      undefined,
      { seuilPoints: "asc" }
    );

    return levels.items[0] || null;
  }

  /**
   * Count clients in a loyalty level
   */
  async countClients(levelId: string): Promise<number> {
    const level = await this.model.findUnique({
      where: { id: levelId },
      include: {
        _count: {
          select: { clients: true },
        },
      },
    });

    return level?._count?.clients || 0;
  }

  /**
   * Get loyalty level with client count
   */
  async findWithClientCount(levelId: string): Promise<NiveauFidelite & { clientCount: number } | null> {
    const level = await this.model.findUnique({
      where: { id: levelId },
      include: {
        _count: {
          select: { clients: true },
        },
      },
    });

    if (!level) return null;

    return {
      ...level,
      clientCount: level._count.clients,
    };
  }

  /**
   * Update loyalty level rewards
   */
  async updateRewards(
    levelId: string,
    avantages: unknown
  ): Promise<NiveauFidelite> {
    return this.update(levelId, { avantages });
  }

  /**
   * Update points threshold
   */
  async updateThreshold(
    levelId: string,
    seuilPoints: number
  ): Promise<NiveauFidelite> {
    return this.update(levelId, { seuilPoints });
  }

  /**
   * Get all levels ordered by threshold
   */
  async findAllOrdered(entrepriseId: string): Promise<NiveauFidelite[]> {
    const result = await this.findAll(
      { entrepriseId },
      undefined,
      undefined,
      { seuilPoints: "asc" }
    );

    return result.items;
  }

  /**
   * Check if a loyalty level name is unique
   */
  async isNameUnique(
    nom: string,
    entrepriseId: string,
    excludeId?: string
  ): Promise<boolean> {
    const where: Record<string, unknown> = {
      entrepriseId,
      nom,
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const count = await this.count(where);
    return count === 0;
  }
}
