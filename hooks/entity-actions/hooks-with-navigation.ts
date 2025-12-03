import { useEntityActions } from "./use-entity-actions";
import type { UseEntityActionsOptions } from "./types";

/**
 * Hook simplifié pour les entités avec navigation vers la page de détail
 *
 * @example
 * ```tsx
 * const { actions } = useEntityActionsWithNavigation<Client>({
 *   labels: { singular: "client", plural: "clients", article: "le" },
 *   deleteMutation: deleteClient,
 *   detailPath: "/dashboard/clients",
 * });
 *
 * // actions.handleView(client) navigue vers /dashboard/clients/{client.id}
 * ```
 */
export function useEntityActionsWithNavigation<T extends { id: string }>(
    options: UseEntityActionsOptions<T> & {
        detailPath: string;
        router: { push: (path: string) => void };
    }
) {
    const { detailPath, router, ...rest } = options;

    return useEntityActions<T>({
        ...rest,
        onView: (item) => {
            router.push(`${detailPath}/${item.id}`);
        },
    });
}
