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
