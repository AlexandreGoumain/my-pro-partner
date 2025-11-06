import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils/payment-utils";

export interface UnpaidInvoice {
    id: string;
    numero: string;
    dateEmission: Date;
    dateEcheance: Date;
    total_ttc: number;
    reste_a_payer: number;
    daysOverdue: number;
    clientId: string;
    client: {
        nom: string;
        prenom: string | null;
        email: string | null;
    };
}

interface UnpaidInvoicesResponse {
    invoices: UnpaidInvoice[];
    summary: {
        totalInvoices: number;
        totalUnpaid: number;
        overdueCount: number;
        totalOverdue: number;
        averageOverdueDays: number;
    };
}

interface UseUnpaidInvoicesReturn {
    invoices: UnpaidInvoice[];
    summary: UnpaidInvoicesResponse["summary"] | undefined;
    isLoading: boolean;
    error: Error | null;
    sortBy: string;
    setSortBy: (sort: string) => void;
    sortOrder: string;
    setSortOrder: (order: string) => void;
    overdueOnly: boolean;
    setOverdueOnly: (value: boolean) => void;
    handleSendReminder: (invoiceId: string) => Promise<void>;
    formatAmount: (value: number) => string;
}

/**
 * Custom hook for managing unpaid invoices analytics
 * Handles data fetching, sorting, filtering, and reminder sending
 *
 * @returns Unpaid invoices data and handlers
 */
export function useUnpaidInvoices(): UseUnpaidInvoicesReturn {
    const [sortBy, setSortBy] = useState("dateEcheance");
    const [sortOrder, setSortOrder] = useState("asc");
    const [overdueOnly, setOverdueOnly] = useState(false);

    const { data, isLoading, error } = useQuery<UnpaidInvoicesResponse>({
        queryKey: ["unpaid-invoices", sortBy, sortOrder, overdueOnly],
        queryFn: async () => {
            const params = new URLSearchParams({
                sortBy,
                sortOrder,
                overdueOnly: overdueOnly.toString(),
            });

            const response = await fetch(`/api/analytics/unpaid-invoices?${params}`);

            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données");
            }

            return response.json();
        },
    });

    const handleSendReminder = async (invoiceId: string) => {
        try {
            // Find the invoice to get the client ID
            const invoice = data?.invoices.find((inv) => inv.id === invoiceId);
            if (!invoice) {
                toast.error("Facture non trouvée");
                return;
            }

            const response = await fetch(`/api/clients/${invoice.clientId}/send-reminder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Erreur lors de l'envoi du rappel");
            }

            toast.success(
                result.message ||
                    `Rappel envoyé avec succès (${result.invoiceCount} facture${
                        result.invoiceCount > 1 ? "s" : ""
                    })`
            );
        } catch (error) {
            console.error("[Unpaid Invoices] Error sending reminder:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Erreur lors de l'envoi du rappel";
            toast.error(errorMessage);
        }
    };

    return {
        invoices: data?.invoices || [],
        summary: data?.summary,
        isLoading,
        error: error as Error | null,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        overdueOnly,
        setOverdueOnly,
        handleSendReminder,
        formatAmount: formatCurrency,
    };
}
