/**
 * Carte d'invalidation croisée des ressources
 * Définit quelles ressources doivent être invalidées lorsqu'une mutation survient
 *
 * @example
 * Quand un document est créé :
 * - Invalider les documents (évident)
 * - Invalider le client concerné (son solde a changé)
 * - Invalider les stats globales
 */

export type ResourceName =
    | "clients"
    | "articles"
    | "categories"
    | "documents"
    | "stock-movements"
    | "loyalty-points"
    | "loyalty-levels"
    | "segments"
    | "campaigns"
    | "automations"
    | "custom-fields"
    | "payment-links"
    | "stores"
    | "terminals"
    | "users"
    | "rachats"
    | "demontages"
    | "reservations"
    | "bank-transactions"
    | "company-settings"
    | "notification-settings";

export type MutationType = "create" | "update" | "delete";

/**
 * Configuration d'une règle d'invalidation
 */
interface InvalidationRule {
    /** Ressources à invalider (query keys à invalider) */
    resources: ResourceName[];
    /** Si true, invalide aussi les stats de ces ressources */
    includeStats?: boolean;
    /** Fonction custom pour invalider des ressources spécifiques (ex: un client en particulier) */
    customInvalidation?: (context: MutationContext) => string[][];
}

/**
 * Contexte d'une mutation pour l'invalidation custom
 */
export interface MutationContext {
    /** ID de la ressource mutée */
    resourceId?: string;
    /** Données de la mutation */
    data?: Record<string, unknown>;
    /** Variables additionnelles */
    variables?: Record<string, unknown>;
}

/**
 * Carte complète des invalidations croisées
 * Structure : resource -> mutationType -> InvalidationRule
 */
export const INVALIDATION_MAP: Record<
    ResourceName,
    Partial<Record<MutationType, InvalidationRule>>
> = {
    // CLIENTS
    clients: {
        create: {
            resources: ["clients", "segments"],
            includeStats: true,
        },
        update: {
            resources: ["clients", "segments", "documents"],
            includeStats: true,
            customInvalidation: (context) => {
                const clientId = context.resourceId;
                return clientId
                    ? [
                          ["clients", clientId],
                          ["documents", "list"],
                      ]
                    : [];
            },
        },
        delete: {
            resources: ["clients", "segments", "documents"],
            includeStats: true,
        },
    },

    // ARTICLES
    articles: {
        create: {
            resources: ["articles"],
            includeStats: true,
        },
        update: {
            resources: ["articles", "stock-movements"],
            includeStats: true,
            customInvalidation: (context) => {
                const articleId = context.resourceId;
                return articleId ? [["articles", articleId]] : [];
            },
        },
        delete: {
            resources: ["articles"],
            includeStats: true,
        },
    },

    // CATEGORIES
    categories: {
        create: {
            resources: ["categories", "articles"],
        },
        update: {
            resources: ["categories", "articles"],
            customInvalidation: (context) => {
                const categoryId = context.resourceId;
                return categoryId ? [["categories", categoryId]] : [];
            },
        },
        delete: {
            resources: ["categories", "articles"],
        },
    },

    // DOCUMENTS (Factures, Devis, etc.)
    documents: {
        create: {
            resources: ["documents", "clients"],
            includeStats: true,
            customInvalidation: (context) => {
                const clientId = context.data?.clientId as string | undefined;
                return clientId
                    ? [
                          ["clients", clientId],
                          ["clients", "stats"],
                      ]
                    : [];
            },
        },
        update: {
            resources: ["documents", "clients"],
            includeStats: true,
            customInvalidation: (context) => {
                const clientId = context.data?.clientId as string | undefined;
                const docId = context.resourceId;
                const result: string[][] = [];
                if (clientId) {
                    result.push(["clients", clientId]);
                }
                if (docId) {
                    result.push(["documents", "detail", docId]);
                }
                return result;
            },
        },
        delete: {
            resources: ["documents", "clients"],
            includeStats: true,
        },
    },

    // MOUVEMENTS DE STOCK
    "stock-movements": {
        create: {
            resources: ["stock-movements", "articles"],
            includeStats: true,
            customInvalidation: (context) => {
                const articleId = context.data?.articleId as string | undefined;
                return articleId
                    ? [
                          ["articles", articleId],
                          ["articles", "stats"],
                      ]
                    : [];
            },
        },
        delete: {
            resources: ["stock-movements", "articles"],
            includeStats: true,
        },
    },

    // POINTS DE FIDÉLITÉ
    "loyalty-points": {
        create: {
            resources: ["loyalty-points", "clients"],
            customInvalidation: (context) => {
                const clientId = context.data?.clientId as string | undefined;
                return clientId ? [["clients", clientId], ["clients"]] : [];
            },
        },
        update: {
            resources: ["loyalty-points", "clients"],
        },
        delete: {
            resources: ["loyalty-points", "clients"],
        },
    },

    // NIVEAUX DE FIDÉLITÉ
    "loyalty-levels": {
        create: {
            resources: ["loyalty-levels", "clients"],
        },
        update: {
            resources: ["loyalty-levels", "clients"],
        },
        delete: {
            resources: ["loyalty-levels", "clients"],
        },
    },

    // SEGMENTS
    segments: {
        create: {
            resources: ["segments"],
        },
        update: {
            resources: ["segments", "clients", "campaigns"],
            customInvalidation: (context) => {
                const segmentId = context.resourceId;
                return segmentId ? [["segments", segmentId]] : [];
            },
        },
        delete: {
            resources: ["segments", "campaigns"],
        },
    },

    // CAMPAGNES
    campaigns: {
        create: {
            resources: ["campaigns"],
        },
        update: {
            resources: ["campaigns", "segments"],
            customInvalidation: (context) => {
                const campaignId = context.resourceId;
                return campaignId ? [["campaigns", campaignId]] : [];
            },
        },
        delete: {
            resources: ["campaigns"],
        },
    },

    // AUTOMATIONS
    automations: {
        create: {
            resources: ["automations"],
        },
        update: {
            resources: ["automations"],
        },
        delete: {
            resources: ["automations"],
        },
    },

    // CHAMPS PERSONNALISÉS
    "custom-fields": {
        create: {
            resources: ["custom-fields"],
        },
        update: {
            resources: ["custom-fields"],
        },
        delete: {
            resources: ["custom-fields"],
        },
    },

    // LIENS DE PAIEMENT
    "payment-links": {
        create: {
            resources: ["payment-links"],
        },
        update: {
            resources: ["payment-links"],
        },
        delete: {
            resources: ["payment-links"],
        },
    },

    // MAGASINS
    stores: {
        create: {
            resources: ["stores"],
        },
        update: {
            resources: ["stores", "articles"],
        },
        delete: {
            resources: ["stores", "articles"],
        },
    },

    // TERMINAUX
    terminals: {
        create: {
            resources: ["terminals"],
        },
        update: {
            resources: ["terminals"],
        },
        delete: {
            resources: ["terminals"],
        },
    },

    // UTILISATEURS
    users: {
        create: {
            resources: ["users"],
        },
        update: {
            resources: ["users"],
        },
        delete: {
            resources: ["users"],
        },
    },

    // RACHATS
    rachats: {
        create: {
            resources: ["rachats", "articles"],
            includeStats: true,
        },
        update: {
            resources: ["rachats", "articles"],
        },
        delete: {
            resources: ["rachats", "articles"],
        },
    },

    // DÉMONTAGES
    demontages: {
        create: {
            resources: ["demontages", "articles"],
            includeStats: true,
            customInvalidation: (context) => {
                // Invalide l'article source qui a été démonté
                const articleSourceId = context.data?.articleSourceId as
                    | string
                    | undefined;
                return articleSourceId
                    ? [["articles", articleSourceId], ["articles"]]
                    : [];
            },
        },
        delete: {
            resources: ["demontages", "articles"],
        },
    },

    // RÉSERVATIONS
    reservations: {
        create: {
            resources: ["reservations", "clients"],
        },
        update: {
            resources: ["reservations", "clients"],
        },
        delete: {
            resources: ["reservations", "clients"],
        },
    },

    // TRANSACTIONS BANCAIRES
    "bank-transactions": {
        create: {
            resources: ["bank-transactions"],
            includeStats: true,
        },
        update: {
            resources: ["bank-transactions"],
        },
        delete: {
            resources: ["bank-transactions"],
            includeStats: true,
        },
    },

    // PARAMÈTRES D'ENTREPRISE
    "company-settings": {
        update: {
            resources: ["company-settings"],
        },
    },

    // PARAMÈTRES DE NOTIFICATIONS
    "notification-settings": {
        update: {
            resources: ["notification-settings"],
        },
    },
};

/**
 * Récupère les règles d'invalidation pour une mutation donnée
 */
export function getInvalidationRules(
    resource: ResourceName,
    mutationType: MutationType
): InvalidationRule | undefined {
    return INVALIDATION_MAP[resource]?.[mutationType];
}
