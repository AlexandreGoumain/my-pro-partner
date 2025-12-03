import { NextResponse } from "next/server";
import {
    type PlanType,
    type PlanLimits,
    type PlanFeatures,
    PLANS_CONFIG,
    getPlanConfig,
    checkPlanLimit,
    isPlanFeatureEnabled,
    PLAN_PRICING,
} from "@/lib/config/plans.config";
import { prisma } from "@/lib/prisma";

/**
 * Type combiné pour limites et features
 */
type CombinedKey = keyof PlanLimits | keyof PlanFeatures;

/**
 * Get plan config for a user's plan
 * Database and pricing config now use the same plan names: FREE, STARTER, PRO, ENTERPRISE
 */
export function getPlanLimitsFromSession(plan: string): PlanLimits {
    const planType = plan as PlanType;
    if (!PLANS_CONFIG[planType]) {
        console.warn(`Unknown plan type: ${plan}, defaulting to FREE`);
        return PLANS_CONFIG.FREE.limits;
    }
    return PLANS_CONFIG[planType].limits;
}

/**
 * Check if a feature is available for a plan
 * @param plan - User's plan (from session or database)
 * @param feature - Feature key to check
 * @returns true if feature is available, false otherwise
 */
export function canAccessFeature(plan: string, feature: CombinedKey): boolean {
    const planType = plan as PlanType;
    const config = getPlanConfig(planType);

    // Check if it's a feature (boolean)
    if (feature in config.features) {
        return isPlanFeatureEnabled(planType, feature as keyof PlanFeatures);
    }

    // Check if it's a limit (numeric)
    if (feature in config.limits) {
        const limit = config.limits[feature as keyof PlanLimits];
        if (typeof limit === "number") {
            return limit !== 0;
        }
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
    const planType = plan as PlanType;
    // checkPlanLimit returns true if within limit, so we negate it
    return !checkPlanLimit(planType, limitKey, currentUsage);
}

/**
 * Get recommended upgrade plan for a feature/limit
 */
function getRecommendedUpgrade(currentPlan: PlanType, key: CombinedKey): PlanType | null {
    const planOrder: PlanType[] = ["FREE", "STARTER", "PRO", "ENTERPRISE"];
    const currentIndex = planOrder.indexOf(currentPlan);

    for (let i = currentIndex + 1; i < planOrder.length; i++) {
        const nextPlan = planOrder[i];
        const nextConfig = PLANS_CONFIG[nextPlan];

        // Check features
        if (key in nextConfig.features) {
            if (nextConfig.features[key as keyof PlanFeatures]) {
                return nextPlan;
            }
        }

        // Check limits
        if (key in nextConfig.limits) {
            const limit = nextConfig.limits[key as keyof PlanLimits];
            if (typeof limit === "number" && limit === -1) {
                return nextPlan;
            }
        }
    }

    return null;
}

/**
 * Get limit error message
 */
function getLimitErrorMessage(plan: PlanType, limitKey: keyof PlanLimits): string {
    const config = getPlanConfig(plan);
    const limit = config.limits[limitKey];
    const planName = PLAN_PRICING[plan].name;

    const messages: Partial<Record<keyof PlanLimits, string>> = {
        maxClients: `Vous avez atteint la limite de ${limit} clients pour le plan ${planName}. Passez au plan supérieur pour ajouter plus de clients.`,
        maxProducts: `Vous avez atteint la limite de ${limit} produits pour le plan ${planName}.`,
        maxDocumentsPerMonth: `Vous avez atteint la limite de ${limit} documents ce mois-ci. Passez au plan supérieur pour créer plus de documents.`,
        maxUsers: `Vous avez atteint la limite de ${limit} utilisateur(s) pour le plan ${planName}.`,
        maxQuestionsPerMonth: `Vous avez atteint la limite de ${limit} questions ce mois-ci. Passez au plan supérieur pour poser plus de questions à l'assistant.`,
    };

    return messages[limitKey] || `Cette fonctionnalité n'est pas disponible dans votre plan ${planName}.`;
}

/**
 * Require a specific feature to be available, or throw an error
 * @param plan - User's plan
 * @param feature - Feature key that must be available
 * @throws Error with appropriate message if feature is not available
 */
export function requireFeature(plan: string, feature: CombinedKey): void {
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

        throw new LimitReachedError(message, limitKey as CombinedKey, planType, recommendedPlan);
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
                    createdAt: {
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
                    role: "USER", // Only count user questions, not assistant responses
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
        public feature: CombinedKey,
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
        public limitKey: CombinedKey,
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
    feature: CombinedKey
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
