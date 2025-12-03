import { PrismaClient, Campaign } from "@/lib/generated/prisma";
import { BaseRepository, PaginationParams } from "./base.repository";

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
    pagination?: PaginationParams,
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
      { createdAt: "desc" }
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
      statut: "SCHEDULED",
      scheduledAt: { lte: now },
    });

    return result.items;
  }

  /**
   * Find sending campaigns
   */
  async findSending(entrepriseId: string): Promise<Campaign[]> {
    const result = await this.findAll({
      entrepriseId,
      statut: "SENDING",
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
      sentCount?: number;
      openedCount?: number;
      clickedCount?: number;
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
      sentCount: (campaign.sentCount || 0) + 1,
    });
  }

  /**
   * Increment open count
   */
  async incrementOpenCount(campaignId: string): Promise<Campaign> {
    const campaign = await this.findByIdOrFail(campaignId);
    return this.update(campaignId, {
      openedCount: (campaign.openedCount || 0) + 1,
    });
  }

  /**
   * Increment click count
   */
  async incrementClickCount(campaignId: string): Promise<Campaign> {
    const campaign = await this.findByIdOrFail(campaignId);
    return this.update(campaignId, {
      clickedCount: (campaign.clickedCount || 0) + 1,
    });
  }

  /**
   * Mark campaign as sent
   */
  async markAsSent(campaignId: string): Promise<Campaign> {
    return this.update(campaignId, {
      statut: "SENT",
      sentAt: new Date(),
    });
  }

  /**
   * Mark campaign as cancelled
   */
  async markAsCancelled(campaignId: string): Promise<Campaign> {
    return this.update(campaignId, {
      statut: "CANCELLED",
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
      draftCampaigns,
      scheduledCampaigns,
      sentCampaigns,
    ] = await Promise.all([
      this.count({ entrepriseId }),
      this.countByStatus(entrepriseId, "DRAFT"),
      this.countByStatus(entrepriseId, "SCHEDULED"),
      this.countByStatus(entrepriseId, "SENT"),
    ]);

    return {
      total: totalCampaigns,
      draft: draftCampaigns,
      scheduled: scheduledCampaigns,
      sent: sentCampaigns,
    };
  }

  /**
   * Calculate campaign performance metrics
   */
  async calculatePerformance(campaignId: string) {
    const campaign = await this.findByIdOrFail(campaignId);

    const openRate = campaign.sentCount
      ? (campaign.openedCount || 0) / campaign.sentCount * 100
      : 0;

    const clickRate = campaign.sentCount
      ? (campaign.clickedCount || 0) / campaign.sentCount * 100
      : 0;

    const clickThroughRate = campaign.openedCount
      ? (campaign.clickedCount || 0) / campaign.openedCount * 100
      : 0;

    return {
      sends: campaign.sentCount || 0,
      opens: campaign.openedCount || 0,
      clicks: campaign.clickedCount || 0,
      openRate: Math.round(openRate * 100) / 100,
      clickRate: Math.round(clickRate * 100) / 100,
      clickThroughRate: Math.round(clickThroughRate * 100) / 100,
    };
  }
}
