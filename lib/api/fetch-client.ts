/**
 * Centralized API fetch client with error handling
 * Eliminates duplication across all React Query hooks
 */

export interface ApiError {
  message: string;
  errors?: unknown[];
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message: string;
  errors?: unknown[];
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

/**
 * Generic fetch wrapper with error handling
 * Usage: const data = await fetchApi<Article>('/api/articles/123')
 */
export async function fetchApi<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      message: `HTTP Error ${response.status}`,
    }));
    throw new Error(error.message || "Une erreur est survenue");
  }

  return response.json();
}

/**
 * HTTP Method Helpers
 */
export const api = {
  get: <T = unknown>(url: string) => fetchApi<T>(url, { method: "GET" }),

  post: <T = unknown>(url: string, data?: unknown) =>
    fetchApi<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = unknown>(url: string, data?: unknown) =>
    fetchApi<T>(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = unknown>(url: string, data?: unknown) =>
    fetchApi<T>(url, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = unknown>(url: string) => fetchApi<T>(url, { method: "DELETE" }),
};
