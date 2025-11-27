"use client";

import { AnalyticsKPIGrid } from "@/components/analytics/analytics-kpi-grid";
import { UnpaidInvoiceTable } from "@/components/analytics/unpaid-invoice-table";
import { UnpaidInvoicesFilters } from "@/components/analytics/unpaid-invoices-filters";
import { ConditionalSkeleton } from "@/components/ui/conditional-skeleton";
import { ErrorState } from "@/components/ui/error-state";
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

    return (
        <ConditionalSkeleton
            isLoading={isLoading}
            skeletonProps={{
                layout: "stats-grid",
                statsCount: 4,
                itemCount: 1,
                statsHeight: "h-28",
                itemHeight: "h-96",
            }}
        >
            {error ? (
                <div className="space-y-6">
                    <PageHeader
                        title="Factures impayées"
                        description="Suivi des factures en attente de paiement"
                    />
                    <ErrorState />
                </div>
            ) : !summary ? null : (
                <div className="space-y-6">
                    <PageHeader
                        title="Factures impayées"
                        description="Suivi et gestion des factures en attente de paiement"
                    />

                    {/* KPI Cards */}
                    <AnalyticsKPIGrid
                        kpis={[
                            {
                                title: "Total impayé",
                                value: formatAmount(summary.totalUnpaid),
                                subtitle: `${summary.totalInvoices} facture${pluralSuffix(summary.totalInvoices)}`,
                                icon: Euro,
                            },
                            {
                                title: "Factures en retard",
                                value: summary.overdueCount,
                                subtitle: formatAmount(summary.totalOverdue),
                                icon: AlertCircle,
                            },
                            {
                                title: "Retard moyen",
                                value: `${summary.averageOverdueDays} j`,
                                subtitle:
                                    summary.overdueCount > 0
                                        ? "Pour les factures en retard"
                                        : "Aucune facture en retard",
                                icon: Clock,
                            },
                            {
                                title: "En attente",
                                value:
                                    summary.totalInvoices -
                                    summary.overdueCount,
                                subtitle: formatAmount(
                                    summary.totalUnpaid - summary.totalOverdue
                                ),
                                icon: FileText,
                            },
                        ]}
                    />

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
            )}
        </ConditionalSkeleton>
    );
}
