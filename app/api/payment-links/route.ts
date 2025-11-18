import { createCrudRoutes } from "@/lib/api/crud-factory";
import { paymentLinkCreateSchema, paymentLinkUpdateSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { ConflictError } from "@/lib/errors";
import { Prisma } from "@prisma/client";

export const { GET, POST } = createCrudRoutes({
  modelName: "paymentLink",
  resourceName: "Lien de paiement",
  createSchema: paymentLinkCreateSchema,
  updateSchema: paymentLinkUpdateSchema,
  searchFields: ["titre", "slug", "description"],
  orderBy: { createdAt: "desc" },

  // Custom filters for active/expired links
  customWhere: (searchParams, _entrepriseId) => {
    const filters: Prisma.PaymentLinkWhereInput = {};

    const actif = searchParams.get("actif");
    if (actif !== null) {
      filters.actif = actif === "true";
    }

    const expired = searchParams.get("expired");
    if (expired === "true") {
      filters.dateExpiration = { lt: new Date() };
    } else if (expired === "false") {
      filters.OR = [
        { dateExpiration: null },
        { dateExpiration: { gte: new Date() } },
      ];
    }

    return filters;
  },

  // Validate unique slug before creating
  beforeCreate: async (data, _entrepriseId) => {
    const existingLink = await prisma.paymentLink.findUnique({
      where: { slug: data.slug },
    });

    if (existingLink) {
      throw new ConflictError(`Un lien de paiement avec le slug ${data.slug} existe déjà`);
    }

    // Convert dateExpiration string to Date if provided
    if (data.dateExpiration) {
      data.dateExpiration = new Date(data.dateExpiration);
    }

    // Initialize quantitePaye
    data.quantitePaye = 0;

    return data;
  },
});
