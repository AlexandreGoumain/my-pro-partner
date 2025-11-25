/**
 * Generic Hooks - Réutilisables pour toutes les pages de l'application
 *
 * Ces hooks fournissent des patterns communs pour :
 * - Pagination, recherche et filtrage (usePageFilters)
 * - Navigation et gestion des URLs (usePageNavigation)
 * - Actions CRUD avec dialogs (useEntityActions, useCrudDialogs)
 *
 * @example
 * ```tsx
 * import {
 *   usePageFiltersWithScroll,
 *   usePageNavigation,
 *   useEntityActions,
 *   useCrudDialogs,
 *   ENTITY_LABELS,
 * } from "@/hooks/generic";
 * ```
 */

// Pagination, Search & Filters
export {
    usePageFilters,
    usePageFiltersWithScroll,
    useSimplePageFilters,
    type PaginationState,
    type SearchState,
    type UsePageFiltersOptions,
    type UsePageFiltersReturn,
    type ViewModeState,
} from "../use-page-filters";

// Navigation & URL Management
export {
    usePageNavigation,
    useSimpleNavigation,
    useUrlFilter,
    type EntityRoutes,
    type NavigationHandlers,
    type SearchParamsHelpers,
    type UsePageNavigationOptions,
    type UsePageNavigationReturn,
} from "../use-page-navigation";

// Entity Actions (CRUD with dialogs + toasts)
export {
    ENTITY_LABELS,
    useEntityActions,
    useEntityActionsWithNavigation,
    type EntityActionHandlers,
    type EntityLabels,
    type SuccessCallbacks,
    type UseEntityActionsOptions,
    type UseEntityActionsReturn,
} from "../use-entity-actions";

// CRUD Dialogs (base hook)
export {
    useCrudDialogs,
    useCrudDialogsLegacy,
    type DialogHandlers,
    type DialogStates,
    type UseCrudDialogsReturn,
} from "../use-crud-dialogs";
