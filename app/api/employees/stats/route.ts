import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { getDaysAgo } from "@/lib/utils/date-periods";
import { NextRequest, NextResponse } from "next/server";
import type { StatutEmploye, TypeContrat } from "@/lib/generated/prisma";

export interface DepartmentData {
    department: string;
    count: number;
    averageSalary: number;
}

export interface ContractTypeData {
    type: TypeContrat;
    count: number;
    percentage: number;
}

export interface StatusData {
    status: StatutEmploye;
    count: number;
}

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

export async function GET(_req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const thirtyDaysAgo = getDaysAgo(30);

            // Execute all queries in parallel for better performance
            const [
                total,
                actifs,
                inactifs,
                enConge,
                nouveaux30Jours,
                salaryAggregation,
                departmentAggregation,
                contractAggregation,
                statusAggregation,
            ] = await Promise.all([
                // Total employees
                prisma.employee.count({
                    where: { entrepriseId: ctx.entrepriseId },
                }),

                // Active employees
                prisma.employee.count({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        statut: "ACTIF",
                    },
                }),

                // Inactive employees
                prisma.employee.count({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        statut: "INACTIF",
                    },
                }),

                // Employees on leave
                prisma.employee.count({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        statut: "CONGE",
                    },
                }),

                // New employees in the last 30 days
                prisma.employee.count({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        dateEmbauche: { gte: thirtyDaysAgo },
                    },
                }),

                // Total and average salary
                prisma.employee.aggregate({
                    where: { entrepriseId: ctx.entrepriseId },
                    _sum: {
                        salaireBrut: true,
                    },
                    _avg: {
                        salaireBrut: true,
                    },
                }),

                // Department aggregation
                prisma.employee.groupBy({
                    by: ["departement"],
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        departement: { not: null },
                    },
                    _count: {
                        departement: true,
                    },
                    _avg: {
                        salaireBrut: true,
                    },
                    orderBy: {
                        _count: {
                            departement: "desc",
                        },
                    },
                    take: 10,
                }),

                // Contract type aggregation
                prisma.employee.groupBy({
                    by: ["typeContrat"],
                    where: { entrepriseId: ctx.entrepriseId },
                    _count: {
                        typeContrat: true,
                    },
                }),

                // Status aggregation
                prisma.employee.groupBy({
                    by: ["statut"],
                    where: { entrepriseId: ctx.entrepriseId },
                    _count: {
                        statut: true,
                    },
                }),
            ]);

            const salaireTotal = Number(salaryAggregation._sum.salaireBrut || 0);
            const salaireMoyen = Number(salaryAggregation._avg.salaireBrut || 0);

            // Format departments
            const departements: DepartmentData[] = departmentAggregation.map(
                (item) => ({
                    department: item.departement || "Non défini",
                    count: item._count.departement,
                    averageSalary: Number(item._avg.salaireBrut || 0),
                })
            );

            // Format contract types with percentages
            const contrats: ContractTypeData[] = contractAggregation.map((item) => ({
                type: item.typeContrat,
                count: item._count.typeContrat,
                percentage: total > 0 ? (item._count.typeContrat / total) * 100 : 0,
            }));

            // Format statuses
            const statuts: StatusData[] = statusAggregation.map((item) => ({
                status: item.statut,
                count: item._count.statut,
            }));

            const stats: EmployeesStats = {
                total,
                actifs,
                inactifs,
                enConge,
                nouveaux30Jours,
                salaireTotal,
                salaireMoyen,
                departements,
                contrats,
                statuts,
            };

            return NextResponse.json(stats);
        },
        {
            context: { resourceName: "Employees", operation: "stats" },
        }
    );
}
