import { createCrudRoutes } from "@/lib/api/crud-factory";
import { niveauFideliteCreateSchema, niveauFideliteUpdateSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { ConflictError } from "@/lib/errors";

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

export const { GET, POST } = createCrudRoutes({
  modelName: "niveauFidelite",
  resourceName: "Niveau de fidélité",
  createSchema: niveauFideliteCreateSchema,
  updateSchema: niveauFideliteUpdateSchema,
  searchFields: ["nom", "description"],
  orderBy: { ordre: "asc" },

  // Custom filters
  customWhere: (searchParams) => {
    const filters: Record<string, unknown> = {};

    const actifOnly = searchParams.get("actifOnly");
    if (actifOnly === "true") {
      filters.actif = true;
    }

    return filters;
  },

  // Validate name uniqueness before creation
  beforeCreate: async (data, entrepriseId) => {
    const existingNom = await prisma.niveauFidelite.findFirst({
      where: {
        entrepriseId,
        nom: data.nom,
      },
    });

    if (existingNom) {
      throw new ConflictError("Un niveau avec ce nom existe déjà");
    }

    return {
      ...data,
      ordre: 0, // Temporary, will be recalculated
    };
  },

  // Recalculate orders after creation
  afterCreate: async (niveau, entrepriseId) => {
    await recalculateOrdres(entrepriseId);
  },
});
