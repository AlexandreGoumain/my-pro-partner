import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { documentKeys } from "./use-documents";
import type { Invoice } from "@/lib/types/document.types";

interface UseInvoicePaymentReturn {
    selectedInvoice: Invoice | null;
    isPaymentDialogOpen: boolean;
    openPaymentDialog: (invoice: Invoice) => void;
    closePaymentDialog: () => void;
    handlePaymentSuccess: () => void;
}

/**
 * Custom hook for managing invoice payment dialog state
 * Handles opening/closing the dialog and refetching data after successful payment
 *
 * @returns Payment dialog state and handlers
 */
export function useInvoicePayment(): UseInvoicePaymentReturn {
    const queryClient = useQueryClient();
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

    const openPaymentDialog = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsPaymentDialogOpen(true);
    };

    const closePaymentDialog = () => {
        setIsPaymentDialogOpen(false);
        setSelectedInvoice(null);
    };

    const handlePaymentSuccess = () => {
        closePaymentDialog();
        // Invalidate all document queries to refresh the data
        queryClient.invalidateQueries({ queryKey: documentKeys.all });
    };

    return {
        selectedInvoice,
        isPaymentDialogOpen,
        openPaymentDialog,
        closePaymentDialog,
        handlePaymentSuccess,
    };
}
