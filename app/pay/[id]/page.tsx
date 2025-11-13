"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePaymentInvoice } from "@/hooks/use-payment-invoice";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CreditCard, FileText, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function PayInvoicePage() {
    const params = useParams();
    const documentId = params.id as string;

    const {
        invoice,
        isLoading,
        isProcessing,
        error,
        clientName,
        resteAPayer,
        entrepriseName,
        isAlreadyPaid,
        handlePayment,
        formatAmount,
    } = usePaymentInvoice(documentId);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black/2 flex items-center justify-center p-4">
                <Card className="max-w-lg w-full p-12 border-black/8 shadow-sm">
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2
                            className="w-8 h-8 text-black/40 animate-spin"
                            strokeWidth={2}
                        />
                        <p className="text-[14px] text-black/60">
                            Chargement de la facture...
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="min-h-screen bg-black/2 flex items-center justify-center p-4">
                <Card className="max-w-lg w-full p-8 border-black/8 shadow-sm">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <FileText
                            className="w-12 h-12 text-red-500"
                            strokeWidth={2}
                        />
                        <h1 className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                            {error || "Facture non trouvée"}
                        </h1>
                        <p className="text-[14px] text-black/60">
                            Veuillez vérifier le lien ou contacter
                            l&apos;entreprise.
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    if (isAlreadyPaid) {
        return (
            <div className="min-h-screen bg-black/2 flex items-center justify-center p-4">
                <Card className="max-w-lg w-full p-8 border-black/8 shadow-sm">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="rounded-full h-16 w-16 bg-green-100 flex items-center justify-center">
                            <FileText
                                className="w-8 h-8 text-green-600"
                                strokeWidth={2}
                            />
                        </div>
                        <h1 className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                            Facture déjà payée
                        </h1>
                        <p className="text-[14px] text-black/60">
                            Cette facture a déjà été réglée intégralement.
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black/2 flex items-center justify-center p-4">
            <Card className="max-w-lg w-full p-8 border-black/8 shadow-sm">
                <div className="space-y-6">
                    <div className="text-center">
                        <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-black mb-2">
                            Paiement de facture
                        </h1>
                        <p className="text-[14px] text-black/60">
                            {entrepriseName}
                        </p>
                    </div>

                    <div className="bg-black/5 rounded-lg p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[13px] text-black/60">
                                Facture
                            </span>
                            <span className="text-[15px] font-semibold text-black">
                                {invoice.numero}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[13px] text-black/60">
                                Client
                            </span>
                            <span className="text-[14px] font-medium text-black">
                                {clientName}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[13px] text-black/60">
                                Date d&apos;émission
                            </span>
                            <span className="text-[14px] font-medium text-black">
                                {format(
                                    new Date(invoice.dateEmission),
                                    "dd MMMM yyyy",
                                    { locale: fr }
                                )}
                            </span>
                        </div>
                        <div className="h-px bg-black/10 my-4" />
                        <div className="flex justify-between items-center">
                            <span className="text-[15px] font-semibold text-black">
                                Montant à payer
                            </span>
                            <span className="text-[24px] font-bold tracking-[-0.02em] text-black">
                                {formatAmount(resteAPayer)}
                            </span>
                        </div>
                    </div>

                    <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full h-12 text-[15px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2
                                    className="w-5 h-5 mr-2 animate-spin"
                                    strokeWidth={2}
                                />
                                Redirection...
                            </>
                        ) : (
                            <>
                                <CreditCard
                                    className="w-5 h-5 mr-2"
                                    strokeWidth={2}
                                />
                                Payer par carte bancaire
                            </>
                        )}
                    </Button>

                    <div className="text-center space-y-2">
                        <p className="text-[12px] text-black/40">
                            Paiement sécurisé par Stripe
                        </p>
                        <p className="text-[12px] text-black/40">
                            Vos informations de paiement sont protégées
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
