/**
 * @deprecated Ce fichier est déprécié. Utilisez `@/lib/config/plans.config.ts` à la place.
 *
 * Ce fichier maintient la rétrocompatibilité mais vous devriez migrer vers :
 * - `import { PLANS_CONFIG, usePlan } from "@/lib/config/plans.config"`
 * - `import { usePlan, useFeature } from "@/hooks/use-plan"`
 * - `import { checkFeatureAccess, checkCanAdd } from "@/lib/utils/plan-helpers"`
 *
 * Voir la documentation : docs/PLANS_USAGE_GUIDE.md
 */

import {
  PlanType as NewPlanType,
  PLANS_CONFIG,
  getPlanConfig,
  PLAN_PRICING as NEW_PLAN_PRICING,
} from "@/lib/config/plans.config";

export type PlanType = NewPlanType;

export interface PlanLimits {
    // Limites de base
    maxClients: number;
    maxProducts: number; // Articles/Produits dans le stock
    maxDocumentsPerMonth: number; // Devis + Factures
    maxUsers: number; // Nombre d'utilisateurs/employés

    // Limites assistant/questions
    maxQuestionsPerMonth: number; // Questions à l'assistant
    hasAssistant: boolean;
    assistantResponseTime: "standard" | "fast" | "ultra-fast"; // Temps de réponse

    // Fonctionnalités Documents
    canCreateQuotes: boolean; // Créer des devis
    canCreateInvoices: boolean; // Créer des factures
    canConvertQuoteToInvoice: boolean; // Convertir devis → facture
    canSendEmailDocuments: boolean; // Envoyer docs par email
    canCustomizeTemplates: boolean; // Personnaliser templates
    canExportPDF: boolean;
    canExportExcel: boolean;

    // Fonctionnalités Clients
    canSegmentClients: boolean; // Segmentation clients (par CA, etc.)
    canScoreClients: boolean; // Score de risque clients
    hasClientHistory: boolean; // Historique complet des interactions
    canImportClients: boolean; // Import CSV/Excel
    canExportClients: boolean;

    // Fonctionnalités Stock
    hasBasicStock: boolean; // Gestion stock basique
    hasAdvancedStock: boolean; // Gestion stock avancée (seuils, alertes)
    canTrackStockMovements: boolean; // Historique mouvements
    hasLowStockAlerts: boolean; // Alertes stock bas
    canManageSuppliers: boolean; // Gestion fournisseurs

    // Analytics & Rapports
    hasBasicAnalytics: boolean; // Stats basiques (CA, nb clients, etc.)
    hasAdvancedAnalytics: boolean; // Analytics avancées (rentabilité, tendances)
    hasPredictions: boolean; // Prédictions CA, risques
    hasProfitabilityAnalysis: boolean; // Analyse rentabilité par client/produit
    canExportReports: boolean;

    // Automatisations
    hasAutomatedReminders: boolean; // Relances automatiques impayés
    hasAutomatedEmails: boolean; // Emails automatiques
    hasAutomatedSMS: boolean; // SMS automatiques
    canCreateCampaigns: boolean; // Campagnes marketing email/SMS
    has24_7Monitoring: boolean; // Surveillance 24/7

    // Gestion des impayés
    canViewDebtors: boolean; // Voir liste débiteurs
    canSendPaymentReminders: boolean; // Relances manuelles
    hasAutomatedPaymentReminders: boolean; // Relances automatiques
    hasDebtorScoring: boolean; // Score de risque débiteurs

    // Intégrations & API
    hasAPIAccess: boolean;
    canUseWebhooks: boolean;
    canIntegrateAccounting: boolean; // Intégrations comptabilité
    hasCustomIntegrations: boolean; // Intégrations sur mesure

    // Support
    supportType: "none" | "email_24h" | "email_priority" | "dedicated_24_7";
    hasAccountManager: boolean; // Gestionnaire de compte dédié
    hasOnboarding: boolean; // Onboarding personnalisé
    hasTraining: boolean; // Formations incluses

    // Autres
    hasSLA: boolean; // SLA 99.9% garanti
    hasEarlyAccess: boolean; // Accès features en avant-première
    canWhiteLabel: boolean; // Marque blanche (entreprise uniquement)
}

/**
 * Mapping function to convert new plan config to old PlanLimits interface
 * @deprecated Use PLANS_CONFIG from plans.config.ts instead
 */
function mapToPlanLimits(planType: PlanType): PlanLimits {
  const config = getPlanConfig(planType);
  const { limits, features } = config;

  return {
    // Limites de base
    maxClients: limits.maxClients,
    maxProducts: limits.maxProducts,
    maxDocumentsPerMonth: limits.maxDocumentsPerMonth,
    maxUsers: limits.maxUsers,

    // Assistant
    maxQuestionsPerMonth: limits.maxQuestionsPerMonth,
    hasAssistant: features.aiChatbot,
    assistantResponseTime: limits.assistantResponseTime,

    // Documents
    canCreateQuotes: features.quotes,
    canCreateInvoices: features.invoices,
    canConvertQuoteToInvoice: features.quoteToInvoice,
    canSendEmailDocuments: features.emailDocuments,
    canCustomizeTemplates: features.customTemplates,
    canExportPDF: features.pdfExport,
    canExportExcel: features.excelExport,

    // Clients
    canSegmentClients: features.clientSegmentation,
    canScoreClients: features.clientScoring,
    hasClientHistory: features.clientHistory,
    canImportClients: features.importClients,
    canExportClients: features.exportClients,

    // Stock
    hasBasicStock: features.basicStock,
    hasAdvancedStock: features.advancedStock,
    canTrackStockMovements: features.stockMovements,
    hasLowStockAlerts: features.lowStockAlerts,
    canManageSuppliers: features.suppliers,

    // Analytics
    hasBasicAnalytics: features.basicAnalytics,
    hasAdvancedAnalytics: features.advancedAnalytics,
    hasPredictions: features.predictions,
    hasProfitabilityAnalysis: features.profitability,
    canExportReports: features.exportReports,

    // Automatisations
    hasAutomatedReminders: features.automatedReminders,
    hasAutomatedEmails: features.automatedEmails,
    hasAutomatedSMS: features.automatedSMS,
    canCreateCampaigns: features.campaigns,
    has24_7Monitoring: features.monitoring24_7,

    // Impayés
    canViewDebtors: features.debtors,
    canSendPaymentReminders: features.paymentReminders,
    hasAutomatedPaymentReminders: features.automatedPaymentReminders,
    hasDebtorScoring: features.debtorScoring,

    // API
    hasAPIAccess: features.apiAccess,
    canUseWebhooks: features.webhooks,
    canIntegrateAccounting: features.accountingIntegration,
    hasCustomIntegrations: features.customIntegrations,

    // Support
    supportType: limits.supportType,
    hasAccountManager: features.accountManager,
    hasOnboarding: features.onboarding,
    hasTraining: features.training,

    // Autres
    hasSLA: features.sla,
    hasEarlyAccess: features.earlyAccess,
    canWhiteLabel: features.whiteLabel,
  };
}

/**
 * Configuration complète de chaque plan
 * @deprecated Use PLANS_CONFIG from plans.config.ts instead
 */
export const PRICING_PLANS: Record<PlanType, PlanLimits> = {
  FREE: mapToPlanLimits("FREE"),
  STARTER: mapToPlanLimits("STARTER"),
  PRO: mapToPlanLimits("PRO"),
  ENTERPRISE: mapToPlanLimits("ENTERPRISE"),
};

/**
 * Informations de prix pour affichage
 * @deprecated Use PLAN_PRICING from plans.config.ts instead
 */
export const PLAN_PRICING = NEW_PLAN_PRICING;

/**
 * Helper pour obtenir les limites d'un plan
 * @deprecated Use getPlanConfig from plans.config.ts instead
 */
export function getPlanLimits(plan: PlanType): PlanLimits {
  return PRICING_PLANS[plan];
}

/**
 * Helper pour vérifier si une fonctionnalité est disponible
 * @deprecated Use isPlanFeatureEnabled from plans.config.ts or usePlan hook instead
 */
export function hasFeature(plan: PlanType, feature: keyof PlanLimits): boolean {
  const limits = PRICING_PLANS[plan];
  return Boolean(limits[feature]);
}

/**
 * Helper pour vérifier si une limite est atteinte
 * @deprecated Use checkPlanLimit from plans.config.ts or usePlan hook instead
 */
export function isLimitReached(
  plan: PlanType,
  limitKey: keyof PlanLimits,
  currentValue: number
): boolean {
  const limits = PRICING_PLANS[plan];
  const limit = limits[limitKey];

  // -1 signifie illimité
  if (limit === -1) return false;

  // Pour les booléens, on ne peut pas atteindre de limite
  if (typeof limit === "boolean") return false;

  // Pour les nombres
  if (typeof limit === "number") {
    return currentValue >= limit;
  }

  return false;
}

/**
 * Helper pour obtenir le message d'erreur quand une limite est atteinte
 * @deprecated Use createLimitError from plan-helpers.ts instead
 */
export function getLimitErrorMessage(
  plan: PlanType,
  limitKey: keyof PlanLimits
): string {
  const limits = PRICING_PLANS[plan];
  const limit = limits[limitKey];

  const messages: Partial<Record<keyof PlanLimits, string>> = {
    maxClients: `Vous avez atteint la limite de ${limit} clients pour le plan ${PLAN_PRICING[plan].name}. Passez au plan supérieur pour ajouter plus de clients.`,
    maxProducts: `Vous avez atteint la limite de ${limit} produits pour le plan ${PLAN_PRICING[plan].name}.`,
    maxDocumentsPerMonth: `Vous avez atteint la limite de ${limit} documents ce mois-ci. Passez au plan supérieur pour créer plus de documents.`,
    maxUsers: `Vous avez atteint la limite de ${limit} utilisateur(s) pour le plan ${PLAN_PRICING[plan].name}.`,
    maxQuestionsPerMonth: `Vous avez atteint la limite de ${limit} questions ce mois-ci. Passez au plan supérieur pour poser plus de questions à l'assistant.`,
  };

  return (
    messages[limitKey] ||
    `Cette fonctionnalité n'est pas disponible dans votre plan ${PLAN_PRICING[plan].name}.`
  );
}

/**
 * Helper pour obtenir le plan recommandé quand une limite est atteinte
 * @deprecated
 */
export function getRecommendedUpgrade(
  currentPlan: PlanType,
  limitKey: keyof PlanLimits
): PlanType | null {
  const planOrder: PlanType[] = ["FREE", "STARTER", "PRO", "ENTERPRISE"];
  const currentIndex = planOrder.indexOf(currentPlan);

  // Chercher le prochain plan qui a cette feature
  for (let i = currentIndex + 1; i < planOrder.length; i++) {
    const nextPlan = planOrder[i];
    const nextLimits = PRICING_PLANS[nextPlan];
    const limit = nextLimits[limitKey];

    // Si c'est un booléen et qu'il est true, ou si c'est un nombre plus élevé
    if (typeof limit === "boolean" && limit === true) {
      return nextPlan;
    }

    if (typeof limit === "number" && limit === -1) {
      return nextPlan;
    }
  }

  return null;
}

/**
 * Helper pour formatter un nombre avec limite (-1 = illimité)
 * @deprecated
 */
export function formatLimit(limit: number): string {
  return limit === -1 ? "Illimité" : limit.toString();
}

/**
 * Liste des features pour chaque plan (pour affichage sur la landing)
 * @deprecated Kept for backward compatibility
 */
export const PLAN_FEATURES = {
  FREE: [
    "10 clients max",
    "10 articles",
    "10 documents/mois",
    "1 utilisateur",
    "Gestion stock basique",
    "Pas d'assistant IA",
  ],
  STARTER: [
    "50 clients",
    "100 articles",
    "Documents illimités",
    "3 utilisateurs",
    "Gestion stock avancée",
    "Assistant IA (100 questions/mois)",
    "Programme de fidélité",
    "Support email",
    "Export Excel/PDF",
  ],
  PRO: [
    "Clients illimités",
    "Articles illimités",
    "Documents illimités",
    "10 utilisateurs",
    "Assistant IA illimité",
    "Programme de fidélité avancé",
    "Segmentation clients",
    "Campagnes marketing",
    "Analytics avancées",
    "Support prioritaire",
    "API REST complète",
  ],
  ENTERPRISE: [
    "Tout illimité",
    "Utilisateurs illimités",
    "Support dédié 24/7",
    "Gestionnaire de compte",
    "API avancée",
    "SLA 99.9% garanti",
    "Onboarding personnalisé",
    "Formations incluses",
    "Intégrations sur mesure",
    "Accès early features",
  ],
} as const;
