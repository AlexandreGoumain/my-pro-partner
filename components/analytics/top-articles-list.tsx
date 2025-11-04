"use client";

import { Card } from "@/components/ui/card";
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
        <Card className={`p-6 border-black/8 shadow-sm ${className}`}>
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-black/60" strokeWidth={2} />
                <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black">
                    {title}
                </h3>
            </div>

            {articles.length > 0 ? (
                <div className="space-y-3">
                    {articles.map((article, index) => (
                        <div
                            key={`${article.reference}-${index}`}
                            className="flex items-center justify-between p-3 bg-white border border-black/8 rounded-lg hover:bg-black/2 transition-colors"
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
                <div className="text-center py-8">
                    <p className="text-[14px] text-black/40">
                        Aucun produit/service vendu
                    </p>
                </div>
            )}
        </Card>
    );
}
