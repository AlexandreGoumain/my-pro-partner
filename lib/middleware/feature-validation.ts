import { NextResponse } from "next/server";
import { PlanType, PRICING_PLANS, PlanLimits, getLimitErrorMessage, getRecommendedUpgrade } from "@/lib/pricing-config";
import { prisma } from "@/lib/prisma";

/**
 * Get plan limits for a user's plan
 * Database and pricing config now use the same plan names: FREE, STARTER, PRO, ENTERPRISE
 */
export function getPlanLimitsFromSession(plan: string): PlanLimits {
    const planType = plan as PlanType;
    if (!PRICING_PLANS[planType]) {
        console.warn(`Unknown plan type: ${plan}, defaulting to FREE`);
        return PRICING_PLANS.FREE;
    }
    return PRICING_PLANS[planType];
}

/**
 * Check if a feature is available for a plan
 * @param plan - User's plan (from session or database)
 * @param feature - Feature key to check
 * @returns true if feature is available, false otherwise
 */
export function canAccessFeature(plan: string, feature: keyof PlanLimits): boolean {
    const limits = getPlanLimitsFromSession(plan);
    const featureValue = limits[feature];

    // For boolean features, return the value directly
    if (typeof featureValue === "boolean") {
        return featureValue;
    }

    // For numeric features, return true if not zero (unlimited = -1 or positive number)
    if (typeof featureValue === "number") {
        return featureValue !== 0;
    }

    return false;
}

/**
 * Check if a usage limit is reached
 * @param plan - User's plan
 * @param limitKey - Limit key to check (maxClients, maxProducts, etc.)
 * @param currentUsage - Current usage count
 * @returns true if limit is reached, false otherwise
 */
export function isLimitReached(plan: string, limitKey: keyof PlanLimits, currentUsage: number): boolean {
    const limits = getPlanLimitsFromSession(plan);
    const limit = limits[limitKey];

    // If limit is -1, it means unlimited
    if (typeof limit === "number" && limit === -1) {
        return false;
    }

    // If limit is 0, feature is not available
    if (typeof limit === "number" && limit === 0) {
        return true;
    }

    // Check if current usage exceeds the limit
    if (typeof limit === "number") {
        return currentUsage >= limit;
    }

    return false;
}

/**
 * Require a specific feature to be available, or throw an error
 * @param plan - User's plan
 * @param feature - Feature key that must be available
 * @throws Error with appropriate message if feature is not available
 */
export function requireFeature(plan: string, feature: keyof PlanLimits): void {
    if (!canAccessFeature(plan, feature)) {
        const planType = plan as PlanType;
        const recommendedPlan = getRecommendedUpgrade(planType, feature);

        throw new FeatureNotAvailableError(
            `This feature is not available in your current plan.`,
            feature,
            planType,
            recommendedPlan
        );
    }
}

/**
 * Require that usage limit is not reached, or throw an error
 * @param plan - User's plan
 * @param limitKey - Limit key to check
 * @param currentUsage - Current usage count
 * @throws Error with appropriate message if limit is reached
 */
export function requireWithinLimit(plan: string, limitKey: keyof PlanLimits, currentUsage: number): void {
    if (isLimitReached(plan, limitKey, currentUsage)) {
        const planType = plan as PlanType;
        const message = getLimitErrorMessage(planType, limitKey);
        const recommendedPlan = getRecommendedUpgrade(planType, limitKey);

        throw new LimitReachedError(message, limitKey, planType, recommendedPlan);
    }
}

/**
 * Count current usage for a specific limit
 * @param entrepriseId - Enterprise ID
 * @param limitKey - What to count (clients, products, documents, etc.)
 * @returns Current usage count
 */
export async function getCurrentUsage(entrepriseId: string, limitKey: keyof PlanLimits): Promise<number> {
    switch (limitKey) {
        case "maxClients":
            return await prisma.client.count({ where: { entrepriseId } });

        case "maxProducts":
            return await prisma.article.count({ where: { entrepriseId } });

        case "maxUsers":
            return await prisma.user.count({ where: { entrepriseId } });

        case "maxDocumentsPerMonth": {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

            return await prisma.document.count({
                where: {
                    entrepriseId,
                    dateCreation: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                    },
                },
            });
        }

        case "maxQuestionsPerMonth": {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

            // Count messages from user (not assistant) in conversations this month
            return await prisma.message.count({
                where: {
                    conversation: {
                        entrepriseId,
                    },
                    role: "user", // Only count user questions, not assistant responses
                    createdAt: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                    },
                },
            });
        }

        default:
            return 0;
    }
}

/**
 * Custom error for feature not available
 */
export class FeatureNotAvailableError extends Error {
    constructor(
        message: string,
        public feature: keyof PlanLimits,
        public currentPlan: PlanType,
        public recommendedPlan: PlanType | null
    ) {
        super(message);
        this.name = "FeatureNotAvailableError";
    }
}

/**
 * Custom error for limit reached
 */
export class LimitReachedError extends Error {
    constructor(
        message: string,
        public limitKey: keyof PlanLimits,
        public currentPlan: PlanType,
        public recommendedPlan: PlanType | null
    ) {
        super(message);
        this.name = "LimitReachedError";
    }
}

/**
 * Handle feature validation errors and return appropriate NextResponse
 */
export function handleFeatureError(error: unknown): NextResponse {
    if (error instanceof FeatureNotAvailableError) {
        return NextResponse.json(
            {
                error: error.message,
                code: "FEATURE_NOT_AVAILABLE",
                feature: error.feature,
                currentPlan: error.currentPlan,
                recommendedPlan: error.recommendedPlan,
            },
            { status: 403 }
        );
    }

    if (error instanceof LimitReachedError) {
        return NextResponse.json(
            {
                error: error.message,
                code: "LIMIT_REACHED",
                limitKey: error.limitKey,
                currentPlan: error.currentPlan,
                recommendedPlan: error.recommendedPlan,
            },
            { status: 403 }
        );
    }

    // Generic error handling
    return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
    );
}

/**
 * Helper to validate feature access and return NextResponse on error
 * Use this in API routes for clean error handling
 */
export async function validateFeatureAccess(
    plan: string,
    feature: keyof PlanLimits
): Promise<NextResponse | null> {
    try {
        requireFeature(plan, feature);
        return null; // No error, feature is available
    } catch (error) {
        return handleFeatureError(error);
    }
}

/**
 * Helper to validate limit and return NextResponse on error
 * Use this in API routes for clean error handling
 */
export async function validateLimit(
    plan: string,
    entrepriseId: string,
    limitKey: keyof PlanLimits
): Promise<NextResponse | null> {
    try {
        const currentUsage = await getCurrentUsage(entrepriseId, limitKey);
        requireWithinLimit(plan, limitKey, currentUsage);
        return null; // No error, within limit
    } catch (error) {
        return handleFeatureError(error);
    }
}
