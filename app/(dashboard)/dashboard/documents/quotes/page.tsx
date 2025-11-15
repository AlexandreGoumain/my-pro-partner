"use client";

import { DocumentFiltersBar, DocumentGridView } from "@/components/documents";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { useDocumentFilters } from "@/hooks/use-document-filters";
import { useDocumentPage } from "@/hooks/use-document-page";
import { useQuoteConvert } from "@/hooks/use-quote-convert";
import { DOCUMENT_SORT_OPTIONS } from "@/lib/constants/document-sort-options";
import type { Quote } from "@/lib/types/document.types";
import { Plus } from "lucide-react";
import { createColumns } from "./_components/data-table/columns";

const QUOTE_COLUMN_LABELS: Record<string, string> = {
    numero: "Numéro",
    client: "Client",
    date: "Date",
    validite: "Validité",
    montant: "Montant",
    statut: "Statut",
    actions: "Actions",
};

export default function QuotesPage() {
    const { convertToInvoice } = useQuoteConvert();

    const page = useDocumentPage<Quote>({
        documentType: "DEVIS",
        basePath: "/dashboard/documents/quotes",
        createColumns,
        additionalHandlers: {
            onConvertToInvoice: convertToInvoice,
        },
    });

    const filters = useDocumentFilters(page.documents);

    return (
        <div className="space-y-6">
            <PageHeader
                title={page.label.title}
                description={page.label.description}
                actions={
                    <PrimaryActionButton
                        icon={Plus}
                        onClick={page.handlers.handleCreate}
                    >
                        {page.label.new}
                    </PrimaryActionButton>
                }
            />

            {!page.isLoading && page.documents.length > 0 && (
                <DocumentFiltersBar
                    searchTerm={filters.searchTerm}
                    onSearchChange={filters.setSearchTerm}
                    statusFilter={filters.statusFilter}
                    onStatusFilterChange={filters.setStatusFilter}
                    sortBy={filters.sortBy}
                    onSortChange={filters.setSortBy}
                    sortOptions={DOCUMENT_SORT_OPTIONS}
                    viewMode={filters.viewMode}
                    onViewModeChange={filters.setViewMode}
                    documentType="DEVIS"
                />
            )}

            {filters.viewMode === "grid" && (
                <DocumentGridView
                    documents={filters.filteredAndSortedDocuments}
                    isLoading={page.isLoading}
                    type="DEVIS"
                    onView={page.handlers.handleView}
                    onEdit={page.handlers.handleEdit}
                    onDelete={page.handlers.handleDelete}
                    onConvertToInvoice={convertToInvoice}
                    onCreate={page.handlers.handleCreate}
                />
            )}

            {filters.viewMode === "list" && (
                <DataTable
                    columns={page.columns}
                    data={filters.filteredAndSortedDocuments}
                    emptyMessage={page.label.notFound}
                    itemLabel={page.label.singular}
                    columnLabels={QUOTE_COLUMN_LABELS}
                />
            )}
        </div>
    );
}
