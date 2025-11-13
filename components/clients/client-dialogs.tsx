import { ClientCreateDialog } from "@/components/client-create-dialog";
import { ClientEditDialog } from "@/components/client-edit-dialog";
import { CSVImportDialog } from "@/components/csv-import-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { getClientFullName } from "@/lib/utils/client-formatting";
import type { Client } from "@/lib/generated/prisma";
import type { CSVMapping } from "@/lib/types";

export interface ClientDialogsProps {
    // Create dialog
    createDialogOpen: boolean;
    onCreateDialogChange: (open: boolean) => void;
    onCreateSuccess: () => void;

    // Edit dialog
    editDialogOpen: boolean;
    onEditDialogChange: (open: boolean) => void;
    onEditSuccess: () => void;

    // Delete dialog
    deleteDialogOpen: boolean;
    onDeleteDialogChange: (open: boolean) => void;
    onDeleteConfirm: () => void;
    isDeleting: boolean;

    // Import dialog
    importDialogOpen: boolean;
    onImportDialogChange: (open: boolean) => void;
    onImport: (data: Record<string, unknown>[]) => Promise<void>;
    csvMappings: CSVMapping[];

    // Selected client
    selectedClient: Client | null;
}

export function ClientDialogs({
    createDialogOpen,
    onCreateDialogChange,
    onCreateSuccess,
    editDialogOpen,
    onEditDialogChange,
    onEditSuccess,
    deleteDialogOpen,
    onDeleteDialogChange,
    onDeleteConfirm,
    isDeleting,
    importDialogOpen,
    onImportDialogChange,
    onImport,
    csvMappings,
    selectedClient,
}: ClientDialogsProps) {
    return (
        <>
            <ClientCreateDialog
                open={createDialogOpen}
                onOpenChange={onCreateDialogChange}
                onSuccess={onCreateSuccess}
            />

            <ClientEditDialog
                client={selectedClient}
                open={editDialogOpen}
                onOpenChange={onEditDialogChange}
                onSuccess={onEditSuccess}
            />

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={onDeleteDialogChange}
                onConfirm={onDeleteConfirm}
                isLoading={isDeleting}
                title="Supprimer le client"
                description={`Êtes-vous sûr de vouloir supprimer le client "${
                    selectedClient
                        ? getClientFullName(
                              selectedClient.nom,
                              selectedClient.prenom
                          )
                        : ""
                }" ? Cette action est irréversible.`}
            />

            <CSVImportDialog
                open={importDialogOpen}
                onOpenChange={onImportDialogChange}
                title="Importer des clients"
                description="Importez plusieurs clients à la fois via un fichier CSV"
                mappings={csvMappings}
                onImport={onImport}
            />
        </>
    );
}
