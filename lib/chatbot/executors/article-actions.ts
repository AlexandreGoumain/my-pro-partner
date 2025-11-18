// ============================================
// ARTICLE ACTIONS
// ============================================

import type { ActionResult } from '../chatbot-actions';
import { createFetchHelper, buildQueryParams, handleApiResponse } from './utils';

/**
 * Search articles with filters
 */
export async function searchArticles(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const queryParams = buildQueryParams({
    query: paramsObj.query,
    type: paramsObj.type,
    categorieId: paramsObj.categorieId,
    minPrice: paramsObj.minPrice,
    maxPrice: paramsObj.maxPrice,
    limit: paramsObj.limit,
  });

  const response = await api.get(`/api/articles?${queryParams.toString()}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
    return { success: false, error: error.error || 'Erreur lors de la recherche' };
  }

  const data = await response.json();
  return {
    success: true,
    data: data.articles || data,
    message: `${data.articles?.length || 0} article(s) trouvé(s)`,
  };
}

/**
 * Get stock alerts for low stock items
 */
export async function getStockAlerts(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const response = await api.get('/api/articles/alerts');
  return handleApiResponse(response, 'Alertes stock récupérées');
}

/**
 * Adjust stock for an article
 */
export async function adjustStock(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.post(`/api/articles/${paramsObj.articleId as string}/stock`, {
    type: paramsObj.type,
    quantite: paramsObj.quantite,
    motif: paramsObj.motif,
  });
  return handleApiResponse(response, 'Stock ajusté');
}

/**
 * Create a new article
 */
export async function createArticle(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const response = await api.post('/api/articles', params);
  return handleApiResponse(response, 'Article créé avec succès');
}

/**
 * Update article information
 */
export async function updateArticle(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const paramsObj = params as Record<string, unknown>;
  const { articleId, ...updateData } = paramsObj;
  const api = createFetchHelper(baseUrl);
  const response = await api.patch(`/api/articles/${articleId}`, updateData);
  return handleApiResponse(response, 'Article mis à jour');
}

/**
 * Delete an article
 */
export async function deleteArticle(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.delete(`/api/articles/${paramsObj.articleId as string}`);
  return handleApiResponse(response, 'Article supprimé');
}

/**
 * Get detailed information about an article
 */
export async function getArticleDetails(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.get(`/api/articles/${paramsObj.articleId as string}`);
  return handleApiResponse(response, 'Détails de l\'article récupérés');
}

/**
 * Get stock movement history for an article
 */
export async function getStockHistory(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const queryParams = buildQueryParams({
    fromDate: paramsObj.fromDate,
    toDate: paramsObj.toDate,
    limit: paramsObj.limit,
  });

  const response = await api.get(
    `/api/articles/${paramsObj.articleId as string}/mouvements?${queryParams.toString()}`
  );
  return handleApiResponse(response, 'Historique récupéré');
}

/**
 * List all article categories
 */
export async function listCategories(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const response = await api.get('/api/categories');
  return handleApiResponse(response, 'Catégories récupérées');
}
