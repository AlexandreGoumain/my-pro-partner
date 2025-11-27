"use client";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { TrendingUp } from "lucide-react";

export interface TopArticle {
    nom: string;
    reference: string;
    revenue: number;
    quantity: number;
}

export interface TopArticlesListProps {
    title: string;
    articles: TopArticle[];
    className?: string;
}

export function TopArticlesList({
    title,
    articles,
    className = "",
}: TopArticlesListProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(value);
    };

    return (
        <Card
            className={`group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500 ${className}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-6">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black flex items-center gap-2">
                            <TrendingUp
                                className="h-4 w-4 text-black/60"
                                strokeWidth={2}
                            />
                            {title}
                        </h3>
                    </div>
                </div>

                {articles.length > 0 ? (
                    <div className="space-y-3">
                        {articles.map((article, index) => (
                            <div
                                key={`${article.reference}-${index}`}
                                className="flex items-center justify-between p-3 bg-white border border-black/[0.08] rounded-lg hover:bg-black/[0.02] transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white text-[12px] font-bold shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[14px] font-medium text-black truncate">
                                            {article.nom}
                                        </div>
                                        <div className="text-[12px] text-black/60">
                                            Réf: {article.reference} • Qté:{" "}
                                            {article.quantity}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                    <div className="text-[14px] font-semibold text-black">
                                        {formatCurrency(article.revenue)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="Aucun produit/service vendu"
                        variant="inline"
                    />
                )}
            </div>
        </Card>
    );
}
