import { createCrudRoutes } from "@/lib/api/crud-factory";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ConflictError } from "@/lib/errors";
import { z } from "zod";

// Validation schema
const campaignCreateSchema = z.object({
  nom: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["EMAIL", "SMS", "NOTIFICATION"]).default("EMAIL"),
  segmentId: z.string().optional(),
  subject: z.string().optional(),
  body: z.string().optional(),
  contenu: z.record(z.unknown()).optional(),
  scheduledAt: z.string().datetime().optional(),
});

const campaignUpdateSchema = campaignCreateSchema.partial();

export const { GET, POST } = createCrudRoutes({
  modelName: "campaign",
  resourceName: "Campagne",
  createSchema: campaignCreateSchema,
  updateSchema: campaignUpdateSchema,
  searchFields: ["nom", "description"],
  include: {
    segment: {
      select: {
        id: true,
        nom: true,
        nombreClients: true,
      },
    },
  },
  orderBy: { dateCreation: "desc" },

  // Custom filters
  customWhere: (searchParams) => {
    const filters: { statut?: string; type?: string } = {};

    const statut = searchParams.get("statut");
    if (statut) {
      filters.statut = statut;
    }

    const type = searchParams.get("type");
    if (type) {
      filters.type = type;
    }

    return filters;
  },

  // Validate segment before creation
  beforeCreate: async (data, entrepriseId) => {
    const { segmentId, scheduledAt, ...restData } = data;

    // Check if campaign name already exists
    const existing = await prisma.campaign.findFirst({
      where: {
        entrepriseId,
        nom: data.nom,
      },
    });

    if (existing) {
      throw new ConflictError("Une campagne avec ce nom existe déjà");
    }

    // Validate segment if provided
    if (segmentId) {
      const segment = await prisma.segment.findUnique({
        where: { id: segmentId },
      });

      if (!segment || segment.entrepriseId !== entrepriseId) {
        throw new NotFoundError("Segment", segmentId);
      }
    }

    return {
      ...restData,
      segmentId: segmentId || null,
      datePlanifiee: scheduledAt ? new Date(scheduledAt) : null,
      dateCreation: new Date(),
      statut: "DRAFT",
      nombreEnvois: 0,
      nombreOuvertures: 0,
      nombreClics: 0,
    };
  },
});

// Note: Feature access check for "canCreateCampaigns" should be done at the frontend level
// or add custom validation in beforeCreate
