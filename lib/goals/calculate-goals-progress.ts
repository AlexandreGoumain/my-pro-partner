import type { GoalMetricType, GoalPeriod } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";

// ============================================================================
// Period Date Utilities
// ============================================================================

interface PeriodDates {
    start: Date;
    end: Date;
}

/**
 * Get the start and end dates for a given period
 */
function getPeriodDates(period: GoalPeriod, referenceDate: Date = new Date()): PeriodDates {
    const now = referenceDate;
    let start: Date;
    let end: Date;

    switch (period) {
        case "WEEKLY": {
            // Week starts on Monday
            const dayOfWeek = now.getDay() || 7; // Convert Sunday (0) to 7
            start = new Date(now);
            start.setDate(now.getDate() - dayOfWeek + 1);
            start.setHours(0, 0, 0, 0);
            end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            break;
        }
        case "MONTHLY": {
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            start.setHours(0, 0, 0, 0);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            end.setHours(23, 59, 59, 999);
            break;
        }
        case "QUARTERLY": {
            const quarter = Math.floor(now.getMonth() / 3);
            start = new Date(now.getFullYear(), quarter * 3, 1);
            start.setHours(0, 0, 0, 0);
            end = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
            end.setHours(23, 59, 59, 999);
            break;
        }
        case "YEARLY": {
            start = new Date(now.getFullYear(), 0, 1);
            start.setHours(0, 0, 0, 0);
            end = new Date(now.getFullYear(), 11, 31);
            end.setHours(23, 59, 59, 999);
            break;
        }
        default:
            // Default to monthly
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            start.setHours(0, 0, 0, 0);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            end.setHours(23, 59, 59, 999);
    }

    return { start, end };
}

// ============================================================================
// Metric Calculation Functions
// ============================================================================

/**
 * Calculate revenue for a given period
 */
async function calculateRevenue(
    entrepriseId: string,
    periodDates: PeriodDates
): Promise<number> {
    const result = await prisma.document.aggregate({
        where: {
            entrepriseId,
            type: "FACTURE",
            statut: "PAYE",
            dateEmission: {
                gte: periodDates.start,
                lte: periodDates.end,
            },
        },
        _sum: {
            total_ttc: true,
        },
    });

    return result._sum.total_ttc?.toNumber() ?? 0;
}

/**
 * Calculate number of new clients for a given period
 */
async function calculateNewClients(
    entrepriseId: string,
    periodDates: PeriodDates
): Promise<number> {
    const count = await prisma.client.count({
        where: {
            entrepriseId,
            createdAt: {
                gte: periodDates.start,
                lte: periodDates.end,
            },
        },
    });

    return count;
}

/**
 * Calculate conversion rate (quotes to invoices) for a given period
 */
async function calculateConversionRate(
    entrepriseId: string,
    periodDates: PeriodDates
): Promise<number> {
    const [quotes, invoices] = await Promise.all([
        prisma.document.count({
            where: {
                entrepriseId,
                type: "DEVIS",
                createdAt: {
                    gte: periodDates.start,
                    lte: periodDates.end,
                },
            },
        }),
        prisma.document.count({
            where: {
                entrepriseId,
                type: "FACTURE",
                createdAt: {
                    gte: periodDates.start,
                    lte: periodDates.end,
                },
            },
        }),
    ]);

    if (quotes === 0) return 0;
    return Math.round((invoices / quotes) * 100);
}

/**
 * Calculate number of documents created for a given period
 */
async function calculateDocumentsCreated(
    entrepriseId: string,
    periodDates: PeriodDates
): Promise<number> {
    const count = await prisma.document.count({
        where: {
            entrepriseId,
            createdAt: {
                gte: periodDates.start,
                lte: periodDates.end,
            },
        },
    });

    return count;
}

/**
 * Calculate average ticket (average transaction value) for a given period
 */
async function calculateAverageTicket(
    entrepriseId: string,
    periodDates: PeriodDates
): Promise<number> {
    const result = await prisma.document.aggregate({
        where: {
            entrepriseId,
            type: "FACTURE",
            statut: "PAYE",
            dateEmission: {
                gte: periodDates.start,
                lte: periodDates.end,
            },
        },
        _avg: {
            total_ttc: true,
        },
    });

    return Math.round(result._avg.total_ttc?.toNumber() ?? 0);
}

// ============================================================================
// Main Calculation Function
// ============================================================================

/**
 * Calculate the current value for a goal metric based on its type and period
 */
export async function calculateGoalCurrentValue(
    entrepriseId: string,
    metricType: GoalMetricType,
    period: GoalPeriod
): Promise<number> {
    // For revenue metrics, the period in metricType overrides the goal period
    let effectivePeriod = period;

    // Map metric type to effective period for revenue metrics
    if (metricType === "REVENUE_MONTHLY") {
        effectivePeriod = "MONTHLY";
    } else if (metricType === "REVENUE_QUARTERLY") {
        effectivePeriod = "QUARTERLY";
    } else if (metricType === "REVENUE_YEARLY") {
        effectivePeriod = "YEARLY";
    }

    const periodDates = getPeriodDates(effectivePeriod);

    switch (metricType) {
        case "REVENUE_MONTHLY":
        case "REVENUE_QUARTERLY":
        case "REVENUE_YEARLY":
            return calculateRevenue(entrepriseId, periodDates);

        case "NEW_CLIENTS":
            return calculateNewClients(entrepriseId, periodDates);

        case "CONVERSION_RATE":
            return calculateConversionRate(entrepriseId, periodDates);

        case "DOCUMENTS_CREATED":
            return calculateDocumentsCreated(entrepriseId, periodDates);

        case "AVERAGE_TICKET":
            return calculateAverageTicket(entrepriseId, periodDates);

        case "CUSTOM":
            // Custom goals don't auto-calculate, return 0
            // The actual value is stored in the database
            return 0;

        default:
            return 0;
    }
}

/**
 * Batch calculate current values for multiple goals
 * More efficient than calling calculateGoalCurrentValue multiple times
 */
export async function calculateGoalsCurrentValues(
    entrepriseId: string,
    goals: Array<{ metricType: GoalMetricType; period: GoalPeriod }>
): Promise<Map<string, number>> {
    const results = new Map<string, number>();
    const now = new Date();

    // Cache period dates
    const periodDatesCache = new Map<GoalPeriod, PeriodDates>();
    const getPeriodDatesCached = (p: GoalPeriod) => {
        if (!periodDatesCache.has(p)) {
            periodDatesCache.set(p, getPeriodDates(p, now));
        }
        return periodDatesCache.get(p)!;
    };

    // Fetch all data needed in parallel
    const periodsNeeded = new Set<GoalPeriod>();
    goals.forEach((g) => {
        if (g.metricType === "REVENUE_MONTHLY") periodsNeeded.add("MONTHLY");
        else if (g.metricType === "REVENUE_QUARTERLY") periodsNeeded.add("QUARTERLY");
        else if (g.metricType === "REVENUE_YEARLY") periodsNeeded.add("YEARLY");
        else if (g.metricType !== "CUSTOM") periodsNeeded.add(g.period);
    });

    // Calculate each unique metric/period combination
    for (const goal of goals) {
        const key = `${goal.metricType}-${goal.period}`;
        if (!results.has(key)) {
            const value = await calculateGoalCurrentValue(
                entrepriseId,
                goal.metricType,
                goal.period
            );
            results.set(key, value);
        }
    }

    return results;
}
