import { prisma } from "@/lib/prisma";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
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

export async function GET(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

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
            // Total clients
            prisma.client.count({
                where: { entrepriseId },
            }),

            // Inactive clients (>90 days)
            prisma.client.count({
                where: {
                    entrepriseId,
                    updatedAt: { lt: ninetyDaysAgo },
                },
            }),

            // Active clients (<=30 days)
            prisma.client.count({
                where: {
                    entrepriseId,
                    updatedAt: { gte: thirtyDaysAgo },
                },
            }),

            // Complete clients (email + telephone + adresse)
            prisma.client.count({
                where: {
                    entrepriseId,
                    email: { not: null },
                    telephone: { not: null },
                    adresse: { not: null },
                },
            }),

            // Clients with email
            prisma.client.count({
                where: {
                    entrepriseId,
                    email: { not: null },
                },
            }),

            // Clients with phone
            prisma.client.count({
                where: {
                    entrepriseId,
                    telephone: { not: null },
                },
            }),

            // Clients with both email and phone
            prisma.client.count({
                where: {
                    entrepriseId,
                    email: { not: null },
                    telephone: { not: null },
                },
            }),

            // Clients with location
            prisma.client.count({
                where: {
                    entrepriseId,
                    ville: { not: null },
                },
            }),

            // Clients created this month
            prisma.client.count({
                where: {
                    entrepriseId,
                    createdAt: { gte: currentMonthStart },
                },
            }),

            // Clients created last month
            prisma.client.count({
                where: {
                    entrepriseId,
                    createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
                },
            }),

            // City aggregation for top cities
            prisma.client.groupBy({
                by: ['ville'],
                where: {
                    entrepriseId,
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
        const growth = lastMonth > 0 ? ((currentMonth - lastMonth) / lastMonth) * 100 : currentMonth > 0 ? 100 : 0;

        // Format top cities
        const topCities: CityData[] = cityAggregation.map(item => ({
            city: item.ville || '',
            count: item._count.ville,
        }));

        // Data quality object
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

            // End of the month
            const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);

            // Count all clients created up to the end of this month
            const count = await prisma.client.count({
                where: {
                    entrepriseId,
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
    } catch (error) {
        return handleTenantError(error);
    }
}
