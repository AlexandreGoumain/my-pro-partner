import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import type {
    BankReconciliationStats,
    BankTransaction,
    FilterType,
} from "@/lib/types/bank-reconciliation";

// Query Keys
export const bankTransactionKeys = {
    all: ["bank-transactions"] as const,
    list: (status: FilterType) =>
        ["bank-transactions", "list", status] as const,
    stats: ["bank-transactions", "stats"] as const,
};

// Hook to fetch transactions by status
export function useBankTransactions(status: FilterType = "pending") {
    return useQuery({
        queryKey: bankTransactionKeys.list(status),
        queryFn: async (): Promise<BankTransaction[]> => {
            const response = await api.get<{ transactions: BankTransaction[] }>(
                `/api/bank/transactions?status=${status}`
            );
            return response.transactions || [];
        },
    });
}

// Hook to fetch bank reconciliation stats
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

// Hook to import CSV file
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
            // Invalidate all transactions queries
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
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            return api.post("/api/bank/auto-match");
        },
        onSuccess: () => {
            // Invalidate all transactions queries
            queryClient.invalidateQueries({
                queryKey: bankTransactionKeys.all,
            });
            queryClient.invalidateQueries({
                queryKey: bankTransactionKeys.stats,
            });
        },
    });
}

// Hook to ignore a transaction
export function useIgnoreTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (transactionId: string) => {
            return api.post(`/api/bank/${transactionId}/ignore`);
        },
        onSuccess: () => {
            // Invalidate all transactions queries
            queryClient.invalidateQueries({
                queryKey: bankTransactionKeys.all,
            });
            queryClient.invalidateQueries({
                queryKey: bankTransactionKeys.stats,
            });
        },
    });
}
