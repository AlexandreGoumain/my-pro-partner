"use client";

import { StockFiltersCard, StockStats } from "@/components/stock";
import { StockAlertsList } from "@/components/stock-alerts-list";
import { StockHistoryTable } from "@/components/stock-history-table";
import { StockMovementDialog } from "@/components/stock-movement-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStockPage } from "@/hooks/use-stock-page";
import { PackagePlus } from "lucide-react";

export default function StockManagementPage() {
    const {
        mouvements,
        loadingMouvements,
        alerts,
        loadingAlerts,
        loadingArticles,
        movementDialogOpen,
        setMovementDialogOpen,
        filters,
        setFilters,
        articlesWithStock,
        stats,
        handleFilterChange,
    } = useStockPage();

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Gestion des stocks
                    </h1>
                    <p className="text-muted-foreground">
                        Suivez et gérez vos stocks en temps réel
                    </p>
                </div>
                <Button onClick={() => setMovementDialogOpen(true)}>
                    <PackagePlus className="mr-2 h-4 w-4" />
                    Nouveau mouvement
                </Button>
            </div>

            {/* Statistiques */}
            <StockStats
                totalArticles={stats.totalArticles}
                articlesEnRupture={stats.articlesEnRupture}
                articlesEnAlerte={stats.articlesEnAlerte}
                mouvementsRecents={stats.mouvementsRecents}
            />

            {/* Contenu principal */}
            <Tabs defaultValue="mouvements" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="mouvements">
                        Historique des mouvements
                    </TabsTrigger>
                    <TabsTrigger value="alertes">
                        Alertes
                        {alerts.length > 0 && (
                            <span className="ml-2 rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">
                                {alerts.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="mouvements" className="space-y-4">
                    {/* Filtres */}
                    <StockFiltersCard
                        filters={filters}
                        articlesWithStock={articlesWithStock}
                        loadingArticles={loadingArticles}
                        onFilterChange={handleFilterChange}
                        onResetFilters={() => setFilters({})}
                    />

                    {/* Table des mouvements */}
                    <StockHistoryTable
                        mouvements={mouvements}
                        showArticle={!filters.articleId}
                        isLoading={loadingMouvements}
                    />
                </TabsContent>

                <TabsContent value="alertes" className="space-y-4">
                    <StockAlertsList
                        articles={alerts}
                        isLoading={loadingAlerts}
                    />
                </TabsContent>
            </Tabs>

            {/* Dialog pour créer un mouvement */}
            <StockMovementDialog
                open={movementDialogOpen}
                onOpenChange={setMovementDialogOpen}
                onSuccess={() => setMovementDialogOpen(false)}
            />
        </div>
    );
}
