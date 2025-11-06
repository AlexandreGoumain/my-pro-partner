import { useState } from "react";
import { toast } from "sonner";

type DocumentStatut =
    | "BROUILLON"
    | "ENVOYE"
    | "ACCEPTE"
    | "REFUSE"
    | "PAYE"
    | "ANNULE";

interface UseDocumentStatusProps {
    documentId: string;
    currentStatus: DocumentStatut;
    documentType: "DEVIS" | "FACTURE" | "AVOIR";
    onStatusChanged?: () => void;
}

interface UseDocumentStatusReturn {
    isConfirmOpen: boolean;
    selectedStatus: DocumentStatut | null;
    isUpdating: boolean;
    allowedTransitions: DocumentStatut[];
    handleStatusSelect: (newStatus: DocumentStatut) => void;
    handleConfirmChange: () => Promise<void>;
    handleCancelChange: () => void;
}

// Allowed transitions
const ALLOWED_TRANSITIONS: Record<DocumentStatut, DocumentStatut[]> = {
    BROUILLON: ["ENVOYE", "ANNULE"],
    ENVOYE: ["ACCEPTE", "REFUSE", "ANNULE"],
    ACCEPTE: ["ANNULE"],
    REFUSE: [],
    PAYE: [],
    ANNULE: [],
};

const INVOICE_TRANSITIONS: Record<DocumentStatut, DocumentStatut[]> = {
    BROUILLON: ["ENVOYE", "ANNULE"],
    ENVOYE: ["PAYE", "ANNULE"],
    PAYE: [],
    ACCEPTE: [],
    REFUSE: [],
    ANNULE: [],
};

const STATUS_LABELS: Record<DocumentStatut, string> = {
    BROUILLON: "Brouillon",
    ENVOYE: "Envoyé",
    ACCEPTE: "Accepté",
    REFUSE: "Refusé",
    PAYE: "Payé",
    ANNULE: "Annulé",
};

/**
 * Custom hook for managing document status changes
 * Handles validation, API calls, and status transitions
 *
 * @param props Document info and callbacks
 * @returns Status management handlers and state
 */
export function useDocumentStatus({
    documentId,
    currentStatus,
    documentType,
    onStatusChanged,
}: UseDocumentStatusProps): UseDocumentStatusReturn {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<DocumentStatut | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Get allowed transitions based on document type
    const allowedTransitions =
        documentType === "FACTURE"
            ? INVOICE_TRANSITIONS[currentStatus] || []
            : ALLOWED_TRANSITIONS[currentStatus] || [];

    const handleStatusSelect = (newStatus: DocumentStatut) => {
        setSelectedStatus(newStatus);
        setIsConfirmOpen(true);
    };

    const handleConfirmChange = async () => {
        if (!selectedStatus) return;

        try {
            setIsUpdating(true);

            const response = await fetch(`/api/documents/${documentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ statut: selectedStatus }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Erreur lors de la mise à jour");
            }

            toast.success(`Statut changé en ${STATUS_LABELS[selectedStatus]}`);
            setIsConfirmOpen(false);
            setSelectedStatus(null);
            onStatusChanged?.();
        } catch (error) {
            console.error("[Document Status] Error updating status:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Erreur lors du changement de statut"
            );
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancelChange = () => {
        setIsConfirmOpen(false);
        setSelectedStatus(null);
    };

    return {
        isConfirmOpen,
        selectedStatus,
        isUpdating,
        allowedTransitions,
        handleStatusSelect,
        handleConfirmChange,
        handleCancelChange,
    };
}
