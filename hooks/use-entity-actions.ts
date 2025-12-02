import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useCrudDialogs, type UseCrudDialogsReturn } from "./use-crud-dialogs";

/**
 * Configuration des labels pour les toasts et confirmations
 */
export interface EntityLabels {
    /** Nom singulier (ex: "article", "client") */
    singular: string;
    /** Nom pluriel (ex: "articles", "clients") */
    plural: string;
    /** Article défini (ex: "l'", "le", "la") */
    article?: string;
    /** Messages personnalisés (optionnels) */
    messages?: {
        createSuccess?: string;
        editSuccess?: string;
        deleteSuccess?: string;
        deleteConfirm?: string;
        deleteError?: string;
    };
}

/**
 * Configuration pour useEntityActions
 */
export interface UseEntityActionsOptions<T> {
    /** Labels pour les messages */
    labels: EntityLabels;
    /** Mutation de suppression (ex: useDeleteArticle()) */
    deleteMutation?: {
        mutate: (
            id: string,
            options: {
                onSuccess?: () => void;
                onError?: (error: Error) => void;
            }
        ) => void;
        isPending: boolean;
    };
    /** Callback après une suppression réussie */
    onDeleteSuccess?: () => void;
    /** Callback pour naviguer vers la page de détail */
    onView?: (item: T) => void;
}

/**
 * Callbacks de succès pour les actions CRUD
 */
export interface SuccessCallbacks {
    /** Appelé après création réussie */
    onCreateSuccess: () => void;
    /** Appelé après modification réussie */
    onEditSuccess: () => void;
    /** Appelé après suppression réussie (interne, utilisé par confirmDelete) */
    onDeleteSuccess: () => void;
}

/**
 * Handlers d'actions pour une entité
 */
export interface EntityActionHandlers<T> {
    /** Ouvrir le dialog de création */
    handleCreate: () => void;
    /** Voir l'élément (navigation ou dialog) */
    handleView: (item: T) => void;
    /** Ouvrir le dialog d'édition */
    handleEdit: (item: T) => void;
    /** Ouvrir le dialog de suppression */
    handleDelete: (item: T) => void;
    /** Confirmer et exécuter la suppression */
    confirmDelete: () => void;
}

/**
 * Valeur retournée par useEntityActions
 */
export interface UseEntityActionsReturn<T> {
    /** Gestion des dialogs CRUD */
    dialogs: UseCrudDialogsReturn<T>;
    /** Handlers d'actions */
    actions: EntityActionHandlers<T>;
    /** Callbacks de succès (à passer aux dialogs) */
    successCallbacks: SuccessCallbacks;
    /** État de la suppression */
    isDeleting: boolean;
    /** Élément sélectionné */
    selectedItem: T | null;
    /** Labels configurés */
    labels: EntityLabels;
}

/**
 * Hook générique pour les actions CRUD sur une entité
 *
 * Combine la gestion des dialogs (useCrudDialogs) avec :
 * - Toasts de succès/erreur automatiques
 * - Flow de suppression avec confirmation
 * - Labels personnalisables
 *
 * @example
 * ```tsx
 * function ArticlesPage() {
 *   const deleteArticle = useDeleteArticle();
 *
 *   const {
 *     dialogs,
 *     actions,
 *     successCallbacks,
 *     isDeleting,
 *     selectedItem,
 *   } = useEntityActions<Article>({
 *     labels: {
 *       singular: "article",
 *       plural: "articles",
 *       article: "l'",
 *     },
 *     deleteMutation: deleteArticle,
 *   });
 *
 *   return (
 *     <>
 *       <Button onClick={actions.handleCreate}>Créer</Button>
 *       <DataTable onRowClick={actions.handleView} />
 *
 *       <CreateDialog
 *         open={dialogs.dialogs.create}
 *         onOpenChange={(open) => dialogs.setDialogs(prev => ({...prev, create: open}))}
 *         onSuccess={successCallbacks.onCreateSuccess}
 *       />
 *
 *       <DeleteDialog
 *         open={dialogs.dialogs.delete}
 *         onConfirm={actions.confirmDelete}
 *         isLoading={isDeleting}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export function useEntityActions<T extends { id: string }>(
    options: UseEntityActionsOptions<T>
): UseEntityActionsReturn<T> {
    const { labels, deleteMutation, onDeleteSuccess, onView } = options;

    // Use the existing CRUD dialogs hook
    const crudDialogs = useCrudDialogs<T>();
    const { handlers: dialogHandlers, selected: selectedItem } = crudDialogs;

    // Build messages with defaults
    const messages = useMemo(() => {
        const articleUpper =
            labels.article === "l'"
                ? "L'"
                : labels.article
                    ? labels.article.charAt(0).toUpperCase() + labels.article.slice(1)
                    : "";

        return {
            createSuccess:
                labels.messages?.createSuccess ||
                `${articleUpper}${labels.singular} a été créé(e) avec succès`,
            editSuccess:
                labels.messages?.editSuccess ||
                `${articleUpper}${labels.singular} a été modifié(e) avec succès`,
            deleteSuccess:
                labels.messages?.deleteSuccess ||
                `${articleUpper}${labels.singular} a été supprimé(e) avec succès`,
            deleteConfirm:
                labels.messages?.deleteConfirm ||
                `Êtes-vous sûr de vouloir supprimer ce(tte) ${labels.singular} ?`,
            deleteError:
                labels.messages?.deleteError ||
                `Impossible de supprimer ${labels.article || ""}${labels.singular}`,
        };
    }, [labels]);

    // Success callbacks with toasts
    const successCallbacks: SuccessCallbacks = useMemo(
        () => ({
            onCreateSuccess: () => {
                toast.success(messages.createSuccess);
            },
            onEditSuccess: () => {
                toast.success(messages.editSuccess);
            },
            onDeleteSuccess: () => {
                toast.success(messages.deleteSuccess);
            },
        }),
        [messages]
    );

    // Action handlers
    const handleCreate = useCallback(() => {
        dialogHandlers.openCreate();
    }, [dialogHandlers]);

    const handleView = useCallback(
        (item: T) => {
            if (onView) {
                onView(item);
            } else {
                dialogHandlers.openView(item);
            }
        },
        [dialogHandlers, onView]
    );

    const handleEdit = useCallback(
        (item: T) => {
            dialogHandlers.openEdit(item);
        },
        [dialogHandlers]
    );

    const handleDelete = useCallback(
        (item: T) => {
            dialogHandlers.openDelete(item);
        },
        [dialogHandlers]
    );

    const confirmDelete = useCallback(() => {
        if (!selectedItem || !deleteMutation) return;

        deleteMutation.mutate(selectedItem.id, {
            onSuccess: () => {
                successCallbacks.onDeleteSuccess();
                dialogHandlers.closeDelete();
                onDeleteSuccess?.();
            },
            onError: (error: Error) => {
                toast.error("Erreur", {
                    description: error.message || messages.deleteError,
                });
            },
        });
    }, [
        selectedItem,
        deleteMutation,
        successCallbacks,
        dialogHandlers,
        onDeleteSuccess,
        messages.deleteError,
    ]);

    const actions: EntityActionHandlers<T> = useMemo(
        () => ({
            handleCreate,
            handleView,
            handleEdit,
            handleDelete,
            confirmDelete,
        }),
        [handleCreate, handleView, handleEdit, handleDelete, confirmDelete]
    );

    return {
        dialogs: crudDialogs,
        actions,
        successCallbacks,
        isDeleting: deleteMutation?.isPending ?? false,
        selectedItem,
        labels,
    };
}

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

/**
 * Labels prédéfinis pour les entités courantes
 */
export const ENTITY_LABELS = {
    article: {
        singular: "article",
        plural: "articles",
        article: "l'",
    },
    client: {
        singular: "client",
        plural: "clients",
        article: "le",
    },
    segment: {
        singular: "segment",
        plural: "segments",
        article: "le",
    },
    campaign: {
        singular: "campagne",
        plural: "campagnes",
        article: "la",
    },
    document: {
        singular: "document",
        plural: "documents",
        article: "le",
    },
    facture: {
        singular: "facture",
        plural: "factures",
        article: "la",
    },
    devis: {
        singular: "devis",
        plural: "devis",
        article: "le",
    },
    avoir: {
        singular: "avoir",
        plural: "avoirs",
        article: "l'",
    },
    reservation: {
        singular: "réservation",
        plural: "réservations",
        article: "la",
    },
    personnel: {
        singular: "membre du personnel",
        plural: "membres du personnel",
        article: "le",
    },
    category: {
        singular: "catégorie",
        plural: "catégories",
        article: "la",
    },
} as const satisfies Record<string, EntityLabels>;
