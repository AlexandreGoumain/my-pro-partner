export interface PaymentLink {
    id: string;
    slug: string;
    titre: string;
    description: string | null;
    montant: number;
    quantiteMax: number | null;
    dateExpiration: Date | null;
    nombreVues: number;
    nombrePaiements: number;
    montantCollecte: number;
    actif: boolean;
    createdAt: Date;
}

export interface PaymentLinkFormData {
    titre: string;
    description?: string;
    montant: number;
    quantiteMax?: number;
    dateExpiration?: string;
}

/**
 * Payment link entreprise information for public pages
 */
export interface PaymentLinkEntreprise {
    nom: string;
    email: string;
    parametres?: {
        logo_url?: string | null;
        nom_entreprise?: string | null;
    } | null;
}

/**
 * Public payment link with entreprise information
 * Used for the public payment link page
 */
export interface PublicPaymentLink {
    id: string;
    slug: string;
    titre: string;
    description: string | null;
    montant: number;
    quantiteMax: number | null;
    quantitePaye: number;
    imageCouverture: string | null;
    isValid: boolean;
    entreprise: PaymentLinkEntreprise;
}

/**
 * Checkout session response
 */
export interface CheckoutResponse {
    url: string;
}

/**
 * Payment link API response
 */
export interface PaymentLinkResponse {
    paymentLink: PublicPaymentLink;
}
