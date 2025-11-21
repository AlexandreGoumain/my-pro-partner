// ============================================
// NAVIGATION ACTIONS
// ============================================

import type { ActionResult } from '../chatbot-actions';

/**
 * Navigate to a specific page in the ERP
 */
export async function navigateTo(params: unknown): Promise<ActionResult> {
  const paramsObj = params as Record<string, unknown>;
  const pageMap: Record<string, string> = {
    DASHBOARD: '/dashboard',
    CLIENTS: '/dashboard/clients',
    ARTICLES: '/dashboard/catalogue',
    DOCUMENTS: '/dashboard/documents',
    STOCK: '/dashboard/stock',
    SEGMENTS: '/dashboard/segments',
    CAMPAIGNS: '/dashboard/campaigns',
    LOYALTY: '/dashboard/loyalty',
    SETTINGS: '/dashboard/settings',
  };

  const path = pageMap[paramsObj.page as string];
  if (!path) {
    return {
      success: false,
      error: `Page inconnue: ${paramsObj.page}`,
    };
  }

  const fullPath = paramsObj.entityId ? `${path}/${paramsObj.entityId}` : path;

  return {
    success: true,
    data: { path: fullPath },
    message: `Navigation vers ${paramsObj.page}`,
  };
}
