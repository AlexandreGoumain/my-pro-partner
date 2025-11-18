import { createCrudRoutes } from "@/lib/api/crud-factory";
import { prisma } from "@/lib/prisma";
import { ConflictError } from "@/lib/errors";
import { SegmentService } from "@/lib/services/segment.service";
import { z } from "zod";
import { TypeSegment } from "@/lib/generated/prisma";

// Validation schema
const segmentCreateSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  type: z.nativeEnum(TypeSegment).default("CUSTOM"),
  icone: z.string().optional(),
  couleur: z.string().optional(),
  criteres: z.union([z.record(z.unknown()), z.array(z.unknown())]).default({}),
  actif: z.boolean().default(true),
});

const segmentUpdateSchema = segmentCreateSchema.partial();

export const { GET, POST } = createCrudRoutes({
  modelName: "segment",
  resourceName: "Segment",
  createSchema: segmentCreateSchema,
  updateSchema: segmentUpdateSchema,
  searchFields: ["nom", "description"],
  orderBy: [{ type: "asc" }, { createdAt: "desc" }],

  // Custom filters
  customWhere: (searchParams) => {
    const filters: Record<string, unknown> = {};

    const type = searchParams.get("type");
    if (type) {
      filters.type = type as TypeSegment;
    }

    const actif = searchParams.get("actif");
    if (actif !== null) {
      filters.actif = actif === "true";
    }

    return filters;
  },

  // Validate feature access and name uniqueness before creation
  beforeCreate: async (data, entrepriseId) => {
    // Check if segment name already exists
    const existing = await prisma.segment.findUnique({
      where: {
        entrepriseId_nom: {
          entrepriseId,
          nom: data.nom,
        },
      },
    });

    if (existing) {
      throw new ConflictError("Un segment avec ce nom existe déjà");
    }

    return {
      ...data,
      nombreClients: 0, // Will be calculated after creation
      derniereCalcul: new Date(),
    };
  },

  // Calculate initial client count after creation
  afterCreate: async (segment, entrepriseId) => {
    await SegmentService.refreshSegmentCount(segment.id, entrepriseId);
  },
});

// Note: Feature access check for "canSegmentClients" should be done at the frontend level
// or you can add a custom validation in beforeCreate
