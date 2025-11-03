"use client";

import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DocumentListPage } from "@/components/documents";
import { createColumns, Quote } from "./_components/data-table/columns";
import { useDocumentPage } from "@/hooks/use-document-page";

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

    const handleConvertToInvoice = async (quote: Quote) => {
        try {
            const response = await fetch(`/api/documents/${quote.id}/convert`, {
                method: "POST",
            });

            if (!response.ok) throw new Error("Erreur lors de la conversion");

            const data = await response.json();
            toast.success("Devis converti en facture avec succès");
            router.push(`/dashboard/documents/invoices/${data.invoice.id}`);
        } catch (error) {
            console.error("Error converting quote:", error);
            toast.error("Impossible de convertir le devis");
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

    return (
        <DocumentListPage
            title={page.label.title}
            description={page.label.description}
            emptyTitle={page.label.emptyTitle}
            emptyDescription={page.label.emptyDescription}
            createButtonLabel={page.label.new}
            emptyIcon={FileText}
            documents={page.documents}
            columns={page.columns}
            isLoading={page.isLoading}
            emptyMessage={page.label.notFound}
            itemLabel={page.label.singular}
            columnLabels={QUOTE_COLUMN_LABELS}
            onCreate={page.handlers.handleCreate}
        />
    );
}
