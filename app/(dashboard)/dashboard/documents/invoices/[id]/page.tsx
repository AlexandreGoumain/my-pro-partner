"use client";

import {
    DocumentDetailActions,
    DocumentDetailCard,
    DocumentDetailSkeleton,
    DocumentLinesTable,
    DocumentPaymentHistory,
    DocumentSummaryCard,
} from "@/components/document-detail";
import { DocumentPdfDialog } from "@/components/pdf/document-pdf-dialog";
import { Card } from "@/components/ui/card";
import { ConditionalSkeleton } from "@/components/ui/conditional-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { useCompanySettings } from "@/hooks/use-company-settings";
import { useDocumentDetail } from "@/hooks/use-document-detail";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useParams, useRouter } from "next/navigation";

export default function InvoiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: companySettings } = useCompanySettings();

    const {
        document: invoice,
        isLoading,
        isPdfDialogOpen,
        setIsPdfDialogOpen,
        clientName,
        handleStatusChanged,
        handleDelete,
        formatAmount,
    } = useDocumentDetail({
        documentId: params.id as string,
        documentType: "FACTURE",
        redirectPath: "/dashboard/documents/invoices",
    });

    return (
        <ConditionalSkeleton
            isLoading={isLoading}
            fallback={<DocumentDetailSkeleton title="Facture" />}
        >
            {!invoice ? null : (
                <div className="space-y-6">
            <PageHeader
                title={`Facture ${invoice.numero}`}
                description={`Créée le ${format(
                    new Date(invoice.dateEmission),
                    "dd MMMM yyyy",
                    { locale: fr }
                )}`}
                actions={
                    <DocumentDetailActions
                        documentId={invoice.id}
                        documentType="FACTURE"
                        currentStatus={invoice.statut}
                        onBack={() => router.back()}
                        onGeneratePdf={() => setIsPdfDialogOpen(true)}
                        onStatusChanged={handleStatusChanged}
                        onDelete={handleDelete}
                    />
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <DocumentDetailCard
                        document={invoice}
                        clientName={clientName}
                    />

                    <Card className="p-6 border-black/8 shadow-sm">
                        <DocumentLinesTable
                            lines={invoice.lignes}
                            formatAmount={formatAmount}
                            title="Lignes de la facture"
                        />
                    </Card>

                    <DocumentPaymentHistory
                        documentId={invoice.id}
                        resteAPayer={invoice.reste_a_payer ?? 0}
                        totalTTC={invoice.total_ttc}
                    />
                </div>

                <div>
                    <DocumentSummaryCard
                        totalHT={invoice.total_ht}
                        totalTVA={invoice.total_tva}
                        totalTTC={invoice.total_ttc}
                        resteAPayer={invoice.reste_a_payer}
                        formatAmount={formatAmount}
                    />
                </div>
            </div>

            {invoice && companySettings && (
                <DocumentPdfDialog
                    isOpen={isPdfDialogOpen}
                    onClose={() => setIsPdfDialogOpen(false)}
                    document={invoice}
                    company={companySettings}
                />
            )}
                </div>
            )}
        </ConditionalSkeleton>
    );
}
