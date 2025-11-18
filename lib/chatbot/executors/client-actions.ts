// ============================================
// CLIENT ACTIONS
// ============================================

import type { ActionResult } from '../chatbot-actions';
import { createFetchHelper, buildQueryParams, handleApiResponse } from './utils';

/**
 * Search clients with filters
 */
export async function searchClients(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const queryParams = buildQueryParams({
    query: paramsObj.query,
    ville: paramsObj.ville,
    minPoints: paramsObj.minPoints,
    maxPoints: paramsObj.maxPoints,
    limit: paramsObj.limit,
  });

  const response = await api.get(`/api/clients?${queryParams.toString()}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
    return { success: false, error: error.error || 'Erreur lors de la recherche' };
  }

  const data = await response.json();
  return {
    success: true,
    data: data.clients || data,
    message: `${data.clients?.length || 0} client(s) trouvé(s)`,
  };
}

/**
 * Get detailed information about a specific client
 */
export async function getClientDetails(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.get(`/api/clients/${paramsObj.clientId as string}`);
  return handleApiResponse(response, `Détails du client récupérés`);
}

/**
 * Create a new client
 */
export async function createClient(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const response = await api.post('/api/clients', params);
  return handleApiResponse(response, 'Client créé avec succès');
}

/**
 * Add loyalty points to a client
 */
export async function addLoyaltyPoints(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.post(`/api/clients/${paramsObj.clientId as string}/loyalty`, {
    points: paramsObj.points,
    description: paramsObj.description,
  });
  return handleApiResponse(response, `${paramsObj.points} points ajoutés`);
}

/**
 * Update client information
 */
export async function updateClient(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const paramsObj = params as Record<string, unknown>;
  const { clientId, ...updateData } = paramsObj;
  const api = createFetchHelper(baseUrl);
  const response = await api.patch(`/api/clients/${clientId}`, updateData);
  return handleApiResponse(response, 'Client mis à jour');
}

/**
 * Delete a client
 */
export async function deleteClient(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.delete(`/api/clients/${paramsObj.clientId as string}`);
  return handleApiResponse(response, 'Client supprimé');
}

/**
 * Get client history (invoices, quotes, etc.)
 */
export async function getClientHistory(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.get(`/api/clients/${paramsObj.clientId as string}/history`);
  return handleApiResponse(response, 'Historique récupéré');
}

/**
 * Export clients list to CSV
 */
export async function exportClients(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const queryParams = buildQueryParams(paramsObj.filters as Record<string, unknown> || {});
  const response = await api.get(`/api/clients/export?${queryParams.toString()}`);
  return handleApiResponse(response, 'Export généré');
}
