import { MouvementStock, Article, TypeMouvement } from "@/lib/generated/prisma";

// Type pour un mouvement de stock avec les relations
export type MouvementStockWithRelations = MouvementStock & {
  article: Article;
};

// Type pour l'affichage frontend des mouvements
export interface MouvementStockDisplay {
  id: string;
  articleId: string;
  articleNom: string;
  articleReference: string;
  type: TypeMouvement;
  quantite: number;
  stock_avant: number;
  stock_apres: number;
  motif: string | null;
  reference: string | null;
  notes: string | null;
  createdAt: Date;
  createdBy: string | null;
}

// Type pour les statistiques de stock
export interface StockStats {
  totalArticles: number;
  articlesEnRupture: number;
  articlesEnAlerte: number;
  mouvementsRecents: number;
  valeurTotaleStock: number;
}

// Type pour les articles avec alerte de stock
export interface ArticleAvecAlerte {
  id: string;
  reference: string;
  nom: string;
  stock_actuel: number;
  stock_min: number;
  prix_ht: number;
  categorie?: {
    id: string;
    nom: string;
  } | null;
}

// Fonction de mapping pour convertir un mouvement avec relations en affichage
export function mapMouvementToDisplay(
  mouvement: MouvementStockWithRelations
): MouvementStockDisplay {
  return {
    id: mouvement.id,
    articleId: mouvement.articleId,
    articleNom: mouvement.article.nom,
    articleReference: mouvement.article.reference,
    type: mouvement.type,
    quantite: mouvement.quantite,
    stock_avant: mouvement.stock_avant,
    stock_apres: mouvement.stock_apres,
    motif: mouvement.motif,
    reference: mouvement.reference,
    notes: mouvement.notes,
    createdAt: mouvement.createdAt,
    createdBy: mouvement.createdBy,
  };
}
