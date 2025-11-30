/**
 * Centralized API endpoints
 * Prevents hardcoded strings across the codebase
 */

export const ENDPOINTS = {
    // Articles
    ARTICLES: "/api/articles",
    ARTICLE_BY_ID: (id: string) => `/api/articles/${id}`,
    ARTICLE_STOCK: (id: string) => `/api/articles/${id}/stock`,
    ARTICLE_ALERTS: "/api/articles/alerts",

    // Categories
    CATEGORIES: "/api/categories",
    CATEGORY_BY_ID: (id: string) => `/api/categories/${id}`,

    // Clients
    CLIENTS: "/api/clients",
    CLIENT_BY_ID: (id: string) => `/api/clients/${id}`,

    // Stock
    STOCK_MOVEMENTS: "/api/stock/mouvements",

    // Analytics
    ANALYTICS_SALES: "/api/analytics/sales",
    ANALYTICS: "/api/analytics",
    ANALYTICS_PROFITABILITY: "/api/analytics/profitability",
    ANALYTICS_UNPAID_INVOICES: "/api/analytics/unpaid-invoices",
    ANALYTICS_TOP_DEBTORS: "/api/analytics/top-debtors",

    // Auth
    AUTH_REGISTER: "/api/auth/register",
    AUTH_SESSION: "/api/auth/session",

    // Public Payment Links
    PUBLIC_PAYMENT_LINK: (slug: string) => `/api/public/payment-link/${slug}`,
    PUBLIC_PAYMENT_LINK_CHECKOUT: (slug: string) =>
        `/api/public/payment-link/${slug}/checkout`,

    // === IMMOBILIER - Agent Immobilier ===
    IMMOBILIER_BIENS: "/api/immobilier/biens",
    IMMOBILIER_BIEN_BY_ID: (id: string) => `/api/immobilier/biens/${id}`,
    IMMOBILIER_MANDATS: "/api/immobilier/mandats",
    IMMOBILIER_MANDAT_BY_ID: (id: string) => `/api/immobilier/mandats/${id}`,
    IMMOBILIER_VISITES: "/api/immobilier/visites",
    IMMOBILIER_VISITE_BY_ID: (id: string) => `/api/immobilier/visites/${id}`,
    IMMOBILIER_ESTIMATIONS: "/api/immobilier/estimations",
    IMMOBILIER_DIFFUSION: "/api/immobilier/diffusion",
    IMMOBILIER_LEADS: "/api/immobilier/leads",
    IMMOBILIER_MATCHING: "/api/immobilier/matching",

    // === GESTION LOCATIVE ===
    GESTION_LOCATIVE_BAUX: "/api/gestion-locative/baux",
    GESTION_LOCATIVE_BAIL_BY_ID: (id: string) =>
        `/api/gestion-locative/baux/${id}`,
    GESTION_LOCATIVE_LOYERS: "/api/gestion-locative/loyers",
    GESTION_LOCATIVE_ETATS_LIEUX: "/api/gestion-locative/etats-lieux",
    GESTION_LOCATIVE_INCIDENTS: "/api/gestion-locative/incidents",

    // === SYNDIC ===
    SYNDIC_COPROPRIETES: "/api/syndic/coproprietes",
    SYNDIC_COPROPRIETE_BY_ID: (id: string) => `/api/syndic/coproprietes/${id}`,
    SYNDIC_LOTS: "/api/syndic/lots",
    SYNDIC_LOT_BY_ID: (id: string) => `/api/syndic/lots/${id}`,
    SYNDIC_CHARGES: "/api/syndic/charges",
    SYNDIC_CHARGE_BY_ID: (id: string) => `/api/syndic/charges/${id}`,
    SYNDIC_AG: "/api/syndic/ag",
    SYNDIC_AG_BY_ID: (id: string) => `/api/syndic/ag/${id}`,
    SYNDIC_TRAVAUX: "/api/syndic/travaux",
    SYNDIC_TRAVAUX_BY_ID: (id: string) => `/api/syndic/travaux/${id}`,
    SYNDIC_CONSEIL: "/api/syndic/conseil-syndical",
    SYNDIC_COMPTABILITE: "/api/syndic/comptabilite",
} as const;
