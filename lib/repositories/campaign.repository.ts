import { PrismaClient, Campaign } from "@/lib/generated/prisma/client";
import { BaseRepository } from "./base.repository";

/**
 * Campaign repository
 * Handles all database operations for marketing campaigns
 */
export class CampaignRepository extends BaseRepository<Campaign> {
  constructor(prisma: PrismaClient) {
    super(prisma, "campaign");
  }

  /**
   * Find campaign by name within a specific entreprise
   */
  async findByName(
    nom: string,
    entrepriseId: string
  ): Promise<Campaign | null> {
    return this.findFirst({
      nom,
      entrepriseId,
    });
  }

  /**
   * Find all campaigns for an entreprise with search and filters
   */
  async findByEntreprise(
    entrepriseId: string,
    search?: string,
    pagination?: Record<string, unknown>,
    filters?: {
      type?: string;
      statut?: string;
      segmentId?: string;
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

    // Add type filter
    if (filters?.type) {
      where.type = filters.type;
    }

    // Add status filter
    if (filters?.statut) {
      where.statut = filters.statut;
    }

    // Add segment filter
    if (filters?.segmentId) {
      where.segmentId = filters.segmentId;
    }

    return this.findAll(
      where,
      pagination,
      {
        segment: true,
      },
      { dateCreation: "desc" }
    );
  }

  /**
   * Find campaigns by segment
   */
  async findBySegment(
    segmentId: string,
    entrepriseId: string
  ): Promise<Campaign[]> {
    const result = await this.findAll({
      segmentId,
      entrepriseId,
    });

    return result.items;
  }

  /**
   * Find campaigns by status
   */
  async findByStatus(
    statut: string,
    entrepriseId: string
  ): Promise<Campaign[]> {
    const result = await this.findAll({
      statut,
      entrepriseId,
    });

    return result.items;
  }

  /**
   * Find scheduled campaigns (ready to be sent)
   */
  async findScheduled(entrepriseId: string): Promise<Campaign[]> {
    const now = new Date();
    const result = await this.findAll({
      entrepriseId,
      statut: "PLANIFIE",
      datePlanifiee: { lte: now },
    });

    return result.items;
  }

  /**
   * Find active campaigns
   */
  async findActive(entrepriseId: string): Promise<Campaign[]> {
    const result = await this.findAll({
      entrepriseId,
      statut: "ACTIVE",
    });

    return result.items;
  }

  /**
   * Update campaign status
   */
  async updateStatus(
    campaignId: string,
    statut: string
  ): Promise<Campaign> {
    return this.update(campaignId, { statut });
  }

  /**
   * Update campaign statistics
   */
  async updateStatistics(
    campaignId: string,
    stats: {
      nombreEnvois?: number;
      nombreOuvertures?: number;
      nombreClics?: number;
    }
  ): Promise<Campaign> {
    return this.update(campaignId, stats);
  }

  /**
   * Increment send count
   */
  async incrementSendCount(campaignId: string): Promise<Campaign> {
    const campaign = await this.findByIdOrFail(campaignId);
    return this.update(campaignId, {
      nombreEnvois: (campaign.nombreEnvois || 0) + 1,
    });
  }

  /**
   * Increment open count
   */
  async incrementOpenCount(campaignId: string): Promise<Campaign> {
    const campaign = await this.findByIdOrFail(campaignId);
    return this.update(campaignId, {
      nombreOuvertures: (campaign.nombreOuvertures || 0) + 1,
    });
  }

  /**
   * Increment click count
   */
  async incrementClickCount(campaignId: string): Promise<Campaign> {
    const campaign = await this.findByIdOrFail(campaignId);
    return this.update(campaignId, {
      nombreClics: (campaign.nombreClics || 0) + 1,
    });
  }

  /**
   * Mark campaign as sent
   */
  async markAsSent(campaignId: string): Promise<Campaign> {
    return this.update(campaignId, {
      statut: "ENVOYE",
      dateEnvoi: new Date(),
    });
  }

  /**
   * Mark campaign as completed
   */
  async markAsCompleted(campaignId: string): Promise<Campaign> {
    return this.update(campaignId, {
      statut: "TERMINE",
    });
  }

  /**
   * Count campaigns by type
   */
  async countByType(
    entrepriseId: string,
    type: string
  ): Promise<number> {
    return this.count({
      entrepriseId,
      type,
    });
  }

  /**
   * Count campaigns by status
   */
  async countByStatus(
    entrepriseId: string,
    statut: string
  ): Promise<number> {
    return this.count({
      entrepriseId,
      statut,
    });
  }

  /**
   * Get campaign statistics for dashboard
   */
  async getStatistics(entrepriseId: string) {
    const [
      totalCampaigns,
      activeCampaigns,
      scheduledCampaigns,
      completedCampaigns,
    ] = await Promise.all([
      this.count({ entrepriseId }),
      this.countByStatus(entrepriseId, "ACTIVE"),
      this.countByStatus(entrepriseId, "PLANIFIE"),
      this.countByStatus(entrepriseId, "TERMINE"),
    ]);

    return {
      total: totalCampaigns,
      active: activeCampaigns,
      scheduled: scheduledCampaigns,
      completed: completedCampaigns,
    };
  }

  /**
   * Calculate campaign performance metrics
   */
  async calculatePerformance(campaignId: string) {
    const campaign = await this.findByIdOrFail(campaignId);

    const openRate = campaign.nombreEnvois
      ? (campaign.nombreOuvertures || 0) / campaign.nombreEnvois * 100
      : 0;

    const clickRate = campaign.nombreEnvois
      ? (campaign.nombreClics || 0) / campaign.nombreEnvois * 100
      : 0;

    const clickThroughRate = campaign.nombreOuvertures
      ? (campaign.nombreClics || 0) / campaign.nombreOuvertures * 100
      : 0;

    return {
      sends: campaign.nombreEnvois || 0,
      opens: campaign.nombreOuvertures || 0,
      clicks: campaign.nombreClics || 0,
      openRate: Math.round(openRate * 100) / 100,
      clickRate: Math.round(clickRate * 100) / 100,
      clickThroughRate: Math.round(clickThroughRate * 100) / 100,
    };
  }
}
