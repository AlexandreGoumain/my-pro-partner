import { createResourceByIdRoutes } from "@/lib/api/crud-factory";
import { BusinessError, ConflictError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { niveauFideliteUpdateSchema } from "@/lib/validation";

/**
 * Recalculate loyalty levels order based on points threshold
 */
async function recalculateOrdres(entrepriseId: string) {
    const niveaux = await prisma.niveauFidelite.findMany({
        where: { entrepriseId },
        orderBy: { seuilPoints: "asc" },
    });

    const updatePromises = niveaux.map((niveau, index) =>
        prisma.niveauFidelite.update({
            where: { id: niveau.id },
            data: { ordre: index + 1 },
        })
    );

    await Promise.all(updatePromises);
}

export const { GET, PUT, DELETE } = createResourceByIdRoutes({
    modelName: "niveauFidelite",
    resourceName: "Niveau de fidélité",
    createSchema: niveauFideliteUpdateSchema, // Dummy schema (required by type, not used for resource-by-id routes)
    updateSchema: niveauFideliteUpdateSchema,

    // Validate name uniqueness before update
    beforeUpdate: async (data, niveauId, entrepriseId) => {
        if (data.nom) {
            const existingNom = await prisma.niveauFidelite.findFirst({
                where: {
                    entrepriseId,
                    nom: data.nom,
                    id: { not: niveauId },
                },
            });

            if (existingNom) {
                throw new ConflictError("Un niveau avec ce nom existe déjà");
            }
        }

        return data;
    },

    // Recalculate orders after update if threshold changed
    afterUpdate: async (niveau, entrepriseId) => {
        // If seuilPoints was updated, recalculate all orders
        await recalculateOrdres(entrepriseId);
    },

    // Check if clients use this level before deletion
    beforeDelete: async (niveauId, entrepriseId) => {
        const clientsCount = await prisma.client.count({
            where: {
                niveauFideliteId: niveauId,
                entrepriseId,
            },
        });

        if (clientsCount > 0) {
            throw new BusinessError(
                `Impossible de supprimer ce niveau : ${clientsCount} client(s) l'utilisent actuellement`
            );
        }
    },

    // Recalculate orders after deletion
    afterDelete: async (niveauId, entrepriseId) => {
        await recalculateOrdres(entrepriseId);
    },
});
