import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useCrudDialogs } from "../use-crud-dialogs";
import type {
    EntityActionHandlers,
    SuccessCallbacks,
    UseEntityActionsOptions,
    UseEntityActionsReturn,
} from "./types";

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
