import { createCrudRoutes } from "@/lib/api/crud-factory";
import { categorieCreateSchema, categorieUpdateSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ForbiddenError, BusinessError } from "@/lib/errors";

export const { GET, POST } = createCrudRoutes({
  modelName: "categorie",
  resourceName: "Catégorie",
  createSchema: categorieCreateSchema,
  updateSchema: categorieUpdateSchema,
  searchFields: ["nom", "description"],
  include: {
    enfants: true,
    parent: true,
    articles: {
      where: { actif: true },
      select: { id: true },
    },
  },
  orderBy: { ordre: "asc" },

  // Validate parent category before creation
  beforeCreate: async (data, entrepriseId) => {
    // If there's a parent category, validate it
    if (data.parentId) {
      const parentCategorie = await prisma.categorie.findUnique({
        where: { id: data.parentId },
        select: { parentId: true, entrepriseId: true },
      });

      if (!parentCategorie) {
        throw new NotFoundError("Catégorie parente", data.parentId);
      }

      if (parentCategorie.entrepriseId !== entrepriseId) {
        throw new ForbiddenError("Cette catégorie parente n'appartient pas à votre entreprise");
      }

      // Limit hierarchy to 2 levels (no sub-sub-categories)
      if (parentCategorie.parentId) {
        throw new BusinessError(
          "Impossible de créer une sous-sous-catégorie. La hiérarchie est limitée à 2 niveaux (catégorie et sous-catégorie)."
        );
      }
    }

    return {
      nom: data.nom,
      description: data.description || null,
      parentId: data.parentId || null,
      ordre: data.ordre,
    };
  },
});
