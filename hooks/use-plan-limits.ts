"use client";

import { useMemo } from "react";
import {
    PlanType,
    PlanLimits,
    PlanFeatures,
    PLANS_CONFIG,
    getPlanConfig,
    isPlanFeatureEnabled,
    checkPlanLimit,
    PLAN_PRICING,
} from "@/lib/config/plans.config";

/**
 * Type combiné pour rétrocompatibilité
 * Combine les limites numériques et les features booléennes
 */
export type CombinedPlanLimits = PlanLimits & PlanFeatures;

/**
 * Clé de limite (numérique uniquement)
 */
export type LimitKey = keyof PlanLimits;

/**
 * Clé de feature (booléenne uniquement)
 */
export type FeatureKey = keyof PlanFeatures;

/**
 * Clé combinée (limite ou feature)
 */
export type CombinedKey = LimitKey | FeatureKey;

/**
 * Hook pour gérer les limites et permissions du plan utilisateur
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { canUse, isLimited, getUpgradeMessage } = usePlanLimits(userPlan);
 *
 *   if (!canUse("clientSegmentation")) {
 *     return <UpgradePrompt message={getUpgradeMessage("clientSegmentation")} />;
 *   }
 *
 *   return <ClientSegmentation />;
 * }
 * ```
 */
export function usePlanLimits(userPlan: PlanType) {
    const planConfig = useMemo(() => getPlanConfig(userPlan), [userPlan]);

    // Combine limits and features for backward compatibility
    const limits = useMemo((): CombinedPlanLimits => ({
        ...planConfig.limits,
        ...planConfig.features,
    }), [planConfig]);

    /**
     * Vérifier si une fonctionnalité est disponible
     * Fonctionne avec les features booléennes ET les limites numériques > 0
     */
    const canUse = (key: CombinedKey): boolean => {
        // Check if it's a feature
        if (key in planConfig.features) {
            return isPlanFeatureEnabled(userPlan, key as FeatureKey);
        }
        // Check if it's a limit (>0 means available)
        if (key in planConfig.limits) {
            const limit = planConfig.limits[key as LimitKey];
            if (typeof limit === "boolean") return limit;
            if (typeof limit === "number") return limit !== 0;
            return true;
        }
        return false;
    };

    /**
     * Vérifier si une limite numérique est atteinte
     */
    const isLimited = (limitKey: LimitKey, currentValue: number): boolean => {
        return !checkPlanLimit(userPlan, limitKey, currentValue);
    };

    /**
     * Obtenir le message d'erreur pour une limite
     */
    const getErrorMessage = (key: CombinedKey): string => {
        const limit = key in planConfig.limits
            ? planConfig.limits[key as LimitKey]
            : null;

        const planName = PLAN_PRICING[userPlan].name;

        const messages: Partial<Record<CombinedKey, string>> = {
            maxClients: `Vous avez atteint la limite de ${limit} clients pour le plan ${planName}. Passez au plan supérieur pour ajouter plus de clients.`,
            maxProducts: `Vous avez atteint la limite de ${limit} produits pour le plan ${planName}.`,
            maxDocumentsPerMonth: `Vous avez atteint la limite de ${limit} documents ce mois-ci. Passez au plan supérieur pour créer plus de documents.`,
            maxUsers: `Vous avez atteint la limite de ${limit} utilisateur(s) pour le plan ${planName}.`,
            maxQuestionsPerMonth: `Vous avez atteint la limite de ${limit} questions ce mois-ci. Passez au plan supérieur pour poser plus de questions à l'assistant.`,
            maxStores: `Vous avez atteint la limite de ${limit} magasins pour le plan ${planName}.`,
            maxSegments: `Vous avez atteint la limite de ${limit} segments pour le plan ${planName}.`,
            maxCampaignsPerMonth: `Vous avez atteint la limite de ${limit} campagnes ce mois-ci.`,
        };

        return messages[key] || `Cette fonctionnalité n'est pas disponible dans votre plan ${planName}.`;
    };

    /**
     * Obtenir le plan recommandé pour upgrader
     */
    const getUpgradePlan = (key: CombinedKey): PlanType | null => {
        const planOrder: PlanType[] = ["FREE", "STARTER", "PRO", "ENTERPRISE"];
        const currentIndex = planOrder.indexOf(userPlan);

        // Find next plan that has this feature/higher limit
        for (let i = currentIndex + 1; i < planOrder.length; i++) {
            const nextPlan = planOrder[i];
            const nextConfig = PLANS_CONFIG[nextPlan];

            // Check features
            if (key in nextConfig.features) {
                if (nextConfig.features[key as FeatureKey]) {
                    return nextPlan;
                }
            }

            // Check limits
            if (key in nextConfig.limits) {
                const limit = nextConfig.limits[key as LimitKey];
                if (typeof limit === "number" && limit === -1) {
                    return nextPlan;
                }
                if (typeof limit === "boolean" && limit) {
                    return nextPlan;
                }
            }
        }

        return null;
    };

    /**
     * Obtenir un message d'upgrade avec le plan recommandé
     */
    const getUpgradeMessage = (key: CombinedKey): string => {
        const recommendedPlan = getUpgradePlan(key);
        if (!recommendedPlan) return "Contactez-nous pour débloquer cette fonctionnalité.";

        return `Passez au plan ${recommendedPlan} pour débloquer cette fonctionnalité.`;
    };

    /**
     * Formater une limite (-1 devient "Illimité")
     */
    const format = (limit: number): string => {
        return limit === -1 ? "Illimité" : limit.toString();
    };

    /**
     * Obtenir la progression pour une limite
     */
    const getProgress = (limitKey: LimitKey, currentValue: number) => {
        const limit = planConfig.limits[limitKey];
        if (typeof limit !== "number" || limit === -1) {
            return { value: currentValue, max: -1, percentage: 0, isUnlimited: true };
        }

        const percentage = Math.min((currentValue / limit) * 100, 100);
        return {
            value: currentValue,
            max: limit,
            percentage,
            isUnlimited: false,
        };
    };

    return {
        plan: userPlan,
        limits,
        planConfig,
        canUse,
        isLimited,
        getErrorMessage,
        getUpgradePlan,
        getUpgradeMessage,
        format,
        getProgress,
    };
}

/**
 * Type guard pour vérifier si une valeur est un PlanType valide
 */
export function isPlanType(value: string): value is PlanType {
    return ["FREE", "STARTER", "PRO", "ENTERPRISE"].includes(value);
}

// Re-export types for convenience
export type { PlanType, PlanLimits, PlanFeatures };
