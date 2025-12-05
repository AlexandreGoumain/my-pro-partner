import { PrismaClient, Segment } from "@/lib/generated/prisma";
import { BaseRepository, PaginationParams } from "./base.repository";

/**
 * Segment repository
 * Handles all database operations for customer segments
 */
export class SegmentRepository extends BaseRepository<Segment> {
  constructor(prisma: PrismaClient) {
    super(prisma, "segment");
  }

  /**
   * Find segment by name within a specific entreprise
   */
  async findByName(
    nom: string,
    entrepriseId: string
  ): Promise<Segment | null> {
    return this.findFirst({
      nom,
      entrepriseId,
    });
  }

  /**
   * Find all segments for an entreprise with search
   */
  async findByEntreprise(
    entrepriseId: string,
    search?: string,
    pagination?: PaginationParams,
    filters?: {
      actif?: boolean;
    }
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

    // Add active filter
    if (filters?.actif !== undefined) {
      where.actif = filters.actif;
    }

    return this.findAll(
      where,
      pagination,
      undefined,
      { createdAt: "desc" }
    );
  }

  /**
   * Find active segments
   */
  async findActive(entrepriseId: string): Promise<Segment[]> {
    const result = await this.findAll({
      entrepriseId,
      actif: true,
    });

    return result.items;
  }

  /**
   * Update segment client count
   */
  async updateClientCount(
    segmentId: string,
    count: number
  ): Promise<Segment> {
    return this.update(segmentId, { nombreClients: count });
  }

  /**
   * Deactivate a segment
   */
  async deactivate(segmentId: string): Promise<Segment> {
    return this.update(segmentId, { actif: false });
  }

  /**
   * Activate a segment
   */
  async activate(segmentId: string): Promise<Segment> {
    return this.update(segmentId, { actif: true });
  }

  /**
   * Count active segments by entreprise
   */
  async countActiveByEntreprise(entrepriseId: string): Promise<number> {
    return this.count({
      entrepriseId,
      actif: true,
    });
  }
}
