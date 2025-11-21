import { QueryClient } from "@tanstack/react-query";
import {
    getInvalidationRules,
    type MutationContext,
    type MutationType,
    type ResourceName,
} from "./invalidation-map";

/**
 * Options pour l'invalidation du cache
 */
interface InvalidationOptions {
    /** QueryClient de React Query */
    queryClient: QueryClient;
    /** Nom de la ressource */
    resource: ResourceName;
    /** Type de mutation */
    mutationType: MutationType;
    /** Contexte de la mutation (pour l'invalidation custom) */
    context?: MutationContext;
}

/**
 * Invalide automatiquement le cache selon les règles définies dans la carte d'invalidation
 *
 * @example
 * ```ts
 * // Dans un hook de mutation
 * const mutation = useMutation({
 *   mutationFn: createDocument,
 *   onSuccess: (data, variables) => {
 *     invalidateRelatedResources({
 *       queryClient,
 *       resource: "documents",
 *       mutationType: "create",
 *       context: {
 *         resourceId: data.id,
 *         data: variables,
 *       },
 *     });
 *   },
 * });
 * ```
 */
export async function invalidateRelatedResources(
    options: InvalidationOptions
): Promise<void> {
    const { queryClient, resource, mutationType, context = {} } = options;

    // Récupère les règles d'invalidation pour cette mutation
    const rules = getInvalidationRules(resource, mutationType);

    if (!rules) {
        // Si aucune règle n'est définie, invalide au moins la ressource elle-même
        await queryClient.invalidateQueries({ queryKey: [resource] });
        return;
    }

    // Invalide toutes les ressources définies dans les règles
    const invalidationPromises: Promise<void>[] = [];

    for (const relatedResource of rules.resources) {
        // Invalide la ressource
        invalidationPromises.push(
            queryClient.invalidateQueries({ queryKey: [relatedResource] })
        );

        // Si demandé, invalide aussi les stats
        if (rules.includeStats) {
            invalidationPromises.push(
                queryClient.invalidateQueries({
                    queryKey: [relatedResource, "stats"],
                })
            );
        }
    }

    // Exécute les invalidations custom si définies
    if (rules.customInvalidation) {
        const customKeys = rules.customInvalidation(context);
        for (const key of customKeys) {
            invalidationPromises.push(
                queryClient.invalidateQueries({ queryKey: key })
            );
        }
    }

    // Attend que toutes les invalidations soient complètes
    await Promise.all(invalidationPromises);
}

/**
 * Helper pour créer une fonction onSuccess avec invalidation automatique
 *
 * @example
 * ```ts
 * const mutation = useMutation({
 *   mutationFn: createClient,
 *   onSuccess: createInvalidationHandler(queryClient, "clients", "create"),
 * });
 * ```
 */
export function createInvalidationHandler(
    queryClient: QueryClient,
    resource: ResourceName,
    mutationType: MutationType
) {
    return (data?: unknown, variables?: unknown) => {
        invalidateRelatedResources({
            queryClient,
            resource,
            mutationType,
            context: {
                resourceId: (data as { id?: string })?.id,
                data: data as Record<string, unknown>,
                variables: variables as Record<string, unknown>,
            },
        });
    };
}

/**
 * Invalide toutes les listes d'une ressource (utile pour les mutations bulk)
 */
export async function invalidateResourceLists(
    queryClient: QueryClient,
    resource: ResourceName
): Promise<void> {
    await queryClient.invalidateQueries({
        queryKey: [resource, "list"],
        exact: false, // Invalide tous les variants de la liste
    });
}

/**
 * Invalide un élément spécifique d'une ressource
 */
export async function invalidateResourceDetail(
    queryClient: QueryClient,
    resource: ResourceName,
    id: string
): Promise<void> {
    await Promise.all([
        queryClient.invalidateQueries({ queryKey: [resource, id] }),
        queryClient.invalidateQueries({ queryKey: [resource] }), // Aussi la liste
    ]);
}

/**
 * Invalide les stats d'une ressource
 */
export async function invalidateResourceStats(
    queryClient: QueryClient,
    resource: ResourceName
): Promise<void> {
    await queryClient.invalidateQueries({ queryKey: [resource, "stats"] });
}

/**
 * Réinitialise complètement le cache d'une ressource
 * (Utile après un import bulk ou une synchronisation)
 */
export async function resetResourceCache(
    queryClient: QueryClient,
    resource: ResourceName
): Promise<void> {
    await queryClient.resetQueries({ queryKey: [resource] });
}

/**
 * Précharge une ressource dans le cache
 * (Utile pour améliorer les performances de navigation)
 */
export async function prefetchResource<T>(
    queryClient: QueryClient,
    resource: ResourceName,
    id: string,
    fetchFn: () => Promise<T>
): Promise<void> {
    await queryClient.prefetchQuery({
        queryKey: [resource, id],
        queryFn: fetchFn,
    });
}

/**
 * Met à jour directement le cache d'une ressource (optimistic update)
 *
 * @example
 * ```ts
 * updateResourceCache(queryClient, "clients", clientId, (oldData) => ({
 *   ...oldData,
 *   nom: "Nouveau nom",
 * }));
 * ```
 */
export function updateResourceCache<T>(
    queryClient: QueryClient,
    resource: ResourceName,
    id: string,
    updater: (oldData: T) => T
): void {
    queryClient.setQueryData<T>([resource, id], updater);

    // Met aussi à jour dans les listes si présent
    queryClient.setQueriesData<{ data?: T[] }>(
        { queryKey: [resource, "list"], exact: false },
        (oldData) => {
            if (!oldData?.data) return oldData;
            return {
                ...oldData,
                data: oldData.data.map((item) =>
                    (item as { id: string }).id === id
                        ? updater(item as T)
                        : item
                ),
            };
        }
    );
}

/**
 * Supprime une entrée du cache (optimistic delete)
 */
export function removeFromCache(
    queryClient: QueryClient,
    resource: ResourceName,
    id: string
): void {
    // Supprime la query du détail
    queryClient.removeQueries({ queryKey: [resource, id] });

    // Supprime aussi des listes
    queryClient.setQueriesData<{ data?: { id: string }[] }>(
        { queryKey: [resource, "list"], exact: false },
        (oldData) => {
            if (!oldData?.data) return oldData;
            return {
                ...oldData,
                data: oldData.data.filter((item) => item.id !== id),
            };
        }
    );
}

/**
 * Ajoute une entrée au cache (optimistic create)
 */
export function addToCache<T extends { id: string }>(
    queryClient: QueryClient,
    resource: ResourceName,
    newItem: T
): void {
    // Ajoute à la query du détail
    queryClient.setQueryData([resource, newItem.id], newItem);

    // Ajoute aussi aux listes
    queryClient.setQueriesData<{ data?: T[] }>(
        { queryKey: [resource, "list"], exact: false },
        (oldData) => {
            if (!oldData?.data) return { data: [newItem] };
            return {
                ...oldData,
                data: [newItem, ...oldData.data],
            };
        }
    );
}

/**
 * Vérifie si une ressource est dans le cache
 */
export function isInCache(
    queryClient: QueryClient,
    resource: ResourceName,
    id: string
): boolean {
    const data = queryClient.getQueryData([resource, id]);
    return data !== undefined;
}

/**
 * Récupère une ressource du cache sans faire de requête
 */
export function getFromCache<T>(
    queryClient: QueryClient,
    resource: ResourceName,
    id: string
): T | undefined {
    return queryClient.getQueryData<T>([resource, id]);
}
