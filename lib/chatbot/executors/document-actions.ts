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
  const response = await api.post('/api/documents', params);
  return handleApiResponse(response, `${params.type} créé avec succès`);
}

/**
 * Search documents with filters
 */
export async function searchDocuments(
  params: unknown,
  baseUrl: string
): Promise<ActionResult> {
  const api = createFetchHelper(baseUrl);
  const queryParams = buildQueryParams({
    type: params.type,
    statut: params.statut,
    clientId: params.clientId,
    limit: params.limit,
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
  const response = await api.get(`/api/documents/${params.documentId}`);
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
  const response = await api.patch(`/api/documents/${params.documentId}`, {
    statut: params.statut,
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
  const response = await api.delete(`/api/documents/${params.documentId}`);
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
  const response = await api.post(`/api/documents/${params.devisId}/convert`, {});
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
  const response = await api.post(`/api/documents/${params.documentId}/duplicate`, {});
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
  const response = await api.post(`/api/documents/${params.documentId}/paiements`, {
    montant: params.montant,
    date: params.date,
    methode: params.methode,
    reference: params.reference,
  });
  return handleApiResponse(response, 'Paiement enregistré');
}
