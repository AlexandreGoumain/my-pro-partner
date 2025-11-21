import { type Article } from "@/lib/types/article";
import { useMemo } from "react";

export interface ArticleStatsData {
    total: number;
    produits: number;
    services: number;
    actifs: number;
    stockFaible: number;
}

export function useArticleStats(articles: Article[]): ArticleStatsData {
    return useMemo(() => {
        const produits = articles.filter((a) => a.type === "PRODUIT");
        const services = articles.filter((a) => a.type === "SERVICE");

        return {
            total: articles.length,
            produits: produits.length,
            services: services.length,
            actifs: articles.filter((a) => a.statut === "ACTIF").length,
            stockFaible: articles.filter(
                (a) => a.stock <= a.seuilAlerte && a.type === "PRODUIT"
            ).length,
        };
    }, [articles]);
}
