import { createResourceByIdRoutes } from "@/lib/api/crud-factory";
import { employeeUpdateSchema } from "@/lib/validation";

export const { GET, PUT, DELETE } = createResourceByIdRoutes({
    modelName: "employee",
    resourceName: "Employé",
    createSchema: employeeUpdateSchema, // Dummy schema (required by type, not used for resource-by-id routes)
    updateSchema: employeeUpdateSchema,
});
