import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import type { PaginatedResponse } from "@/lib/utils/pagination";

/**
 * Configuration pour la factory de hooks
 */
export interface ResourceHooksConfig<TResource, TDisplay = TResource> {
    /** Nom de la ressource (ex: "clients", "articles") */
    resourceName: string;
    /** Endpoint de l'API (ex: "/api/clients") */
    endpoint: string;
    /** Fonction optionnelle pour transformer les données de l'API vers le format d'affichage */
    mapToDisplay?: (data: TResource) => TDisplay;
}

/**
 * Paramètres de pagination pour les listes
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
}

/**
 * Factory pour créer automatiquement tous les hooks CRUD d'une ressource
 *
 * @example
 * ```ts
 * const clientHooks = createResourceHooks<Client>({
 *   resourceName: 'clients',
 *   endpoint: '/api/clients',
 * });
 *
 * // Utilisation
 * const { data: clients } = clientHooks.useList();
 * const { data: client } = clientHooks.useDetail(id);
 * const createMutation = clientHooks.useCreate();
 * ```
 */
export function createResourceHooks<TResource, TDisplay = TResource>(
    config: ResourceHooksConfig<TResource, TDisplay>
) {
    const { resourceName, endpoint, mapToDisplay } = config;

    /**
     * Query keys pour la gestion du cache React Query
     */
    const keys = {
        all: [resourceName] as const,
        list: (params: PaginationParams) => [resourceName, "list", params] as const,
        detail: (id: string) => [resourceName, id] as const,
        stats: [resourceName, "stats"] as const,
    };

    /**
     * Hook pour récupérer la liste complète de la ressource (sans pagination)
     *
     * @param limit - Limite optionnelle du nombre d'éléments
     */
    function useList(limit?: number) {
        return useQuery({
            queryKey: limit ? [...keys.all, limit] : keys.all,
            queryFn: async (): Promise<TDisplay[]> => {
                const queryString = limit ? `?limit=${limit}` : "";
                const result = await api.get<TResource[] | { data: TResource[] }>(`${endpoint}${queryString}`);
                const data = Array.isArray(result) ? result : result.data || [];
                return mapToDisplay ? data.map(mapToDisplay) : (data as unknown as TDisplay[]);
            },
        });
    }

    /**
     * Hook pour récupérer la liste paginée de la ressource (server-side pagination)
     *
     * @param params - Paramètres de pagination (page, limit, search)
     */
    function useListPaginated(params?: PaginationParams) {
        const { page = 1, limit = 20, search = "" } = params || {};

        return useQuery({
            queryKey: keys.list({ page, limit, search }),
            queryFn: async (): Promise<PaginatedResponse<TDisplay>> => {
                const searchParams = new URLSearchParams();
                searchParams.set("page", page.toString());
                searchParams.set("limit", limit.toString());
                if (search) {
                    searchParams.set("search", search);
                }

                const result = await api.get<PaginatedResponse<TResource>>(`${endpoint}?${searchParams.toString()}`);

                // Transform data if mapper is provided
                if (mapToDisplay && result.data) {
                    return {
                        ...result,
                        data: result.data.map(mapToDisplay),
                    };
                }

                return result as unknown as PaginatedResponse<TDisplay>;
            },
            enabled: !!params, // Only fetch when params are provided
        });
    }

    /**
     * Hook pour récupérer un élément spécifique par ID
     *
     * @param id - ID de la ressource
     * @param options - Options supplémentaires pour useQuery
     */
    function useDetail(id: string, options?: Partial<UseQueryOptions<TResource>>) {
        return useQuery({
            queryKey: keys.detail(id),
            queryFn: async () => api.get<TResource>(`${endpoint}/${id}`),
            enabled: !!id, // Ne lance la requête que si l'ID existe
            ...options,
        });
    }

    /**
     * Hook pour récupérer les statistiques de la ressource
     *
     * @param options - Options supplémentaires pour useQuery
     */
    function useStats<TStats = unknown>(options?: Partial<UseQueryOptions<TStats>>) {
        return useQuery({
            queryKey: keys.stats,
            queryFn: async () => api.get<TStats>(`${endpoint}/stats`),
            ...options,
        });
    }

    /**
     * Hook pour créer une nouvelle ressource
     */
    function useCreate<TCreateInput = Partial<TResource>>() {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: async (data: TCreateInput) =>
                api.post<TResource>(endpoint, data),
            onSuccess: () => {
                // Invalide le cache pour forcer un rechargement
                queryClient.invalidateQueries({ queryKey: keys.all });
                queryClient.invalidateQueries({ queryKey: [resourceName, "list"] });
                queryClient.invalidateQueries({ queryKey: keys.stats });
            },
        });
    }

    /**
     * Hook pour mettre à jour une ressource existante
     */
    function useUpdate<TUpdateInput = Partial<TResource>>() {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: async ({ id, data }: { id: string; data: TUpdateInput }) =>
                api.put<TResource>(`${endpoint}/${id}`, data),
            onSuccess: (_, variables) => {
                // Invalide le cache de la liste, du détail et des stats
                queryClient.invalidateQueries({ queryKey: keys.all });
                queryClient.invalidateQueries({ queryKey: keys.detail(variables.id) });
                queryClient.invalidateQueries({ queryKey: [resourceName, "list"] });
                queryClient.invalidateQueries({ queryKey: keys.stats });
            },
        });
    }

    /**
     * Hook pour supprimer une ressource
     */
    function useDelete() {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: async (id: string) => api.delete(`${endpoint}/${id}`),
            onSuccess: () => {
                // Invalide le cache pour forcer un rechargement
                queryClient.invalidateQueries({ queryKey: keys.all });
                queryClient.invalidateQueries({ queryKey: [resourceName, "list"] });
                queryClient.invalidateQueries({ queryKey: keys.stats });
            },
        });
    }

    /**
     * Retourne tous les hooks et utilitaires pour la ressource
     */
    return {
        /** Query keys pour la gestion du cache */
        keys,
        /** Hook pour récupérer la liste complète */
        useList,
        /** Hook pour récupérer la liste paginée */
        useListPaginated,
        /** Hook pour récupérer un élément par ID */
        useDetail,
        /** Hook pour récupérer les statistiques */
        useStats,
        /** Hook pour créer une nouvelle ressource */
        useCreate,
        /** Hook pour mettre à jour une ressource */
        useUpdate,
        /** Hook pour supprimer une ressource */
        useDelete,
    };
}
