"use client";

import { LoadingState } from "@/components/ui/loading-state";
import { PaymentStatusCard } from "@/components/ui/payment-status-card";
import { usePaymentRetry } from "@/hooks/use-payment-retry";
import { XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { SuspensePage } from "@/components/ui/suspense-page";

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
        <SuspensePage fallback={<LoadingState variant="fullscreen" />}>
            <PaymentCancelContent />
        </SuspensePage>
    );
}
