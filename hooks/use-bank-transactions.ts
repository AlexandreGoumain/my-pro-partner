/**
 * Bank transactions hooks
 *
 * Optimized version using:
 * - buildUrl utility for URL construction
 * - useMutationWithInvalidation for mutations
 */

import { api } from "@/lib/api/fetch-client";
import { useMutationWithInvalidation } from "@/lib/hooks/mutation-helpers";
import type {
    BankReconciliationStats,
    BankTransaction,
    FilterType,
} from "@/lib/types/bank-reconciliation";
import { buildUrl } from "@/lib/utils/query-params";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query Keys
export const bankTransactionKeys = {
    all: ["bank-transactions"] as const,
    list: (status: FilterType) =>
        ["bank-transactions", "list", status] as const,
    stats: ["bank-transactions", "stats"] as const,
};

// Common invalidation keys
const baseInvalidateKeys = [bankTransactionKeys.all, bankTransactionKeys.stats];

// ============================================================================
// QUERY HOOKS
// ============================================================================

export function useBankTransactions(status: FilterType = "pending") {
    return useQuery({
        queryKey: bankTransactionKeys.list(status),
        queryFn: async (): Promise<BankTransaction[]> => {
            const response = await api.get<{ transactions: BankTransaction[] }>(
                buildUrl("/api/bank/transactions", { status })
            );
            return response.transactions || [];
        },
    });
}

export function useBankStats() {
    return useQuery({
        queryKey: bankTransactionKeys.stats,
        queryFn: async (): Promise<BankReconciliationStats> => {
            const response = await api.get<{ stats: BankReconciliationStats }>(
                "/api/bank/stats"
            );
            return response.stats;
        },
    });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

// Hook to import CSV file (uses FormData, requires raw fetch)
export function useImportBankTransactions() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/bank/import", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Erreur lors de l'import");
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: bankTransactionKeys.all,
            });
            queryClient.invalidateQueries({
                queryKey: bankTransactionKeys.stats,
            });
        },
    });
}

// Hook to trigger auto-matching
export function useAutoMatch() {
    return useMutationWithInvalidation<unknown, void>({
        mutationFn: () => api.post("/api/bank/auto-match"),
        invalidateKeys: baseInvalidateKeys,
        messages: {
            success: "Rapprochement automatique terminé",
            successDescription: "Les transactions ont été rapprochées.",
        },
    });
}

// Hook to ignore a transaction
export function useIgnoreTransaction() {
    return useMutationWithInvalidation<unknown, string>({
        mutationFn: (transactionId) =>
            api.post(`/api/bank/${transactionId}/ignore`),
        invalidateKeys: baseInvalidateKeys,
        messages: {
            success: "Transaction ignorée",
            successDescription: "La transaction a été marquée comme ignorée.",
        },
    });
}
