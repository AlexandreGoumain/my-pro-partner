import { createCrudRoutes } from "@/lib/api/crud-factory";
import { terminalCreateSchema, terminalUpdateSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { ConflictError } from "@/lib/errors";

export const { GET, POST } = createCrudRoutes({
  modelName: "terminal",
  resourceName: "Terminal",
  createSchema: terminalCreateSchema,
  updateSchema: terminalUpdateSchema,
  searchFields: ["label", "location", "stripeTerminalId"],
  orderBy: { createdAt: "desc" },

  // Validate unique Stripe Terminal ID before creating
  beforeCreate: async (data, _entrepriseId) => {
    const existingTerminal = await prisma.terminal.findUnique({
      where: { stripeTerminalId: data.stripeTerminalId },
    });

    if (existingTerminal) {
      throw new ConflictError(
        `Un terminal avec l'ID Stripe ${data.stripeTerminalId} existe déjà`
      );
    }

    return data;
  },
});
