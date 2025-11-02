import { useState, useEffect } from "react";
import { ArticleDisplay } from "@/lib/types/article";

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
    const [article, setArticle] = useState<ArticleDisplay | null>(null);
    const [mouvements, setMouvements] = useState<MouvementStock[]>([]);
    const [stats, setStats] = useState<ArticleStats | null>(null);
    const [documents, setDocuments] = useState<DocumentLie[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!articleId) return;

        const fetchData = async () => {
            try {
                setIsLoading(true);

                const articleRes = await fetch(`/api/articles/${articleId}`);
                if (articleRes.ok) {
                    const data = await articleRes.json();
                    const articleDisplay: ArticleDisplay = {
                        id: data.id,
                        reference: data.reference,
                        nom: data.nom,
                        description: data.description,
                        type: data.type || "PRODUIT",
                        prix: Number(data.prix_ht),
                        stock: data.stock_actuel,
                        seuilAlerte: data.stock_min,
                        categorie: data.categorie?.nom || "Sans catégorie",
                        statut: data.statut,
                        image: data.image,
                        tva: data.tva_taux,
                        gestionStock: data.gestion_stock || false,
                        createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
                    };
                    setArticle(articleDisplay);
                }

                setMouvements([]);

                setStats({
                    ventesTotal: 145,
                    ventesMois: 12,
                    ventesEvolution: 8.5,
                    ca_total: 24580,
                    ca_mois: 2040,
                    ca_evolution: 12.3,
                    marge_moyenne: 35.5,
                    rotationStock: 2.3,
                    derniereMaj: new Date().toISOString(),
                });

                setDocuments([]);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [articleId]);

    return {
        article,
        mouvements,
        stats,
        documents,
        isLoading,
    };
}
