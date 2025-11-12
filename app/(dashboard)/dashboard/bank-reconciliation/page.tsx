"use client";

import {
    AnomalyDialog,
    EmptyState,
    MatchDialog,
    StatsGrid,
    TransactionCard,
} from "@/components/bank-reconciliation";
import { Button } from "@/components/ui/button";
import { useBankReconciliation } from "@/hooks/use-bank-reconciliation";
import type { BankTransaction } from "@/lib/types/bank-reconciliation";
import { RefreshCw, Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function BankReconciliationPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [matchDialogOpen, setMatchDialogOpen] = useState(false);
    const [anomalyDialogOpen, setAnomalyDialogOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] =
        useState<BankTransaction | null>(null);

    const {
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
    } = useBankReconciliation();

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        Rapprochement Bancaire
                    </h1>
                    <p className="text-[14px] text-black/60 mt-1">
                        Importez vos relevés et rapprochez automatiquement vos
                        transactions
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={handleAutoMatch}
                        variant="outline"
                        className="border-black/10 hover:bg-black/5"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Matching auto
                    </Button>
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6"
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploading ? "Import en cours..." : "Importer CSV"}
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={onFileInputChange}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Stats */}
            <StatsGrid stats={stats} />

            {/* Filter */}
            <div className="flex gap-2">
                <Button
                    onClick={() => setFilter("pending")}
                    variant={filter === "pending" ? "default" : "outline"}
                    className={
                        filter === "pending"
                            ? "bg-black hover:bg-black/90"
                            : "border-black/10"
                    }
                >
                    En attente
                </Button>
                <Button
                    onClick={() => setFilter("all")}
                    variant={filter === "all" ? "default" : "outline"}
                    className={
                        filter === "all"
                            ? "bg-black hover:bg-black/90"
                            : "border-black/10"
                    }
                >
                    Toutes les transactions
                </Button>
            </div>

            {/* Transactions list */}
            {isLoading ? (
                <div className="text-center py-12">
                    <p className="text-[14px] text-black/40">Chargement...</p>
                </div>
            ) : transactions.length === 0 ? (
                <EmptyState
                    onImportClick={() => fileInputRef.current?.click()}
                />
            ) : (
                <div className="space-y-2">
                    {transactions.map((transaction) => (
                        <TransactionCard
                            key={transaction.id}
                            transaction={transaction}
                            onMatch={openMatchDialog}
                            onAnomaly={openAnomalyDialog}
                            onIgnore={handleIgnore}
                        />
                    ))}
                </div>
            )}

            {/* Dialogs */}
            <MatchDialog
                open={matchDialogOpen}
                onOpenChange={setMatchDialogOpen}
                transaction={selectedTransaction}
                onSuccess={loadData}
            />

            <AnomalyDialog
                open={anomalyDialogOpen}
                onOpenChange={setAnomalyDialogOpen}
                transaction={selectedTransaction}
                onSuccess={loadData}
            />
        </div>
    );
}
