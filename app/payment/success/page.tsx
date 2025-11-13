"use client";

import { DetailsSection } from "@/components/ui/details-section";
import { LoadingFallback } from "@/components/ui/loading-fallback";
import { PaymentStatusCard } from "@/components/ui/payment-status-card";
import { usePaymentSuccess } from "@/hooks/use-payment-success";
import { truncateId } from "@/lib/utils/payment-utils";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const { isLoading } = usePaymentSuccess();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black/2 flex items-center justify-center p-4">
                <PaymentStatusCard
                    icon={CheckCircle}
                    title="Traitement du paiement..."
                    description="Veuillez patienter pendant que nous confirmons votre paiement."
                    variant="success"
                />
            </div>
        );
    }

    const details = sessionId ? (
        <DetailsSection
            items={[
                {
                    label: "ID de session",
                    value: truncateId(sessionId),
                },
            ]}
        />
    ) : undefined;

    return (
        <div className="min-h-screen bg-black/2 flex items-center justify-center p-4">
            <PaymentStatusCard
                icon={CheckCircle}
                title="Paiement réussi !"
                description="Votre paiement a été traité avec succès. Vous recevrez un email de confirmation sous peu."
                variant="success"
                details={details}
                footer="Vous pouvez maintenant fermer cette fenêtre."
            />
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
