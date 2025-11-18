import { createResourceByIdRoutes } from "@/lib/api/crud-factory";
import { prisma } from "@/lib/prisma";
import { BusinessError } from "@/lib/errors";
import { z } from "zod";

// Validation schema
const campaignUpdateSchema = z.object({
  nom: z.string().min(1).optional(),
  description: z.string().optional(),
  type: z.enum(["EMAIL", "SMS", "NOTIFICATION"]).optional(),
  segmentId: z.string().optional().nullable(),
  subject: z.string().optional(),
  body: z.string().optional(),
  contenu: z.record(z.unknown()).optional(),
  scheduledAt: z.string().datetime().optional(),
  statut: z
    .enum(["DRAFT", "SCHEDULED", "SENDING", "SENT", "CANCELLED"])
    .optional(),
});

// Dummy create schema (required by type, but not used for resource-by-id routes)
const campaignCreateSchema = campaignUpdateSchema;

export const { GET, PUT, DELETE } = createResourceByIdRoutes({
  modelName: "campaign",
  resourceName: "Campagne",
  createSchema: campaignCreateSchema,
  updateSchema: campaignUpdateSchema,
  include: {
    segment: {
      select: {
        id: true,
        nom: true,
        nombreClients: true,
      },
    },
  },

  // Validate before update
  beforeUpdate: async (data, campaignId) => {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    // Cannot edit campaigns that are already sent
    if (campaign?.statut === "SENT") {
      throw new BusinessError("Impossible de modifier une campagne déjà envoyée");
    }

    const { scheduledAt, ...restData } = data;

    return {
      ...restData,
      ...(scheduledAt && { datePlanifiee: new Date(scheduledAt) }),
    };
  },

  // Validate before deletion
  beforeDelete: async (campaignId) => {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    // Cannot delete campaigns that are sending or sent
    if (
      campaign?.statut === "SENDING" ||
      campaign?.statut === "SENT"
    ) {
      throw new BusinessError("Impossible de supprimer une campagne en cours ou envoyée");
    }
  },
});

// Use PUT as PATCH for campaigns
export { PUT as PATCH };
