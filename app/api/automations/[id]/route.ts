import { createResourceByIdRoutes } from "@/lib/api/crud-factory";
import { automationCreateSchema, automationUpdateSchema } from "@/lib/validation";

export const { GET, PUT, DELETE } = createResourceByIdRoutes({
  modelName: "automation",
  resourceName: "Automation",
  createSchema: automationCreateSchema, // Dummy schema (required by type)
  updateSchema: automationUpdateSchema,
  include: {
    _count: {
      select: { executions: true },
    },
  },
});

// PATCH is the same as PUT
export { PUT as PATCH };
