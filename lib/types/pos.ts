/**
 * POS (Point of Sale) Types
 */

export interface POSArticle {
    id: string;
    reference: string;
    nom: string;
    prix_ht: number;
    tva_taux: number;
    actif: boolean;
}

export interface CartItem {
    articleId: string;
    reference: string;
    nom: string;
    prix_ht: number;
    tva_taux: number;
    quantite: number;
    remise_pourcent?: number;
}

export interface Terminal {
    id: string;
    stripeTerminalId: string;
    label: string;
    location: string | null;
    status: "ONLINE" | "OFFLINE" | "BUSY" | "ERROR";
    device_type: string | null;
    serial_number: string | null;
    ip_address: string | null;
    lastSyncAt: Date;
    lastUsedAt: Date | null;
}

export interface StripeReader {
    id: string;
    label: string;
    device_type: string;
    status: string;
    ip_address?: string;
    serial_number?: string;
}

export interface RegisterTerminalInput {
    stripeTerminalId: string;
    label: string;
    location?: string;
}

export type PaymentMethod = "CARTE" | "ESPECES" | "CHEQUE";

export type PaymentStatus =
    | "idle"
    | "selecting"
    | "creating_intent"
    | "processing"
    | "success"
    | "error";

export interface CheckoutRequest {
    items: any[];
    clientId: string | null;
    remiseGlobale: number;
    paymentMethod: PaymentMethod;
    stripePaymentIntentId?: string;
}

export interface CheckoutResponse {
    document: {
        id: string;
    };
    ticketUrl?: string;
}
