"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import type { ArticleAvecAlerte } from "@/lib/types/stock";
import { AlertTriangle, PackagePlus } from "lucide-react";
import { useState } from "react";
import { StockMovementDialog } from "./stock-movement-dialog";

interface StockAlertsListProps {
    articles: ArticleAvecAlerte[];
    isLoading?: boolean;
}

export function StockAlertsList({
    articles,
    isLoading = false,
}: StockAlertsListProps) {
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
        null
    );
    const [movementDialogOpen, setMovementDialogOpen] = useState(false);

    const handleAddStock = (articleId: string) => {
        setSelectedArticleId(articleId);
        setMovementDialogOpen(true);
    };

    if (isLoading) {
        return (
            <Card className="group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-sm transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <CardTitle className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                            Alertes de stock
                        </CardTitle>
                    </div>
                    <CardDescription className="text-[13px] text-black/60 ml-3">
                        Articles en rupture ou sous le seuil minimum
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                    <GridSkeleton
                        itemCount={3}
                        gridColumns={{ default: 1 }}
                        gap={3}
                        itemHeight="h-24"
                    />
                </CardContent>
            </Card>
        );
    }

    const ruptureArticles = articles.filter((a) => a.stock_actuel === 0);
    const alerteArticles = articles.filter(
        (a) => a.stock_actuel > 0 && a.stock_actuel <= a.stock_min
    );

    return (
        <>
            <Card className="group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-sm transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                                <CardTitle className="text-[15px] font-semibold tracking-[-0.02em] text-black flex items-center gap-2">
                                    <AlertTriangle
                                        className="h-4 w-4 text-black/60"
                                        strokeWidth={2}
                                    />
                                    Alertes de stock
                                </CardTitle>
                            </div>
                            <CardDescription className="text-[13px] text-black/60 ml-3">
                                Articles en rupture ou sous le seuil minimum
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Badge className="bg-black text-white text-[12px] h-6 px-3 font-medium border-0">
                                {ruptureArticles.length} en rupture
                            </Badge>
                            <Badge
                                variant="outline"
                                className="bg-black/5 text-black/70 border-black/10 text-[12px] h-6 px-3 font-medium"
                            >
                                {alerteArticles.length} en alerte
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="relative">
                    {articles.length === 0 ? (
                        <p className="text-black/60 text-[13px] text-center py-8">
                            Aucune alerte de stock
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {ruptureArticles.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-[14px] font-semibold text-black flex items-center gap-2">
                                        <AlertTriangle
                                            className="h-4 w-4"
                                            strokeWidth={2}
                                        />
                                        Rupture de stock (
                                        {ruptureArticles.length})
                                    </h3>
                                    {ruptureArticles.map((article) => (
                                        <ArticleAlertItem
                                            key={article.id}
                                            article={article}
                                            severity="rupture"
                                            onAddStock={() =>
                                                handleAddStock(article.id)
                                            }
                                        />
                                    ))}
                                </div>
                            )}

                            {alerteArticles.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-[14px] font-semibold text-black flex items-center gap-2">
                                        <AlertTriangle
                                            className="h-4 w-4"
                                            strokeWidth={2}
                                        />
                                        Stock faible ({alerteArticles.length})
                                    </h3>
                                    {alerteArticles.map((article) => (
                                        <ArticleAlertItem
                                            key={article.id}
                                            article={article}
                                            severity="alerte"
                                            onAddStock={() =>
                                                handleAddStock(article.id)
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <StockMovementDialog
                open={movementDialogOpen}
                onOpenChange={setMovementDialogOpen}
                defaultArticleId={selectedArticleId || undefined}
                onSuccess={() => {
                    setMovementDialogOpen(false);
                    setSelectedArticleId(null);
                }}
            />
        </>
    );
}

function ArticleAlertItem({
    article,
    severity,
    onAddStock,
}: {
    article: ArticleAvecAlerte;
    severity: "rupture" | "alerte";
    onAddStock: () => void;
}) {
    return (
        <Alert
            variant="default"
            className="border-black/10 bg-black/[0.02] hover:bg-black/[0.04] transition-colors duration-200"
        >
            <AlertTriangle className="h-4 w-4 text-black/60" strokeWidth={2} />
            <div className="flex items-center justify-between w-full">
                <div className="flex-1">
                    <AlertTitle className="flex items-center gap-2 mb-1 text-[14px] font-semibold text-black">
                        {article.nom}
                        {article.categorie && (
                            <Badge
                                variant="outline"
                                className="bg-black/5 text-black/70 border-black/10 text-[11px] h-5 px-2 font-medium"
                            >
                                {article.categorie.nom}
                            </Badge>
                        )}
                    </AlertTitle>
                    <AlertDescription className="text-[13px] text-black/70">
                        <div className="flex items-center gap-4">
                            <span>Réf: {article.reference}</span>
                            <span className="font-medium text-black">
                                Stock: {article.stock_actuel} / Min:{" "}
                                {article.stock_min}
                            </span>
                        </div>
                    </AlertDescription>
                </div>
                <Button
                    size="sm"
                    onClick={onAddStock}
                    className="ml-4 shrink-0 bg-black hover:bg-black/90 text-white h-9 px-4 text-[13px] font-medium"
                >
                    <PackagePlus className="h-4 w-4 mr-2" strokeWidth={2} />
                    Approvisionner
                </Button>
            </div>
        </Alert>
    );
}
