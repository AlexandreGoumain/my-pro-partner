import { toast } from "sonner";
import { useDeleteDocument } from "@/hooks/use-documents";

interface UseDocumentListHandlersProps {
    documentType: "DEVIS" | "FACTURE" | "AVOIR";
    onDeleteSuccess?: () => void;
}

interface UseDocumentListHandlersReturn {
    handleDelete: (id: string) => Promise<void>;
}

const LABELS = {
    DEVIS: {
        singular: "devis",
        deleteConfirm: "Êtes-vous sûr de vouloir supprimer ce devis ?",
        deleteSuccess: "Devis supprimé avec succès",
        deleteError: "Impossible de supprimer le devis",
    },
    FACTURE: {
        singular: "facture",
        deleteConfirm: "Êtes-vous sûr de vouloir supprimer cette facture ?",
        deleteSuccess: "Facture supprimée avec succès",
        deleteError: "Impossible de supprimer la facture",
    },
    AVOIR: {
        singular: "avoir",
        deleteConfirm: "Êtes-vous sûr de vouloir supprimer cet avoir ?",
        deleteSuccess: "Avoir supprimé avec succès",
        deleteError: "Impossible de supprimer l'avoir",
    },
};

/**
 * Custom hook for document list page handlers
 * Provides delete functionality with proper labels and error handling
 *
 * @param props Document type and callbacks
 * @returns Delete handler
 */
export function useDocumentListHandlers({
    documentType,
    onDeleteSuccess,
}: UseDocumentListHandlersProps): UseDocumentListHandlersReturn {
    const deleteDocument = useDeleteDocument();
    const labels = LABELS[documentType];

    const handleDelete = async (id: string) => {
        if (!confirm(labels.deleteConfirm)) {
            return;
        }

        try {
            await deleteDocument.mutateAsync(id);
            toast.success(labels.deleteSuccess);
            onDeleteSuccess?.();
        } catch (error) {
            console.error(`[Document List] Error deleting ${labels.singular}:`, error);
            toast.error(labels.deleteError);
        }
    };

    return {
        handleDelete,
    };
}
