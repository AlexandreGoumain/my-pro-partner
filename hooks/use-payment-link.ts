import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/fetch-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type {
    PublicPaymentLink,
    PaymentLinkResponse,
    CheckoutResponse,
} from "@/lib/types/payment-link";
import { QRCodeService } from "@/lib/services/qr-code.service";
import { useToast } from "./use-toast";

export interface UsePaymentLinkReturn {
    // Data
    paymentLink: PublicPaymentLink | null;
    qrCode: string;

    // States
    loading: boolean;
    paying: boolean;
    showQR: boolean;

    // Handlers
    handlePay: () => Promise<void>;
    handleShowQR: () => Promise<void>;
}

/**
 * Custom hook for managing payment link page logic
 * Handles loading, payment, and QR code generation
 *
 * @param slug - Payment link slug from URL
 * @returns Payment link state and handlers
 */
export function usePaymentLink(slug: string): UsePaymentLinkReturn {
    const router = useRouter();
    const { toast } = useToast();

    // States
    const [paymentLink, setPaymentLink] = useState<PublicPaymentLink | null>(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [qrCode, setQrCode] = useState<string>("");

    // Load payment link on mount
    useEffect(() => {
        loadPaymentLink();
    }, [slug]);

    /**
     * Load payment link from API
     */
    const loadPaymentLink = async () => {
        try {
            setLoading(true);
            const data = await api.get<PaymentLinkResponse>(
                ENDPOINTS.PUBLIC_PAYMENT_LINK(slug)
            );
            setPaymentLink(data.paymentLink);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Lien de paiement introuvable";
            toast({
                title: "Erreur",
                description: message,
                variant: "destructive",
            });
            router.push("/");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle payment initiation
     * Creates a Stripe checkout session and redirects
     */
    const handlePay = async () => {
        try {
            setPaying(true);

            const data = await api.post<CheckoutResponse>(
                ENDPOINTS.PUBLIC_PAYMENT_LINK_CHECKOUT(slug)
            );

            // Redirect to Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur lors du paiement";
            toast({
                title: "Erreur",
                description: message,
                variant: "destructive",
            });
            setPaying(false);
        }
    };

    /**
     * Handle QR code generation and display
     * Generates QR code only once and toggles visibility
     */
    const handleShowQR = async () => {
        if (qrCode) {
            setShowQR(!showQR);
            return;
        }

        try {
            const url = window.location.href;
            const qr = await QRCodeService.generateQRCode(url, 400);
            setQrCode(qr);
            setShowQR(true);
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de générer le QR code",
                variant: "destructive",
            });
        }
    };

    return {
        // Data
        paymentLink,
        qrCode,

        // States
        loading,
        paying,
        showQR,

        // Handlers
        handlePay,
        handleShowQR,
    };
}
