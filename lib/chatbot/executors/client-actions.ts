// ============================================
// CLIENT ACTIONS
// ============================================

import type { ActionResult } from '../chatbot-actions';
import { createFetchHelper, buildQueryParams, handleApiResponse } from './utils';

/**
 * Search clients with filters
 */
export async function searchClients(
  params: any,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const queryParams = buildQueryParams({
    query: params.query,
    ville: params.ville,
    minPoints: params.minPoints,
    maxPoints: params.maxPoints,
    limit: params.limit,
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
  params: any,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const response = await api.get(`/api/clients/${params.clientId}`);
  return handleApiResponse(response, `Détails du client récupérés`);
}

/**
 * Create a new client
 */
export async function createClient(
  params: any,
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
  params: any,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const response = await api.post(`/api/clients/${params.clientId}/loyalty`, {
    points: params.points,
    description: params.description,
  });
  return handleApiResponse(response, `${params.points} points ajoutés`);
}

/**
 * Update client information
 */
export async function updateClient(
  params: any,
  baseUrl: string
): Promise<ActionResult> {
  const { clientId, ...updateData } = params;
  const api = createFetchHelper(baseUrl);
  const response = await api.patch(`/api/clients/${clientId}`, updateData);
  return handleApiResponse(response, 'Client mis à jour');
}

/**
 * Delete a client
 */
export async function deleteClient(
  params: any,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const response = await api.delete(`/api/clients/${params.clientId}`);
  return handleApiResponse(response, 'Client supprimé');
}

/**
 * Get client history (invoices, quotes, etc.)
 */
export async function getClientHistory(
  params: any,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const response = await api.get(`/api/clients/${params.clientId}/history`);
  return handleApiResponse(response, 'Historique récupéré');
}

/**
 * Export clients list to CSV
 */
export async function exportClients(
  params: any,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const queryParams = buildQueryParams(params.filters || {});
  const response = await api.get(`/api/clients/export?${queryParams.toString()}`);
  return handleApiResponse(response, 'Export généré');
}
