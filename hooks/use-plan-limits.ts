"use client";

import { useMemo } from "react";
import {
    PlanType,
    PlanLimits,
    getPlanLimits,
    hasFeature,
    isLimitReached,
    getLimitErrorMessage,
    getRecommendedUpgrade,
    formatLimit,
} from "@/lib/pricing-config";

/**
 * Hook pour gérer les limites et permissions du plan utilisateur
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { limits, canUse, isLimited, getUpgradeMessage } = usePlanLimits(userPlan);
 *
 *   if (!canUse("canSegmentClients")) {
 *     return <UpgradePrompt message={getUpgradeMessage("canSegmentClients")} />;
 *   }
 *
 *   return <ClientSegmentation />;
 * }
 * ```
 */
export function usePlanLimits(userPlan: PlanType) {
    const limits = useMemo(() => getPlanLimits(userPlan), [userPlan]);

    /**
     * Vérifier si une fonctionnalité est disponible
     */
    const canUse = (feature: keyof PlanLimits): boolean => {
        return hasFeature(userPlan, feature);
    };

    /**
     * Vérifier si une limite numérique est atteinte
     */
    const isLimited = (limitKey: keyof PlanLimits, currentValue: number): boolean => {
        return isLimitReached(userPlan, limitKey, currentValue);
    };

    /**
     * Obtenir le message d'erreur pour une limite
     */
    const getErrorMessage = (limitKey: keyof PlanLimits): string => {
        return getLimitErrorMessage(userPlan, limitKey);
    };

    /**
     * Obtenir le plan recommandé pour upgrader
     */
    const getUpgradePlan = (limitKey: keyof PlanLimits): PlanType | null => {
        return getRecommendedUpgrade(userPlan, limitKey);
    };

    /**
     * Obtenir un message d'upgrade avec le plan recommandé
     */
    const getUpgradeMessage = (limitKey: keyof PlanLimits): string => {
        const recommendedPlan = getUpgradePlan(limitKey);
        if (!recommendedPlan) return "Contactez-nous pour débloquer cette fonctionnalité.";

        return `Passez au plan ${recommendedPlan} pour débloquer cette fonctionnalité.`;
    };

    /**
     * Formater une limite (-1 devient "Illimité")
     */
    const format = (limit: number): string => {
        return formatLimit(limit);
    };

    /**
     * Obtenir la progression pour une limite
     */
    const getProgress = (limitKey: keyof PlanLimits, currentValue: number) => {
        const limit = limits[limitKey];
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
