import { createCrudRoutes } from "@/lib/api/crud-factory";
import { storeCreateSchema, storeUpdateSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { ConflictError } from "@/lib/errors";

export const { GET, POST } = createCrudRoutes({
  modelName: "store",
  resourceName: "Magasin",
  createSchema: storeCreateSchema,
  updateSchema: storeUpdateSchema,
  searchFields: ["nom", "code", "ville"],
  include: {
    registers: true,
    _count: {
      select: { documents: true, stockItems: true },
    },
  },
  orderBy: [{ isMainStore: "desc" }, { createdAt: "asc" }],

  // Validate unique code before creating
  beforeCreate: async (data, entrepriseId) => {
    const existingStore = await prisma.store.findFirst({
      where: {
        code: data.code,
        entrepriseId,
      },
    });

    if (existingStore) {
      throw new ConflictError(`Un magasin avec le code ${data.code} existe déjà`);
    }

    return data;
  },
});
