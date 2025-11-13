import { useRef, useState } from "react";
import { toast } from "sonner";
import type {
    BankReconciliationStats,
    BankTransaction,
    FilterType,
} from "@/lib/types/bank-reconciliation";
import {
    useBankStats,
    useBankTransactions,
    useImportBankTransactions,
    useAutoMatch,
    useIgnoreTransaction,
} from "./use-bank-transactions";

interface UseBankReconciliationReturn {
    // Data
    transactions: BankTransaction[];
    stats: BankReconciliationStats | null;
    isLoading: boolean;
    isUploading: boolean;

    // Filter state
    filter: FilterType;
    setFilter: (filter: FilterType) => void;

    // Dialog state
    matchDialogOpen: boolean;
    setMatchDialogOpen: (open: boolean) => void;
    anomalyDialogOpen: boolean;
    setAnomalyDialogOpen: (open: boolean) => void;
    selectedTransaction: BankTransaction | null;

    // File input ref
    fileInputRef: React.RefObject<HTMLInputElement | null>;

    // Handlers
    handleFileUpload: (file: File) => Promise<void>;
    handleAutoMatch: () => Promise<void>;
    handleIgnore: (transactionId: string) => Promise<void>;
    onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    openMatchDialog: (transaction: BankTransaction) => void;
    openAnomalyDialog: (transaction: BankTransaction) => void;
    loadData: () => Promise<void>;
}

export function useBankReconciliation(): UseBankReconciliationReturn {
    const [filter, setFilter] = useState<FilterType>("pending");
    const [matchDialogOpen, setMatchDialogOpen] = useState(false);
    const [anomalyDialogOpen, setAnomalyDialogOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] =
        useState<BankTransaction | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // React Query hooks
    const { data: transactions = [], isLoading: isLoadingTransactions } =
        useBankTransactions(filter);
    const { data: stats = null, isLoading: isLoadingStats } = useBankStats();
    const importMutation = useImportBankTransactions();
    const autoMatchMutation = useAutoMatch();
    const ignoreMutation = useIgnoreTransaction();

    const handleFileUpload = async (file: File) => {
        try {
            const result = await importMutation.mutateAsync(file);
            toast.success(
                `${result.imported} transactions importées sur ${result.total}`
            );
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erreur lors de l'import";
            toast.error(message);
        }
    };

    const handleAutoMatch = async () => {
        try {
            await autoMatchMutation.mutateAsync();
            toast.success("Matching automatique effectué");
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erreur lors du matching";
            toast.error(message);
        }
    };

    const handleIgnore = async (transactionId: string) => {
        try {
            await ignoreMutation.mutateAsync(transactionId);
            toast.success("Transaction ignorée");
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Erreur";
            toast.error(message);
        }
    };

    const onFileInputChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            await handleFileUpload(file);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const openMatchDialog = (transaction: BankTransaction) => {
        setSelectedTransaction(transaction);
        setMatchDialogOpen(true);
    };

    const openAnomalyDialog = (transaction: BankTransaction) => {
        setSelectedTransaction(transaction);
        setAnomalyDialogOpen(true);
    };

    const loadData = async () => {
        // Data is automatically refetched by React Query
        // This function is kept for compatibility with dialogs
    };

    return {
        transactions,
        stats,
        isLoading: isLoadingTransactions || isLoadingStats,
        isUploading: importMutation.isPending,
        filter,
        setFilter,
        matchDialogOpen,
        setMatchDialogOpen,
        anomalyDialogOpen,
        setAnomalyDialogOpen,
        selectedTransaction,
        fileInputRef,
        handleFileUpload,
        handleAutoMatch,
        handleIgnore,
        onFileInputChange,
        openMatchDialog,
        openAnomalyDialog,
        loadData,
    };
}
