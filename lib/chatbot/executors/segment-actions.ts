// ============================================
// SEGMENT & CAMPAIGN ACTIONS
// ============================================

import type { ActionResult } from '../chatbot-actions';
import { createFetchHelper, buildQueryParams, handleApiResponse } from './utils';

/**
 * Search customer segments
 */
export async function searchSegments(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const queryParams = buildQueryParams({
    search: paramsObj.query,
    type: paramsObj.type !== 'ALL' ? paramsObj.type : undefined,
  });

  const response = await api.get(`/api/segments?${queryParams.toString()}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
    return { success: false, error: error.error || 'Erreur lors de la recherche' };
  }

  const data = await response.json();
  return {
    success: true,
    data: data.segments || data,
    message: `${data.segments?.length || 0} segment(s) trouvé(s)`,
  };
}

/**
 * Create a marketing campaign
 */
export async function createCampaign(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.post('/api/campaigns', params);
  return handleApiResponse(response, `Campagne "${paramsObj.nom}" créée`);
}

/**
 * Get clients in a specific segment
 */
export async function getSegmentClients(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const queryParams = buildQueryParams({
    limit: paramsObj.limit || 50,
  });

  const response = await api.get(
    `/api/segments/${paramsObj.segmentId as string}/clients?${queryParams.toString()}`
  );
  return handleApiResponse(response, 'Clients du segment récupérés');
}

/**
 * Get analytics for a segment
 */
export async function analyzeSegment(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.get(`/api/segments/${paramsObj.segmentId as string}/analytics`);
  return handleApiResponse(response, 'Analyse du segment récupérée');
}

/**
 * Compare two segments
 */
export async function compareSegments(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const queryParams = buildQueryParams({
    segmentId1: paramsObj.segmentId1,
    segmentId2: paramsObj.segmentId2,
  });

  const response = await api.get(`/api/segments/compare?${queryParams.toString()}`);
  return handleApiResponse(response, 'Comparaison effectuée');
}

/**
 * Get campaign details
 */
export async function getCampaignDetails(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.get(`/api/campaigns/${paramsObj.campaignId as string}`);
  return handleApiResponse(response, 'Détails de la campagne récupérés');
}

/**
 * Schedule a campaign for later
 */
export async function scheduleCampaign(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.post(`/api/campaigns/${paramsObj.campaignId as string}/schedule`, {
    scheduledDate: paramsObj.scheduledDate,
  });
  return handleApiResponse(response, 'Campagne programmée');
}

/**
 * Send a campaign immediately
 */
export async function sendCampaignNow(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.post(`/api/campaigns/${paramsObj.campaignId as string}/send`, {});
  return handleApiResponse(response, 'Campagne envoyée');
}

/**
 * Cancel a scheduled campaign
 */
export async function cancelCampaign(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.post(`/api/campaigns/${paramsObj.campaignId as string}/cancel`, {});
  return handleApiResponse(response, 'Campagne annulée');
}
