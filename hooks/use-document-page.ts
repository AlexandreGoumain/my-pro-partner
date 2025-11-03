import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { useDocuments, useDeleteDocument, type DocumentType } from "./use-documents";

export type { DocumentType };

interface UseDocumentPageProps<T> {
    documentType: DocumentType;
    basePath: string;
    createColumns: (handlers: Record<string, unknown>) => unknown[];
    additionalHandlers?: Record<string, (document: T) => void | Promise<void>>;
}

export function useDocumentPage<T extends { id: string }>({
    documentType,
    basePath,
    createColumns,
    additionalHandlers = {},
}: UseDocumentPageProps<T>) {
    const router = useRouter();
    const { data: documents = [], isLoading } = useDocuments(documentType);
    const deleteDocument = useDeleteDocument();

    const labels = {
        FACTURE: {
            singular: "facture",
            plural: "factures",
            article: "la",
            articleUpper: "La",
            new: "Nouvelle facture",
            title: "Factures",
            description: "Gérez vos factures et suivez les paiements",
            emptyTitle: "Aucune facture",
            emptyDescription: "Commencez par créer votre première facture pour vos clients",
            createButton: "Créer une facture",
            deleteConfirm: "Êtes-vous sûr de vouloir supprimer cette facture ?",
            deleteSuccess: "Facture supprimée avec succès",
            deleteError: "Impossible de supprimer la facture",
            fetchError: "Impossible de charger les factures",
            loadingError: "Erreur lors du chargement des factures",
            notFound: "Aucune facture trouvée",
        },
        DEVIS: {
            singular: "devis",
            plural: "devis",
            article: "le",
            articleUpper: "Le",
            new: "Nouveau devis",
            title: "Devis",
            description: "Gérez vos devis et convertissez-les en factures",
            emptyTitle: "Aucun devis",
            emptyDescription: "Commencez par créer votre premier devis pour vos clients",
            createButton: "Créer un devis",
            deleteConfirm: "Êtes-vous sûr de vouloir supprimer ce devis ?",
            deleteSuccess: "Devis supprimé avec succès",
            deleteError: "Impossible de supprimer le devis",
            fetchError: "Impossible de charger les devis",
            loadingError: "Erreur lors du chargement des devis",
            notFound: "Aucun devis trouvé",
        },
    };

    const label = labels[documentType];

    const handleView = (document: T) => {
        router.push(`${basePath}/${document.id}`);
    };

    const handleEdit = (document: T) => {
        router.push(`${basePath}/${document.id}`);
    };

    const handleDelete = async (document: T) => {
        if (!confirm(label.deleteConfirm)) return;

        try {
            await deleteDocument.mutateAsync(document.id);
            toast.success(label.deleteSuccess);
        } catch (error) {
            console.error(`Error deleting ${label.singular}:`, error);
            toast.error(label.deleteError);
        }
    };

    const handleCreate = () => {
        router.push(`${basePath}/new`);
    };

    const handlers = useMemo(() => ({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        ...additionalHandlers,
    }), [handleView, handleEdit, handleDelete, additionalHandlers]);

    const columns = useMemo(() => createColumns(handlers), [createColumns, handlers]);

    return {
        documents: documents as T[],
        isLoading,
        columns,
        label,
        handlers: {
            handleView,
            handleEdit,
            handleDelete,
            handleCreate,
        },
    };
}
