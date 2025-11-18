// ============================================
// DOCUMENT ACTIONS
// ============================================

import type { ActionResult } from '../chatbot-actions';
import { createFetchHelper, buildQueryParams, handleApiResponse } from './utils';

/**
 * Create a new document (invoice, quote, credit note)
 */
export async function createDocument(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.post('/api/documents', params);
  return handleApiResponse(response, `${paramsObj.type} créé avec succès`);
}

/**
 * Search documents with filters
 */
export async function searchDocuments(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const queryParams = buildQueryParams({
    type: paramsObj.type,
    statut: paramsObj.statut,
    clientId: paramsObj.clientId,
    limit: paramsObj.limit,
  });

  const response = await api.get(`/api/documents?${queryParams.toString()}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
    return { success: false, error: error.error || 'Erreur lors de la recherche' };
  }

  const data = await response.json();
  return {
    success: true,
    data: data.documents || data,
    message: `${data.documents?.length || 0} document(s) trouvé(s)`,
  };
}

/**
 * Get document details
 */
export async function getDocumentDetails(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.get(`/api/documents/${paramsObj.documentId as string}`);
  return handleApiResponse(response, 'Détails du document récupérés');
}

/**
 * Update document status
 */
export async function updateDocumentStatus(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.patch(`/api/documents/${paramsObj.documentId as string}`, {
    statut: paramsObj.statut,
  });
  return handleApiResponse(response, 'Statut mis à jour');
}

/**
 * Delete a document
 */
export async function deleteDocument(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.delete(`/api/documents/${paramsObj.documentId as string}`);
  return handleApiResponse(response, 'Document supprimé');
}

/**
 * Convert a quote to an invoice
 */
export async function convertQuoteToInvoice(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.post(`/api/documents/${paramsObj.devisId as string}/convert`, {});
  return handleApiResponse(response, 'Devis converti en facture');
}

/**
 * Duplicate a document
 */
export async function duplicateDocument(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.post(`/api/documents/${paramsObj.documentId as string}/duplicate`, {});
  return handleApiResponse(response, 'Document dupliqué');
}

/**
 * Add a payment to an invoice
 */
export async function addPayment(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const paramsObj = params as Record<string, unknown>;
  const response = await api.post(`/api/documents/${paramsObj.documentId as string}/paiements`, {
    montant: paramsObj.montant,
    date: paramsObj.date,
    methode: paramsObj.methode,
    reference: paramsObj.reference,
  });
  return handleApiResponse(response, 'Paiement enregistré');
}
