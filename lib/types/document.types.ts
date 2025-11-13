export type DocumentType = "DEVIS" | "FACTURE" | "AVOIR";

export type DocumentStatus =
    | "BROUILLON"
    | "ENVOYE"
    | "ACCEPTE"
    | "REFUSE"
    | "PAYE"
    | "ANNULE";

export interface DocumentClient {
    id?: string;
    nom: string;
    prenom: string | null;
    email: string | null;
    telephone: string | null;
    adresse: string | null;
}

export interface Article {
    id: string;
    nom: string;
    reference?: string;
    type: "PRODUIT" | "SERVICE";
    prix_ht: number;
    tva_taux: number;
}

export interface DocumentFormData {
    clientId: string;
    serieId?: string;
    dateEmission: string;
    dateEcheance: string;
    validite_jours: number;
    notes: string;
    conditions_paiement: string;
}

export interface DocumentLine {
    id: string;
    ordre?: number;
    articleId?: string | null;
    designation: string;
    description: string | null;
    quantite: number;
    prix_unitaire_ht: number;
    tva_taux: number;
    remise_pourcent: number;
    montant_ht: number;
    montant_tva: number;
    montant_ttc: number;
}

export interface DocumentTotals {
    totalHT: number;
    totalTVA: number;
    totalTTC: number;
}

export interface Document {
    id: string;
    numero: string;
    type: DocumentType;
    dateEmission: Date | string;
    dateEcheance: Date | string | null;
    statut: DocumentStatus;
    clientId?: string;
    serieId?: string | null;
    client: DocumentClient;
    total_ht: number;
    total_tva: number;
    total_ttc: number;
    reste_a_payer?: number;
    notes: string | null;
    conditions_paiement: string | null;
    validite_jours: number;
    lignes: DocumentLine[];
}

/**
 * Invoice type - extends Document with required reste_a_payer field
 */
export interface Invoice extends Omit<Document, "reste_a_payer"> {
    reste_a_payer: number;
}

/**
 * Quote type - represents a quote document
 */
export interface Quote {
    id: string;
    numero: string;
    dateEmission: Date;
    dateEcheance: Date | null;
    statut: "BROUILLON" | "ENVOYE" | "ACCEPTE" | "REFUSE" | "ANNULE";
    client: {
        nom: string;
        prenom: string | null;
        email: string | null;
    };
    total_ht: number;
    total_tva: number;
    total_ttc: number;
    validite_jours: number;
}
