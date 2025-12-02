import { prisma } from "@/lib/prisma";
import { segmentRepository, clientRepository } from "@/lib/repositories";
import { ConflictError, NotFoundError } from "@/lib/errors";
import type { Segment, Client } from "@/lib/generated/prisma";

/**
 * Options for creating a segment
 */
export interface CreateSegmentOptions {
  entrepriseId: string;
  nom: string;
  description?: string;
  criteres: Record<string, unknown>;
  actif?: boolean;
}

/**
 * Options for updating a segment
 */
export interface UpdateSegmentOptions {
  nom?: string;
  description?: string;
  criteres?: Record<string, unknown>;
  actif?: boolean;
}

/**
 * Segment Service
 * Handles all business logic related to customer segmentation
 */
export class SegmentService {
  /**
   * Create a new segment
   * Validates name uniqueness and calculates initial client count
   */
  static async createSegment(options: CreateSegmentOptions): Promise<Segment> {
    const { entrepriseId, nom, ...data } = options;

    // Check name uniqueness
    const existing = await segmentRepository.findByName(nom, entrepriseId);
    if (existing) {
      throw new ConflictError(`Un segment avec le nom "${nom}" existe déjà`);
    }

    // Create segment
    const segment = await segmentRepository.create({
      ...data,
      nom,
      entrepriseId,
      nombreClients: 0,
      actif: options.actif !== undefined ? options.actif : true,
    });

    // Calculate and update client count
    await this.refreshSegmentCount(segment.id, entrepriseId);

    return segment;
  }

  /**
   * Update a segment
   * Validates name uniqueness and recalculates client count if criteria changed
   */
  static async updateSegment(
    segmentId: string,
    entrepriseId: string,
    options: UpdateSegmentOptions
  ): Promise<Segment> {
    // Verify segment exists and belongs to entreprise
    const existingSegment = await segmentRepository.findByIdOrFail(segmentId);
    if (existingSegment.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Segment", segmentId);
    }

    // Check name uniqueness if changing name
    if (options.nom && options.nom !== existingSegment.nom) {
      const nameTaken = await segmentRepository.findByName(options.nom, entrepriseId);
      if (nameTaken) {
        throw new ConflictError(`Un segment avec le nom "${options.nom}" existe déjà`);
      }
    }

    // Update segment
    const updated = await segmentRepository.update(segmentId, options as Record<string, unknown>);

    // Recalculate client count if criteria changed
    if (options.criteres) {
      await this.refreshSegmentCount(segmentId, entrepriseId);
    }

    return updated;
  }

  /**
   * Delete a segment
   */
  static async deleteSegment(
    segmentId: string,
    entrepriseId: string
  ): Promise<void> {
    // Verify segment exists and belongs to entreprise
    const segment = await segmentRepository.findByIdOrFail(segmentId);
    if (segment.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Segment", segmentId);
    }

    // Check if segment is used in campaigns
    const campaignCount = await prisma.campaign.count({
      where: { segmentId },
    });

    if (campaignCount > 0) {
      throw new ConflictError(
        `Impossible de supprimer ce segment car ${campaignCount} campagne(s) l'utilisent`
      );
    }

    await segmentRepository.delete(segmentId);
  }

  /**
   * Get clients matching a segment's criteria
   */
  static async getSegmentClients(
    segmentId: string,
    entrepriseId: string
  ): Promise<Client[]> {
    // Verify segment exists
    const segment = await segmentRepository.findByIdOrFail(segmentId);
    if (segment.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Segment", segmentId);
    }

    // Get all clients for entreprise
    const allClients = await clientRepository.findByEntreprise(entrepriseId);

    // Apply segment criteria
    return this.applySegmentCriteria(allClients.items, segment.criteres as Record<string, unknown>);
  }

  /**
   * Refresh the client count for a segment
   */
  static async refreshSegmentCount(
    segmentId: string,
    entrepriseId: string
  ): Promise<number> {
    const clients = await this.getSegmentClients(segmentId, entrepriseId);
    const count = clients.length;

    await segmentRepository.updateClientCount(segmentId, count);

    return count;
  }

  /**
   * Refresh counts for all segments of an entreprise
   */
  static async refreshAllSegmentCounts(entrepriseId: string): Promise<void> {
    const segments = await segmentRepository.findByEntreprise(entrepriseId);

    await Promise.all(
      segments.items.map((segment) =>
        this.refreshSegmentCount(segment.id, entrepriseId)
      )
    );
  }

  /**
   * Apply segment criteria to filter clients
   * This is a simplified version - can be enhanced based on criteria structure
   */
  private static applySegmentCriteria(
    clients: Client[],
    criteres: Record<string, unknown>
  ): Client[]  {
    if (!criteres || typeof criteres !== "object") {
      return clients;
    }

    return clients.filter((client) => {
      // Example criteria evaluation
      // This should be customized based on your actual criteria structure

      // Points range
      if (criteres.pointsMin !== undefined || criteres.pointsMax !== undefined) {
        const points = client.points_solde || 0;
        const minPoints = criteres.pointsMin as number | undefined;
        const maxPoints = criteres.pointsMax as number | undefined;
        if (minPoints !== undefined && minPoints !== null && points < minPoints) {
          return false;
        }
        if (maxPoints !== undefined && maxPoints !== null && points > maxPoints) {
          return false;
        }
      }

      // Loyalty level
      if (criteres.niveauFideliteId && client.niveauFideliteId !== criteres.niveauFideliteId) {
        return false;
      }

      // Active status (Client doesn't have actif field, use email presence as proxy for active)
      if (criteres.actif !== undefined) {
        // Skip this criteria as Client model doesn't have 'actif' field
      }

      // City
      if (criteres.ville && client.ville !== criteres.ville) {
        return false;
      }

      // Country
      if (criteres.pays && client.pays !== criteres.pays) {
        return false;
      }

      return true;
    });
  }

  /**
   * Test segment criteria against sample data
   * Useful for previewing segment before creation
   */
  static async previewSegment(
    entrepriseId: string,
    criteres: Record<string, unknown>
  ): Promise<{ matchingCount: number; totalClients: number; percentage: number }> {
    const allClients = await clientRepository.findByEntreprise(entrepriseId);
    const matchingClients = this.applySegmentCriteria(allClients.items, criteres);

    const total = allClients.total;
    const matching = matchingClients.length;
    const percentage = total > 0 ? (matching / total) * 100 : 0;

    return {
      matchingCount: matching,
      totalClients: total,
      percentage: Math.round(percentage * 100) / 100,
    };
  }

  /**
   * Activate a segment
   */
  static async activateSegment(
    segmentId: string,
    entrepriseId: string
  ): Promise<Segment> {
    const segment = await segmentRepository.findByIdOrFail(segmentId);
    if (segment.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Segment", segmentId);
    }

    return segmentRepository.activate(segmentId);
  }

  /**
   * Deactivate a segment
   */
  static async deactivateSegment(
    segmentId: string,
    entrepriseId: string
  ): Promise<Segment> {
    const segment = await segmentRepository.findByIdOrFail(segmentId);
    if (segment.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Segment", segmentId);
    }

    return segmentRepository.deactivate(segmentId);
  }

  /**
   * Get segment statistics
   */
  static async getSegmentStatistics(entrepriseId: string) {
    const [totalSegments, activeSegments] = await Promise.all([
      segmentRepository.count({ entrepriseId }),
      segmentRepository.countActiveByEntreprise(entrepriseId),
    ]);

    return {
      total: totalSegments,
      active: activeSegments,
      inactive: totalSegments - activeSegments,
    };
  }
}
