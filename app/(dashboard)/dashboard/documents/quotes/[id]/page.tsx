"use client";

import {
    DocumentDetailActions,
    DocumentDetailCard,
    DocumentDetailSkeleton,
    DocumentLinesTable,
    DocumentSummaryCard,
} from "@/components/document-detail";
import { DocumentPdfDialog } from "@/components/pdf/document-pdf-dialog";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useCompanySettings } from "@/hooks/use-company-settings";
import { useDocumentDetail } from "@/hooks/use-document-detail";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useParams, useRouter } from "next/navigation";

export default function QuoteDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: companySettings } = useCompanySettings();

    const {
        document: quote,
        isLoading,
        isPdfDialogOpen,
        setIsPdfDialogOpen,
        clientName,
        canConvert,
        handleStatusChanged,
        handleDelete,
        handleConvertToInvoice,
        formatAmount,
    } = useDocumentDetail({
        documentId: params.id as string,
        documentType: "DEVIS",
        redirectPath: "/dashboard/documents/quotes",
    });

    if (isLoading) {
        return <DocumentDetailSkeleton title="Devis" />;
    }

    if (!quote) {
        return null;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Devis ${quote.numero}`}
                description={`Créé le ${format(
                    new Date(quote.dateEmission),
                    "dd MMMM yyyy",
                    { locale: fr }
                )}`}
                actions={
                    <DocumentDetailActions
                        documentId={quote.id}
                        documentType="DEVIS"
                        currentStatus={quote.statut}
                        canConvert={canConvert}
                        onBack={() => router.back()}
                        onGeneratePdf={() => setIsPdfDialogOpen(true)}
                        onStatusChanged={handleStatusChanged}
                        onDelete={handleDelete}
                        onConvert={handleConvertToInvoice}
                    />
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <DocumentDetailCard
                        document={quote}
                        clientName={clientName}
                        showValidite={true}
                    />

                    <Card className="p-6 border-black/8 shadow-sm">
                        <DocumentLinesTable
                            lines={quote.lignes}
                            formatAmount={formatAmount}
                            title="Lignes du devis"
                        />
                    </Card>
                </div>

                <div>
                    <DocumentSummaryCard
                        totalHT={quote.total_ht}
                        totalTVA={quote.total_tva}
                        totalTTC={quote.total_ttc}
                        formatAmount={formatAmount}
                    />
                </div>
            </div>

            {quote && companySettings && (
                <DocumentPdfDialog
                    isOpen={isPdfDialogOpen}
                    onClose={() => setIsPdfDialogOpen(false)}
                    document={quote}
                    company={companySettings}
                />
            )}
        </div>
    );
}
