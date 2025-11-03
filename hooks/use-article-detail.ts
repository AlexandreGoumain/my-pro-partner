import { useMemo } from "react";
import { ArticleDisplay } from "@/lib/types/article";
import { useArticle } from "./use-articles";

interface MouvementStock {
    id: string;
    type: "ENTREE" | "SORTIE" | "AJUSTEMENT" | "INVENTAIRE" | "RETOUR";
    quantite: number;
    stock_avant: number;
    stock_apres: number;
    motif?: string;
    reference?: string;
    createdAt: string;
}

interface ArticleStats {
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

interface DocumentLie {
    id: string;
    numero: string;
    type: "DEVIS" | "FACTURE" | "AVOIR";
    client: string;
    quantite: number;
    montant: number;
    date: string;
    statut: string;
}

export interface ArticleDetailData {
    article: ArticleDisplay | null;
    mouvements: MouvementStock[];
    stats: ArticleStats | null;
    documents: DocumentLie[];
    isLoading: boolean;
}

export function useArticleDetail(articleId: string | null): ArticleDetailData {
    const { data: articleData, isLoading } = useArticle(articleId || "");

    // Transform article data using useMemo for performance
    const article = useMemo(() => {
        if (!articleData) return null;

        return {
            id: articleData.id,
            reference: articleData.reference,
            nom: articleData.nom,
            description: articleData.description,
            type: articleData.type || "PRODUIT",
            prix: Number(articleData.prix_ht),
            stock: articleData.stock_actuel,
            seuilAlerte: articleData.stock_min,
            categorie: articleData.categorie?.nom || "Sans catégorie",
            statut: articleData.statut,
            image: articleData.image,
            tva: articleData.tva_taux,
            gestionStock: articleData.gestion_stock || false,
            createdAt: articleData.createdAt ? new Date(articleData.createdAt) : undefined,
        } as ArticleDisplay;
    }, [articleData]);

    // Mock data pour mouvements et stats (à implémenter plus tard avec des vraies queries)
    const mouvements: MouvementStock[] = useMemo(() => [], []);

    const stats: ArticleStats | null = useMemo(() => ({
        ventesTotal: 145,
        ventesMois: 12,
        ventesEvolution: 8.5,
        ca_total: 24580,
        ca_mois: 2040,
        ca_evolution: 12.3,
        marge_moyenne: 35.5,
        rotationStock: 2.3,
        derniereMaj: new Date().toISOString(),
    }), []);

    const documents: DocumentLie[] = useMemo(() => [], []);

    return {
        article,
        mouvements,
        stats,
        documents,
        isLoading,
    };
}
