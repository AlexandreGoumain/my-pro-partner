"use client";

import { StockFiltersCard, StockStats } from "@/components/stock";
import { StockAlertsList } from "@/components/stock-alerts-list";
import { StockHistoryTable } from "@/components/stock-history-table";
import { StockMovementDialog } from "@/components/stock-movement-dialog";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
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
            <PageHeader
                title="Gestion des stocks"
                description="Suivez et gérez vos stocks en temps réel"
                actions={
                    <PrimaryActionButton
                        icon={PackagePlus}
                        onClick={() => setMovementDialogOpen(true)}
                    >
                        Nouveau mouvement
                    </PrimaryActionButton>
                }
            />

            <StockStats
                totalArticles={stats.totalArticles}
                articlesEnRupture={stats.articlesEnRupture}
                articlesEnAlerte={stats.articlesEnAlerte}
                mouvementsRecents={stats.mouvementsRecents}
            />

            <Tabs defaultValue="mouvements" className="space-y-4">
                <TabsList className="bg-black/5 border-black/10">
                    <TabsTrigger
                        value="mouvements"
                        className="text-[14px] data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        Historique des mouvements
                    </TabsTrigger>
                    <TabsTrigger
                        value="alertes"
                        className="text-[14px] data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        Alertes
                        {alerts.length > 0 && (
                            <span className="ml-2 rounded-full bg-black/10 px-2 py-0.5 text-[11px] font-medium text-black/60">
                                {alerts.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="mouvements" className="space-y-4 mt-6">
                    <StockFiltersCard
                        filters={filters}
                        articlesWithStock={articlesWithStock}
                        loadingArticles={loadingArticles}
                        onFilterChange={handleFilterChange}
                        onResetFilters={() => setFilters({})}
                    />

                    <StockHistoryTable
                        mouvements={mouvements}
                        showArticle={!filters.articleId}
                        isLoading={loadingMouvements}
                    />
                </TabsContent>

                <TabsContent value="alertes" className="space-y-4 mt-6">
                    <StockAlertsList
                        articles={alerts}
                        isLoading={loadingAlerts}
                    />
                </TabsContent>
            </Tabs>

            <StockMovementDialog
                open={movementDialogOpen}
                onOpenChange={setMovementDialogOpen}
                onSuccess={() => setMovementDialogOpen(false)}
            />
        </div>
    );
}
