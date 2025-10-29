"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, PackagePlus } from "lucide-react";
import type { ArticleAvecAlerte } from "@/lib/types/stock";
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
      <Card>
        <CardHeader>
          <CardTitle>Alertes de stock</CardTitle>
          <CardDescription>
            Articles en rupture ou sous le seuil minimum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Chargement...
          </p>
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Alertes de stock
              </CardTitle>
              <CardDescription>
                Articles en rupture ou sous le seuil minimum
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="destructive" className="h-6">
                {ruptureArticles.length} en rupture
              </Badge>
              <Badge variant="outline" className="h-6 border-orange-500 text-orange-600">
                {alerteArticles.length} en alerte
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {articles.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aucune alerte de stock
            </p>
          ) : (
            <div className="space-y-3">
              {ruptureArticles.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Rupture de stock ({ruptureArticles.length})
                  </h3>
                  {ruptureArticles.map((article) => (
                    <ArticleAlertItem
                      key={article.id}
                      article={article}
                      severity="rupture"
                      onAddStock={() => handleAddStock(article.id)}
                    />
                  ))}
                </div>
              )}

              {alerteArticles.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-orange-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Stock faible ({alerteArticles.length})
                  </h3>
                  {alerteArticles.map((article) => (
                    <ArticleAlertItem
                      key={article.id}
                      article={article}
                      severity="alerte"
                      onAddStock={() => handleAddStock(article.id)}
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
    <Alert variant={severity === "rupture" ? "destructive" : "default"} className={severity === "alerte" ? "border-orange-500/50 text-orange-600 [&>svg]:text-orange-600" : ""}>
      <AlertTriangle className="h-4 w-4" />
      <div className="flex items-center justify-between w-full">
        <div className="flex-1">
          <AlertTitle className="flex items-center gap-2 mb-1">
            {article.nom}
            {article.categorie && (
              <Badge variant="outline" className="h-5 text-xs">
                {article.categorie.nom}
              </Badge>
            )}
          </AlertTitle>
          <AlertDescription>
            <div className="flex items-center gap-4">
              <span>Réf: {article.reference}</span>
              <span className="font-medium">
                Stock: {article.stock_actuel} / Min: {article.stock_min}
              </span>
            </div>
          </AlertDescription>
        </div>
        <Button size="sm" onClick={onAddStock} className="ml-4 shrink-0">
          <PackagePlus className="h-4 w-4 mr-2" />
          Approvisionner
        </Button>
      </div>
    </Alert>
  );
}
