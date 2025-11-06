"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { DocumentStatusBadge } from "@/components/ui/document-status-badge";
import { DocumentTypeBadge } from "@/components/ui/document-type-badge";
import { DocumentPdfDialog } from "@/components/pdf/document-pdf-dialog";
import { DocumentStatusManager } from "@/components/document-status-manager";
import { ArrowLeft, Receipt, Trash2, Download } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useCompanySettings } from "@/hooks/use-company-settings";
import { useDocumentDetail } from "@/hooks/use-document-detail";

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
        return (
            <div className="space-y-6">
                <PageHeader title="Devis" description="Chargement..." />
                <Card className="p-12 border-black/8 shadow-sm">
                    <div className="flex items-center justify-center">
                        <div className="text-[14px] text-black/40">Chargement...</div>
                    </div>
                </Card>
            </div>
        );
    }

    if (!quote) {
        return null;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Devis ${quote.numero}`}
                description={`Créé le ${format(new Date(quote.dateEmission), "dd MMMM yyyy", { locale: fr })}`}
                actions={
                    <>
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
                            Retour
                        </Button>
                        <Button
                            onClick={() => setIsPdfDialogOpen(true)}
                            variant="outline"
                            className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                        >
                            <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                            Générer PDF
                        </Button>
                        <DocumentStatusManager
                            documentId={quote.id}
                            currentStatus={quote.statut}
                            documentType="DEVIS"
                            onStatusChanged={handleStatusChanged}
                        />
                        {canConvert && (
                            <Button
                                onClick={handleConvertToInvoice}
                                className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                            >
                                <Receipt className="w-4 h-4 mr-2" strokeWidth={2} />
                                Convertir en facture
                            </Button>
                        )}
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
                                    <DocumentTypeBadge type={quote.type} />
                                    <DocumentStatusBadge status={quote.statut} />
                                </div>
                                <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                                    {quote.numero}
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="text-[14px] font-semibold text-black mb-3">Client</h3>
                                <div className="space-y-1 text-[14px]">
                                    <p className="font-medium">{clientName}</p>
                                    {quote.client.email && (
                                        <p className="text-black/60">{quote.client.email}</p>
                                    )}
                                    {quote.client.telephone && (
                                        <p className="text-black/60">{quote.client.telephone}</p>
                                    )}
                                    {quote.client.adresse && (
                                        <p className="text-black/60">{quote.client.adresse}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[14px] font-semibold text-black mb-3">Informations</h3>
                                <div className="space-y-1 text-[14px]">
                                    <div className="flex justify-between">
                                        <span className="text-black/60">Date d&apos;émission:</span>
                                        <span className="font-medium">
                                            {format(new Date(quote.dateEmission), "dd/MM/yyyy")}
                                        </span>
                                    </div>
                                    {quote.dateEcheance && (
                                        <div className="flex justify-between">
                                            <span className="text-black/60">Date d&apos;échéance:</span>
                                            <span className="font-medium">
                                                {format(new Date(quote.dateEcheance), "dd/MM/yyyy")}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-black/60">Validité:</span>
                                        <span className="font-medium">{quote.validite_jours} jours</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {quote.conditions_paiement && (
                            <div className="mb-6">
                                <h3 className="text-[14px] font-semibold text-black mb-2">
                                    Conditions de paiement
                                </h3>
                                <p className="text-[14px] text-black/60">{quote.conditions_paiement}</p>
                            </div>
                        )}

                        {quote.notes && (
                            <div>
                                <h3 className="text-[14px] font-semibold text-black mb-2">Notes</h3>
                                <p className="text-[14px] text-black/60">{quote.notes}</p>
                            </div>
                        )}
                    </Card>

                    <Card className="p-6 border-black/8 shadow-sm">
                        <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black mb-4">
                            Lignes du devis
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-[13px]">
                                <thead className="bg-black/2 border-b border-black/8">
                                    <tr>
                                        <th className="text-left p-3 font-medium text-black/60">Désignation</th>
                                        <th className="text-right p-3 font-medium text-black/60">Quantité</th>
                                        <th className="text-right p-3 font-medium text-black/60">Prix unitaire HT</th>
                                        <th className="text-right p-3 font-medium text-black/60">TVA</th>
                                        <th className="text-right p-3 font-medium text-black/60">Remise</th>
                                        <th className="text-right p-3 font-medium text-black/60">Total HT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quote.lignes.map((ligne) => (
                                        <tr key={ligne.id} className="border-b border-black/5 last:border-0">
                                            <td className="p-3">
                                                <div className="font-medium">{ligne.designation}</div>
                                                {ligne.description && (
                                                    <div className="text-black/60 text-[12px] mt-1">
                                                        {ligne.description}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3 text-right">{ligne.quantite}</td>
                                            <td className="p-3 text-right">{formatAmount(ligne.prix_unitaire_ht)}</td>
                                            <td className="p-3 text-right">{ligne.tva_taux}%</td>
                                            <td className="p-3 text-right">{ligne.remise_pourcent}%</td>
                                            <td className="p-3 text-right font-medium">{formatAmount(ligne.montant_ht)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="p-6 border-black/8 shadow-sm">
                        <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black mb-4">
                            Récapitulatif
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[14px]">
                                <span className="text-black/60">Total HT</span>
                                <span className="font-medium">{formatAmount(quote.total_ht)}</span>
                            </div>
                            <div className="flex items-center justify-between text-[14px]">
                                <span className="text-black/60">TVA</span>
                                <span className="font-medium">{formatAmount(quote.total_tva)}</span>
                            </div>
                            <div className="h-px bg-black/8" />
                            <div className="flex items-center justify-between text-[18px]">
                                <span className="font-semibold">Total TTC</span>
                                <span className="font-bold">{formatAmount(quote.total_ttc)}</span>
                            </div>
                        </div>
                    </Card>
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
