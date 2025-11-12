export type DocumentType = "DEVIS" | "FACTURE" | "AVOIR";

export type DocumentStatus =
    | "BROUILLON"
    | "ENVOYE"
    | "ACCEPTE"
    | "REFUSE"
    | "PAYE"
    | "ANNULE";

export interface ClientDocument {
    id: string;
    numero: string;
    type: DocumentType;
    dateEmission: string;
    dateEcheance?: string;
    statut: DocumentStatus;
    total_ht: number;
    total_tva: number;
    total_ttc: number;
    reste_a_payer: number;
}

export interface ClientDocumentsData {
    documents: ClientDocument[];
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
    DEVIS: "Devis",
    FACTURE: "Facture",
    AVOIR: "Avoir",
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
    BROUILLON: "Brouillon",
    ENVOYE: "Envoyé",
    ACCEPTE: "Accepté",
    REFUSE: "Refusé",
    PAYE: "Payé",
    ANNULE: "Annulé",
};

export const DOCUMENT_STATUS_COLORS: Record<DocumentStatus, string> = {
    BROUILLON: "bg-black/5 text-black/60",
    ENVOYE: "bg-black/10 text-black/70",
    ACCEPTE: "bg-black/15 text-black/80",
    REFUSE: "bg-black/10 text-black/60",
    PAYE: "bg-black text-white",
    ANNULE: "bg-black/5 text-black/40",
};
