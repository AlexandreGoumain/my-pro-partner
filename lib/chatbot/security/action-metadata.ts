// ============================================
// ACTION METADATA - Security & Confirmation
// ============================================

/**
 * Niveau de risque d'une action
 */
export type RiskLevel = "low" | "medium" | "high" | "critical";

/**
 * Métadonnées de sécurité pour une action du chatbot
 */
export interface ActionMetadata {
    /**
     * Nom de l'action (doit correspondre au nom de la fonction)
     */
    name: string;

    /**
     * Description lisible de l'action
     */
    description: string;

    /**
     * Niveau de risque
     */
    riskLevel: RiskLevel;

    /**
     * Si true, l'action nécessite une confirmation explicite de l'utilisateur
     */
    requiresConfirmation: boolean;

    /**
     * Catégorie de l'action (pour regroupement)
     */
    category: "read" | "create" | "update" | "delete" | "bulk" | "navigation";

    /**
     * Paramètres sensibles à masquer dans les logs
     */
    sensitiveParams?: string[];

    /**
     * Message de confirmation à afficher à l'utilisateur
     */
    confirmationMessage?: (params: Record<string, unknown>) => string;
}

/**
 * Registre de toutes les actions avec leurs métadonnées
 */
export const ACTION_REGISTRY: Record<string, ActionMetadata> = {
    // ============================================
    // NAVIGATION - Risque faible
    // ============================================
    navigate_to: {
        name: "navigate_to",
        description: "Naviguer vers une page de l'application",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "navigation",
    },

    // ============================================
    // CLIENTS - Lecture (Risque faible)
    // ============================================
    search_clients: {
        name: "search_clients",
        description: "Rechercher des clients",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },
    get_client_details: {
        name: "get_client_details",
        description: "Obtenir les détails d'un client",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },
    get_client_history: {
        name: "get_client_history",
        description: "Obtenir l'historique d'un client",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },

    // ============================================
    // CLIENTS - Création/Modification (Risque moyen)
    // ============================================
    create_client: {
        name: "create_client",
        description: "Créer un nouveau client",
        riskLevel: "medium",
        requiresConfirmation: true,
        category: "create",
        sensitiveParams: ["email", "telephone"],
        confirmationMessage: (params) =>
            `Voulez-vous créer le client "${params.nom as string}" ?`,
    },
    update_client: {
        name: "update_client",
        description: "Modifier les informations d'un client",
        riskLevel: "medium",
        requiresConfirmation: true,
        category: "update",
        sensitiveParams: ["email", "telephone"],
        confirmationMessage: (params) =>
            `Voulez-vous modifier le client "${params.clientId as string}" ?`,
    },
    add_loyalty_points: {
        name: "add_loyalty_points",
        description: "Ajouter/retirer des points de fidélité",
        riskLevel: "medium",
        requiresConfirmation: true,
        category: "update",
        confirmationMessage: (params) =>
            `Voulez-vous ${(params.points as number) > 0 ? "ajouter" : "retirer"} ${Math.abs(params.points as number)} points ?`,
    },

    // ============================================
    // CLIENTS - Suppression (Risque élevé)
    // ============================================
    delete_client: {
        name: "delete_client",
        description: "Supprimer définitivement un client",
        riskLevel: "critical",
        requiresConfirmation: true,
        category: "delete",
        confirmationMessage: (params) =>
            `⚠️ ATTENTION : Voulez-vous SUPPRIMER DÉFINITIVEMENT le client "${params.clientId as string}" ? Cette action est irréversible.`,
    },

    // ============================================
    // CLIENTS - Export (Risque moyen - RGPD)
    // ============================================
    export_clients: {
        name: "export_clients",
        description: "Exporter la liste des clients (données sensibles)",
        riskLevel: "high",
        requiresConfirmation: true,
        category: "bulk",
        confirmationMessage: () =>
            "Voulez-vous exporter les données clients ? Assurez-vous de respecter la RGPD.",
    },

    // ============================================
    // ARTICLES - Lecture (Risque faible)
    // ============================================
    search_articles: {
        name: "search_articles",
        description: "Rechercher des articles",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },
    get_article_details: {
        name: "get_article_details",
        description: "Obtenir les détails d'un article",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },
    list_categories: {
        name: "list_categories",
        description: "Lister les catégories d'articles",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },

    // ============================================
    // ARTICLES - Création/Modification (Risque moyen)
    // ============================================
    create_article: {
        name: "create_article",
        description: "Créer un nouvel article",
        riskLevel: "medium",
        requiresConfirmation: true,
        category: "create",
        confirmationMessage: (params) =>
            `Voulez-vous créer l'article "${params.nom as string}" au prix de ${params.prix as number}€ ?`,
    },
    update_article: {
        name: "update_article",
        description: "Modifier un article",
        riskLevel: "medium",
        requiresConfirmation: true,
        category: "update",
        confirmationMessage: (params) =>
            `Voulez-vous modifier l'article "${params.articleId as string}" ?`,
    },

    // ============================================
    // ARTICLES - Suppression (Risque élevé)
    // ============================================
    delete_article: {
        name: "delete_article",
        description: "Supprimer un article",
        riskLevel: "critical",
        requiresConfirmation: true,
        category: "delete",
        confirmationMessage: (params) =>
            `⚠️ Voulez-vous SUPPRIMER l'article "${params.articleId as string}" ?`,
    },

    // ============================================
    // STOCK - Lecture (Risque faible)
    // ============================================
    get_stock_alerts: {
        name: "get_stock_alerts",
        description: "Obtenir les alertes de stock",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },
    get_stock_history: {
        name: "get_stock_history",
        description: "Obtenir l'historique de stock",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },

    // ============================================
    // STOCK - Ajustement (Risque moyen à élevé)
    // ============================================
    adjust_stock: {
        name: "adjust_stock",
        description: "Ajuster le stock d'un article",
        riskLevel: "high",
        requiresConfirmation: true,
        category: "update",
        confirmationMessage: (params) =>
            `Voulez-vous ${params.type === "ENTREE" ? "ajouter" : "retirer"} ${Math.abs(params.quantite as number)} unités ${params.type === "ENTREE" ? "au" : "du"} stock ?`,
    },

    // ============================================
    // DOCUMENTS - Lecture (Risque faible)
    // ============================================
    search_documents: {
        name: "search_documents",
        description: "Rechercher des documents",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },
    get_document_details: {
        name: "get_document_details",
        description: "Obtenir les détails d'un document",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },
    get_payment_status: {
        name: "get_payment_status",
        description: "Obtenir le statut de paiement",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },

    // ============================================
    // DOCUMENTS - Création (Risque moyen)
    // ============================================
    create_document: {
        name: "create_document",
        description: "Créer un document (devis, facture, avoir)",
        riskLevel: "medium",
        requiresConfirmation: true,
        category: "create",
        confirmationMessage: (params) =>
            `Voulez-vous créer un ${params.type as string} ?`,
    },

    // ============================================
    // DOCUMENTS - Modification (Risque élevé)
    // ============================================
    update_document: {
        name: "update_document",
        description: "Modifier un document",
        riskLevel: "high",
        requiresConfirmation: true,
        category: "update",
        confirmationMessage: (params) =>
            `⚠️ Voulez-vous modifier le document "${params.documentId as string}" ?`,
    },
    add_payment: {
        name: "add_payment",
        description: "Enregistrer un paiement",
        riskLevel: "high",
        requiresConfirmation: true,
        category: "create",
        confirmationMessage: (params) =>
            `Voulez-vous enregistrer un paiement de ${params.montant as number}€ par ${params.methode as string} ?`,
    },

    // ============================================
    // DOCUMENTS - Suppression (Risque critique)
    // ============================================
    delete_document: {
        name: "delete_document",
        description: "Supprimer un document",
        riskLevel: "critical",
        requiresConfirmation: true,
        category: "delete",
        confirmationMessage: (params) =>
            `⚠️ ATTENTION : Voulez-vous SUPPRIMER le document "${params.documentId as string}" ? Cette action est irréversible.`,
    },

    // ============================================
    // ANALYTICS - Lecture (Risque faible)
    // ============================================
    get_kpis: {
        name: "get_kpis",
        description: "Obtenir les indicateurs de performance",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },
    get_sales_by_period: {
        name: "get_sales_by_period",
        description: "Obtenir les ventes par période",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },
    get_top_products: {
        name: "get_top_products",
        description: "Obtenir les produits les plus vendus",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },
    get_top_clients: {
        name: "get_top_clients",
        description: "Obtenir les meilleurs clients",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },

    // ============================================
    // SEGMENTS - Lecture (Risque faible)
    // ============================================
    list_segments: {
        name: "list_segments",
        description: "Lister les segments de clients",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },
    get_segment_details: {
        name: "get_segment_details",
        description: "Obtenir les détails d'un segment",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },

    // ============================================
    // SEGMENTS - Création/Modification (Risque moyen)
    // ============================================
    create_segment: {
        name: "create_segment",
        description: "Créer un segment de clients",
        riskLevel: "medium",
        requiresConfirmation: true,
        category: "create",
        confirmationMessage: (params) =>
            `Voulez-vous créer le segment "${params.nom as string}" ?`,
    },
    update_segment: {
        name: "update_segment",
        description: "Modifier un segment",
        riskLevel: "medium",
        requiresConfirmation: true,
        category: "update",
        confirmationMessage: (params) =>
            `Voulez-vous modifier le segment "${params.segmentId as string}" ?`,
    },

    // ============================================
    // SEGMENTS - Suppression (Risque élevé)
    // ============================================
    delete_segment: {
        name: "delete_segment",
        description: "Supprimer un segment",
        riskLevel: "high",
        requiresConfirmation: true,
        category: "delete",
        confirmationMessage: (params) =>
            `Voulez-vous supprimer le segment "${params.segmentId as string}" ?`,
    },

    // ============================================
    // CAMPAGNES - Lecture (Risque faible)
    // ============================================
    list_campaigns: {
        name: "list_campaigns",
        description: "Lister les campagnes marketing",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },
    get_campaign_details: {
        name: "get_campaign_details",
        description: "Obtenir les détails d'une campagne",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },
    get_campaign_stats: {
        name: "get_campaign_stats",
        description: "Obtenir les statistiques d'une campagne",
        riskLevel: "low",
        requiresConfirmation: false,
        category: "read",
    },

    // ============================================
    // CAMPAGNES - Création (Risque élevé - envoi mass)
    // ============================================
    create_campaign: {
        name: "create_campaign",
        description: "Créer une campagne marketing",
        riskLevel: "high",
        requiresConfirmation: true,
        category: "create",
        confirmationMessage: (params) =>
            `⚠️ Voulez-vous créer la campagne "${params.nom as string}" de type ${params.type as string} ? (Cette action peut envoyer des messages en masse)`,
    },
    schedule_campaign: {
        name: "schedule_campaign",
        description: "Programmer l'envoi d'une campagne",
        riskLevel: "critical",
        requiresConfirmation: true,
        category: "update",
        confirmationMessage: (params) =>
            `⚠️ ATTENTION : Voulez-vous PROGRAMMER l'envoi de la campagne "${params.campaignId as string}" ? Elle sera envoyée automatiquement.`,
    },
    send_campaign_now: {
        name: "send_campaign_now",
        description: "Envoyer une campagne immédiatement",
        riskLevel: "critical",
        requiresConfirmation: true,
        category: "bulk",
        confirmationMessage: (params) =>
            `⚠️ ATTENTION : Voulez-vous ENVOYER IMMÉDIATEMENT la campagne "${params.campaignId as string}" ? Cette action ne peut pas être annulée.`,
    },

    // ============================================
    // CAMPAGNES - Suppression (Risque moyen)
    // ============================================
    delete_campaign: {
        name: "delete_campaign",
        description: "Supprimer une campagne",
        riskLevel: "high",
        requiresConfirmation: true,
        category: "delete",
        confirmationMessage: (params) =>
            `Voulez-vous supprimer la campagne "${params.campaignId as string}" ?`,
    },
};

/**
 * Obtenir les métadonnées d'une action
 */
export function getActionMetadata(actionName: string): ActionMetadata | null {
    return ACTION_REGISTRY[actionName] || null;
}

/**
 * Vérifier si une action nécessite une confirmation
 */
export function requiresConfirmation(actionName: string): boolean {
    const metadata = getActionMetadata(actionName);
    return metadata?.requiresConfirmation ?? false;
}

/**
 * Obtenir le message de confirmation pour une action
 */
export function getConfirmationMessage(
    actionName: string,
    params: Record<string, unknown>
): string | null {
    const metadata = getActionMetadata(actionName);
    if (!metadata?.confirmationMessage) return null;
    return metadata.confirmationMessage(params);
}

/**
 * Obtenir le niveau de risque d'une action
 */
export function getRiskLevel(actionName: string): RiskLevel {
    const metadata = getActionMetadata(actionName);
    return metadata?.riskLevel ?? "medium";
}

/**
 * Vérifier si une action est critique (delete ou bulk)
 */
export function isCriticalAction(actionName: string): boolean {
    const metadata = getActionMetadata(actionName);
    return (
        metadata?.riskLevel === "critical" ||
        metadata?.category === "delete" ||
        metadata?.category === "bulk"
    );
}
