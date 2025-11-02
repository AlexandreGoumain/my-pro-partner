// ============================================
// NAVIGATION ACTIONS
// ============================================

import type { ActionResult } from '../chatbot-actions';

/**
 * Navigate to a specific page in the ERP
 */
export async function navigateTo(params: any): Promise<ActionResult> {
  const pageMap: Record<string, string> = {
    DASHBOARD: '/dashboard',
    CLIENTS: '/dashboard/clients',
    ARTICLES: '/dashboard/articles',
    DOCUMENTS: '/dashboard/documents',
    STOCK: '/dashboard/stock',
    SEGMENTS: '/dashboard/segments',
    CAMPAIGNS: '/dashboard/campaigns',
    LOYALTY: '/dashboard/loyalty',
    SETTINGS: '/dashboard/settings',
  };

  const path = pageMap[params.page];
  if (!path) {
    return {
      success: false,
      error: `Page inconnue: ${params.page}`,
    };
  }

  const fullPath = params.entityId ? `${path}/${params.entityId}` : path;

  return {
    success: true,
    data: { path: fullPath },
    message: `Navigation vers ${params.page}`,
  };
}
