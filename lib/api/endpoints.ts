/**
 * Centralized API endpoints
 * Prevents hardcoded strings across the codebase
 */

export const ENDPOINTS = {
  // Articles
  ARTICLES: "/api/articles",
  ARTICLE_BY_ID: (id: string) => `/api/articles/${id}`,
  ARTICLE_STOCK: (id: string) => `/api/articles/${id}/stock`,

  // Categories
  CATEGORIES: "/api/categories",
  CATEGORY_BY_ID: (id: string) => `/api/categories/${id}`,

  // Clients
  CLIENTS: "/api/clients",
  CLIENT_BY_ID: (id: string) => `/api/clients/${id}`,

  // Stock
  STOCK_MOVEMENTS: "/api/stock/mouvements",
  STOCK_ALERTS: "/api/stock/alerts",

  // Auth
  AUTH_REGISTER: "/api/auth/register",
  AUTH_SESSION: "/api/auth/session",
} as const;
