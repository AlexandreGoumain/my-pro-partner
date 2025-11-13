"use client";

import { LoadingFallback } from "@/components/ui/loading-fallback";
import { PaymentStatusCard } from "@/components/ui/payment-status-card";
import { usePaymentRetry } from "@/hooks/use-payment-retry";
import { XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentCancelContent() {
    const searchParams = useSearchParams();
    const documentId = searchParams.get("document_id");
    const { isRetrying, handleRetry } = usePaymentRetry(documentId);

    return (
        <div className="min-h-screen bg-black/2 flex items-center justify-center p-4">
            <PaymentStatusCard
                icon={XCircle}
                title="Paiement annulé"
                description="Votre paiement a été annulé. Aucun montant n'a été débité de votre compte."
                variant="error"
                action={
                    documentId
                        ? {
                              label: isRetrying
                                  ? "Redirection..."
                                  : "Réessayer le paiement",
                              onClick: handleRetry,
                              disabled: isRetrying,
                          }
                        : undefined
                }
                footer="Si vous avez des questions, veuillez contacter le support."
            />
        </div>
    );
}

export default function PaymentCancelPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <PaymentCancelContent />
        </Suspense>
    );
}
