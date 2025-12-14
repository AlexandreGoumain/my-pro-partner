"use client";

import {
    DocumentDetailActions,
    DocumentDetailCard,
    DocumentDetailSkeleton,
    DocumentLinesTable,
    DocumentSummaryCard,
} from "@/components/document-detail";
import { Card } from "@/components/ui/card";
import { ConditionalSkeleton } from "@/components/ui/conditional-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { useCompanySettings } from "@/hooks/use-company-settings";
import { useDocumentDetail } from "@/hooks/use-document-detail";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";

// Lazy load PDF dialog - heavy component with @react-pdf/renderer
const DocumentPdfDialog = dynamic(
    () =>
        import("@/components/pdf/document-pdf-dialog").then(
            (mod) => mod.DocumentPdfDialog
        ),
    { ssr: false }
);

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

    return (
        <ConditionalSkeleton
            isLoading={isLoading}
            fallback={<DocumentDetailSkeleton title="Devis" />}
        >
            {!quote ? null : (
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
            )}
        </ConditionalSkeleton>
    );
}
