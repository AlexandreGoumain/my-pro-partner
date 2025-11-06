import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils/payment-utils";

export interface Debtor {
    id: string;
    nom: string;
    prenom: string | null;
    email: string | null;
    telephone: string | null;
    totalDebt: number;
    oldestInvoiceDate: Date;
    unpaidInvoiceCount: number;
    daysOverdue: number;
    riskLevel: "HIGH" | "MEDIUM" | "LOW";
}

interface DebtorsResponse {
    debtors: Debtor[];
    summary: {
        totalClients: number;
        totalDebtAmount: number;
        highRiskCount: number;
        mediumRiskCount: number;
        lowRiskCount: number;
    };
}

interface UseDebtorsAnalyticsReturn {
    limit: string;
    setLimit: (limit: string) => void;
    debtors: Debtor[];
    summary: DebtorsResponse["summary"] | undefined;
    isLoading: boolean;
    error: Error | null;
    handleSendReminder: (clientId: string) => Promise<void>;
    formatAmount: (value: number) => string;
}

/**
 * Custom hook for managing debtors analytics page
 * Handles data fetching, limit selection, and reminder sending
 *
 * @returns Debtors data and handlers
 */
export function useDebtorsAnalytics(): UseDebtorsAnalyticsReturn {
    const [limit, setLimit] = useState("10");

    const { data, isLoading, error } = useQuery<DebtorsResponse>({
        queryKey: ["top-debtors", limit],
        queryFn: async () => {
            const params = new URLSearchParams({ limit });
            const response = await fetch(`/api/analytics/top-debtors?${params}`);

            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données");
            }

            return response.json();
        },
    });

    const handleSendReminder = async (clientId: string) => {
        try {
            const response = await fetch(`/api/clients/${clientId}/send-reminder`, {
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
                `Rappel envoyé avec succès (${result.invoiceCount} facture${result.invoiceCount > 1 ? "s" : ""})`
            );
        } catch (error) {
            console.error("[Debtors Analytics] Error sending reminder:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Erreur lors de l'envoi du rappel";
            toast.error(errorMessage);
        }
    };

    return {
        limit,
        setLimit,
        debtors: data?.debtors || [],
        summary: data?.summary,
        isLoading,
        error: error as Error | null,
        handleSendReminder,
        formatAmount: formatCurrency,
    };
}
