import type { Employee as PrismaEmployee } from "@/lib/generated/prisma";
import { createResourceHooks } from "@/lib/hooks/create-resource-hooks";
import type { EmployeeCreateInput, EmployeeUpdateInput } from "@/lib/validation";

// Re-export Prisma Employee type for consistency
export type Employee = PrismaEmployee;

// Department data for statistics
export interface DepartmentData {
    department: string;
    count: number;
    averageSalary: number;
}

// Contract type data for statistics
export interface ContractTypeData {
    type: string;
    count: number;
    percentage: number;
}

// Status data for statistics
export interface StatusData {
    status: string;
    count: number;
}

// Employee statistics type definition
export interface EmployeesStats {
    total: number;
    actifs: number;
    inactifs: number;
    enConge: number;
    nouveaux30Jours: number;
    salaireTotal: number;
    salaireMoyen: number;
    departements: DepartmentData[];
    contrats: ContractTypeData[];
    statuts: StatusData[];
}

// Create base hooks using factory
const employeeHooks = createResourceHooks<Employee>({
    resourceName: "employees",
    endpoint: "/api/employees",
});

// Export query keys
export const employeeKeys = employeeHooks.keys;

// Export base hooks from factory
export const useEmployees = employeeHooks.useList;
export const useEmployeesPaginated = employeeHooks.useListPaginated;
export const useEmployee = employeeHooks.useDetail;
export const useEmployeesStats = () => employeeHooks.useStats<EmployeesStats>();
export const useCreateEmployee = () => employeeHooks.useCreate<EmployeeCreateInput>();
export const useUpdateEmployee = () => employeeHooks.useUpdate<EmployeeUpdateInput>();
export const useDeleteEmployee = employeeHooks.useDelete;
