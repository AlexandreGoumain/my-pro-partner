"use client";

import {
    DocumentDetailCard,
    DocumentDetailSkeleton,
    DocumentLinesTable,
    DocumentSummaryCard,
} from "@/components/document-detail";
import { DocumentStatusManager } from "@/components/document-status-manager";
import { DocumentPdfDialog } from "@/components/pdf/document-pdf-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConditionalSkeleton } from "@/components/ui/conditional-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { useCompanySettings } from "@/hooks/use-company-settings";
import { useDocumentDetail } from "@/hooks/use-document-detail";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function CreditNoteDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: companySettings } = useCompanySettings();

    const {
        document: credit,
        isLoading,
        isPdfDialogOpen,
        setIsPdfDialogOpen,
        clientName,
        handleStatusChanged,
        handleDelete,
        formatAmount,
    } = useDocumentDetail({
        documentId: params.id as string,
        documentType: "AVOIR",
        redirectPath: "/dashboard/documents/credits",
    });

    return (
        <ConditionalSkeleton
            isLoading={isLoading}
            fallback={<DocumentDetailSkeleton title="Avoir" />}
        >
            {!credit ? null : (
                <div className="space-y-6">
            <PageHeader
                title={`Avoir ${credit.numero}`}
                description={`Créé le ${format(
                    new Date(credit.dateEmission),
                    "dd MMMM yyyy",
                    { locale: fr }
                )}`}
                actions={
                    <>
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                        >
                            <ArrowLeft
                                className="w-4 h-4 mr-2"
                                strokeWidth={2}
                            />
                            Retour
                        </Button>
                        <Button
                            onClick={() => setIsPdfDialogOpen(true)}
                            variant="outline"
                            className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                        >
                            <Download
                                className="w-4 h-4 mr-2"
                                strokeWidth={2}
                            />
                            Générer PDF
                        </Button>
                        <DocumentStatusManager
                            documentId={credit.id}
                            currentStatus={credit.statut}
                            documentType="AVOIR"
                            onStatusChanged={handleStatusChanged}
                        />
                        <Button
                            onClick={handleDelete}
                            variant="outline"
                            className="h-11 px-6 text-[14px] font-medium border-red-200 text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                            Supprimer
                        </Button>
                    </>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <DocumentDetailCard
                        document={credit}
                        clientName={clientName}
                        showValidite
                    />

                    <Card className="p-6 border-black/8 shadow-sm">
                        <DocumentLinesTable
                            lines={credit.lignes}
                            formatAmount={formatAmount}
                            title="Lignes de l'avoir"
                        />
                    </Card>
                </div>

                <div className="space-y-6">
                    <DocumentSummaryCard
                        totalHT={credit.total_ht}
                        totalTVA={credit.total_tva}
                        totalTTC={credit.total_ttc}
                        formatAmount={formatAmount}
                    />
                </div>
            </div>

            {credit && companySettings && (
                <DocumentPdfDialog
                    isOpen={isPdfDialogOpen}
                    onClose={() => setIsPdfDialogOpen(false)}
                    document={credit}
                    company={companySettings}
                />
            )}
                </div>
            )}
        </ConditionalSkeleton>
    );
}
