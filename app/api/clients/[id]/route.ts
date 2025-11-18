import { createResourceByIdRoutes } from "@/lib/api/crud-factory";
import { BusinessError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { clientUpdateSchema } from "@/lib/validation";

export const { GET, PUT, DELETE } = createResourceByIdRoutes({
    modelName: "client",
    resourceName: "Client",
    createSchema: clientUpdateSchema, // Dummy schema (required by type, not used for resource-by-id routes)
    updateSchema: clientUpdateSchema,
    include: {
        niveauFidelite: true,
        documents: {
            orderBy: { createdAt: "desc" },
            take: 10,
        },
    },
    beforeDelete: async (clientId, entrepriseId) => {
        // Check if client has documents
        const hasDocuments = await prisma.document.count({
            where: {
                clientId,
                entrepriseId,
            },
        });

        if (hasDocuments > 0) {
            throw new BusinessError(
                `Impossible de supprimer ce client car ${hasDocuments} document(s) lui sont associés`
            );
        }
    },
});
