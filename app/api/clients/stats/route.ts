import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { getDaysAgo, calculatePercentageChange } from "@/lib/utils/date-periods";
import { NextRequest, NextResponse } from "next/server";

export interface MonthlyData {
    month: string;
    count: number;
}

export interface CityData {
    city: string;
    count: number;
}

export interface DataQuality {
    withEmail: number;
    withPhone: number;
    withBoth: number;
    withLocation: number;
}

export interface ClientsStats {
    total: number;
    inactive: number;
    active: number;
    complete: number;
    completionRate: number;
    currentMonth: number;
    lastMonth: number;
    growth: number;
    monthlyEvolution: MonthlyData[];
    topCities: CityData[];
    dataQuality: DataQuality;
}

/**
 * GET /api/clients/stats
 * Get clients statistics
 */
export async function GET(_req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const now = new Date();
            const thirtyDaysAgo = getDaysAgo(30);
            const ninetyDaysAgo = getDaysAgo(90);

            // Dates for current and last month
            const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

            // Execute all queries in parallel for better performance
            const [
                total,
                inactive,
                active,
                complete,
                withEmail,
                withPhone,
                withBoth,
                withLocation,
                currentMonth,
                lastMonth,
                cityAggregation,
            ] = await Promise.all([
                prisma.client.count({
                    where: { entrepriseId: ctx.entrepriseId },
                }),
                prisma.client.count({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        updatedAt: { lt: ninetyDaysAgo },
                    },
                }),
                prisma.client.count({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        updatedAt: { gte: thirtyDaysAgo },
                    },
                }),
                prisma.client.count({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        email: { not: null },
                        telephone: { not: null },
                        adresse: { not: null },
                    },
                }),
                prisma.client.count({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        email: { not: null },
                    },
                }),
                prisma.client.count({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        telephone: { not: null },
                    },
                }),
                prisma.client.count({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        email: { not: null },
                        telephone: { not: null },
                    },
                }),
                prisma.client.count({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        ville: { not: null },
                    },
                }),
                prisma.client.count({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        createdAt: { gte: currentMonthStart },
                    },
                }),
                prisma.client.count({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
                    },
                }),
                prisma.client.groupBy({
                    by: ['ville'],
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        ville: { not: null },
                    },
                    _count: {
                        ville: true,
                    },
                    orderBy: {
                        _count: {
                            ville: 'desc',
                        },
                    },
                    take: 5,
                }),
            ]);

            const completionRate = total > 0 ? (complete / total) * 100 : 0;
            const growth = calculatePercentageChange(currentMonth, lastMonth);

            const topCities: CityData[] = cityAggregation.map(item => ({
                city: item.ville || '',
                count: item._count.ville,
            }));

            const dataQuality: DataQuality = {
                withEmail,
                withPhone,
                withBoth,
                withLocation,
            };

            // Calculate monthly evolution over the last 6 months
            const monthlyEvolution: MonthlyData[] = [];
            const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jui", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];

            for (let i = 5; i >= 0; i--) {
                const date = new Date(now);
                date.setMonth(date.getMonth() - i);
                const year = date.getFullYear();
                const month = date.getMonth();
                const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);

                const count = await prisma.client.count({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        createdAt: { lte: monthEnd },
                    },
                });

                monthlyEvolution.push({
                    month: monthNames[month],
                    count,
                });
            }

            const stats: ClientsStats = {
                total,
                inactive,
                active,
                complete,
                completionRate,
                currentMonth,
                lastMonth,
                growth,
                monthlyEvolution,
                topCities,
                dataQuality,
            };

            return NextResponse.json(stats);
        },
        {
            context: { resourceName: "Client", operation: "stats" },
        }
    );
}
