import type {
    BankReconciliationStats,
    BankTransaction,
} from "@/lib/types/bank-reconciliation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type FilterType = "all" | "pending";

interface UseBankReconciliationReturn {
    transactions: BankTransaction[];
    stats: BankReconciliationStats | null;
    isLoading: boolean;
    isUploading: boolean;
    filter: FilterType;
    setFilter: (filter: FilterType) => void;
    loadData: () => Promise<void>;
    handleFileUpload: (file: File) => Promise<void>;
    handleAutoMatch: () => Promise<void>;
    handleIgnore: (transactionId: string) => Promise<void>;
}

export function useBankReconciliation(): UseBankReconciliationReturn {
    const [transactions, setTransactions] = useState<BankTransaction[]>([]);
    const [stats, setStats] = useState<BankReconciliationStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [filter, setFilter] = useState<FilterType>("pending");

    useEffect(() => {
        loadData();
    }, [filter]);

    const loadData = async () => {
        try {
            setIsLoading(true);

            const [transactionsRes, statsRes] = await Promise.all([
                fetch(`/api/bank/transactions?status=${filter}`),
                fetch("/api/bank/stats"),
            ]);

            const transactionsData = await transactionsRes.json();
            const statsData = await statsRes.json();

            setTransactions(transactionsData.transactions || []);
            setStats(statsData.stats);
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors du chargement des données");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/bank/import", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            toast.success(
                `${data.imported} transactions importées sur ${data.total}`
            );
            await loadData();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Erreur lors de l'import");
        } finally {
            setIsUploading(false);
        }
    };

    const handleAutoMatch = async () => {
        try {
            const res = await fetch("/api/bank/auto-match", {
                method: "POST",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            toast.success("Matching automatique effectué");
            await loadData();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Erreur lors du matching");
        }
    };

    const handleIgnore = async (transactionId: string) => {
        try {
            const res = await fetch(`/api/bank/${transactionId}/ignore`, {
                method: "POST",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            toast.success("Transaction ignorée");
            await loadData();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Erreur");
        }
    };

    return {
        transactions,
        stats,
        isLoading,
        isUploading,
        filter,
        setFilter,
        loadData,
        handleFileUpload,
        handleAutoMatch,
        handleIgnore,
    };
}
