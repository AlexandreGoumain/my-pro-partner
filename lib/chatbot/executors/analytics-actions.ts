// ============================================
// ANALYTICS & QUICK ACTIONS
// ============================================

import type { ActionResult } from '../chatbot-actions';
import { createFetchHelper, buildQueryParams, handleApiResponse } from './utils';

/**
 * Get general statistics (revenue, client count, etc.)
 */
export async function getStatistics(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const queryParams = buildQueryParams({
    fromDate: params.fromDate,
    toDate: params.toDate,
  });

  const response = await api.get(`/api/statistics?${queryParams.toString()}`);
  return handleApiResponse(response, 'Statistiques récupérées');
}

/**
 * Get dashboard KPIs
 */
export async function getDashboardKpis(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const response = await api.get('/api/dashboard/kpis');
  return handleApiResponse(response, 'KPIs récupérés');
}

/**
 * Search across all entities (clients, articles, documents)
 */
export async function searchAll(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const limit = params.limit || 5;
  const query = encodeURIComponent(params.query);

  try {
    const [clientsRes, articlesRes, documentsRes] = await Promise.all([
      api.get(`/api/clients?search=${query}&limit=${limit}`),
      api.get(`/api/articles?search=${query}&limit=${limit}`),
      api.get(`/api/documents?search=${query}&limit=${limit}`),
    ]);

    const [clients, articles, documents] = await Promise.all([
      clientsRes.json(),
      articlesRes.json(),
      documentsRes.json(),
    ]);

    return {
      success: true,
      data: {
        clients: clients.clients || [],
        articles: articles.articles || [],
        documents: documents.documents || [],
      },
      message: 'Recherche effectuée',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erreur lors de la recherche',
    };
  }
}

/**
 * Quick create invoice from article
 */
export async function quickInvoice(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);

  // Get article details first
  const articleRes = await api.get(`/api/articles/${params.articleId}`);
  if (!articleRes.ok) {
    return { success: false, error: 'Article non trouvé' };
  }

  const article = await articleRes.json();

  // Create invoice
  const response = await api.post('/api/documents', {
    type: 'FACTURE',
    clientId: params.clientId,
    lignes: [
      {
        articleId: params.articleId,
        description: article.nom,
        quantite: params.quantite || 1,
        prix_unitaire: article.prix_ht,
        tva_taux: article.tva_taux,
      },
    ],
  });

  return handleApiResponse(response, 'Facture créée');
}

/**
 * Get recent activity (clients, documents)
 */
export async function getRecentActivity(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const days = params.days || 7;
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  try {
    const [clientsRes, documentsRes] = await Promise.all([
      api.get(
        `/api/clients?fromDate=${fromDate.toISOString()}&sort=createdAt&order=desc&limit=10`
      ),
      api.get(
        `/api/documents?fromDate=${fromDate.toISOString()}&sort=createdAt&order=desc&limit=10`
      ),
    ]);

    const [clients, documents] = await Promise.all([
      clientsRes.json(),
      documentsRes.json(),
    ]);

    return {
      success: true,
      data: {
        recentClients: clients.clients || [],
        recentDocuments: documents.documents || [],
      },
      message: `Activité des ${days} derniers jours`,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erreur lors de la récupération',
    };
  }
}
