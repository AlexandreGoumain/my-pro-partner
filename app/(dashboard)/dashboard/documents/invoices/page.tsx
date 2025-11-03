"use client";

import { Receipt } from "lucide-react";
import { useState } from "react";
import { DocumentListPage } from "@/components/documents";
import { createColumns, Invoice } from "./_components/data-table/columns";
import { AddPaymentDialog } from "@/components/add-payment-dialog";
import { useDocumentPage } from "@/hooks/use-document-page";

const INVOICE_COLUMN_LABELS: Record<string, string> = {
    numero: "Numéro",
    client: "Client",
    date: "Date",
    echeance: "Échéance",
    montant: "Montant",
    statut: "Statut",
    actions: "Actions",
};

export default function InvoicesPage() {
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

    const handleAddPayment = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsPaymentDialogOpen(true);
    };

    const handlePaymentSuccess = () => {
        setIsPaymentDialogOpen(false);
        setSelectedInvoice(null);
        page.handlers.fetchDocuments();
    };

    const page = useDocumentPage<Invoice>({
        documentType: "FACTURE",
        basePath: "/dashboard/documents/invoices",
        createColumns,
        additionalHandlers: {
            onAddPayment: handleAddPayment,
        },
    });

    return (
        <>
            <DocumentListPage
                title={page.label.title}
                description={page.label.description}
                emptyTitle={page.label.emptyTitle}
                emptyDescription={page.label.emptyDescription}
                createButtonLabel={page.label.new}
                emptyIcon={Receipt}
                documents={page.documents}
                columns={page.columns}
                isLoading={page.isLoading}
                emptyMessage={page.label.notFound}
                itemLabel={page.label.plural}
                columnLabels={INVOICE_COLUMN_LABELS}
                onCreate={page.handlers.handleCreate}
                additionalContent={
                    selectedInvoice && (
                        <AddPaymentDialog
                            isOpen={isPaymentDialogOpen}
                            onClose={() => setIsPaymentDialogOpen(false)}
                            invoice={selectedInvoice}
                            onSuccess={handlePaymentSuccess}
                        />
                    )
                }
            />
        </>
    );
}
