import { createResourceByIdRoutes } from "@/lib/api/crud-factory";
import { ConflictError, ForbiddenError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { SegmentService } from "@/lib/services/segment.service";
import { z } from "zod";

// Validation schema
const segmentUpdateSchema = z.object({
    nom: z.string().min(1).optional(),
    description: z.string().optional(),
    icone: z.string().optional(),
    couleur: z.string().optional(),
    criteres: z.union([z.record(z.unknown()), z.array(z.unknown())]).optional(),
    actif: z.boolean().optional(),
});

export const { GET, PUT, DELETE } = createResourceByIdRoutes({
    modelName: "segment",
    resourceName: "Segment",
    createSchema: segmentUpdateSchema, // Dummy schema (required by type, not used for resource-by-id routes)
    updateSchema: segmentUpdateSchema,

    // Validate before update
    beforeUpdate: async (data, segmentId, entrepriseId) => {
        // Get existing segment
        const existingSegment = await prisma.segment.findUnique({
            where: { id: segmentId },
        });

        if (!existingSegment) {
            return data;
        }

        // Don't allow editing predefined segments
        if (existingSegment.type === "PREDEFINED") {
            throw new ForbiddenError(
                "Les segments prédéfinis ne peuvent pas être modifiés"
            );
        }

        // If name is being changed, check uniqueness
        if (data.nom && data.nom !== existingSegment.nom) {
            const duplicate = await prisma.segment.findUnique({
                where: {
                    entrepriseId_nom: {
                        entrepriseId,
                        nom: data.nom,
                    },
                },
            });

            if (duplicate) {
                throw new ConflictError("Un segment avec ce nom existe déjà");
            }
        }

        // Add timestamp if criteria changed
        if (data.criteres) {
            return {
                ...data,
                derniereCalcul: new Date(),
            };
        }

        return data;
    },

    // Recalculate client count after update if criteria changed
    afterUpdate: async (segment, entrepriseId) => {
        await SegmentService.refreshSegmentCount(segment.id, entrepriseId);
    },

    // Validate before deletion
    beforeDelete: async (segmentId, _entrepriseId) => {
        const segment = await prisma.segment.findUnique({
            where: { id: segmentId },
        });

        if (segment?.type === "PREDEFINED") {
            throw new ForbiddenError(
                "Les segments prédéfinis ne peuvent pas être supprimés"
            );
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
    },
});

// Use PUT as PATCH for segments
export { PUT as PATCH };
