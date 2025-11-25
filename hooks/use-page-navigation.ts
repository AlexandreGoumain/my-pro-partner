import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * Configuration des routes pour une entité
 */
export interface EntityRoutes {
    /** Route de base (ex: "/dashboard/clients") */
    base: string;
    /** Route pour la page de détail (défaut: "{base}/{id}") */
    detail?: string;
    /** Route pour la page d'édition (défaut: "{base}/{id}/edit") */
    edit?: string;
    /** Route pour la page de création (défaut: "{base}/new") */
    create?: string;
    /** Routes supplémentaires personnalisées */
    custom?: Record<string, string>;
}

/**
 * Options pour usePageNavigation
 */
export interface UsePageNavigationOptions {
    /** Configuration des routes */
    routes: EntityRoutes;
    /** Paramètres de recherche à préserver lors de la navigation */
    preserveParams?: string[];
}

/**
 * Handlers de navigation retournés par le hook
 */
export interface NavigationHandlers<T extends { id: string }> {
    /** Naviguer vers la page de détail d'un élément */
    navigateToDetail: (item: T) => void;
    /** Naviguer vers la page d'édition d'un élément */
    navigateToEdit: (item: T) => void;
    /** Naviguer vers la page de création */
    navigateToCreate: () => void;
    /** Naviguer vers la page de base (liste) */
    navigateToList: () => void;
    /** Naviguer vers une route custom */
    navigateToCustom: (routeKey: string) => void;
    /** Naviguer avec des paramètres de recherche */
    navigateWithParams: (path: string, params: Record<string, string>) => void;
}

/**
 * Helpers pour les paramètres de recherche
 */
export interface SearchParamsHelpers {
    /** Obtenir un paramètre */
    getParam: (key: string) => string | null;
    /** Vérifier si un paramètre existe */
    hasParam: (key: string) => boolean;
    /** Définir un paramètre (navigue vers la nouvelle URL) */
    setParam: (key: string, value: string) => void;
    /** Supprimer un paramètre (navigue vers la nouvelle URL) */
    removeParam: (key: string) => void;
    /** Définir plusieurs paramètres à la fois */
    setParams: (params: Record<string, string>) => void;
    /** Effacer tous les paramètres de recherche */
    clearParams: () => void;
    /** Obtenir tous les paramètres sous forme d'objet */
    allParams: Record<string, string>;
}

/**
 * Valeur retournée par usePageNavigation
 */
export interface UsePageNavigationReturn<T extends { id: string }> {
    /** Router Next.js */
    router: ReturnType<typeof useRouter>;
    /** Chemin actuel */
    pathname: string;
    /** Paramètres de recherche */
    searchParams: ReturnType<typeof useSearchParams>;
    /** Handlers de navigation */
    navigation: NavigationHandlers<T>;
    /** Helpers pour les paramètres de recherche */
    params: SearchParamsHelpers;
    /** Routes configurées */
    routes: Required<EntityRoutes>;
}

/**
 * Hook générique pour la navigation dans les pages d'entités
 *
 * Centralise la logique de navigation commune :
 * - Navigation vers les pages de détail, édition, création
 * - Gestion des paramètres de recherche URL
 * - Routes personnalisables
 *
 * @example
 * ```tsx
 * function ClientsPage() {
 *   const { navigation, params } = usePageNavigation<Client>({
 *     routes: {
 *       base: "/dashboard/clients",
 *       custom: {
 *         segments: "/dashboard/clients/segments",
 *         statistics: "/dashboard/clients/statistiques",
 *         importExport: "/dashboard/clients/import-export",
 *       },
 *     },
 *   });
 *
 *   // Navigation vers une fiche client
 *   const handleView = (client: Client) => navigation.navigateToDetail(client);
 *
 *   // Navigation vers les segments
 *   const goToSegments = () => navigation.navigateToCustom("segments");
 *
 *   // Filtrer par segment via URL
 *   const filterBySegment = (segmentId: string) => params.setParam("segment", segmentId);
 *
 *   // Effacer le filtre segment
 *   const clearSegmentFilter = () => params.removeParam("segment");
 *
 *   return ...;
 * }
 * ```
 */
export function usePageNavigation<T extends { id: string }>(
    options: UsePageNavigationOptions
): UsePageNavigationReturn<T> {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { routes: routeConfig, preserveParams = [] } = options;

    // Build full routes with defaults
    const routes: Required<EntityRoutes> = useMemo(
        () => ({
            base: routeConfig.base,
            detail: routeConfig.detail || `${routeConfig.base}/[id]`,
            edit: routeConfig.edit || `${routeConfig.base}/[id]/edit`,
            create: routeConfig.create || `${routeConfig.base}/new`,
            custom: routeConfig.custom || {},
        }),
        [routeConfig]
    );

    // Helper to build URL with preserved params
    const buildUrl = useCallback(
        (path: string, additionalParams?: Record<string, string>) => {
            const params = new URLSearchParams();

            // Preserve specified params from current URL
            for (const key of preserveParams) {
                const value = searchParams.get(key);
                if (value) {
                    params.set(key, value);
                }
            }

            // Add additional params
            if (additionalParams) {
                for (const [key, value] of Object.entries(additionalParams)) {
                    params.set(key, value);
                }
            }

            const queryString = params.toString();
            return queryString ? `${path}?${queryString}` : path;
        },
        [searchParams, preserveParams]
    );

    // Navigation handlers
    const navigation: NavigationHandlers<T> = useMemo(
        () => ({
            navigateToDetail: (item: T) => {
                const path = routes.base + "/" + item.id;
                router.push(buildUrl(path));
            },

            navigateToEdit: (item: T) => {
                const path = routes.base + "/" + item.id + "/edit";
                router.push(buildUrl(path));
            },

            navigateToCreate: () => {
                router.push(buildUrl(routes.create));
            },

            navigateToList: () => {
                router.push(buildUrl(routes.base));
            },

            navigateToCustom: (routeKey: string) => {
                const path = routes.custom[routeKey];
                if (path) {
                    router.push(buildUrl(path));
                } else {
                    console.warn(`Custom route "${routeKey}" not found`);
                }
            },

            navigateWithParams: (
                path: string,
                params: Record<string, string>
            ) => {
                router.push(buildUrl(path, params));
            },
        }),
        [router, routes, buildUrl]
    );

    // Search params helpers
    const params: SearchParamsHelpers = useMemo(() => {
        const getParam = (key: string) => searchParams.get(key);

        const hasParam = (key: string) => searchParams.has(key);

        const allParams = Object.fromEntries(searchParams.entries());

        const setParam = (key: string, value: string) => {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set(key, value);
            router.push(`${pathname}?${newParams.toString()}`);
        };

        const removeParam = (key: string) => {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete(key);
            const queryString = newParams.toString();
            router.push(queryString ? `${pathname}?${queryString}` : pathname);
        };

        const setParams = (newParamsObj: Record<string, string>) => {
            const newParams = new URLSearchParams(searchParams.toString());
            for (const [key, value] of Object.entries(newParamsObj)) {
                newParams.set(key, value);
            }
            router.push(`${pathname}?${newParams.toString()}`);
        };

        const clearParams = () => {
            router.push(pathname);
        };

        return {
            getParam,
            hasParam,
            setParam,
            removeParam,
            setParams,
            clearParams,
            allParams,
        };
    }, [searchParams, router, pathname]);

    return {
        router,
        pathname,
        searchParams,
        navigation,
        params,
        routes,
    };
}

/**
 * Version simplifiée pour les cas d'usage basiques
 */
export function useSimpleNavigation(basePath: string) {
    return usePageNavigation({
        routes: { base: basePath },
    });
}

/**
 * Hook pour gérer un filtre unique via URL (ex: segment, status)
 *
 * @example
 * ```tsx
 * function ClientsPage() {
 *   const { filterId, setFilter, clearFilter, hasFilter } = useUrlFilter("segment");
 *
 *   // filterId = "abc123" si URL contient ?segment=abc123
 *   // setFilter("xyz") navigue vers ?segment=xyz
 *   // clearFilter() navigue vers URL sans le param
 * }
 * ```
 */
export function useUrlFilter(paramKey: string) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const filterId = searchParams.get(paramKey);
    const hasFilter = filterId !== null;

    const setFilter = useCallback(
        (value: string) => {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set(paramKey, value);
            router.push(`${pathname}?${newParams.toString()}`);
        },
        [router, pathname, searchParams, paramKey]
    );

    const clearFilter = useCallback(() => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete(paramKey);
        const queryString = newParams.toString();
        router.push(queryString ? `${pathname}?${queryString}` : pathname);
    }, [router, pathname, searchParams, paramKey]);

    return {
        filterId,
        hasFilter,
        setFilter,
        clearFilter,
    };
}
