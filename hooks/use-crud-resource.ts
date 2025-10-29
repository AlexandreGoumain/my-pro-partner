/**
 * Generic CRUD resource hook factory
 * Eliminates ~80 lines of duplication per resource hook
 *
 * This hook provides a standardized way to interact with REST API resources,
 * handling all CRUD operations with proper React Query integration.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { PaginatedResponse } from "@/lib/api/fetch-client";

export interface CrudResourceConfig {
  /** Resource name for query keys (e.g., "articles", "clients") */
  resourceName: string;
  /** Base API endpoint (e.g., "/api/articles") */
  endpoint: string;
  /** Function to generate endpoint for single item (e.g., (id) => `/api/articles/${id}`) */
  getItemEndpoint?: (id: string) => string;
}

export interface UseResourceListOptions {
  /** Enable/disable the query */
  enabled?: boolean;
  /** Additional query parameters */
  params?: Record<string, unknown>;
}

/**
 * Generic CRUD hook factory
 *
 * @example
 * ```tsx
 * const articles = useCrudResource<Article, ArticleCreateInput, ArticleUpdateInput>({
 *   resourceName: "articles",
 *   endpoint: "/api/articles",
 * });
 *
 * // Use in components:
 * const { data, isLoading } = articles.useList();
 * const { data: article } = articles.useOne("123");
 * const createMutation = articles.useCreate({
 *   onSuccess: () => toast.success("Created!")
 * });
 * ```
 */
export function useCrudResource<
  TResource = unknown,
  TCreateInput = Partial<TResource>,
  TUpdateInput = Partial<TResource>
>(config: CrudResourceConfig) {
  const { resourceName, endpoint, getItemEndpoint } = config;
  const queryClient = useQueryClient();

  // Default item endpoint generator
  const itemEndpoint = getItemEndpoint || ((id: string) => `${endpoint}/${id}`);

  /**
   * Query Keys Factory
   */
  const queryKeys = {
    all: [resourceName] as const,
    lists: () => [...queryKeys.all, "list"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.lists(), params] as const,
    details: () => [...queryKeys.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.details(), id] as const,
  };

  /**
   * Fetch all resources (with optional pagination)
   */
  const useList = (options?: UseResourceListOptions) => {
    const { enabled = true, params } = options || {};

    return useQuery<TResource[]>({
      queryKey: queryKeys.list(params),
      queryFn: async () => {
        const queryString = params
          ? "?" + new URLSearchParams(params).toString()
          : "";
        return api.get<TResource[]>(`${endpoint}${queryString}`);
      },
      enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  /**
   * Fetch paginated resources
   */
  const usePaginatedList = (
    page: number = 1,
    limit: number = 10,
    options?: UseResourceListOptions
  ) => {
    const { enabled = true, params } = options || {};
    const allParams = { ...params, page, limit };

    return useQuery<PaginatedResponse<TResource>>({
      queryKey: queryKeys.list(allParams),
      queryFn: () => {
        const queryString = new URLSearchParams(
          Object.entries(allParams).reduce((acc, [key, value]) => {
            acc[key] = String(value);
            return acc;
          }, {} as Record<string, string>)
        ).toString();
        return api.get<PaginatedResponse<TResource>>(`${endpoint}?${queryString}`);
      },
      enabled,
      staleTime: 5 * 60 * 1000,
    });
  };

  /**
   * Fetch single resource by ID
   */
  const useOne = (id: string, options?: { enabled?: boolean }) => {
    return useQuery<TResource>({
      queryKey: queryKeys.detail(id),
      queryFn: () => api.get<TResource>(itemEndpoint(id)),
      enabled: options?.enabled ?? !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  /**
   * Create new resource
   */
  const useCreate = (options?: {
    onSuccess?: (data: TResource) => void;
    onError?: (error: Error) => void;
  }) => {
    return useMutation<TResource, Error, TCreateInput>({
      mutationFn: (data) => api.post<TResource>(endpoint, data),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
        options?.onSuccess?.(data);
      },
      onError: options?.onError,
    });
  };

  /**
   * Update existing resource
   */
  const useUpdate = (options?: {
    onSuccess?: (data: TResource) => void;
    onError?: (error: Error) => void;
  }) => {
    return useMutation<TResource, Error, { id: string; data: TUpdateInput }>({
      mutationFn: ({ id, data }) => api.put<TResource>(itemEndpoint(id), data),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: queryKeys.detail(variables.id),
        });
        options?.onSuccess?.(data);
      },
      onError: options?.onError,
    });
  };

  /**
   * Delete resource
   */
  const useDelete = (options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }) => {
    return useMutation<void, Error, string>({
      mutationFn: (id) => api.delete<void>(itemEndpoint(id)),
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
        queryClient.removeQueries({ queryKey: queryKeys.detail(id) });
        options?.onSuccess?.();
      },
      onError: options?.onError,
    });
  };

  return {
    queryKeys,
    useList,
    usePaginatedList,
    useOne,
    useCreate,
    useUpdate,
    useDelete,
  };
}
