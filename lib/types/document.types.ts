export type DocumentType = "DEVIS" | "FACTURE" | "AVOIR";

export type DocumentStatus =
    | "BROUILLON"
    | "ENVOYE"
    | "ACCEPTE"
    | "REFUSE"
    | "PAYE"
    | "ANNULE";

export interface Client {
    id: string;
    nom: string;
    prenom: string | null;
    email: string | null;
    telephone: string | null;
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
    serieId?: string; // Optional serie ID for custom numbering
    dateEmission: string;
    dateEcheance: string;
    validite_jours: number;
    notes: string;
    conditions_paiement: string;
}

export interface DocumentLine {
    ordre: number;
    articleId: string | null;
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
