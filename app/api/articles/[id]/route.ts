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
    },

    // Transform data before update to handle null categorieId
    beforeUpdate: async (data) => {
        return {
            ...data,
            categorieId: data.categorieId || null,
        };
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
