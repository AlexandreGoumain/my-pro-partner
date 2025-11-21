/**
 * Export centralisé du système de cache global
 * Importez depuis ce fichier pour une meilleure maintenabilité
 *
 * @example
 * ```typescript
 * import { invalidateRelatedResources, updateResourceCache } from "@/lib/cache";
 * ```
 */

// Carte d'invalidation
export {
    getInvalidationRules,
    INVALIDATION_MAP,
    type MutationContext,
    type MutationType,
    type ResourceName,
} from "./invalidation-map";

// Utilitaires d'invalidation
export {
    addToCache,
    createInvalidationHandler,
    getFromCache,
    invalidateRelatedResources,
    invalidateResourceDetail,
    invalidateResourceLists,
    invalidateResourceStats,
    isInCache,
    prefetchResource,
    removeFromCache,
    resetResourceCache,
    updateResourceCache,
} from "./invalidation-utils";
