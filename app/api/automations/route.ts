import { createCrudRoutes } from "@/lib/api/crud-factory";
import { automationCreateSchema, automationUpdateSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { ForbiddenError } from "@/lib/errors";

export const { GET, POST } = createCrudRoutes({
  modelName: "automation",
  resourceName: "Automation",
  createSchema: automationCreateSchema,
  updateSchema: automationUpdateSchema,
  searchFields: ["nom", "description"],
  include: {
    _count: {
      select: { executions: true },
    },
  },
  orderBy: { createdAt: "desc" },

  // Check if user's plan allows automations (PRO+ only)
  beforeCreate: async (data, entrepriseId) => {
    // Fetch entreprise to check plan
    const entreprise = await prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: { plan: true },
    });

    if (!entreprise) {
      throw new ForbiddenError("Entreprise non trouvée");
    }

    // Check if plan has automated reminders feature
    const hasFeature = ["PRO", "ENTERPRISE"].includes(entreprise.plan);
    if (!hasFeature) {
      throw new ForbiddenError(
        "Les automations ne sont disponibles qu'à partir du plan PRO"
      );
    }

    // Cast JSON fields properly
    return {
      ...data,
      triggerConfig: data.triggerConfig || {},
      actionConfig: data.actionConfig || {},
    };
  },
});
