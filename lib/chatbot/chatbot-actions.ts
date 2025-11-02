// ============================================
// CHATBOT ACTIONS - Function Calling Definitions
// ============================================

import type { ChatCompletionTool } from "openai/resources/chat/completions";

/**
 * Définitions des fonctions disponibles pour l'IA
 * Format OpenAI Function Calling
 */
export const chatbotTools: ChatCompletionTool[] = [
    // ============================================
    // CLIENTS
    // ============================================
    {
        type: "function",
        function: {
            name: "search_clients",
            description:
                "Rechercher des clients avec des filtres optionnels (nom, email, ville, niveau de fidélité, points). Retourne une liste de clients correspondant aux critères.",
            parameters: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description:
                            "Terme de recherche libre (nom, email, etc.)",
                    },
                    ville: {
                        type: "string",
                        description: "Filtrer par ville",
                    },
                    minPoints: {
                        type: "number",
                        description: "Points de fidélité minimum",
                    },
                    maxPoints: {
                        type: "number",
                        description: "Points de fidélité maximum",
                    },
                    limit: {
                        type: "number",
                        description: "Nombre maximum de résultats (défaut: 10)",
                    },
                },
                required: [],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_client_details",
            description:
                "Obtenir les détails complets d'un client spécifique par son ID",
            parameters: {
                type: "object",
                properties: {
                    clientId: {
                        type: "string",
                        description: "ID du client",
                    },
                },
                required: ["clientId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "create_client",
            description: "Créer un nouveau client dans la base de données",
            parameters: {
                type: "object",
                properties: {
                    nom: {
                        type: "string",
                        description: "Nom du client",
                    },
                    prenom: {
                        type: "string",
                        description: "Prénom du client",
                    },
                    email: {
                        type: "string",
                        description: "Email du client",
                    },
                    telephone: {
                        type: "string",
                        description: "Numéro de téléphone",
                    },
                    adresse: {
                        type: "string",
                        description: "Adresse postale",
                    },
                    ville: {
                        type: "string",
                        description: "Ville",
                    },
                    codePostal: {
                        type: "string",
                        description: "Code postal",
                    },
                },
                required: ["nom"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "add_loyalty_points",
            description:
                "Ajouter ou retirer des points de fidélité à un client",
            parameters: {
                type: "object",
                properties: {
                    clientId: {
                        type: "string",
                        description: "ID du client",
                    },
                    points: {
                        type: "number",
                        description:
                            "Nombre de points (positif pour ajouter, négatif pour retirer)",
                    },
                    description: {
                        type: "string",
                        description: "Raison du mouvement de points",
                    },
                },
                required: ["clientId", "points"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "update_client",
            description: "Mettre à jour les informations d'un client existant",
            parameters: {
                type: "object",
                properties: {
                    clientId: {
                        type: "string",
                        description: "ID du client",
                    },
                    nom: { type: "string", description: "Nouveau nom" },
                    prenom: { type: "string", description: "Nouveau prénom" },
                    email: { type: "string", description: "Nouvel email" },
                    telephone: {
                        type: "string",
                        description: "Nouveau téléphone",
                    },
                    adresse: {
                        type: "string",
                        description: "Nouvelle adresse",
                    },
                    ville: { type: "string", description: "Nouvelle ville" },
                    codePostal: {
                        type: "string",
                        description: "Nouveau code postal",
                    },
                },
                required: ["clientId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "delete_client",
            description: "Supprimer un client de la base de données",
            parameters: {
                type: "object",
                properties: {
                    clientId: {
                        type: "string",
                        description: "ID du client à supprimer",
                    },
                },
                required: ["clientId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_client_history",
            description:
                "Obtenir l'historique des documents et transactions d'un client",
            parameters: {
                type: "object",
                properties: {
                    clientId: {
                        type: "string",
                        description: "ID du client",
                    },
                },
                required: ["clientId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "export_clients",
            description: "Exporter une liste de clients en CSV",
            parameters: {
                type: "object",
                properties: {
                    filters: {
                        type: "object",
                        description: "Filtres optionnels pour l'export",
                    },
                },
                required: [],
            },
        },
    },

    // ============================================
    // ARTICLES
    // ============================================
    {
        type: "function",
        function: {
            name: "search_articles",
            description:
                "Rechercher des articles/produits avec filtres (nom, référence, catégorie, stock)",
            parameters: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Terme de recherche (nom ou référence)",
                    },
                    type: {
                        type: "string",
                        enum: ["PRODUIT", "SERVICE"],
                        description: "Type d'article",
                    },
                    categorieId: {
                        type: "string",
                        description: "ID de la catégorie",
                    },
                    enStock: {
                        type: "boolean",
                        description: "Uniquement les articles en stock",
                    },
                    limit: {
                        type: "number",
                        description: "Nombre maximum de résultats (défaut: 10)",
                    },
                },
                required: [],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_stock_alerts",
            description:
                "Obtenir la liste des articles en rupture de stock ou stock faible",
            parameters: {
                type: "object",
                properties: {
                    type: {
                        type: "string",
                        enum: ["RUPTURE", "FAIBLE", "TOUS"],
                        description: "Type d'alerte (défaut: TOUS)",
                    },
                },
                required: [],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "adjust_stock",
            description:
                "Ajuster le stock d'un article (entrée, sortie, ajustement)",
            parameters: {
                type: "object",
                properties: {
                    articleId: {
                        type: "string",
                        description: "ID de l'article",
                    },
                    type: {
                        type: "string",
                        enum: [
                            "ENTREE",
                            "SORTIE",
                            "AJUSTEMENT",
                            "INVENTAIRE",
                            "RETOUR",
                        ],
                        description: "Type de mouvement de stock",
                    },
                    quantite: {
                        type: "number",
                        description: "Quantité (toujours positive)",
                    },
                    motif: {
                        type: "string",
                        description: "Raison du mouvement",
                    },
                },
                required: ["articleId", "type", "quantite"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "create_article",
            description: "Créer un nouvel article/produit/service",
            parameters: {
                type: "object",
                properties: {
                    reference: {
                        type: "string",
                        description: "Référence unique",
                    },
                    nom: { type: "string", description: "Nom de l'article" },
                    description: {
                        type: "string",
                        description: "Description détaillée",
                    },
                    type: {
                        type: "string",
                        enum: ["PRODUIT", "SERVICE"],
                        description: "Type d'article",
                    },
                    prix_ht: { type: "number", description: "Prix HT" },
                    tva_taux: {
                        type: "number",
                        description: "Taux de TVA (défaut: 20)",
                    },
                    stock_min: { type: "number", description: "Stock minimum" },
                    categorieId: {
                        type: "string",
                        description: "ID de la catégorie",
                    },
                },
                required: ["reference", "nom", "prix_ht"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "update_article",
            description: "Mettre à jour les informations d'un article",
            parameters: {
                type: "object",
                properties: {
                    articleId: {
                        type: "string",
                        description: "ID de l'article",
                    },
                    nom: { type: "string", description: "Nouveau nom" },
                    description: {
                        type: "string",
                        description: "Nouvelle description",
                    },
                    prix_ht: { type: "number", description: "Nouveau prix HT" },
                    tva_taux: {
                        type: "number",
                        description: "Nouveau taux TVA",
                    },
                    stock_min: {
                        type: "number",
                        description: "Nouveau stock minimum",
                    },
                    actif: {
                        type: "boolean",
                        description: "Article actif ou non",
                    },
                },
                required: ["articleId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "delete_article",
            description: "Supprimer un article de la base de données",
            parameters: {
                type: "object",
                properties: {
                    articleId: {
                        type: "string",
                        description: "ID de l'article",
                    },
                },
                required: ["articleId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_article_details",
            description: "Obtenir les détails complets d'un article",
            parameters: {
                type: "object",
                properties: {
                    articleId: {
                        type: "string",
                        description: "ID de l'article",
                    },
                },
                required: ["articleId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_stock_history",
            description:
                "Obtenir l'historique des mouvements de stock d'un article",
            parameters: {
                type: "object",
                properties: {
                    articleId: {
                        type: "string",
                        description: "ID de l'article",
                    },
                    limit: {
                        type: "number",
                        description: "Nombre de mouvements (défaut: 50)",
                    },
                },
                required: ["articleId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "list_categories",
            description: "Lister toutes les catégories d'articles",
            parameters: {
                type: "object",
                properties: {},
                required: [],
            },
        },
    },

    // ============================================
    // ANALYTICS & STATISTICS
    // ============================================
    {
        type: "function",
        function: {
            name: "get_statistics",
            description:
                "Obtenir les statistiques globales de l'ERP (CA, clients, ventes, etc.)",
            parameters: {
                type: "object",
                properties: {
                    period: {
                        type: "string",
                        enum: ["TODAY", "WEEK", "MONTH", "YEAR", "ALL"],
                        description:
                            "Période pour les statistiques (défaut: MONTH)",
                    },
                    metrics: {
                        type: "array",
                        items: {
                            type: "string",
                            enum: [
                                "CA",
                                "CLIENTS",
                                "ARTICLES",
                                "DOCUMENTS",
                                "STOCK",
                            ],
                        },
                        description:
                            "Métriques spécifiques à inclure (défaut: toutes)",
                    },
                },
                required: [],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_dashboard_kpis",
            description:
                "Obtenir les KPIs du dashboard principal (chiffres clés)",
            parameters: {
                type: "object",
                properties: {},
                required: [],
            },
        },
    },

    // ============================================
    // DOCUMENTS
    // ============================================
    {
        type: "function",
        function: {
            name: "create_document",
            description: "Créer un nouveau document (devis, facture, avoir)",
            parameters: {
                type: "object",
                properties: {
                    type: {
                        type: "string",
                        enum: ["DEVIS", "FACTURE", "AVOIR"],
                        description: "Type de document",
                    },
                    clientId: {
                        type: "string",
                        description: "ID du client",
                    },
                    dateEmission: {
                        type: "string",
                        description: "Date d'émission (format ISO)",
                    },
                },
                required: ["type", "clientId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "search_documents",
            description: "Rechercher des documents (devis, factures, avoirs)",
            parameters: {
                type: "object",
                properties: {
                    type: {
                        type: "string",
                        enum: ["DEVIS", "FACTURE", "AVOIR"],
                        description: "Type de document",
                    },
                    statut: {
                        type: "string",
                        enum: [
                            "BROUILLON",
                            "ENVOYE",
                            "ACCEPTE",
                            "REFUSE",
                            "PAYE",
                            "ANNULE",
                        ],
                        description: "Statut du document",
                    },
                    clientId: {
                        type: "string",
                        description: "ID du client",
                    },
                    limit: {
                        type: "number",
                        description: "Nombre maximum de résultats (défaut: 10)",
                    },
                },
                required: [],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_document_details",
            description:
                "Obtenir les détails complets d'un document avec ses lignes",
            parameters: {
                type: "object",
                properties: {
                    documentId: {
                        type: "string",
                        description: "ID du document",
                    },
                },
                required: ["documentId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "update_document_status",
            description: "Mettre à jour le statut d'un document",
            parameters: {
                type: "object",
                properties: {
                    documentId: {
                        type: "string",
                        description: "ID du document",
                    },
                    statut: {
                        type: "string",
                        enum: [
                            "BROUILLON",
                            "ENVOYE",
                            "ACCEPTE",
                            "REFUSE",
                            "PAYE",
                            "ANNULE",
                        ],
                        description: "Nouveau statut",
                    },
                },
                required: ["documentId", "statut"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "delete_document",
            description: "Supprimer un document (uniquement si brouillon)",
            parameters: {
                type: "object",
                properties: {
                    documentId: {
                        type: "string",
                        description: "ID du document",
                    },
                },
                required: ["documentId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "convert_quote_to_invoice",
            description: "Convertir un devis accepté en facture",
            parameters: {
                type: "object",
                properties: {
                    devisId: { type: "string", description: "ID du devis" },
                    dateEmission: {
                        type: "string",
                        description:
                            "Date d'émission de la facture (format ISO, optionnel)",
                    },
                },
                required: ["devisId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "duplicate_document",
            description: "Dupliquer un document existant",
            parameters: {
                type: "object",
                properties: {
                    documentId: {
                        type: "string",
                        description: "ID du document à dupliquer",
                    },
                },
                required: ["documentId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "add_payment",
            description: "Enregistrer un paiement sur une facture",
            parameters: {
                type: "object",
                properties: {
                    documentId: {
                        type: "string",
                        description: "ID de la facture",
                    },
                    montant: {
                        type: "number",
                        description: "Montant du paiement",
                    },
                    date_paiement: {
                        type: "string",
                        description: "Date du paiement (format ISO)",
                    },
                    moyen_paiement: {
                        type: "string",
                        enum: [
                            "ESPECES",
                            "CHEQUE",
                            "VIREMENT",
                            "CARTE",
                            "PRELEVEMENT",
                        ],
                        description: "Moyen de paiement",
                    },
                    reference: {
                        type: "string",
                        description: "Référence du paiement (optionnel)",
                    },
                },
                required: ["documentId", "montant", "moyen_paiement"],
            },
        },
    },

    // ============================================
    // SEGMENTS & CAMPAIGNS
    // ============================================
    {
        type: "function",
        function: {
            name: "search_segments",
            description: "Rechercher des segments de clients",
            parameters: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Terme de recherche",
                    },
                    type: {
                        type: "string",
                        enum: ["PREDEFINED", "CUSTOM", "ALL"],
                        description: "Type de segment (défaut: ALL)",
                    },
                },
                required: [],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "create_campaign",
            description:
                "Créer une nouvelle campagne marketing (email, SMS, notification)",
            parameters: {
                type: "object",
                properties: {
                    nom: {
                        type: "string",
                        description: "Nom de la campagne",
                    },
                    type: {
                        type: "string",
                        enum: ["EMAIL", "SMS", "NOTIFICATION"],
                        description: "Type de campagne",
                    },
                    segmentId: {
                        type: "string",
                        description: "ID du segment cible",
                    },
                    subject: {
                        type: "string",
                        description: "Sujet (pour email)",
                    },
                    body: {
                        type: "string",
                        description: "Corps du message",
                    },
                },
                required: ["nom", "type"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_segment_clients",
            description: "Obtenir la liste des clients d'un segment",
            parameters: {
                type: "object",
                properties: {
                    segmentId: { type: "string", description: "ID du segment" },
                    limit: {
                        type: "number",
                        description: "Nombre max de clients (défaut: 50)",
                    },
                },
                required: ["segmentId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "analyze_segment",
            description:
                "Analyser les statistiques d'un segment (CA, fidélité, etc.)",
            parameters: {
                type: "object",
                properties: {
                    segmentId: { type: "string", description: "ID du segment" },
                },
                required: ["segmentId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "compare_segments",
            description: "Comparer deux segments (KPIs, comportements)",
            parameters: {
                type: "object",
                properties: {
                    segmentId1: {
                        type: "string",
                        description: "ID du premier segment",
                    },
                    segmentId2: {
                        type: "string",
                        description: "ID du second segment",
                    },
                },
                required: ["segmentId1", "segmentId2"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_campaign_details",
            description: "Obtenir les détails et statistiques d'une campagne",
            parameters: {
                type: "object",
                properties: {
                    campaignId: {
                        type: "string",
                        description: "ID de la campagne",
                    },
                },
                required: ["campaignId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "schedule_campaign",
            description: "Programmer l'envoi d'une campagne",
            parameters: {
                type: "object",
                properties: {
                    campaignId: {
                        type: "string",
                        description: "ID de la campagne",
                    },
                    scheduledAt: {
                        type: "string",
                        description: "Date/heure d'envoi (format ISO)",
                    },
                },
                required: ["campaignId", "scheduledAt"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "send_campaign_now",
            description: "Envoyer une campagne immédiatement",
            parameters: {
                type: "object",
                properties: {
                    campaignId: {
                        type: "string",
                        description: "ID de la campagne",
                    },
                },
                required: ["campaignId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "cancel_campaign",
            description: "Annuler une campagne programmée",
            parameters: {
                type: "object",
                properties: {
                    campaignId: {
                        type: "string",
                        description: "ID de la campagne",
                    },
                },
                required: ["campaignId"],
            },
        },
    },

    // ============================================
    // FIDÉLITÉ
    // ============================================
    {
        type: "function",
        function: {
            name: "list_loyalty_levels",
            description: "Lister tous les niveaux de fidélité configurés",
            parameters: {
                type: "object",
                properties: {},
                required: [],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_loyalty_stats",
            description: "Obtenir les statistiques du programme de fidélité",
            parameters: {
                type: "object",
                properties: {},
                required: [],
            },
        },
    },

    // ============================================
    // ACTIONS RAPIDES
    // ============================================
    {
        type: "function",
        function: {
            name: "search_all",
            description:
                "Rechercher un terme partout (clients, articles, documents)",
            parameters: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Terme de recherche global",
                    },
                    limit: {
                        type: "number",
                        description:
                            "Nombre max de résultats par type (défaut: 5)",
                    },
                },
                required: ["query"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "quick_invoice",
            description:
                "Créer rapidement une facture simple (client + article + quantité)",
            parameters: {
                type: "object",
                properties: {
                    clientId: { type: "string", description: "ID du client" },
                    articleId: {
                        type: "string",
                        description: "ID de l'article",
                    },
                    quantite: { type: "number", description: "Quantité" },
                    notes: {
                        type: "string",
                        description: "Notes optionnelles",
                    },
                },
                required: ["clientId", "articleId", "quantite"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_recent_activity",
            description:
                "Obtenir l'activité récente de l'entreprise (derniers clients, documents, etc.)",
            parameters: {
                type: "object",
                properties: {
                    days: {
                        type: "number",
                        description: "Nombre de jours (défaut: 7)",
                    },
                },
                required: [],
            },
        },
    },

    // ============================================
    // NAVIGATION
    // ============================================
    {
        type: "function",
        function: {
            name: "navigate_to",
            description: "Naviguer vers une page spécifique de l'ERP",
            parameters: {
                type: "object",
                properties: {
                    page: {
                        type: "string",
                        enum: [
                            "DASHBOARD",
                            "CLIENTS",
                            "ARTICLES",
                            "DOCUMENTS",
                            "STOCK",
                            "SEGMENTS",
                            "CAMPAIGNS",
                            "LOYALTY",
                            "SETTINGS",
                        ],
                        description: "Page de destination",
                    },
                    entityId: {
                        type: "string",
                        description:
                            "ID de l'entité (optionnel, pour voir un détail)",
                    },
                },
                required: ["page"],
            },
        },
    },
];

/**
 * Types pour les actions
 */
export type ActionName = (typeof chatbotTools)[number]["function"]["name"];

export interface ActionResult {
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
}
