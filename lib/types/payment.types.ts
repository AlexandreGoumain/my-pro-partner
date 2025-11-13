/**
 * Payment-related types for the application
 */

export type PaymentMethod = "ESPECES" | "CHEQUE" | "VIREMENT" | "CARTE" | "PRELEVEMENT";

export interface Payment {
    id: string;
    documentId: string;
    date_paiement: Date;
    montant: number;
    moyen_paiement: PaymentMethod;
    reference: string | null;
    notes: string | null;
    createdAt: Date;
}

export interface CreatePaymentInput {
    documentId: string;
    date_paiement: Date;
    montant: number;
    moyen_paiement: PaymentMethod;
    reference?: string;
    notes?: string;
}

export interface PaymentSummary {
    totalPaid: number;
    remainingAmount: number;
    paymentCount: number;
    lastPaymentDate: Date | null;
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
    ESPECES: "Espèces",
    CHEQUE: "Chèque",
    VIREMENT: "Virement",
    CARTE: "Carte bancaire",
    PRELEVEMENT: "Prélèvement automatique",
};

/**
 * Stripe payment session status
 */
export type StripeSessionStatus = "pending" | "succeeded" | "cancelled" | "expired";

/**
 * Stripe payment session data
 */
export interface StripePaymentSession {
    sessionId: string;
    status: StripeSessionStatus;
    amount?: number;
    currency?: string;
    documentId?: string;
}

/**
 * Payment status page variant
 */
export type PaymentStatusVariant = "success" | "error" | "warning";
