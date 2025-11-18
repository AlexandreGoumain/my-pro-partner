"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArticleDisplay } from "@/lib/types/article";
import { ARTICLE_STATUSES } from "@/lib/constants/article-statuses";
import { Package } from "lucide-react";

interface ArticleViewDialogProps {
    article: ArticleDisplay | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ArticleViewDialog({
    article,
    open,
    onOpenChange,
}: ArticleViewDialogProps) {
    if (!article) return null;

    const statusConfig = ARTICLE_STATUSES[article.statut];
    const isLowStock = article.stock <= article.seuilAlerte;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Détails de l&apos;article</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Image et informations principales */}
                    <div className="flex gap-6">
                        <div className="w-32 h-32 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            {article.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={article.image}
                                    alt={article.nom}
                                    className="w-32 h-32 rounded-lg object-cover"
                                />
                            ) : (
                                <Package className="w-12 h-12 text-muted-foreground" />
                            )}
                        </div>

                        <div className="flex-1 space-y-3">
                            <div>
                                <h3 className="text-2xl font-bold">
                                    {article.nom}
                                </h3>
                                <code className="text-sm text-muted-foreground">
                                    {article.reference}
                                </code>
                            </div>

                            <div className="flex gap-2">
                                <Badge variant={statusConfig.variant}>
                                    {statusConfig.label}
                                </Badge>
                                <Badge variant="outline">
                                    {article.categorie}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Description */}
                    {article.description && (
                        <>
                            <div>
                                <h4 className="font-semibold mb-2">
                                    Description
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    {article.description}
                                </p>
                            </div>
                            <Separator />
                        </>
                    )}

                    {/* Informations tarifaires */}
                    <div>
                        <h4 className="font-semibold mb-3">Tarification</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Prix HT
                                </p>
                                <p className="text-2xl font-bold">
                                    {article.prix.toFixed(2)} €
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    TVA
                                </p>
                                <p className="text-lg font-semibold">
                                    {article.tva}%
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Prix TTC
                                </p>
                                <p className="text-lg font-semibold">
                                    {(
                                        article.prix *
                                        (1 + article.tva / 100)
                                    ).toFixed(2)}{" "}
                                    €
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Informations de stock */}
                    <div>
                        <h4 className="font-semibold mb-3">Stock</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Stock actuel
                                </p>
                                <p
                                    className={`text-2xl font-bold ${
                                        isLowStock ? "text-orange-600" : ""
                                    }`}
                                >
                                    {article.stock}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Seuil d&apos;alerte
                                </p>
                                <p className="text-lg font-semibold">
                                    {article.seuilAlerte}
                                </p>
                            </div>
                        </div>
                        {isLowStock && (
                            <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                                <p className="text-sm text-orange-800 dark:text-orange-200">
                                    ⚠️ Stock faible - Réapprovisionnement
                                    recommandé
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
