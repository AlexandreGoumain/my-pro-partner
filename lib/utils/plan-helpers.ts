/**
 * Helpers backend pour vérifier les plans et limites
 * À utiliser dans les API routes
 */

import { prisma } from "@/lib/prisma";
import {
  PlanType,
  PlanFeatures,
  PlanLimits,
  isPlanFeatureEnabled,
  checkPlanLimit,
  getPlanLimit,
  isFeatureAvailable,
  GLOBAL_FEATURE_FLAGS,
} from "@/lib/config/plans.config";

/**
 * Récupère le plan d'une entreprise depuis la BDD
 */
export async function getEntreprisePlan(entrepriseId: string): Promise<PlanType> {
  const entreprise = await prisma.entreprise.findUnique({
    where: { id: entrepriseId },
    select: { plan: true },
  });

  return (entreprise?.plan as PlanType) || "FREE";
}

/**
 * Vérifie si une entreprise a accès à une feature
 */
export async function checkFeatureAccess(
  entrepriseId: string,
  feature: keyof PlanFeatures,
  globalFeature?: keyof typeof GLOBAL_FEATURE_FLAGS
): Promise<boolean> {
  const plan = await getEntreprisePlan(entrepriseId);
  return isFeatureAvailable(plan, feature, globalFeature);
}

/**
 * Vérifie si une entreprise peut ajouter un élément
 * (utilisateurs, clients, documents, etc.)
 */
export async function checkCanAdd(
  entrepriseId: string,
  limitKey: keyof PlanLimits,
  currentCount: number
): Promise<{
  canAdd: boolean;
  limit: number | boolean;
  current: number;
  remaining: number;
}> {
  const plan = await getEntreprisePlan(entrepriseId);
  const limit = getPlanLimit(plan, limitKey);
  const canAdd = checkPlanLimit(plan, limitKey, currentCount);

  const isUnlimited = limit === -1;
  const remaining = isUnlimited ? Infinity : (limit as number) - currentCount;

  return {
    canAdd,
    limit,
    current: currentCount,
    remaining,
  };
}

/**
 * Vérifie le nombre d'utilisateurs et si on peut en ajouter
 */
export async function checkCanAddUser(entrepriseId: string): Promise<boolean> {
  const userCount = await prisma.user.count({
    where: { entrepriseId },
  });

  const result = await checkCanAdd(entrepriseId, "maxUsers", userCount);
  return result.canAdd;
}

/**
 * Vérifie le nombre de clients et si on peut en ajouter
 */
export async function checkCanAddClient(entrepriseId: string): Promise<boolean> {
  const clientCount = await prisma.client.count({
    where: { entrepriseId },
  });

  const result = await checkCanAdd(entrepriseId, "maxClients", clientCount);
  return result.canAdd;
}

/**
 * Vérifie le nombre de produits et si on peut en ajouter
 */
export async function checkCanAddProduct(entrepriseId: string): Promise<boolean> {
  const productCount = await prisma.article.count({
    where: { entrepriseId },
  });

  const result = await checkCanAdd(entrepriseId, "maxProducts", productCount);
  return result.canAdd;
}

/**
 * Vérifie le nombre de documents ce mois-ci
 */
export async function checkCanAddDocument(entrepriseId: string): Promise<boolean> {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const documentCount = await prisma.document.count({
    where: {
      entrepriseId,
      createdAt: {
        gte: firstDayOfMonth,
      },
    },
  });

  const result = await checkCanAdd(
    entrepriseId,
    "maxDocumentsPerMonth",
    documentCount
  );
  return result.canAdd;
}

/**
 * Vérifie le nombre de magasins et si on peut en ajouter
 */
export async function checkCanAddStore(entrepriseId: string): Promise<boolean> {
  const storeCount = await prisma.store.count({
    where: { entrepriseId },
  });

  const result = await checkCanAdd(entrepriseId, "maxStores", storeCount);
  return result.canAdd;
}

/**
 * Vérifie le nombre de segments et si on peut en ajouter
 */
export async function checkCanAddSegment(entrepriseId: string): Promise<boolean> {
  const segmentCount = await prisma.segment.count({
    where: { entrepriseId },
  });

  const result = await checkCanAdd(entrepriseId, "maxSegments", segmentCount);
  return result.canAdd;
}

/**
 * Vérifie le nombre d'automations et si on peut en ajouter
 */
export async function checkCanAddAutomation(entrepriseId: string): Promise<boolean> {
  const automationCount = await prisma.automation.count({
    where: { entrepriseId },
  });

  const result = await checkCanAdd(entrepriseId, "maxAutomations", automationCount);
  return result.canAdd;
}

/**
 * Helper générique pour renvoyer une erreur 403 si limite atteinte
 */
export function createLimitError(limitName: string) {
  return {
    error: `Limite atteinte pour votre plan actuel`,
    limitReached: true,
    limitName,
    upgradeRequired: true,
  };
}

/**
 * Helper générique pour renvoyer une erreur 403 si feature non disponible
 */
export function createFeatureError(featureName: string) {
  return {
    error: `Cette fonctionnalité n'est pas disponible dans votre plan actuel`,
    featureUnavailable: true,
    featureName,
    upgradeRequired: true,
  };
}
