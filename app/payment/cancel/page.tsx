"use client";

import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { usePaymentRetry } from "@/hooks/use-payment-retry";

export default function PaymentCancelPage() {
    const searchParams = useSearchParams();
    const documentId = searchParams.get("document_id");
    const { isRetrying, handleRetry } = usePaymentRetry(documentId);

    return (
        <div className="min-h-screen bg-black/2 flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 border-black/8 shadow-sm">
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="rounded-full h-20 w-20 bg-red-100 flex items-center justify-center">
                        <XCircle className="w-12 h-12 text-red-600" strokeWidth={2} />
                    </div>

                    <div>
                        <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-black mb-2">
                            Paiement annulé
                        </h1>
                        <p className="text-[14px] text-black/60">
                            Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
                        </p>
                    </div>

                    {documentId && (
                        <Button
                            onClick={handleRetry}
                            disabled={isRetrying}
                            className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                        >
                            {isRetrying ? "Redirection..." : "Réessayer le paiement"}
                        </Button>
                    )}

                    <p className="text-[12px] text-black/40">
                        Si vous avez des questions, veuillez contacter le support.
                    </p>
                </div>
            </Card>
        </div>
    );
}
