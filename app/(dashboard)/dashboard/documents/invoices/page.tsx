"use client";

import { AddPaymentDialog } from "@/components/add-payment-dialog";
import { DocumentListPage } from "@/components/documents";
import { useDocumentPage } from "@/hooks/use-document-page";
import { useInvoicePayment } from "@/hooks/use-invoice-payment";
import type { Invoice } from "@/lib/types/document.types";
import { Receipt } from "lucide-react";
import { createColumns } from "./_components/data-table/columns";

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
    const payment = useInvoicePayment();

    const page = useDocumentPage<Invoice>({
        documentType: "FACTURE",
        basePath: "/dashboard/documents/invoices",
        createColumns,
        additionalHandlers: {
            onAddPayment: payment.openPaymentDialog,
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
                    payment.selectedInvoice && (
                        <AddPaymentDialog
                            isOpen={payment.isPaymentDialogOpen}
                            onClose={payment.closePaymentDialog}
                            invoice={payment.selectedInvoice}
                            onSuccess={payment.handlePaymentSuccess}
                        />
                    )
                }
            />
        </>
    );
}
