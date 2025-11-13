"use client";

import { PaymentLinkActions } from "@/components/payment-links/payment-link-actions";
import { PaymentLinkAmount } from "@/components/payment-links/payment-link-amount";
import { PaymentLinkFooter } from "@/components/payment-links/payment-link-footer";
import { PaymentLinkQRCode } from "@/components/payment-links/payment-link-qr-code";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingFallback } from "@/components/ui/loading-fallback";
import { usePaymentLink } from "@/hooks/use-payment-link";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function PaymentLinkPage() {
    const params = useParams();
    const slug = params.slug as string;

    const {
        paymentLink,
        qrCode,
        loading,
        paying,
        showQR,
        handlePay,
        handleShowQR,
    } = usePaymentLink(slug);

    // Loading state
    if (loading) {
        return <LoadingFallback />;
    }

    // Invalid or expired payment link
    if (!paymentLink || !paymentLink.isValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-4">
                <EmptyState
                    icon={AlertCircle}
                    title="Lien de paiement invalide"
                    description="Ce lien de paiement n'est plus disponible ou a expiré."
                    variant="default"
                    className="max-w-md"
                />
            </div>
        );
    }

    const entrepriseName =
        paymentLink.entreprise.parametres?.nom_entreprise ||
        paymentLink.entreprise.nom;
    const logoUrl = paymentLink.entreprise.parametres?.logo_url;

    return (
        <div className="min-h-screen bg-white p-4">
            <div className="max-w-2xl mx-auto py-8">
                {/* Logo entreprise */}
                {logoUrl && (
                    <div className="text-center mb-8">
                        <Image
                            src={logoUrl}
                            alt={entrepriseName}
                            width={120}
                            height={40}
                            className="mx-auto"
                        />
                    </div>
                )}

                {/* Card principale */}
                <Card className="border-black/8 shadow-sm overflow-hidden">
                    {/* Image de couverture */}
                    {paymentLink.imageCouverture && (
                        <div className="relative w-full h-48">
                            <Image
                                src={paymentLink.imageCouverture}
                                alt={paymentLink.titre}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    <div className="p-8">
                        {/* Titre et description */}
                        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black mb-3">
                            {paymentLink.titre}
                        </h1>

                        {paymentLink.description && (
                            <p className="text-[16px] text-black/60 mb-6">
                                {paymentLink.description}
                            </p>
                        )}

                        {/* Montant et stats */}
                        <PaymentLinkAmount
                            montant={paymentLink.montant}
                            quantitePaye={paymentLink.quantitePaye}
                            quantiteMax={paymentLink.quantiteMax}
                            className="mb-6"
                        />

                        {/* Actions */}
                        <PaymentLinkActions
                            montant={paymentLink.montant}
                            paying={paying}
                            showQR={showQR}
                            onPay={handlePay}
                            onToggleQR={handleShowQR}
                        />

                        {/* QR Code */}
                        {showQR && qrCode && (
                            <PaymentLinkQRCode
                                qrCode={qrCode}
                                className="mt-6"
                            />
                        )}

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-black/8">
                            <PaymentLinkFooter
                                entrepriseName={entrepriseName}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
