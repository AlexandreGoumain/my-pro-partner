import { createResourceByIdRoutes } from "@/lib/api/crud-factory";
import { BusinessError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { articleUpdateSchema } from "@/lib/validation";

export const { GET, PUT, DELETE } = createResourceByIdRoutes({
    modelName: "article",
    resourceName: "Article",
    createSchema: articleUpdateSchema, // Dummy schema (required by type, not used for resource-by-id routes)
    updateSchema: articleUpdateSchema,
    include: {
        categorie: true,
        rachat: true,
    },

    // Transform data before update to handle null categorieId and service stock management
    beforeUpdate: async (data: any) => {
        // Si on change le type en SERVICE, désactiver la gestion de stock
        const updates: Record<string, unknown> = {
            ...data,
            categorieId: data.categorieId || null,
        };

        if (data.type === "SERVICE") {
            updates.gestion_stock = false;
            updates.stock_actuel = 0;
            updates.stock_min = 0;
        }

        // Remove occasion-specific fields from update data
        // These fields are on the RachatArticle relation, not Article
        delete updates.etat;
        delete updates.provenance;
        delete updates.prixRachat;
        delete updates.dureeGarantie;
        delete updates.numeroSerie;
        delete updates.dateRachat;
        delete updates.notesRachat;

        return updates;
    },

    // Check if article is used in documents before deletion
    beforeDelete: async (articleId, _entrepriseId) => {
        const usageCount = await prisma.ligneDocument.count({
            where: { articleId },
        });

        if (usageCount > 0) {
            throw new BusinessError(
                `Impossible de supprimer cet article car il est utilisé dans ${usageCount} document(s)`
            );
        }
    },
});
