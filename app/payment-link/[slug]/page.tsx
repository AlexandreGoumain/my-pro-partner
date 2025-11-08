"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle, QrCode, ExternalLink } from "lucide-react";
import Image from "next/image";
import { QRCodeService } from "@/lib/services/qr-code.service";

export default function PaymentLinkPage() {
  const params = useParams();
  const router = useRouter();
  const [paymentLink, setPaymentLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");

  useEffect(() => {
    loadPaymentLink();
  }, [params.slug]);

  const loadPaymentLink = async () => {
    try {
      const res = await fetch(`/api/public/payment-link/${params.slug}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setPaymentLink(data.paymentLink);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Lien de paiement introuvable");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    try {
      setPaying(true);

      const res = await fetch(`/api/public/payment-link/${params.slug}/checkout`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      // Rediriger vers Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erreur lors du paiement");
      setPaying(false);
    }
  };

  const handleShowQR = async () => {
    if (qrCode) {
      setShowQR(!showQR);
      return;
    }

    const url = window.location.href;
    const qr = await QRCodeService.generateQRCode(url, 400);
    setQrCode(qr);
    setShowQR(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (!paymentLink || !paymentLink.isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <Card className="max-w-md w-full p-8 border-black/8 shadow-sm text-center">
          <AlertCircle className="h-12 w-12 text-black/40 mx-auto mb-4" />
          <h2 className="text-[20px] font-semibold text-black mb-2">
            Lien de paiement invalide
          </h2>
          <p className="text-[14px] text-black/60">
            Ce lien de paiement n'est plus disponible ou a expiré.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Logo entreprise */}
        {paymentLink.entreprise.parametres?.logo_url && (
          <div className="text-center mb-8">
            <Image
              src={paymentLink.entreprise.parametres.logo_url}
              alt={paymentLink.entreprise.nom}
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

            {/* Montant */}
            <div className="bg-black/2 rounded-lg p-6 mb-6">
              <div className="text-center">
                <p className="text-[14px] text-black/60 mb-2">Montant à payer</p>
                <p className="text-[48px] font-semibold tracking-[-0.02em] text-black">
                  {Number(paymentLink.montant).toFixed(2)}€
                </p>
              </div>
            </div>

            {/* Stats */}
            {paymentLink.quantiteMax && (
              <div className="text-center text-[13px] text-black/60 mb-6">
                {paymentLink.quantitePaye} / {paymentLink.quantiteMax} paiements effectués
              </div>
            )}

            {/* Bouton de paiement */}
            <Button
              onClick={handlePay}
              disabled={paying}
              className="w-full h-12 bg-black hover:bg-black/90 text-white text-[15px] font-medium rounded-md shadow-sm mb-4"
            >
              {paying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirection...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Payer {Number(paymentLink.montant).toFixed(2)}€
                </>
              )}
            </Button>

            {/* Bouton QR Code */}
            <Button
              onClick={handleShowQR}
              variant="outline"
              className="w-full h-11 border-black/10 hover:bg-black/5 text-[14px] font-medium rounded-md"
            >
              <QrCode className="mr-2 h-4 w-4" />
              {showQR ? "Masquer" : "Afficher"} le QR Code
            </Button>

            {/* QR Code */}
            {showQR && qrCode && (
              <div className="mt-6 text-center">
                <div className="bg-white p-4 rounded-lg border border-black/8 inline-block">
                  <Image
                    src={qrCode}
                    alt="QR Code"
                    width={300}
                    height={300}
                  />
                </div>
                <p className="text-[13px] text-black/60 mt-3">
                  Scannez ce QR code pour payer
                </p>
              </div>
            )}

            {/* Info entreprise */}
            <div className="mt-8 pt-6 border-t border-black/8 text-center">
              <p className="text-[13px] text-black/40">
                Paiement sécurisé par {paymentLink.entreprise.nom}
              </p>
              <p className="text-[12px] text-black/30 mt-1">
                Propulsé par Stripe
              </p>
            </div>
          </div>
        </Card>

        {/* Sécurité */}
        <div className="text-center mt-6">
          <p className="text-[12px] text-black/40">
            🔒 Paiement 100% sécurisé avec chiffrement SSL
          </p>
        </div>
      </div>
    </div>
  );
}
