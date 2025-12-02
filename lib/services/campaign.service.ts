import { campaignRepository, segmentRepository } from "@/lib/repositories";
import { ConflictError, NotFoundError, BusinessError } from "@/lib/errors";
import { SegmentService } from "./segment.service";
import type { Campaign } from "@/lib/generated/prisma";

/**
 * Options for creating a campaign
 */
export interface CreateCampaignOptions {
  entrepriseId: string;
  nom: string;
  type?: "EMAIL" | "SMS" | "NOTIFICATION";
  statut?: "DRAFT" | "SCHEDULED" | "SENDING" | "SENT" | "CANCELLED";
  description?: string;
  segmentId?: string;
  subject?: string;
  body?: string;
  scheduledAt?: Date;
}

/**
 * Options for updating a campaign
 */
export interface UpdateCampaignOptions {
  nom?: string;
  type?: "EMAIL" | "SMS" | "NOTIFICATION";
  statut?: "DRAFT" | "SCHEDULED" | "SENDING" | "SENT" | "CANCELLED";
  description?: string;
  segmentId?: string;
  subject?: string;
  body?: string;
  scheduledAt?: Date;
}

/**
 * Campaign Service
 * Handles all business logic related to marketing campaigns
 */
export class CampaignService {
  /**
   * Create a new campaign
   * Validates segment existence and name uniqueness
   */
  static async createCampaign(options: CreateCampaignOptions): Promise<Campaign> {
    const { entrepriseId, nom, segmentId, ...data } = options;

    // Check name uniqueness
    const existing = await campaignRepository.findByName(nom, entrepriseId);
    if (existing) {
      throw new ConflictError(`Une campagne avec le nom "${nom}" existe déjà`);
    }

    // Verify segment exists if provided
    if (segmentId) {
      const segment = await segmentRepository.findById(segmentId);
      if (!segment || segment.entrepriseId !== entrepriseId) {
        throw new NotFoundError("Segment", segmentId);
      }
    }

    // Create campaign
    const campaign = await campaignRepository.create({
      ...data,
      nom,
      segmentId,
      entrepriseId,
      statut: options.statut || "DRAFT",
      recipientsCount: 0,
      sentCount: 0,
      openedCount: 0,
      clickedCount: 0,
    });

    return campaign;
  }

  /**
   * Update a campaign
   * Validates name uniqueness and prevents modification of sent campaigns
   */
  static async updateCampaign(
    campaignId: string,
    entrepriseId: string,
    options: UpdateCampaignOptions
  ): Promise<Campaign> {
    // Verify campaign exists and belongs to entreprise
    const existingCampaign = await campaignRepository.findByIdOrFail(campaignId);
    if (existingCampaign.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Campaign", campaignId);
    }

    // Prevent modification of sent campaigns
    if (existingCampaign.statut === "SENT" || existingCampaign.statut === "CANCELLED") {
      throw new BusinessError("Impossible de modifier une campagne déjà envoyée ou annulée");
    }

    // Check name uniqueness if changing name
    if (options.nom && options.nom !== existingCampaign.nom) {
      const nameTaken = await campaignRepository.findByName(options.nom, entrepriseId);
      if (nameTaken) {
        throw new ConflictError(`Une campagne avec le nom "${options.nom}" existe déjà`);
      }
    }

    // Verify segment exists if changing segment
    if (options.segmentId) {
      const segment = await segmentRepository.findById(options.segmentId);
      if (!segment || segment.entrepriseId !== entrepriseId) {
        throw new NotFoundError("Segment", options.segmentId);
      }
    }

    return campaignRepository.update(campaignId, options as Record<string, unknown>);
  }

  /**
   * Delete a campaign
   * Prevents deletion of sent campaigns
   */
  static async deleteCampaign(
    campaignId: string,
    entrepriseId: string
  ): Promise<void> {
    // Verify campaign exists and belongs to entreprise
    const campaign = await campaignRepository.findByIdOrFail(campaignId);
    if (campaign.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Campaign", campaignId);
    }

    // Prevent deletion of sent campaigns
    if (campaign.statut === "SENT") {
      throw new BusinessError("Impossible de supprimer une campagne déjà envoyée");
    }

    await campaignRepository.delete(campaignId);
  }

  /**
   * Schedule a campaign for sending
   */
  static async scheduleCampaign(
    campaignId: string,
    entrepriseId: string,
    scheduledAt: Date
  ): Promise<Campaign> {
    // Verify campaign exists
    const campaign = await campaignRepository.findByIdOrFail(campaignId);
    if (campaign.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Campaign", campaignId);
    }

    // Validate campaign is ready
    if (!campaign.segmentId) {
      throw new BusinessError("La campagne doit avoir un segment cible");
    }

    if (!campaign.body && !campaign.subject) {
      throw new BusinessError("La campagne doit avoir un contenu (sujet ou corps)");
    }

    // Validate scheduled date is in the future
    if (scheduledAt <= new Date()) {
      throw new BusinessError("La date planifiée doit être dans le futur");
    }

    return campaignRepository.update(campaignId, {
      statut: "SCHEDULED",
      scheduledAt,
    });
  }

  /**
   * Send a campaign immediately
   */
  static async sendCampaign(
    campaignId: string,
    entrepriseId: string
  ): Promise<{ campaign: Campaign; recipientCount: number }> {
    // Verify campaign exists
    const campaign = await campaignRepository.findByIdOrFail(campaignId);
    if (campaign.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Campaign", campaignId);
    }

    // Validate campaign can be sent
    if (campaign.statut === "SENT" || campaign.statut === "CANCELLED") {
      throw new BusinessError("Cette campagne a déjà été envoyée ou annulée");
    }

    if (!campaign.segmentId) {
      throw new BusinessError("La campagne doit avoir un segment cible");
    }

    if (!campaign.body && !campaign.subject) {
      throw new BusinessError("La campagne doit avoir un contenu");
    }

    // Get recipients from segment
    const recipients = await SegmentService.getSegmentClients(
      campaign.segmentId,
      entrepriseId
    );

    if (recipients.length === 0) {
      throw new BusinessError("Aucun destinataire trouvé dans le segment");
    }

    // TODO: Integrate with email service to actually send emails
    // await emailService.sendBulkEmails(recipients, campaign.body);

    // Update campaign status and stats
    const updatedCampaign = await campaignRepository.update(campaignId, {
      statut: "SENT",
      sentAt: new Date(),
      recipientsCount: recipients.length,
      sentCount: recipients.length,
    });

    return {
      campaign: updatedCampaign,
      recipientCount: recipients.length,
    };
  }

  /**
   * Process scheduled campaigns (to be run by a cron job)
   */
  static async processScheduledCampaigns(entrepriseId: string): Promise<number> {
    const scheduledCampaigns = await campaignRepository.findScheduled(entrepriseId);

    let processedCount = 0;

    for (const campaign of scheduledCampaigns) {
      try {
        await this.sendCampaign(campaign.id, entrepriseId);
        processedCount++;
      } catch (error) {
        console.error(`Failed to send campaign ${campaign.id}:`, error);
        // Continue with next campaign
      }
    }

    return processedCount;
  }

  /**
   * Cancel a campaign
   */
  static async cancelCampaign(
    campaignId: string,
    entrepriseId: string
  ): Promise<Campaign> {
    const campaign = await campaignRepository.findByIdOrFail(campaignId);
    if (campaign.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Campaign", campaignId);
    }

    if (campaign.statut === "SENT") {
      throw new BusinessError("Impossible d'annuler une campagne déjà envoyée");
    }

    return campaignRepository.markAsCancelled(campaignId);
  }

  /**
   * Track campaign open (when recipient opens email)
   */
  static async trackCampaignOpen(
    campaignId: string,
    entrepriseId: string
  ): Promise<void> {
    const campaign = await campaignRepository.findByIdOrFail(campaignId);
    if (campaign.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Campaign", campaignId);
    }

    await campaignRepository.incrementOpenCount(campaignId);
  }

  /**
   * Track campaign click (when recipient clicks a link)
   */
  static async trackCampaignClick(
    campaignId: string,
    entrepriseId: string
  ): Promise<void> {
    const campaign = await campaignRepository.findByIdOrFail(campaignId);
    if (campaign.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Campaign", campaignId);
    }

    await campaignRepository.incrementClickCount(campaignId);
  }

  /**
   * Get campaign performance metrics
   */
  static async getCampaignPerformance(
    campaignId: string,
    entrepriseId: string
  ) {
    const campaign = await campaignRepository.findByIdOrFail(campaignId);
    if (campaign.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Campaign", campaignId);
    }

    return campaignRepository.calculatePerformance(campaignId);
  }

  /**
   * Get campaign statistics for dashboard
   */
  static async getCampaignStatistics(entrepriseId: string) {
    return campaignRepository.getStatistics(entrepriseId);
  }

  /**
   * Duplicate a campaign
   */
  static async duplicateCampaign(
    campaignId: string,
    entrepriseId: string,
    newName?: string
  ): Promise<Campaign> {
    const original = await campaignRepository.findByIdOrFail(campaignId);
    if (original.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Campaign", campaignId);
    }

    const duplicateName = newName || `${original.nom} (Copie)`;

    return this.createCampaign({
      entrepriseId,
      nom: duplicateName,
      type: original.type,
      description: original.description || undefined,
      segmentId: original.segmentId || undefined,
      subject: original.subject || undefined,
      body: original.body || undefined,
      statut: "DRAFT",
    });
  }
}
