"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DocumentFiltersBar, DocumentGridView } from "@/components/documents";
import { createColumns, Quote } from "./_components/data-table/columns";
import { useDocumentPage } from "@/hooks/use-document-page";
import { useState, useMemo } from "react";
import type { DocumentStatus } from "@/lib/types/document.types";
import { DOCUMENT_SORT_OPTIONS } from "@/lib/constants/document-sort-options";
import { DataTable } from "@/components/ui/data-table";

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
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<DocumentStatus | "TOUS">("TOUS");
    const [sortBy, setSortBy] = useState("Date récente");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const handleConvertToInvoice = async (quote: Quote) => {
        try {
            const response = await fetch(`/api/documents/${quote.id}/convert`, {
                method: "POST",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de la conversion");
            }

            const data = await response.json();
            toast.success("Devis converti en facture avec succès");
            router.push(`/dashboard/documents/invoices/${data.invoice.id}`);
        } catch (error) {
            console.error("Error converting quote:", error);
            toast.error(error instanceof Error ? error.message : "Impossible de convertir le devis");
        }
    };

    const page = useDocumentPage<Quote>({
        documentType: "DEVIS",
        basePath: "/dashboard/documents/quotes",
        createColumns,
        additionalHandlers: {
            onConvertToInvoice: handleConvertToInvoice,
        },
    });

    // Filtrer et trier les documents
    const filteredAndSortedDocuments = useMemo(() => {
        let filtered = page.documents;

        // Filtre par recherche
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter((doc: Quote) => {
                const clientName = `${doc.client.nom} ${doc.client.prenom || ""}`.toLowerCase();
                return (
                    doc.numero.toLowerCase().includes(searchLower) ||
                    clientName.includes(searchLower)
                );
            });
        }

        // Filtre par statut
        if (statusFilter !== "TOUS") {
            filtered = filtered.filter((doc: Quote) => doc.statut === statusFilter);
        }

        // Tri
        const sorted = [...filtered];
        switch (sortBy) {
            case "Date récente":
                sorted.sort((a, b) => new Date(b.dateEmission).getTime() - new Date(a.dateEmission).getTime());
                break;
            case "Date ancienne":
                sorted.sort((a, b) => new Date(a.dateEmission).getTime() - new Date(b.dateEmission).getTime());
                break;
            case "Numéro croissant":
                sorted.sort((a, b) => a.numero.localeCompare(b.numero));
                break;
            case "Numéro décroissant":
                sorted.sort((a, b) => b.numero.localeCompare(a.numero));
                break;
            case "Montant croissant":
                sorted.sort((a, b) => a.total_ttc - b.total_ttc);
                break;
            case "Montant décroissant":
                sorted.sort((a, b) => b.total_ttc - a.total_ttc);
                break;
            case "Client A-Z":
                sorted.sort((a, b) => a.client.nom.localeCompare(b.client.nom));
                break;
            case "Client Z-A":
                sorted.sort((a, b) => b.client.nom.localeCompare(a.client.nom));
                break;
        }

        return sorted;
    }, [page.documents, searchTerm, statusFilter, sortBy]);

    return (
        <div className="space-y-6">
            <PageHeader
                title={page.label.title}
                description={page.label.description}
                actions={
                    <Button
                        onClick={page.handlers.handleCreate}
                        className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                        {page.label.new}
                    </Button>
                }
            />

            {!page.isLoading && page.documents.length > 0 && (
                <DocumentFiltersBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    sortOptions={DOCUMENT_SORT_OPTIONS}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    documentType="DEVIS"
                />
            )}

            {viewMode === "grid" && (
                <DocumentGridView
                    documents={filteredAndSortedDocuments}
                    isLoading={page.isLoading}
                    type="DEVIS"
                    onView={page.handlers.handleView}
                    onEdit={page.handlers.handleEdit}
                    onDelete={page.handlers.handleDelete}
                    onConvertToInvoice={handleConvertToInvoice}
                    onCreate={page.handlers.handleCreate}
                />
            )}

            {viewMode === "list" && (
                <DataTable
                    columns={page.columns}
                    data={filteredAndSortedDocuments}
                    emptyMessage={page.label.notFound}
                    itemLabel={page.label.singular}
                    columnLabels={QUOTE_COLUMN_LABELS}
                />
            )}
        </div>
    );
}
