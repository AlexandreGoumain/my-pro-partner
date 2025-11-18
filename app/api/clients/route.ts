import { createCrudRoutes } from "@/lib/api/crud-factory";
import { clientCreateSchema, clientUpdateSchema } from "@/lib/validation";

export const { GET, POST } = createCrudRoutes({
  modelName: "client",
  resourceName: "Client",
  createSchema: clientCreateSchema,
  updateSchema: clientUpdateSchema,
  searchFields: ["nom", "email", "ville", "telephone"],
  limitKey: "maxClients",
  include: {
    niveauFidelite: true,
  },
  orderBy: { createdAt: "desc" },
});
