"use client";

import { AnalyticsKPICard } from "@/components/analytics/analytics-kpi-card";
import { UnpaidInvoiceTable } from "@/components/analytics/unpaid-invoice-table";
import { UnpaidInvoicesFilters } from "@/components/analytics/unpaid-invoices-filters";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { PageHeader } from "@/components/ui/page-header";
import { useUnpaidInvoices } from "@/hooks/use-unpaid-invoices";
import { pluralSuffix } from "@/lib/utils/format";
import { AlertCircle, Clock, Euro, FileText } from "lucide-react";

export default function UnpaidInvoicesPage() {
    const {
        invoices,
        summary,
        isLoading,
        error,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        overdueOnly,
        setOverdueOnly,
        handleSendReminder,
        formatAmount,
    } = useUnpaidInvoices();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Factures impayées"
                    description="Suivi des factures en attente de paiement"
                />
                <LoadingState variant="card" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Factures impayées"
                    description="Suivi des factures en attente de paiement"
                />
                <ErrorState />
            </div>
        );
    }

    if (!summary) {
        return null;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Factures impayées"
                description="Suivi et gestion des factures en attente de paiement"
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnalyticsKPICard
                    title="Total impayé"
                    value={formatAmount(summary.totalUnpaid)}
                    subtitle={`${summary.totalInvoices} facture${pluralSuffix(summary.totalInvoices)}`}
                    icon={Euro}
                />
                <AnalyticsKPICard
                    title="Factures en retard"
                    value={summary.overdueCount}
                    subtitle={formatAmount(summary.totalOverdue)}
                    icon={AlertCircle}
                />
                <AnalyticsKPICard
                    title="Retard moyen"
                    value={`${summary.averageOverdueDays} j`}
                    subtitle={
                        summary.overdueCount > 0
                            ? "Pour les factures en retard"
                            : "Aucune facture en retard"
                    }
                    icon={Clock}
                />
                <AnalyticsKPICard
                    title="En attente"
                    value={summary.totalInvoices - summary.overdueCount}
                    subtitle={formatAmount(
                        summary.totalUnpaid - summary.totalOverdue
                    )}
                    icon={FileText}
                />
            </div>

            {/* Filters */}
            <UnpaidInvoicesFilters
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                overdueOnly={overdueOnly}
                setOverdueOnly={setOverdueOnly}
            />

            {/* Invoice Table */}
            <UnpaidInvoiceTable
                invoices={invoices}
                onSendReminder={handleSendReminder}
            />
        </div>
    );
}
