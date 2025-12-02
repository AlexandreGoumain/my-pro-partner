import { useDeleteClient, useImportClients } from "@/hooks/use-clients";
import { useCrudDialogs } from "@/hooks/use-crud-dialogs";
import type { Client } from "@/lib/generated/prisma";
import type { CSVMapping } from "@/lib/types";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export interface ClientHandlers {
    createDialogOpen: boolean;
    setCreateDialogOpen: (open: boolean) => void;
    editDialogOpen: boolean;
    setEditDialogOpen: (open: boolean) => void;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    importDialogOpen: boolean;
    setImportDialogOpen: (open: boolean) => void;
    selectedClient: Client | null;

    handleCreate: () => void;
    handleEdit: (client: Client) => void;
    handleDelete: (client: Client) => void;
    confirmDelete: () => void;
    handleImport: (file: File, mapping: CSVMapping[]) => Promise<void>;
    handleCreateSuccess: () => void;
    handleEditSuccess: () => void;

    isDeleting: boolean;
}

export function useClientHandlers(): ClientHandlers {
    // Use generic CRUD dialogs hook
    const {
        dialogs,
        selected: selectedClient,
        handlers: dialogHandlers,
        setDialogs,
    } = useCrudDialogs<Client>();

    // Additional dialog for import (specific to clients)
    const [importDialogOpen, setImportDialogOpen] = useState(false);

    const deleteClient = useDeleteClient();
    const importClients = useImportClients();

    const handleCreate = useCallback(() => {
        dialogHandlers.openCreate();
    }, [dialogHandlers]);

    const handleEdit = useCallback(
        (client: Client) => {
            dialogHandlers.openEdit(client);
        },
        [dialogHandlers]
    );

    const handleDelete = useCallback(
        (client: Client) => {
            dialogHandlers.openDelete(client);
        },
        [dialogHandlers]
    );

    const confirmDelete = useCallback(() => {
        if (!selectedClient) return;

        deleteClient.mutate(selectedClient.id, {
            onSuccess: () => {
                toast.success("Client supprimé", {
                    description: "Le client a été supprimé avec succès",
                });
                dialogHandlers.closeDelete();
            },
            onError: (error) => {
                toast.error("Erreur", {
                    description:
                        error instanceof Error
                            ? error.message
                            : "Impossible de supprimer le client",
                });
            },
        });
    }, [selectedClient, deleteClient, dialogHandlers]);

    const handleImport = useCallback(
        async (_file: File, _mapping: CSVMapping[]) => {
            try {
                // TODO: Parse CSV file and map to client records before calling import
                await importClients.mutateAsync([]);
                toast.success("Import réussi", {
                    description: "Les clients ont été importés avec succès",
                });
                setImportDialogOpen(false);
            } catch (error) {
                toast.error("Erreur", {
                    description:
                        error instanceof Error
                            ? error.message
                            : "Erreur lors de l'import",
                });
            }
        },
        [importClients]
    );

    const handleCreateSuccess = useCallback(() => {
        toast.success("Client créé", {
            description: "Le client a été créé avec succès",
        });
    }, []);

    const handleEditSuccess = useCallback(() => {
        toast.success("Client modifié", {
            description: "Le client a été modifié avec succès",
        });
    }, []);

    // Dialog state setters with stable references
    const setCreateDialogOpen = useCallback(
        (open: boolean) => {
            setDialogs((prev) => ({ ...prev, create: open }));
        },
        [setDialogs]
    );

    const setEditDialogOpen = useCallback(
        (open: boolean) => {
            setDialogs((prev) => ({ ...prev, edit: open }));
        },
        [setDialogs]
    );

    const setDeleteDialogOpen = useCallback(
        (open: boolean) => {
            setDialogs((prev) => ({ ...prev, delete: open }));
        },
        [setDialogs]
    );

    return {
        createDialogOpen: dialogs.create,
        setCreateDialogOpen,
        editDialogOpen: dialogs.edit,
        setEditDialogOpen,
        deleteDialogOpen: dialogs.delete,
        setDeleteDialogOpen,
        importDialogOpen,
        setImportDialogOpen,
        selectedClient,
        handleCreate,
        handleEdit,
        handleDelete,
        confirmDelete,
        handleImport,
        handleCreateSuccess,
        handleEditSuccess,
        isDeleting: deleteClient.isPending,
    };
}
