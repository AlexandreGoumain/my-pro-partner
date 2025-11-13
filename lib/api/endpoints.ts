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
} as const;
