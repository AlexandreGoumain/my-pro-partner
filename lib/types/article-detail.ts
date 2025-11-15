/**
 * Article detail page types
 */

export interface MouvementStock {
    id: string;
    type: "ENTREE" | "SORTIE" | "AJUSTEMENT" | "INVENTAIRE" | "RETOUR";
    quantite: number;
    stock_avant: number;
    stock_apres: number;
    motif?: string;
    reference?: string;
    createdAt: string;
}

export interface ArticleStats {
    ventesTotal: number;
    ventesMois: number;
    ventesEvolution: number;
    ca_total: number;
    ca_mois: number;
    ca_evolution: number;
    marge_moyenne: number;
    rotationStock: number;
    derniereMaj: string;
}

export interface DocumentLie {
    id: string;
    numero: string;
    type: "DEVIS" | "FACTURE" | "AVOIR";
    client: string;
    quantite: number;
    montant: number;
    date: string;
    statut: string;
}

export type MouvementType = "ENTREE" | "SORTIE" | "AJUSTEMENT" | "INVENTAIRE" | "RETOUR";
export type ArticleStatut = "ACTIF" | "INACTIF" | "RUPTURE";
