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

/**
 * Query unpaid invoices
 */
export async function queryUnpaidInvoices(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const queryParams = buildQueryParams({
    sortBy: params.sortBy || 'dateEcheance',
    sortOrder: params.sortOrder || 'asc',
    overdueOnly: params.overdueOnly?.toString(),
    minAmount: params.minAmount?.toString(),
    clientId: params.clientId,
  });

  const response = await api.get(
    `/api/analytics/unpaid-invoices?${queryParams.toString()}`
  );
  return handleApiResponse(response, 'Factures impayées récupérées');
}

/**
 * Query top debtors
 */
export async function queryTopDebtors(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const queryParams = buildQueryParams({
    limit: params.limit?.toString() || '10',
  });

  const response = await api.get(
    `/api/analytics/top-debtors?${queryParams.toString()}`
  );
  return handleApiResponse(response, 'Clients débiteurs identifiés');
}

/**
 * Analyze profitability by product type and category
 */
export async function analyzeProfitability(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const queryParams = buildQueryParams({
    period: params.period || 'all',
    topLimit: params.topLimit?.toString() || '10',
  });

  const response = await api.get(
    `/api/analytics/profitability?${queryParams.toString()}`
  );
  return handleApiResponse(response, 'Analyse de rentabilité effectuée');
}

/**
 * Identify best clients
 */
export async function identifyBestClients(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const limit = params.limit || 10;
  const period = params.period || 'year';
  const sortBy = params.sortBy || 'revenue';

  try {
    // Get all paid invoices for the period
    const now = new Date();
    let dateFrom: Date | undefined;

    switch (period) {
      case 'month':
        dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
        dateFrom = new Date(now.getFullYear(), quarterStartMonth, 1);
        break;
      case 'year':
        dateFrom = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const documentsRes = await api.get(
      `/api/documents?type=FACTURE&statut=PAYE${
        dateFrom ? `&fromDate=${dateFrom.toISOString()}` : ''
      }`
    );

    if (!documentsRes.ok) {
      return { success: false, error: 'Erreur lors de la récupération des factures' };
    }

    const { documents } = await documentsRes.json();

    // Aggregate by client
    const clientStats = new Map();
    for (const doc of documents || []) {
      const clientId = doc.clientId;
      if (!clientStats.has(clientId)) {
        clientStats.set(clientId, {
          clientId,
          client: doc.client,
          revenue: 0,
          invoiceCount: 0,
        });
      }
      const stats = clientStats.get(clientId);
      stats.revenue += Number(doc.total_ttc);
      stats.invoiceCount += 1;
    }

    // Sort and limit
    let bestClients = Array.from(clientStats.values());
    if (sortBy === 'revenue') {
      bestClients.sort((a, b) => b.revenue - a.revenue);
    } else if (sortBy === 'count') {
      bestClients.sort((a, b) => b.invoiceCount - a.invoiceCount);
    } else if (sortBy === 'loyalty') {
      bestClients.sort((a, b) => (b.client?.points_solde || 0) - (a.client?.points_solde || 0));
    }
    bestClients = bestClients.slice(0, limit);

    return {
      success: true,
      data: { bestClients, period, sortBy },
      message: `Top ${limit} meilleurs clients identifiés`,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erreur lors de l\'analyse des meilleurs clients',
    };
  }
}

/**
 * Predict revenue based on historical trends
 */
export async function predictRevenue(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const months = params.months || 1;

  try {
    // Get historical data (last 12 months of paid invoices)
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    const documentsRes = await api.get(
      `/api/documents?type=FACTURE&statut=PAYE&fromDate=${oneYearAgo.toISOString()}`
    );

    if (!documentsRes.ok) {
      return { success: false, error: 'Erreur lors de la récupération des données historiques' };
    }

    const { documents } = await documentsRes.json();

    if (!documents || documents.length === 0) {
      return {
        success: true,
        data: {
          prediction: 0,
          confidence: 'low',
          message: 'Pas assez de données historiques pour une prédiction fiable',
        },
        message: 'Prédiction basée sur des données limitées',
      };
    }

    // Group by month
    const monthlyRevenue = new Map();
    for (const doc of documents) {
      const date = new Date(doc.dateEmission);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyRevenue.has(monthKey)) {
        monthlyRevenue.set(monthKey, 0);
      }
      monthlyRevenue.set(monthKey, monthlyRevenue.get(monthKey) + Number(doc.total_ttc));
    }

    // Simple average for prediction
    const revenues = Array.from(monthlyRevenue.values());
    const averageRevenue = revenues.reduce((sum, r) => sum + r, 0) / revenues.length;

    // Calculate trend (last 3 months vs previous 3 months)
    const sortedMonths = Array.from(monthlyRevenue.entries()).sort(([a], [b]) => b.localeCompare(a));
    const last3Months = sortedMonths.slice(0, 3).reduce((sum, [, rev]) => sum + rev, 0) / 3;
    const prev3Months = sortedMonths.slice(3, 6).reduce((sum, [, rev]) => sum + rev, 0) / 3;
    const trendFactor = prev3Months > 0 ? last3Months / prev3Months : 1;

    // Prediction with trend
    const prediction = averageRevenue * trendFactor * months;
    const confidence = revenues.length >= 6 ? 'medium' : 'low';

    return {
      success: true,
      data: {
        prediction: Math.round(prediction * 100) / 100,
        averageMonthly: Math.round(averageRevenue * 100) / 100,
        trendFactor: Math.round(trendFactor * 100) / 100,
        months,
        confidence,
        historicalMonths: revenues.length,
      },
      message: `CA prévu pour les ${months} prochains mois: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(prediction)}`,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erreur lors de la prédiction du chiffre d\'affaires',
    };
  }
}

/**
 * Generate payment reminder email
 */
export async function generatePaymentReminder(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const invoiceId = params.invoiceId;
  const tone = params.tone || 'friendly';

  try {
    // Get invoice details
    const invoiceRes = await api.get(`/api/documents/${invoiceId}`);
    if (!invoiceRes.ok) {
      return { success: false, error: 'Facture non trouvée' };
    }

    const invoice = await invoiceRes.json();

    // Calculate days overdue
    const daysOverdue = invoice.dateEcheance
      ? Math.floor(
          (new Date().getTime() - new Date(invoice.dateEcheance).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

    // Generate email based on tone
    let subject = '';
    let body = '';

    const formatCurrency = (amount: number) =>
      new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

    switch (tone) {
      case 'urgent':
        subject = `URGENT - Facture ${invoice.numero} en retard de ${daysOverdue} jours`;
        body = `Madame, Monsieur,

Malgré nos précédents rappels, nous constatons que la facture ${invoice.numero} d'un montant de ${formatCurrency(invoice.reste_a_payer)} n'a toujours pas été réglée.

Cette facture est échue depuis ${daysOverdue} jours.

Nous vous demandons de bien vouloir procéder au règlement immédiat de cette facture.

À défaut, nous serons contraints d'engager des poursuites.

Cordialement`;
        break;

      case 'formal':
        subject = `Rappel - Facture ${invoice.numero} échue`;
        body = `Madame, Monsieur,

Nous nous permettons de vous rappeler que la facture ${invoice.numero} d'un montant de ${formatCurrency(invoice.reste_a_payer)} reste impayée à ce jour.

Date d'échéance: ${new Date(invoice.dateEcheance).toLocaleDateString('fr-FR')}
Montant dû: ${formatCurrency(invoice.reste_a_payer)}

Nous vous remercions de bien vouloir procéder au règlement dans les meilleurs délais.

Si vous avez déjà effectué ce paiement, veuillez ne pas tenir compte de ce message.

Cordialement`;
        break;

      default: // friendly
        subject = `Rappel amical - Facture ${invoice.numero}`;
        body = `Bonjour,

J'espère que vous allez bien !

Je me permets de vous rappeler gentiment que la facture ${invoice.numero} d'un montant de ${formatCurrency(invoice.reste_a_payer)} est en attente de paiement.

${daysOverdue > 0 ? `Elle est échue depuis ${daysOverdue} jour${daysOverdue > 1 ? 's' : ''}.` : 'Elle arrive bientôt à échéance.'}

Si vous avez besoin d'un échelonnement ou si vous rencontrez un problème, n'hésitez pas à me contacter, nous trouverons une solution ensemble.

Merci beaucoup et à bientôt !`;
        break;
    }

    return {
      success: true,
      data: {
        subject,
        body,
        invoice: {
          numero: invoice.numero,
          montant: invoice.reste_a_payer,
          client: invoice.client,
          daysOverdue,
        },
        tone,
      },
      message: 'Email de rappel généré',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erreur lors de la génération du rappel',
    };
  }
}
