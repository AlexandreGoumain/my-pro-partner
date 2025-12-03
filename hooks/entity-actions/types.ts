import type { UseCrudDialogsReturn } from "../use-crud-dialogs";

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
