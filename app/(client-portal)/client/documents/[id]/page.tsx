"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Download,
    Calendar,
    FileText,
    CreditCard,
    Package,
} from "lucide-react";
import { useClientDocumentDetail } from "@/hooks/use-client-document-detail";
import {
    DocumentStatusBadge,
    DocumentTypeLabel,
    getDocumentTypeLabel,
    DocumentTotals,
    DocumentLinesTable,
} from "@/components/client-portal";

const paymentMethodLabels: Record<string, string> = {
    ESPECES: "Espèces",
    CHEQUE: "Chèque",
    VIREMENT: "Virement",
    CARTE: "Carte bancaire",
    PRELEVEMENT: "Prélèvement",
};

export default function DocumentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const documentId = params.id as string;

    const { document, isLoading, downloadPdf, isDownloading } =
        useClientDocumentDetail(documentId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-[14px] text-black/60">Chargement...</p>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-[14px] text-black/60">Document non trouvé</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-10 w-10 border-black/10 hover:bg-black/5"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>

                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                                {document.numero}
                            </h1>
                            <DocumentStatusBadge statut={document.statut} />
                        </div>
                        <p className="text-[14px] text-black/60">
                            <DocumentTypeLabel type={document.type} /> émis le{" "}
                            {new Date(document.dateEmission).toLocaleDateString(
                                "fr-FR"
                            )}
                        </p>
                    </div>
                </div>

                <Button
                    onClick={downloadPdf}
                    disabled={isDownloading}
                    className="bg-black hover:bg-black/90 text-white h-10 px-4 text-[14px] font-medium"
                >
                    <Download className="h-4 w-4 mr-2" />
                    {isDownloading ? "Téléchargement..." : "Télécharger PDF"}
                </Button>
            </div>

            {/* Document Info Cards */}
            <div className="grid gap-5 md:grid-cols-3">
                <Card className="border-black/8 shadow-sm p-5">
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-black/60" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[13px] text-black/40 mb-1">
                                Date d&apos;émission
                            </p>
                            <p className="text-[15px] font-medium text-black">
                                {new Date(document.dateEmission).toLocaleDateString(
                                    "fr-FR",
                                    {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    }
                                )}
                            </p>
                        </div>
                    </div>
                </Card>

                {document.dateEcheance && (
                    <Card className="border-black/8 shadow-sm p-5">
                        <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-black/60" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[13px] text-black/40 mb-1">
                                    Date d&apos;échéance
                                </p>
                                <p className="text-[15px] font-medium text-black">
                                    {new Date(document.dateEcheance).toLocaleDateString(
                                        "fr-FR",
                                        {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                <Card className="border-black/8 shadow-sm p-5">
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-black/60" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[13px] text-black/40 mb-1">Type</p>
                            <p className="text-[15px] font-medium text-black">
                                {getDocumentTypeLabel(document.type)}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Document Lines */}
            <Card className="border-black/8 shadow-sm">
                <div className="p-6 border-b border-black/8">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                            <Package className="h-5 w-5 text-black/60" />
                        </div>
                        <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                            Détails
                        </h2>
                    </div>
                </div>

                <DocumentLinesTable lines={document.lignes} />

                <DocumentTotals
                    totalHt={document.total_ht}
                    totalTva={document.total_tva}
                    totalTtc={document.total_ttc}
                    acompteMontant={document.acompte_montant}
                    resteAPayer={document.reste_a_payer}
                />
            </Card>

            {/* Payments */}
            {document.paiements.length > 0 && (
                <Card className="border-black/8 shadow-sm">
                    <div className="p-6 border-b border-black/8">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-black/60" />
                            </div>
                            <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                                Historique des paiements
                            </h2>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        {document.paiements.map((paiement) => (
                            <div
                                key={paiement.id}
                                className="flex items-center justify-between p-4 rounded-lg bg-black/5"
                            >
                                <div>
                                    <p className="text-[14px] font-medium text-black">
                                        {Number(paiement.montant).toFixed(2)}€
                                    </p>
                                    <p className="text-[13px] text-black/60 mt-1">
                                        {paymentMethodLabels[paiement.moyen_paiement]} •{" "}
                                        {new Date(
                                            paiement.date_paiement
                                        ).toLocaleDateString("fr-FR")}
                                    </p>
                                    {paiement.reference && (
                                        <p className="text-[12px] text-black/40 mt-1">
                                            Réf. {paiement.reference}
                                        </p>
                                    )}
                                </div>
                                {paiement.notes && (
                                    <p className="text-[13px] text-black/60">
                                        {paiement.notes}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Notes */}
            {(document.notes || document.conditions_paiement) && (
                <Card className="border-black/8 shadow-sm p-6 space-y-4">
                    {document.notes && (
                        <div>
                            <h3 className="text-[14px] font-medium text-black mb-2">
                                Notes
                            </h3>
                            <p className="text-[14px] text-black/60 whitespace-pre-wrap">
                                {document.notes}
                            </p>
                        </div>
                    )}
                    {document.conditions_paiement && (
                        <div>
                            <h3 className="text-[14px] font-medium text-black mb-2">
                                Conditions de paiement
                            </h3>
                            <p className="text-[14px] text-black/60 whitespace-pre-wrap">
                                {document.conditions_paiement}
                            </p>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
}
