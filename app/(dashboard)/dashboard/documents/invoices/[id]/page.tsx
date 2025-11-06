"use client";

import { DocumentPdfDialog } from "@/components/pdf/document-pdf-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DocumentStatusBadge } from "@/components/ui/document-status-badge";
import { DocumentTypeBadge } from "@/components/ui/document-type-badge";
import { PageHeader } from "@/components/ui/page-header";
import { PaymentHistory } from "@/components/payment-history";
import { DocumentStatusManager } from "@/components/document-status-manager";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCompanySettings } from "@/hooks/use-company-settings";
import { useDocumentDetail } from "@/hooks/use-document-detail";

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

    if (isLoading) {
        return (
            <div className="space-y-6">
                <PageHeader title="Facture" description="Chargement..." />
                <Card className="p-12 border-black/8 shadow-sm">
                    <div className="flex items-center justify-center">
                        <div className="text-[14px] text-black/40">
                            Chargement...
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    if (!invoice) {
        return null;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Facture ${invoice.numero}`}
                description={`Créée le ${format(
                    new Date(invoice.dateEmission),
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
                            documentId={invoice.id}
                            currentStatus={invoice.statut}
                            documentType="FACTURE"
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
                    <Card className="p-6 border-black/8 shadow-sm">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <DocumentTypeBadge type={invoice.type} />
                                    <DocumentStatusBadge
                                        status={invoice.statut}
                                    />
                                </div>
                                <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                                    {invoice.numero}
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="text-[14px] font-semibold text-black mb-3">
                                    Client
                                </h3>
                                <div className="space-y-1 text-[14px]">
                                    <p className="font-medium">{clientName}</p>
                                    {invoice.client.email && (
                                        <p className="text-black/60">
                                            {invoice.client.email}
                                        </p>
                                    )}
                                    {invoice.client.telephone && (
                                        <p className="text-black/60">
                                            {invoice.client.telephone}
                                        </p>
                                    )}
                                    {invoice.client.adresse && (
                                        <p className="text-black/60">
                                            {invoice.client.adresse}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[14px] font-semibold text-black mb-3">
                                    Informations
                                </h3>
                                <div className="space-y-1 text-[14px]">
                                    <div className="flex justify-between">
                                        <span className="text-black/60">
                                            Date d&apos;émission:
                                        </span>
                                        <span className="font-medium">
                                            {format(
                                                new Date(invoice.dateEmission),
                                                "dd/MM/yyyy"
                                            )}
                                        </span>
                                    </div>
                                    {invoice.dateEcheance && (
                                        <div className="flex justify-between">
                                            <span className="text-black/60">
                                                Date d&apos;échéance:
                                            </span>
                                            <span className="font-medium">
                                                {format(
                                                    new Date(
                                                        invoice.dateEcheance
                                                    ),
                                                    "dd/MM/yyyy"
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {invoice.conditions_paiement && (
                            <div className="mb-6">
                                <h3 className="text-[14px] font-semibold text-black mb-2">
                                    Conditions de paiement
                                </h3>
                                <p className="text-[14px] text-black/60">
                                    {invoice.conditions_paiement}
                                </p>
                            </div>
                        )}

                        {invoice.notes && (
                            <div>
                                <h3 className="text-[14px] font-semibold text-black mb-2">
                                    Notes
                                </h3>
                                <p className="text-[14px] text-black/60">
                                    {invoice.notes}
                                </p>
                            </div>
                        )}
                    </Card>

                    <Card className="p-6 border-black/8 shadow-sm">
                        <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black mb-4">
                            Lignes de la facture
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-[13px]">
                                <thead className="bg-black/2 border-b border-black/8">
                                    <tr>
                                        <th className="text-left p-3 font-medium text-black/60">
                                            Désignation
                                        </th>
                                        <th className="text-right p-3 font-medium text-black/60">
                                            Quantité
                                        </th>
                                        <th className="text-right p-3 font-medium text-black/60">
                                            Prix unitaire HT
                                        </th>
                                        <th className="text-right p-3 font-medium text-black/60">
                                            TVA
                                        </th>
                                        <th className="text-right p-3 font-medium text-black/60">
                                            Remise
                                        </th>
                                        <th className="text-right p-3 font-medium text-black/60">
                                            Total HT
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.lignes.map((ligne) => (
                                        <tr
                                            key={ligne.id}
                                            className="border-b border-black/5 last:border-0"
                                        >
                                            <td className="p-3">
                                                <div className="font-medium">
                                                    {ligne.designation}
                                                </div>
                                                {ligne.description && (
                                                    <div className="text-black/60 text-[12px] mt-1">
                                                        {ligne.description}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3 text-right">
                                                {ligne.quantite}
                                            </td>
                                            <td className="p-3 text-right">
                                                {formatAmount(ligne.prix_unitaire_ht)}
                                            </td>
                                            <td className="p-3 text-right">
                                                {ligne.tva_taux}%
                                            </td>
                                            <td className="p-3 text-right">
                                                {ligne.remise_pourcent}%
                                            </td>
                                            <td className="p-3 text-right font-medium">
                                                {formatAmount(ligne.montant_ht)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <PaymentHistory documentId={invoice.id} />
                </div>

                <div>
                    <Card className="p-6 border-black/8 shadow-sm">
                        <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black mb-4">
                            Récapitulatif
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[14px]">
                                <span className="text-black/60">Total HT</span>
                                <span className="font-medium">
                                    {formatAmount(invoice.total_ht)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-[14px]">
                                <span className="text-black/60">TVA</span>
                                <span className="font-medium">
                                    {formatAmount(invoice.total_tva)}
                                </span>
                            </div>
                            <div className="h-px bg-black/8" />
                            <div className="flex items-center justify-between text-[18px]">
                                <span className="font-semibold">Total TTC</span>
                                <span className="font-bold">
                                    {formatAmount(invoice.total_ttc)}
                                </span>
                            </div>

                            {invoice.reste_a_payer > 0 && (
                                <>
                                    <div className="h-px bg-black/8" />
                                    <div className="flex items-center justify-between text-[16px] text-orange-600">
                                        <span className="font-semibold">
                                            Reste à payer
                                        </span>
                                        <span className="font-bold">
                                            {formatAmount(invoice.reste_a_payer)}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
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
    );
}
