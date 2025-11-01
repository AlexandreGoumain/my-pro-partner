import { prisma } from "@/lib/prisma";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";

export interface ClientsStats {
    total: number;
    newThisMonth: number;
    inactive: number;
    active: number;
    complete: number;
    completionRate: number;
}

export async function GET(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

        // Execute all queries in parallel for better performance
        const [
            total,
            newThisMonth,
            inactive,
            active,
            complete,
        ] = await Promise.all([
            // Total clients
            prisma.client.count({
                where: { entrepriseId },
            }),

            // New clients this month
            prisma.client.count({
                where: {
                    entrepriseId,
                    createdAt: { gte: thirtyDaysAgo },
                },
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
        ]);

        const completionRate = total > 0 ? (complete / total) * 100 : 0;

        const stats: ClientsStats = {
            total,
            newThisMonth,
            inactive,
            active,
            complete,
            completionRate,
        };

        return NextResponse.json(stats);
    } catch (error) {
        return handleTenantError(error);
    }
}
