/**
 * Hook pour gérer les plans et vérifier les accès aux features
 */

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import {
  PlanType,
  PlanFeatures,
  PlanLimits,
  getPlanConfig,
  isPlanFeatureEnabled,
  checkPlanLimit,
  getPlanLimit,
  isFeatureAvailable,
  isGlobalFeatureEnabled,
  GLOBAL_FEATURE_FLAGS,
} from "@/lib/config/plans.config";

export function usePlan() {
  const { data: session } = useSession();

  const currentPlan: PlanType = useMemo(() => {
    return ((session?.user as { plan?: PlanType } | undefined)?.plan as PlanType) || "FREE";
  }, [session]);

  const planConfig = useMemo(() => getPlanConfig(currentPlan), [currentPlan]);

  return {
    // Info du plan
    currentPlan,
    planConfig,
    planName: planConfig.name,
    limits: planConfig.limits,
    features: planConfig.features,

    // Vérifier une feature
    hasFeature: (feature: keyof PlanFeatures) => {
      return isPlanFeatureEnabled(currentPlan, feature);
    },

    // Vérifier une limite
    canAdd: (limitKey: keyof PlanLimits, currentCount: number) => {
      return checkPlanLimit(currentPlan, limitKey, currentCount);
    },

    // Récupérer une limite
    getLimit: (limitKey: keyof PlanLimits) => {
      return getPlanLimit(currentPlan, limitKey);
    },

    // Vérifier feature + global flag
    isAvailable: (
      planFeature: keyof PlanFeatures,
      globalFeature?: keyof typeof GLOBAL_FEATURE_FLAGS
    ) => {
      return isFeatureAvailable(currentPlan, planFeature, globalFeature);
    },

    // Vérifier un global feature flag
    isGloballyEnabled: (feature: keyof typeof GLOBAL_FEATURE_FLAGS) => {
      return isGlobalFeatureEnabled(feature);
    },
  };
}

/**
 * Hook pour vérifier simplement si une feature est disponible
 */
export function useFeature(
  planFeature: keyof PlanFeatures,
  globalFeature?: keyof typeof GLOBAL_FEATURE_FLAGS
) {
  const { isAvailable } = usePlan();
  return isAvailable(planFeature, globalFeature);
}

/**
 * Hook pour vérifier une limite
 */
export function usePlanLimit(limitKey: keyof PlanLimits, currentCount: number) {
  const { canAdd, getLimit } = usePlan();

  const limit = getLimit(limitKey);
  const isUnlimited = limit === -1;
  const canAddMore = canAdd(limitKey, currentCount);
  const remaining = isUnlimited ? Infinity : (limit as number) - currentCount;

  return {
    limit,
    isUnlimited,
    canAddMore,
    remaining,
    current: currentCount,
    percentage: isUnlimited ? 0 : (currentCount / (limit as number)) * 100,
  };
}
