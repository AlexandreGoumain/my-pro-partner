import { createCrudRoutes } from "@/lib/api/crud-factory";
import { employeeCreateSchema, employeeUpdateSchema } from "@/lib/validation";

export const { GET, POST } = createCrudRoutes({
    modelName: "employee",
    resourceName: "Employé",
    createSchema: employeeCreateSchema,
    updateSchema: employeeUpdateSchema,
    searchFields: ["nom", "prenom", "email", "poste", "departement"],
    limitKey: "maxEmployees",
    orderBy: { dateEmbauche: "desc" },
});
