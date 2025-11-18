import { createResourceByIdRoutes } from "@/lib/api/crud-factory";
import { BusinessError, ForbiddenError, NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { categorieUpdateSchema } from "@/lib/validation";

export const { GET, PUT, DELETE } = createResourceByIdRoutes({
    modelName: "categorie",
    resourceName: "Catégorie",
    createSchema: categorieUpdateSchema, // Dummy schema (required by type, not used for resource-by-id routes)
    updateSchema: categorieUpdateSchema,
    include: {
        parent: true,
        enfants: true,
        articles: {
            where: { actif: true },
            select: { id: true, nom: true, reference: true },
        },
    },

    // Validate parent category before update
    beforeUpdate: async (data, categorieId, entrepriseId) => {
        // If updating parentId, validate the new parent
        if (data.parentId) {
            const parentCategorie = await prisma.categorie.findUnique({
                where: { id: data.parentId },
                include: { parent: true },
            });

            if (!parentCategorie) {
                throw new NotFoundError("Catégorie parente", data.parentId);
            }

            if (parentCategorie.entrepriseId !== entrepriseId) {
                throw new ForbiddenError(
                    "Cette catégorie parente n'appartient pas à votre entreprise"
                );
            }

            // Category cannot be its own parent
            if (data.parentId === categorieId) {
                throw new BusinessError(
                    "Une catégorie ne peut pas être son propre parent"
                );
            }

            // Prevent circular references (parent's parent cannot be the category itself)
            if (parentCategorie?.parentId === categorieId) {
                throw new BusinessError(
                    "Cette opération créerait une boucle de catégories"
                );
            }

            // Limit hierarchy to 2 levels
            if (parentCategorie.parentId) {
                throw new BusinessError(
                    "Impossible de créer une sous-sous-catégorie. La hiérarchie est limitée à 2 niveaux (catégorie et sous-catégorie)."
                );
            }
        }

        return data;
    },

    // Check for children and articles before deletion
    beforeDelete: async (categorieId, _entrepriseId) => {
        const categorie = await prisma.categorie.findUnique({
            where: { id: categorieId },
            include: {
                enfants: true,
                articles: true,
            },
        });

        if (!categorie) {
            throw new NotFoundError("Catégorie", categorieId);
        }

        if (categorie.enfants.length > 0) {
            throw new BusinessError(
                `Impossible de supprimer cette catégorie car elle contient ${categorie.enfants.length} sous-catégorie(s)`
            );
        }

        if (categorie.articles.length > 0) {
            throw new BusinessError(
                `Impossible de supprimer cette catégorie car elle contient ${categorie.articles.length} article(s)`
            );
        }
    },
});

// PATCH is the same as PUT for categories
export { PUT as PATCH };
