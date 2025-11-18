import { PrismaClient, Client } from "@/lib/generated/prisma/client";
import { BaseRepository } from "./base.repository";

/**
 * Client repository
 * Handles all database operations for clients
 */
export class ClientRepository extends BaseRepository<Client> {
  constructor(prisma: PrismaClient) {
    super(prisma, "client");
  }

  /**
   * Find client by email within a specific entreprise
   */
  async findByEmail(
    email: string,
    entrepriseId: string
  ): Promise<Client | null> {
    return this.findFirst({
      email,
      entrepriseId,
    });
  }

  /**
   * Find all clients for an entreprise with search
   */
  async findByEntreprise(
    entrepriseId: string,
    search?: string,
    pagination?: Record<string, unknown>,
    filters?: {
      actif?: boolean;
      niveauFideliteId?: string;
      ville?: string;
    }
  ) {
    const where: Record<string, unknown> = {
      entrepriseId,
    };

    // Add search filter
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { telephone: { contains: search, mode: "insensitive" } },
        { ville: { contains: search, mode: "insensitive" } },
      ];
    }

    // Add additional filters
    if (filters) {
      if (filters.actif !== undefined) {
        where.actif = filters.actif;
      }
      if (filters.niveauFideliteId) {
        where.niveauFideliteId = filters.niveauFideliteId;
      }
      if (filters.ville) {
        where.ville = { contains: filters.ville, mode: "insensitive" };
      }
    }

    return this.findAll(
      where,
      pagination,
      {
        niveauFidelite: true,
      },
      { createdAt: "desc" }
    );
  }

  /**
   * Count clients by entreprise
   */
  async countByEntreprise(entrepriseId: string): Promise<number> {
    return this.count({ entrepriseId });
  }

  /**
   * Count active clients by entreprise
   */
  async countActiveByEntreprise(entrepriseId: string): Promise<number> {
    return this.count({
      entrepriseId,
      actif: true,
    });
  }

  /**
   * Find clients by loyalty level
   */
  async findByLoyaltyLevel(
    niveauFideliteId: string,
    entrepriseId: string
  ): Promise<Client[]> {
    const result = await this.findAll({
      niveauFideliteId,
      entrepriseId,
    });

    return result.items;
  }

  /**
   * Find clients by segment criteria
   */
  async findBySegmentCriteria(
    entrepriseId: string,
    _criteria: Record<string, unknown>
  ): Promise<Client[]> {
    // This would need custom logic based on segment criteria structure
    // For now, return all clients of the entreprise
    const result = await this.findAll({ entrepriseId });
    return result.items;
  }

  /**
   * Update client loyalty points
   */
  async updateLoyaltyPoints(
    clientId: string,
    points: number
  ): Promise<Client> {
    return this.update(clientId, { points });
  }

  /**
   * Increment client loyalty points
   */
  async incrementLoyaltyPoints(
    clientId: string,
    pointsToAdd: number
  ): Promise<Client> {
    const client = await this.findByIdOrFail(clientId);
    const newPoints = (client.points || 0) + pointsToAdd;
    return this.update(clientId, { points: newPoints });
  }

  /**
   * Decrement client loyalty points
   */
  async decrementLoyaltyPoints(
    clientId: string,
    pointsToRemove: number
  ): Promise<Client> {
    const client = await this.findByIdOrFail(clientId);
    const newPoints = Math.max(0, (client.points || 0) - pointsToRemove);
    return this.update(clientId, { points: newPoints });
  }

  /**
   * Deactivate a client
   */
  async deactivate(clientId: string): Promise<Client> {
    return this.update(clientId, { actif: false });
  }

  /**
   * Activate a client
   */
  async activate(clientId: string): Promise<Client> {
    return this.update(clientId, { actif: true });
  }
}
