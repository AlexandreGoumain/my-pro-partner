/**
 * Configuration centralisée des plans et fonctionnalités
 *
 * Ce fichier est la source unique de vérité pour :
 * - Les plans disponibles
 * - Les limites par plan
 * - Les features disponibles par plan
 * - Les feature flags globaux
 */

// ============================================
// TYPES
// ============================================

export type PlanType = "FREE" | "STARTER" | "PRO" | "ENTERPRISE";

export interface PlanLimits {
    // Utilisateurs
    maxUsers: number;
    maxClients: number;

    // Documents
    maxDocumentsPerMonth: number;
    maxDocumentsTotal: number;

    // Catalogue
    maxProducts: number;
    maxCategories: number;

    // Multi-store
    maxStores: number;

    // Marketing
    maxSegments: number;
    maxCampaignsPerMonth: number;
    maxAutomations: number;

    // AI
    maxChatbotMessages: number;
    maxQuestionsPerMonth: number;

    // Stockage
    maxStorageGB: number;

    // Support
    prioritySupport: boolean;
    dedicatedAccountManager: boolean;
    supportType: "none" | "email_24h" | "email_priority" | "dedicated_24_7";

    // Assistant
    assistantResponseTime: "standard" | "fast" | "ultra-fast";
}

export interface PlanFeatures {
    // Core
    multiTenant: boolean;
    clientPortal: boolean;

    // Documents
    quotes: boolean;
    invoices: boolean;
    creditNotes: boolean;
    documentSeries: boolean;
    pdfGeneration: boolean;
    documentTemplates: boolean;
    quoteToInvoice: boolean;
    emailDocuments: boolean;
    customTemplates: boolean;
    pdfExport: boolean;
    excelExport: boolean;

    // CRM
    clientManagement: boolean;
    clientSegmentation: boolean;
    loyaltyProgram: boolean;
    clientScoring: boolean;
    clientHistory: boolean;
    importClients: boolean;
    exportClients: boolean;

    // Catalogue
    productManagement: boolean;
    stockManagement: boolean;
    multiStore: boolean;
    stockTransfers: boolean;
    customFields: boolean;
    basicStock: boolean;
    advancedStock: boolean;
    stockMovements: boolean;
    lowStockAlerts: boolean;
    suppliers: boolean;

    // Finance
    payments: boolean;
    paymentLinks: boolean;
    bankReconciliation: boolean;
    fecExport: boolean;

    // POS
    pointOfSale: boolean;
    paymentTerminals: boolean; // Feature flag

    // Marketing
    emailCampaigns: boolean;
    automations: boolean;
    automatedReminders: boolean;
    automatedEmails: boolean;
    automatedSMS: boolean;
    campaigns: boolean;
    monitoring24_7: boolean;

    // Analytics
    analytics: boolean;
    advancedReports: boolean;
    customDashboards: boolean;
    basicAnalytics: boolean;
    advancedAnalytics: boolean;
    predictions: boolean;
    profitability: boolean;
    exportReports: boolean;

    // Gestion des impayés
    debtors: boolean;
    paymentReminders: boolean;
    automatedPaymentReminders: boolean;
    debtorScoring: boolean;

    // Team
    teamManagement: boolean;
    rolesPermissions: boolean;
    timeTracking: boolean;

    // Integrations
    apiAccess: boolean;
    webhooks: boolean;
    thirdPartyIntegrations: boolean;
    accountingIntegration: boolean;
    customIntegrations: boolean;

    // AI
    aiChatbot: boolean;

    // Support
    accountManager: boolean;
    onboarding: boolean;
    training: boolean;

    // Advanced
    whiteLabel: boolean;
    customDomain: boolean;
    sla: boolean;
    earlyAccess: boolean;
}

export interface Plan {
    id: PlanType;
    name: string;
    description: string;
    price: {
        monthly: number;
        yearly: number;
    };
    limits: PlanLimits;
    features: PlanFeatures;
    popular?: boolean;
    recommended?: boolean;
}

// ============================================
// FEATURE FLAGS GLOBAUX
// ============================================

/**
 * Feature flags pour activer/désactiver des fonctionnalités globalement
 * Indépendamment des plans
 */
export const GLOBAL_FEATURE_FLAGS = {
    /**
     * Terminaux de paiement physiques (Stripe Terminal)
     * Nécessite du matériel - désactivé par défaut
     */
    ENABLE_PAYMENT_TERMINALS: false,

    /**
     * SMS Campaigns (Twilio)
     * Nécessite configuration - désactivé par défaut
     */
    ENABLE_SMS_CAMPAIGNS: false,

    /**
     * Tables & Reservations
     * En cours de développement
     */
    ENABLE_RESERVATIONS: false,

    /**
     * Upload d'images produits
     * En cours de développement
     */
    ENABLE_PRODUCT_IMAGES: false,
} as const;

// ============================================
// CONFIGURATION DES PLANS
// ============================================

export const PLANS_CONFIG: Record<PlanType, Plan> = {
    FREE: {
        id: "FREE",
        name: "Gratuit",
        description: "Pour tester MyProPartner",
        price: {
            monthly: 0,
            yearly: 0,
        },
        limits: {
            maxUsers: 1,
            maxClients: 50,
            maxDocumentsPerMonth: 20,
            maxDocumentsTotal: 100,
            maxProducts: 50,
            maxCategories: 10,
            maxStores: 1,
            maxSegments: 3,
            maxCampaignsPerMonth: 1,
            maxAutomations: 0,
            maxChatbotMessages: 0,
            maxQuestionsPerMonth: 0,
            maxStorageGB: 1,
            prioritySupport: false,
            dedicatedAccountManager: false,
            supportType: "none",
            assistantResponseTime: "standard",
        },
        features: {
            multiTenant: true,
            clientPortal: true,
            quotes: true,
            invoices: true,
            creditNotes: false,
            documentSeries: false,
            pdfGeneration: true,
            documentTemplates: false,
            quoteToInvoice: true,
            emailDocuments: true,
            customTemplates: false,
            pdfExport: true,
            excelExport: false,
            clientManagement: true,
            clientSegmentation: true,
            loyaltyProgram: false,
            clientScoring: false,
            clientHistory: true,
            importClients: true,
            exportClients: true,
            productManagement: true,
            stockManagement: true,
            multiStore: false,
            stockTransfers: false,
            customFields: false,
            basicStock: true,
            advancedStock: false,
            stockMovements: true,
            lowStockAlerts: true,
            suppliers: true,
            payments: true,
            paymentLinks: false,
            bankReconciliation: false,
            fecExport: false,
            pointOfSale: true,
            paymentTerminals: false,
            emailCampaigns: false,
            automations: false,
            automatedReminders: false,
            automatedEmails: false,
            automatedSMS: false,
            campaigns: false,
            monitoring24_7: false,
            analytics: true,
            advancedReports: false,
            customDashboards: false,
            basicAnalytics: true,
            advancedAnalytics: false,
            predictions: false,
            profitability: false,
            exportReports: false,
            debtors: true,
            paymentReminders: true,
            automatedPaymentReminders: false,
            debtorScoring: false,
            teamManagement: false,
            rolesPermissions: false,
            timeTracking: false,
            apiAccess: false,
            webhooks: false,
            thirdPartyIntegrations: false,
            accountingIntegration: false,
            customIntegrations: false,
            aiChatbot: false,
            accountManager: false,
            onboarding: false,
            training: false,
            whiteLabel: false,
            customDomain: false,
            sla: false,
            earlyAccess: false,
        },
    },

    STARTER: {
        id: "STARTER",
        name: "Starter",
        description: "Pour les petites entreprises",
        price: {
            monthly: 29,
            yearly: 290, // ~24€/mois
        },
        limits: {
            maxUsers: 3,
            maxClients: 500,
            maxDocumentsPerMonth: 100,
            maxDocumentsTotal: 2000,
            maxProducts: 200,
            maxCategories: 30,
            maxStores: 2,
            maxSegments: 10,
            maxCampaignsPerMonth: 10,
            maxAutomations: 5,
            maxChatbotMessages: 50,
            maxQuestionsPerMonth: 100,
            maxStorageGB: 5,
            prioritySupport: false,
            dedicatedAccountManager: false,
            supportType: "email_24h",
            assistantResponseTime: "standard",
        },
        features: {
            multiTenant: true,
            clientPortal: true,
            quotes: true,
            invoices: true,
            creditNotes: true,
            documentSeries: true,
            pdfGeneration: true,
            documentTemplates: true,
            quoteToInvoice: true,
            emailDocuments: true,
            customTemplates: true,
            pdfExport: true,
            excelExport: true,
            clientManagement: true,
            clientSegmentation: true,
            loyaltyProgram: true,
            clientScoring: true,
            clientHistory: true,
            importClients: true,
            exportClients: true,
            productManagement: true,
            stockManagement: true,
            multiStore: true,
            stockTransfers: true,
            customFields: true,
            basicStock: true,
            advancedStock: true,
            stockMovements: true,
            lowStockAlerts: true,
            suppliers: true,
            payments: true,
            paymentLinks: true,
            bankReconciliation: true,
            fecExport: true,
            pointOfSale: true,
            paymentTerminals: true,
            emailCampaigns: true,
            automations: true,
            automatedReminders: true,
            automatedEmails: true,
            automatedSMS: false,
            campaigns: true,
            monitoring24_7: false,
            analytics: true,
            advancedReports: false,
            customDashboards: false,
            basicAnalytics: true,
            advancedAnalytics: true,
            predictions: false,
            profitability: true,
            exportReports: true,
            debtors: true,
            paymentReminders: true,
            automatedPaymentReminders: true,
            debtorScoring: true,
            teamManagement: true,
            rolesPermissions: true,
            timeTracking: true,
            apiAccess: false,
            webhooks: false,
            thirdPartyIntegrations: false,
            accountingIntegration: true,
            customIntegrations: false,
            aiChatbot: true,
            accountManager: false,
            onboarding: false,
            training: false,
            whiteLabel: false,
            customDomain: false,
            sla: false,
            earlyAccess: false,
        },
        popular: true,
    },

    PRO: {
        id: "PRO",
        name: "Pro",
        description: "Pour les entreprises en croissance",
        price: {
            monthly: 79,
            yearly: 790, // ~66€/mois
        },
        limits: {
            maxUsers: 10,
            maxClients: 5000,
            maxDocumentsPerMonth: 500,
            maxDocumentsTotal: -1, // Unlimited
            maxProducts: 1000,
            maxCategories: 100,
            maxStores: 5,
            maxSegments: 50,
            maxCampaignsPerMonth: 50,
            maxAutomations: 20,
            maxChatbotMessages: -1, // Unlimited
            maxQuestionsPerMonth: -1, // Unlimited
            maxStorageGB: 20,
            prioritySupport: true,
            dedicatedAccountManager: false,
            supportType: "email_priority",
            assistantResponseTime: "fast",
        },
        features: {
            multiTenant: true,
            clientPortal: true,
            quotes: true,
            invoices: true,
            creditNotes: true,
            documentSeries: true,
            pdfGeneration: true,
            documentTemplates: true,
            quoteToInvoice: true,
            emailDocuments: true,
            customTemplates: true,
            pdfExport: true,
            excelExport: true,
            clientManagement: true,
            clientSegmentation: true,
            loyaltyProgram: true,
            clientScoring: true,
            clientHistory: true,
            importClients: true,
            exportClients: true,
            productManagement: true,
            stockManagement: true,
            multiStore: true,
            stockTransfers: true,
            customFields: true,
            basicStock: true,
            advancedStock: true,
            stockMovements: true,
            lowStockAlerts: true,
            suppliers: true,
            payments: true,
            paymentLinks: true,
            bankReconciliation: true,
            fecExport: true,
            pointOfSale: true,
            paymentTerminals: true,
            emailCampaigns: true,
            automations: true,
            automatedReminders: true,
            automatedEmails: true,
            automatedSMS: true,
            campaigns: true,
            monitoring24_7: true,
            analytics: true,
            advancedReports: true,
            customDashboards: true,
            basicAnalytics: true,
            advancedAnalytics: true,
            predictions: true,
            profitability: true,
            exportReports: true,
            debtors: true,
            paymentReminders: true,
            automatedPaymentReminders: true,
            debtorScoring: true,
            teamManagement: true,
            rolesPermissions: true,
            timeTracking: true,
            apiAccess: true,
            webhooks: true,
            thirdPartyIntegrations: true,
            accountingIntegration: true,
            customIntegrations: false,
            aiChatbot: true,
            accountManager: false,
            onboarding: true,
            training: true,
            whiteLabel: false,
            customDomain: false,
            sla: true,
            earlyAccess: true,
        },
        recommended: true,
    },

    ENTERPRISE: {
        id: "ENTERPRISE",
        name: "Enterprise",
        description: "Pour les grandes organisations",
        price: {
            monthly: 199,
            yearly: 1990, // ~166€/mois
        },
        limits: {
            maxUsers: -1, // Unlimited
            maxClients: -1, // Unlimited
            maxDocumentsPerMonth: -1, // Unlimited
            maxDocumentsTotal: -1, // Unlimited
            maxProducts: -1, // Unlimited
            maxCategories: -1, // Unlimited
            maxStores: -1, // Unlimited
            maxSegments: -1, // Unlimited
            maxCampaignsPerMonth: -1, // Unlimited
            maxAutomations: -1, // Unlimited
            maxChatbotMessages: -1, // Unlimited
            maxQuestionsPerMonth: -1, // Unlimited
            maxStorageGB: 100,
            prioritySupport: true,
            dedicatedAccountManager: true,
            supportType: "dedicated_24_7",
            assistantResponseTime: "ultra-fast",
        },
        features: {
            multiTenant: true,
            clientPortal: true,
            quotes: true,
            invoices: true,
            creditNotes: true,
            documentSeries: true,
            pdfGeneration: true,
            documentTemplates: true,
            quoteToInvoice: true,
            emailDocuments: true,
            customTemplates: true,
            pdfExport: true,
            excelExport: true,
            clientManagement: true,
            clientSegmentation: true,
            loyaltyProgram: true,
            clientScoring: true,
            clientHistory: true,
            importClients: true,
            exportClients: true,
            productManagement: true,
            stockManagement: true,
            multiStore: true,
            stockTransfers: true,
            customFields: true,
            basicStock: true,
            advancedStock: true,
            stockMovements: true,
            lowStockAlerts: true,
            suppliers: true,
            payments: true,
            paymentLinks: true,
            bankReconciliation: true,
            fecExport: true,
            pointOfSale: true,
            paymentTerminals: true,
            emailCampaigns: true,
            automations: true,
            automatedReminders: true,
            automatedEmails: true,
            automatedSMS: true,
            campaigns: true,
            monitoring24_7: true,
            analytics: true,
            advancedReports: true,
            customDashboards: true,
            basicAnalytics: true,
            advancedAnalytics: true,
            predictions: true,
            profitability: true,
            exportReports: true,
            debtors: true,
            paymentReminders: true,
            automatedPaymentReminders: true,
            debtorScoring: true,
            teamManagement: true,
            rolesPermissions: true,
            timeTracking: true,
            apiAccess: true,
            webhooks: true,
            thirdPartyIntegrations: true,
            accountingIntegration: true,
            customIntegrations: true,
            aiChatbot: true,
            accountManager: true,
            onboarding: true,
            training: true,
            whiteLabel: true,
            customDomain: true,
            sla: true,
            earlyAccess: true,
        },
    },
};

// ============================================
// HELPERS
// ============================================

/**
 * Récupère la configuration d'un plan
 */
export function getPlanConfig(planType: PlanType): Plan {
    return PLANS_CONFIG[planType];
}

/**
 * Vérifie si une feature est disponible pour un plan
 */
export function isPlanFeatureEnabled(
    planType: PlanType,
    feature: keyof PlanFeatures
): boolean {
    return PLANS_CONFIG[planType].features[feature];
}

/**
 * Vérifie si une limite est atteinte
 * @returns true si la limite n'est PAS atteinte (donc OK pour continuer)
 */
export function checkPlanLimit(
    planType: PlanType,
    limitKey: keyof PlanLimits,
    currentValue: number
): boolean {
    const limit = PLANS_CONFIG[planType].limits[limitKey];

    // -1 = unlimited
    if (typeof limit === "number" && limit === -1) return true;
    if (typeof limit === "boolean") return limit;

    return currentValue < (limit as number);
}

/**
 * Récupère la limite pour un plan
 */
export function getPlanLimit(
    planType: PlanType,
    limitKey: keyof PlanLimits
): number | boolean {
    return PLANS_CONFIG[planType].limits[limitKey] as number | boolean;
}

/**
 * Vérifie si une feature globale est activée
 */
export function isGlobalFeatureEnabled(
    feature: keyof typeof GLOBAL_FEATURE_FLAGS
): boolean {
    return GLOBAL_FEATURE_FLAGS[feature];
}

/**
 * Vérifie si une feature est disponible (plan + global flag)
 * Combine la vérification du plan ET du feature flag global
 */
export function isFeatureAvailable(
    planType: PlanType,
    planFeature: keyof PlanFeatures,
    globalFeature?: keyof typeof GLOBAL_FEATURE_FLAGS
): boolean {
    // Vérifier d'abord le plan
    const planHasFeature = isPlanFeatureEnabled(planType, planFeature);
    if (!planHasFeature) return false;

    // Si pas de feature flag global, c'est OK
    if (!globalFeature) return true;

    // Vérifier le feature flag global
    return isGlobalFeatureEnabled(globalFeature);
}

/**
 * Liste toutes les features disponibles pour un plan
 */
export function getAvailableFeatures(
    planType: PlanType
): Array<keyof PlanFeatures> {
    const plan = PLANS_CONFIG[planType];
    return (Object.keys(plan.features) as Array<keyof PlanFeatures>).filter(
        (key) => plan.features[key]
    );
}

/**
 * Compare deux plans (retourne true si plan2 est meilleur que plan1)
 */
export function isPlanUpgrade(
    currentPlan: PlanType,
    newPlan: PlanType
): boolean {
    const planOrder: PlanType[] = ["FREE", "STARTER", "PRO", "ENTERPRISE"];
    return planOrder.indexOf(newPlan) > planOrder.indexOf(currentPlan);
}

/**
 * Obtient tous les plans (utile pour la page pricing)
 */
export function getAllPlans(): Plan[] {
    return Object.values(PLANS_CONFIG);
}

/**
 * Prix des plans (pour rétrocompatibilité)
 * Maps plan types to their basic info
 */
export const PLAN_PRICING: Record<
    PlanType,
    { name: string; price: { monthly: number; yearly: number } }
> = {
    FREE: {
        name: PLANS_CONFIG.FREE.name,
        price: PLANS_CONFIG.FREE.price,
    },
    STARTER: {
        name: PLANS_CONFIG.STARTER.name,
        price: PLANS_CONFIG.STARTER.price,
    },
    PRO: {
        name: PLANS_CONFIG.PRO.name,
        price: PLANS_CONFIG.PRO.price,
    },
    ENTERPRISE: {
        name: PLANS_CONFIG.ENTERPRISE.name,
        price: PLANS_CONFIG.ENTERPRISE.price,
    },
};

/**
 * Liste des features pour chaque plan (pour affichage sur la landing page)
 */
export const PLAN_FEATURES = {
    FREE: [
        "50 clients max",
        "50 articles",
        "20 documents/mois",
        "1 utilisateur",
        "Gestion stock basique",
        "Pas d'assistant IA",
    ],
    STARTER: [
        "500 clients",
        "200 articles",
        "100 documents/mois",
        "3 utilisateurs",
        "Gestion stock avancée",
        "Assistant IA (100 questions/mois)",
        "Programme de fidélité",
        "Support email",
        "Export Excel/PDF",
    ],
    PRO: [
        "5000 clients",
        "1000 articles",
        "500 documents/mois",
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
