// ============================================
// LOYALTY ACTIONS
// ============================================

import type { ActionResult } from '../chatbot-actions';
import { createFetchHelper, handleApiResponse } from './utils';

/**
 * List all loyalty levels
 */
export async function listLoyaltyLevels(
  params: any,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const response = await api.get('/api/loyalty-levels');
  return handleApiResponse(response, 'Niveaux de fidélité récupérés');
}

/**
 * Get loyalty program statistics
 */
export async function getLoyaltyStats(
  params: any,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const response = await api.get('/api/loyalty-levels/stats');
  return handleApiResponse(response, 'Statistiques de fidélité récupérées');
}
