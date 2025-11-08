/**
 * Configuration complète du pricing et des limitations par plan
 * À utiliser dans toute l'application pour gérer les permissions et limites
 */

export type PlanType = "FREE" | "STARTER" | "PRO" | "ENTERPRISE";

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
 * Configuration complète de chaque plan
 */
export const PRICING_PLANS: Record<PlanType, PlanLimits> = {
    FREE: {
        // Limites de base
        maxClients: 10,
        maxProducts: 10,
        maxDocumentsPerMonth: 10,
        maxUsers: 1,

        // Assistant
        maxQuestionsPerMonth: 0,
        hasAssistant: false,
        assistantResponseTime: "standard",

        // Documents
        canCreateQuotes: true,
        canCreateInvoices: true,
        canConvertQuoteToInvoice: true,
        canSendEmailDocuments: false,
        canCustomizeTemplates: false,
        canExportPDF: true,
        canExportExcel: false,

        // Clients
        canSegmentClients: false,
        canScoreClients: false,
        hasClientHistory: true,
        canImportClients: false,
        canExportClients: false,

        // Stock
        hasBasicStock: true,
        hasAdvancedStock: false,
        canTrackStockMovements: false,
        hasLowStockAlerts: false,
        canManageSuppliers: false,

        // Analytics
        hasBasicAnalytics: true,
        hasAdvancedAnalytics: false,
        hasPredictions: false,
        hasProfitabilityAnalysis: false,
        canExportReports: false,

        // Automatisations
        hasAutomatedReminders: false,
        hasAutomatedEmails: false,
        hasAutomatedSMS: false,
        canCreateCampaigns: false,
        has24_7Monitoring: false,

        // Impayés
        canViewDebtors: true,
        canSendPaymentReminders: false,
        hasAutomatedPaymentReminders: false,
        hasDebtorScoring: false,

        // API
        hasAPIAccess: false,
        canUseWebhooks: false,
        canIntegrateAccounting: false,
        hasCustomIntegrations: false,

        // Support
        supportType: "none",
        hasAccountManager: false,
        hasOnboarding: false,
        hasTraining: false,

        // Autres
        hasSLA: false,
        hasEarlyAccess: false,
        canWhiteLabel: false,
    },

    STARTER: {
        // Limites de base
        maxClients: 50,
        maxProducts: 100,
        maxDocumentsPerMonth: -1, // Illimité
        maxUsers: 3,

        // Assistant
        maxQuestionsPerMonth: 100,
        hasAssistant: true,
        assistantResponseTime: "standard",

        // Documents
        canCreateQuotes: true,
        canCreateInvoices: true,
        canConvertQuoteToInvoice: true,
        canSendEmailDocuments: true,
        canCustomizeTemplates: true,
        canExportPDF: true,
        canExportExcel: true,

        // Clients
        canSegmentClients: false,
        canScoreClients: false,
        hasClientHistory: true,
        canImportClients: true,
        canExportClients: true,

        // Stock
        hasBasicStock: true,
        hasAdvancedStock: true,
        canTrackStockMovements: true,
        hasLowStockAlerts: true,
        canManageSuppliers: false,

        // Analytics
        hasBasicAnalytics: true,
        hasAdvancedAnalytics: false,
        hasPredictions: false,
        hasProfitabilityAnalysis: false,
        canExportReports: true,

        // Automatisations
        hasAutomatedReminders: false,
        hasAutomatedEmails: false,
        hasAutomatedSMS: false,
        canCreateCampaigns: false,
        has24_7Monitoring: false,

        // Impayés
        canViewDebtors: true,
        canSendPaymentReminders: true,
        hasAutomatedPaymentReminders: false,
        hasDebtorScoring: false,

        // API
        hasAPIAccess: false,
        canUseWebhooks: false,
        canIntegrateAccounting: false,
        hasCustomIntegrations: false,

        // Support
        supportType: "email_24h",
        hasAccountManager: false,
        hasOnboarding: false,
        hasTraining: false,

        // Autres
        hasSLA: false,
        hasEarlyAccess: false,
        canWhiteLabel: false,
    },

    PRO: {
        // Limites de base
        maxClients: -1, // Illimité
        maxProducts: -1, // Illimité
        maxDocumentsPerMonth: -1, // Illimité
        maxUsers: 10,

        // Assistant
        maxQuestionsPerMonth: -1, // Illimité
        hasAssistant: true,
        assistantResponseTime: "fast",

        // Documents
        canCreateQuotes: true,
        canCreateInvoices: true,
        canConvertQuoteToInvoice: true,
        canSendEmailDocuments: true,
        canCustomizeTemplates: true,
        canExportPDF: true,
        canExportExcel: true,

        // Clients
        canSegmentClients: true,
        canScoreClients: true,
        hasClientHistory: true,
        canImportClients: true,
        canExportClients: true,

        // Stock
        hasBasicStock: true,
        hasAdvancedStock: true,
        canTrackStockMovements: true,
        hasLowStockAlerts: true,
        canManageSuppliers: true,

        // Analytics
        hasBasicAnalytics: true,
        hasAdvancedAnalytics: true,
        hasPredictions: true,
        hasProfitabilityAnalysis: true,
        canExportReports: true,

        // Automatisations
        hasAutomatedReminders: true,
        hasAutomatedEmails: true,
        hasAutomatedSMS: true,
        canCreateCampaigns: true,
        has24_7Monitoring: true,

        // Impayés
        canViewDebtors: true,
        canSendPaymentReminders: true,
        hasAutomatedPaymentReminders: true,
        hasDebtorScoring: true,

        // API
        hasAPIAccess: true,
        canUseWebhooks: true,
        canIntegrateAccounting: true,
        hasCustomIntegrations: false,

        // Support
        supportType: "email_priority",
        hasAccountManager: false,
        hasOnboarding: false,
        hasTraining: false,

        // Autres
        hasSLA: false,
        hasEarlyAccess: false,
        canWhiteLabel: false,
    },

    ENTERPRISE: {
        // Limites de base
        maxClients: -1, // Illimité
        maxProducts: -1, // Illimité
        maxDocumentsPerMonth: -1, // Illimité
        maxUsers: -1, // Illimité

        // Assistant
        maxQuestionsPerMonth: -1, // Illimité
        hasAssistant: true,
        assistantResponseTime: "ultra-fast",

        // Documents
        canCreateQuotes: true,
        canCreateInvoices: true,
        canConvertQuoteToInvoice: true,
        canSendEmailDocuments: true,
        canCustomizeTemplates: true,
        canExportPDF: true,
        canExportExcel: true,

        // Clients
        canSegmentClients: true,
        canScoreClients: true,
        hasClientHistory: true,
        canImportClients: true,
        canExportClients: true,

        // Stock
        hasBasicStock: true,
        hasAdvancedStock: true,
        canTrackStockMovements: true,
        hasLowStockAlerts: true,
        canManageSuppliers: true,

        // Analytics
        hasBasicAnalytics: true,
        hasAdvancedAnalytics: true,
        hasPredictions: true,
        hasProfitabilityAnalysis: true,
        canExportReports: true,

        // Automatisations
        hasAutomatedReminders: true,
        hasAutomatedEmails: true,
        hasAutomatedSMS: true,
        canCreateCampaigns: true,
        has24_7Monitoring: true,

        // Impayés
        canViewDebtors: true,
        canSendPaymentReminders: true,
        hasAutomatedPaymentReminders: true,
        hasDebtorScoring: true,

        // API
        hasAPIAccess: true,
        canUseWebhooks: true,
        canIntegrateAccounting: true,
        hasCustomIntegrations: true,

        // Support
        supportType: "dedicated_24_7",
        hasAccountManager: true,
        hasOnboarding: true,
        hasTraining: true,

        // Autres
        hasSLA: true,
        hasEarlyAccess: true,
        canWhiteLabel: true,
    },
};

/**
 * Informations de prix pour affichage
 */
export const PLAN_PRICING = {
    FREE: {
        name: "Free",
        price: 0,
        annualPrice: 0,
        tagline: "Pour tester",
        ideal: "Découverte",
    },
    STARTER: {
        name: "Starter",
        price: 29,
        annualPrice: 24.17, // 290€/an ÷ 12 mois
        tagline: "L'essentiel pour démarrer",
        ideal: "Artisans",
        savings: "Économisez 58€/an",
    },
    PRO: {
        name: "Pro",
        price: 79,
        annualPrice: 65.83, // 790€/an ÷ 12 mois
        tagline: "Le plus populaire",
        ideal: "PME en croissance",
        popular: true,
        savings: "Économisez 158€/an",
    },
    ENTERPRISE: {
        name: "Entreprise",
        price: 299,
        annualPrice: 249.17, // 2990€/an ÷ 12 mois
        tagline: "Performance max",
        ideal: "Grandes équipes",
        premium: true,
        savings: "Économisez 598€/an",
    },
} as const;

/**
 * Helper pour obtenir les limites d'un plan
 */
export function getPlanLimits(plan: PlanType): PlanLimits {
    return PRICING_PLANS[plan];
}

/**
 * Helper pour vérifier si une fonctionnalité est disponible
 */
export function hasFeature(plan: PlanType, feature: keyof PlanLimits): boolean {
    const limits = PRICING_PLANS[plan];
    return Boolean(limits[feature]);
}

/**
 * Helper pour vérifier si une limite est atteinte
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

    return messages[limitKey] || `Cette fonctionnalité n'est pas disponible dans votre plan ${PLAN_PRICING[plan].name}.`;
}

/**
 * Helper pour obtenir le plan recommandé quand une limite est atteinte
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
 */
export function formatLimit(limit: number): string {
    return limit === -1 ? "Illimité" : limit.toString();
}

/**
 * Liste des features pour chaque plan (pour affichage sur la landing)
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
