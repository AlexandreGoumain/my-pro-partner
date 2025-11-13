import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { useDocument, useDeleteDocument, useConvertQuoteToInvoice } from "@/hooks/use-documents";
import { formatCurrency } from "@/lib/utils/payment-utils";
import { Document, DocumentType } from "@/lib/types/document.types";

export interface UseDocumentDetailProps {
    documentId: string;
    documentType: DocumentType;
    redirectPath: string;
}

export interface UseDocumentDetailReturn {
    document: Document | undefined;
    isLoading: boolean;
    isPdfDialogOpen: boolean;
    setIsPdfDialogOpen: (open: boolean) => void;
    clientName: string;
    canConvert: boolean;
    handleStatusChanged: () => void;
    handleDelete: () => Promise<void>;
    handleConvertToInvoice: () => Promise<void>;
    formatAmount: (value: number) => string;
}

/**
 * Custom hook for managing document detail page logic
 * Handles document operations like delete, convert, status change
 *
 * @param props Document configuration
 * @returns Document data and handlers
 */
export function useDocumentDetail({
    documentId,
    documentType,
    redirectPath,
}: UseDocumentDetailProps): UseDocumentDetailReturn {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);

    const { data: document, isLoading } = useDocument(documentId);
    const deleteDocument = useDeleteDocument();
    const convertToInvoice = useConvertQuoteToInvoice();

    const canConvert = useMemo(
        () => documentType === "DEVIS" && document?.statut === "ACCEPTE",
        [documentType, document?.statut]
    );

    const clientName = useMemo(() => {
        if (!document?.client) return "";
        return document.client.prenom
            ? `${document.client.nom} ${document.client.prenom}`
            : document.client.nom;
    }, [document?.client]);

    const handleStatusChanged = () => {
        queryClient.invalidateQueries({ queryKey: ["document", documentId] });
    };

    const handleDelete = async () => {
        if (!document) return;

        const documentTypeLabel = {
            DEVIS: "devis",
            FACTURE: "facture",
            AVOIR: "avoir",
        }[documentType];

        const confirmMessage = `Êtes-vous sûr de vouloir supprimer ce ${documentTypeLabel} ?`;
        if (!confirm(confirmMessage)) return;

        try {
            await deleteDocument.mutateAsync(document.id);
            toast.success(`${documentTypeLabel.charAt(0).toUpperCase() + documentTypeLabel.slice(1)} supprimé avec succès`);
            router.push(redirectPath);
        } catch (error) {
            console.error(`[Document Detail] Error deleting ${documentType}:`, error);
            toast.error(`Impossible de supprimer le ${documentTypeLabel}`);
        }
    };

    const handleConvertToInvoice = async () => {
        if (!document || documentType !== "DEVIS") return;

        try {
            const result = await convertToInvoice.mutateAsync(document.id);
            toast.success("Devis converti en facture avec succès");
            router.push(`/dashboard/documents/invoices/${result.invoice.id}`);
        } catch (error: any) {
            console.error("[Document Detail] Error converting quote:", error);
            toast.error(error?.message || "Impossible de convertir le devis");
        }
    };

    return {
        document,
        isLoading,
        isPdfDialogOpen,
        setIsPdfDialogOpen,
        clientName,
        canConvert,
        handleStatusChanged,
        handleDelete,
        handleConvertToInvoice,
        formatAmount: formatCurrency,
    };
}
