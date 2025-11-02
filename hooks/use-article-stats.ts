import { useMemo } from "react";
import { type Article } from "@/app/(dashboard)/dashboard/articles/_components/data-table/columns";

export interface ArticleStatsData {
    total: number;
    produits: number;
    services: number;
    actifs: number;
    stockFaible: number;
}

export function useArticleStats(articles: Article[]): ArticleStatsData {
    return useMemo(() => {
        const produits = articles.filter(
            (a) =>
                !(a as Article & { type?: string }).type ||
                (a as Article & { type?: string }).type === "PRODUIT"
        );
        const services = articles.filter(
            (a) => (a as Article & { type?: string }).type === "SERVICE"
        );

        return {
            total: articles.length,
            produits: produits.length,
            services: services.length,
            actifs: articles.filter((a) => a.statut === "ACTIF").length,
            stockFaible: articles.filter(
                (a) =>
                    a.stock <=
                        (a as Article & { seuilAlerte?: number }).seuilAlerte &&
                    (!(a as Article & { type?: string }).type ||
                        (a as Article & { type?: string }).type === "PRODUIT")
            ).length,
        };
    }, [articles]);
}
