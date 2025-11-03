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
  const queryParams = buildQueryParams({
    search: params.query,
    type: params.type !== 'ALL' ? params.type : undefined,
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
  const response = await api.post('/api/campaigns', params);
  return handleApiResponse(response, `Campagne "${params.nom}" créée`);
}

/**
 * Get clients in a specific segment
 */
export async function getSegmentClients(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const queryParams = buildQueryParams({
    limit: params.limit || 50,
  });

  const response = await api.get(
    `/api/segments/${params.segmentId}/clients?${queryParams.toString()}`
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
  const response = await api.get(`/api/segments/${params.segmentId}/analytics`);
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
  const queryParams = buildQueryParams({
    segmentId1: params.segmentId1,
    segmentId2: params.segmentId2,
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
  const response = await api.get(`/api/campaigns/${params.campaignId}`);
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
  const response = await api.post(`/api/campaigns/${params.campaignId}/schedule`, {
    scheduledDate: params.scheduledDate,
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
  const response = await api.post(`/api/campaigns/${params.campaignId}/send`, {});
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
  const response = await api.post(`/api/campaigns/${params.campaignId}/cancel`, {});
  return handleApiResponse(response, 'Campagne annulée');
}
