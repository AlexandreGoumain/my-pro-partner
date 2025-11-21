import { useMemo } from "react";
import { mapArticleToDisplay } from "@/lib/types/article";
import type { ArticleDisplay } from "@/lib/types/article";
import {
    MouvementStock,
    ArticleStats,
    DocumentLie,
} from "@/lib/types/article-detail";
import { useArticle } from "./use-articles";
import { useStockMouvements } from "./use-stock";

export interface ArticleDetailData {
    article: ArticleDisplay | null;
    mouvements: MouvementStock[];
    stats: ArticleStats | null;
    documents: DocumentLie[];
    isLoading: boolean;
}

export function useArticleDetail(articleId: string | null): ArticleDetailData {
    const { data: articleData, isLoading: isLoadingArticle } = useArticle(articleId || "");

    // Transform article data using useMemo for performance
    const article = useMemo(() => {
        if (!articleData) return null;
        return mapArticleToDisplay(articleData);
    }, [articleData]);

    // Récupérer les mouvements de stock réels depuis la DB uniquement si ce n'est pas un service
    const isService = article?.type === "SERVICE";
    const { data: mouvementsData, isLoading: isLoadingMouvements } = useStockMouvements(
        articleId && !isService ? { articleId } : undefined
    );

    // Transformer les mouvements de stock pour le format attendu
    const mouvements: MouvementStock[] = useMemo(() => {
        if (!mouvementsData || isService) return [];
        return mouvementsData.map((m) => ({
            id: m.id,
            type: m.type,
            quantite: m.quantite,
            stock_avant: m.stock_avant,
            stock_apres: m.stock_apres,
            motif: m.motif || undefined,
            reference: m.reference || undefined,
            createdAt: m.createdAt.toISOString(),
        }));
    }, [mouvementsData, isService]);

    // Stats non disponibles pour le moment - affiche l'état vide
    const stats: ArticleStats | null = null;

    // Documents non disponibles pour le moment - affiche l'état vide
    const documents: DocumentLie[] = [];

    return {
        article,
        mouvements,
        stats,
        documents,
        isLoading: isLoadingArticle || isLoadingMouvements,
    };
}
