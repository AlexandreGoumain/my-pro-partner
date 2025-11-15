import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { Client } from "@/lib/generated/prisma";
import { useDeleteClient, useImportClients } from "@/hooks/use-clients";
import type { CSVMapping } from "@/lib/types";

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
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const deleteClient = useDeleteClient();
    const importClients = useImportClients();

    const handleCreate = useCallback(() => {
        setCreateDialogOpen(true);
    }, []);

    const handleEdit = useCallback((client: Client) => {
        setSelectedClient(client);
        setEditDialogOpen(true);
    }, []);

    const handleDelete = useCallback((client: Client) => {
        setSelectedClient(client);
        setDeleteDialogOpen(true);
    }, []);

    const confirmDelete = useCallback(() => {
        if (!selectedClient) return;

        deleteClient.mutate(selectedClient.id, {
            onSuccess: () => {
                toast.success("Client supprimé avec succès");
                setDeleteDialogOpen(false);
                setSelectedClient(null);
            },
            onError: (error) => {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Erreur lors de la suppression"
                );
            },
        });
    }, [selectedClient, deleteClient]);

    const handleImport = useCallback(
        async (file: File, mapping: CSVMapping[]) => {
            try {
                await importClients.mutateAsync({ file, mapping });
                toast.success("Import réussi");
                setImportDialogOpen(false);
            } catch (error) {
                toast.error(
                    error instanceof Error ? error.message : "Erreur lors de l'import"
                );
            }
        },
        [importClients]
    );

    const handleCreateSuccess = useCallback(() => {
        toast.success("Client créé avec succès");
    }, []);

    const handleEditSuccess = useCallback(() => {
        toast.success("Client modifié avec succès");
    }, []);

    return {
        createDialogOpen,
        setCreateDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        deleteDialogOpen,
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
