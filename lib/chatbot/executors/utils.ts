// ============================================
// CHATBOT EXECUTOR UTILITIES
// ============================================

import type { ActionResult } from '../chatbot-actions';

/**
 * Type for executor functions
 */
export type ExecutorFunction = (
  params: any,
  baseUrl: string
) => Promise<ActionResult>;

/**
 * Create a fetch helper with base URL
 */
export function createFetchHelper(baseUrl: string) {
  const fetchApi = async (
    path: string,
    options?: RequestInit
  ): Promise<Response> => {
    const url = `${baseUrl}${path}`;
    return fetch(url, options);
  };

  return {
    get: (path: string) => fetchApi(path, { method: 'GET' }),

    post: (path: string, data: any) =>
      fetchApi(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),

    patch: (path: string, data: any) =>
      fetchApi(path, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),

    delete: (path: string) => fetchApi(path, { method: 'DELETE' }),
  };
}

/**
 * Handle API response and convert to ActionResult
 */
export async function handleApiResponse(
  response: Response,
  successMessage: string
): Promise<ActionResult> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
    return {
      success: false,
      error: error.error || `Erreur ${response.status}`,
    };
  }

  const data = await response.json();
  return {
    success: true,
    data,
    message: successMessage,
  };
}

/**
 * Build query parameters from an object
 */
export function buildQueryParams(params: Record<string, any>): URLSearchParams {
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  }

  return queryParams;
}
