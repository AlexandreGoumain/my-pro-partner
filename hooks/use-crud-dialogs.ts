import { useState, useCallback, useMemo } from "react";

/**
 * États des dialogs CRUD
 */
export interface DialogStates {
    create: boolean;
    edit: boolean;
    delete: boolean;
    view: boolean;
}

/**
 * Handlers pour gérer les dialogs
 */
export interface DialogHandlers<T> {
    /** Ouvrir le dialog de création */
    openCreate: () => void;
    /** Ouvrir le dialog d'édition avec un élément */
    openEdit: (item: T) => void;
    /** Ouvrir le dialog de suppression avec un élément */
    openDelete: (item: T) => void;
    /** Ouvrir le dialog de visualisation avec un élément */
    openView: (item: T) => void;
    /** Fermer tous les dialogs */
    closeAll: () => void;
    /** Fermer le dialog de création */
    closeCreate: () => void;
    /** Fermer le dialog d'édition */
    closeEdit: () => void;
    /** Fermer le dialog de suppression */
    closeDelete: () => void;
    /** Fermer le dialog de visualisation */
    closeView: () => void;
}

/**
 * Valeur de retour du hook useCrudDialogs
 */
export interface UseCrudDialogsReturn<T> {
    /** États actuels des dialogs */
    dialogs: DialogStates;
    /** Élément actuellement sélectionné */
    selected: T | null;
    /** Handlers pour gérer les dialogs */
    handlers: DialogHandlers<T>;
    /** Setter pour les états des dialogs (pour contrôle manuel si besoin) */
    setDialogs: React.Dispatch<React.SetStateAction<DialogStates>>;
    /** Setter pour l'élément sélectionné (pour contrôle manuel si besoin) */
    setSelected: React.Dispatch<React.SetStateAction<T | null>>;
}

/**
 * Hook générique pour gérer les états et handlers des dialogs CRUD
 *
 * Centralise la gestion des dialogs Create/Edit/Delete/View et de l'élément sélectionné,
 * éliminant ainsi la duplication de code dans chaque page.
 *
 * @example
 * ```tsx
 * function ClientsPage() {
 *   const { dialogs, selected, handlers } = useCrudDialogs<Client>();
 *
 *   return (
 *     <>
 *       <Button onClick={handlers.openCreate}>Créer</Button>
 *       <Button onClick={() => handlers.openEdit(client)}>Éditer</Button>
 *
 *       <CreateDialog
 *         open={dialogs.create}
 *         onOpenChange={handlers.closeCreate}
 *       />
 *
 *       <EditDialog
 *         open={dialogs.edit}
 *         onOpenChange={handlers.closeEdit}
 *         item={selected}
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @template T - Type de l'élément géré (Client, Article, etc.)
 * @returns État des dialogs, élément sélectionné et handlers
 */
export function useCrudDialogs<T = unknown>(): UseCrudDialogsReturn<T> {
    const [dialogs, setDialogs] = useState<DialogStates>({
        create: false,
        edit: false,
        delete: false,
        view: false,
    });

    const [selected, setSelected] = useState<T | null>(null);

    // Handlers mémorisés pour éviter les re-renders inutiles
    const handlers = useMemo<DialogHandlers<T>>(
        () => ({
            openCreate: () => {
                setSelected(null);
                setDialogs((prev) => ({ ...prev, create: true }));
            },

            openEdit: (item: T) => {
                setSelected(item);
                setDialogs((prev) => ({ ...prev, edit: true }));
            },

            openDelete: (item: T) => {
                setSelected(item);
                setDialogs((prev) => ({ ...prev, delete: true }));
            },

            openView: (item: T) => {
                setSelected(item);
                setDialogs((prev) => ({ ...prev, view: true }));
            },

            closeAll: () => {
                setDialogs({
                    create: false,
                    edit: false,
                    delete: false,
                    view: false,
                });
                setSelected(null);
            },

            closeCreate: () => {
                setDialogs((prev) => ({ ...prev, create: false }));
                setSelected(null);
            },

            closeEdit: () => {
                setDialogs((prev) => ({ ...prev, edit: false }));
                setSelected(null);
            },

            closeDelete: () => {
                setDialogs((prev) => ({ ...prev, delete: false }));
                setSelected(null);
            },

            closeView: () => {
                setDialogs((prev) => ({ ...prev, view: false }));
                setSelected(null);
            },
        }),
        []
    );

    return {
        dialogs,
        selected,
        handlers,
        setDialogs,
        setSelected,
    };
}

/**
 * Hook alternatif pour les pages qui utilisent l'ancienne nomenclature
 *
 * Retourne les états individuels pour compatibilité avec le code existant.
 * Utiliser `useCrudDialogs` est préférable pour les nouvelles implémentations.
 *
 * @deprecated Utiliser `useCrudDialogs` à la place
 */
export function useCrudDialogsLegacy<T = unknown>() {
    const { dialogs, selected, handlers, setDialogs, setSelected } = useCrudDialogs<T>();

    return {
        // États individuels
        createDialogOpen: dialogs.create,
        setCreateDialogOpen: (open: boolean) =>
            setDialogs((prev) => ({ ...prev, create: open })),

        editDialogOpen: dialogs.edit,
        setEditDialogOpen: (open: boolean) =>
            setDialogs((prev) => ({ ...prev, edit: open })),

        deleteDialogOpen: dialogs.delete,
        setDeleteDialogOpen: (open: boolean) =>
            setDialogs((prev) => ({ ...prev, delete: open })),

        viewDialogOpen: dialogs.view,
        setViewDialogOpen: (open: boolean) =>
            setDialogs((prev) => ({ ...prev, view: open })),

        selectedItem: selected,
        setSelectedItem: setSelected,

        // Handlers
        handleCreate: handlers.openCreate,
        handleEdit: handlers.openEdit,
        handleDelete: handlers.openDelete,
        handleView: handlers.openView,
    };
}
