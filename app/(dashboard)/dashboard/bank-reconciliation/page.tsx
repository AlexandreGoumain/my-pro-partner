"use client";

import {
    AnomalyDialog,
    EmptyState,
    FilterButtons,
    LoadingState,
    MatchDialog,
    StatsGrid,
    TransactionCard,
} from "@/components/bank-reconciliation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { useBankReconciliation } from "@/hooks/use-bank-reconciliation";
import { RefreshCw, Upload } from "lucide-react";
import { Suspense } from "react";

function BankReconciliationPageContent() {
    const {
        transactions,
        stats,
        isLoading,
        isUploading,
        filter,
        setFilter,
        matchDialogOpen,
        setMatchDialogOpen,
        anomalyDialogOpen,
        setAnomalyDialogOpen,
        selectedTransaction,
        fileInputRef,
        handleAutoMatch,
        handleIgnore,
        onFileInputChange,
        openMatchDialog,
        openAnomalyDialog,
        loadData,
    } = useBankReconciliation();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Rapprochement Bancaire"
                description="Importez vos relevés et rapprochez automatiquement vos transactions"
                actions={
                    <>
                        <Button
                            onClick={handleAutoMatch}
                            variant="outline"
                            className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                        >
                            <RefreshCw
                                className="h-4 w-4 mr-2"
                                strokeWidth={2}
                            />
                            Matching auto
                        </Button>
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                        >
                            <Upload className="h-4 w-4 mr-2" strokeWidth={2} />
                            {isUploading
                                ? "Import en cours..."
                                : "Importer CSV"}
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={onFileInputChange}
                            className="hidden"
                        />
                    </>
                }
            />

            <StatsGrid stats={stats} />

            <FilterButtons activeFilter={filter} onFilterChange={setFilter} />

            {isLoading ? (
                <LoadingState />
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

function BankReconciliationPageFallback() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="h-9 w-64 bg-black/5 rounded-md animate-pulse" />
                    <div className="h-5 w-96 bg-black/5 rounded-md animate-pulse" />
                </div>
                <div className="flex gap-3">
                    <div className="h-11 w-40 bg-black/5 rounded-md animate-pulse" />
                    <div className="h-11 w-40 bg-black/5 rounded-md animate-pulse" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-24 bg-black/5 rounded-lg animate-pulse"
                    />
                ))}
            </div>
            <div className="flex gap-2">
                <div className="h-11 w-32 bg-black/5 rounded-md animate-pulse" />
                <div className="h-11 w-48 bg-black/5 rounded-md animate-pulse" />
            </div>
            <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-32 bg-black/5 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        </div>
    );
}

export default function BankReconciliationPage() {
    return (
        <Suspense fallback={<BankReconciliationPageFallback />}>
            <BankReconciliationPageContent />
        </Suspense>
    );
}
