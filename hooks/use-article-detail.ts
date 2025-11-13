import { useMemo } from "react";
import { mapArticleToDisplay } from "@/lib/types/article";
import type { ArticleDisplay } from "@/lib/types/article";
import {
    MouvementStock,
    ArticleStats,
    DocumentLie,
} from "@/lib/types/article-detail";
import { useArticle } from "./use-articles";

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
        return mapArticleToDisplay(articleData);
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
