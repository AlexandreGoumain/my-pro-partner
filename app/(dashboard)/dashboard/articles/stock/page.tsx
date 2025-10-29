"use client";

import { StockAlertsList } from "@/components/stock-alerts-list";
import { StockHistoryTable } from "@/components/stock-history-table";
import { StockMovementDialog } from "@/components/stock-movement-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useArticles } from "@/hooks/use-articles";
import {
    useStockAlerts,
    useStockMouvements,
    type StockFilters,
} from "@/hooks/use-stock";
import { STOCK_MOVEMENT_TYPES } from "@/lib/constants/stock-movements";
import {
    Activity,
    AlertTriangle,
    Package,
    PackagePlus,
    TrendingUp,
} from "lucide-react";
import { useState } from "react";

export default function StockManagementPage() {
    const [movementDialogOpen, setMovementDialogOpen] = useState(false);
    const [filters, setFilters] = useState<StockFilters>({});

    const { data: mouvements = [], isLoading: loadingMouvements } =
        useStockMouvements(filters);
    const { data: alerts = [], isLoading: loadingAlerts } = useStockAlerts();
    const { data: articles = [], isLoading: loadingArticles } = useArticles();

    // Calculer les statistiques
    const articlesWithStock = articles.filter((a) => a.gestionStock);
    const totalArticles = articlesWithStock.length;
    const articlesEnRupture = articlesWithStock.filter(
        (a) => a.stock === 0
    ).length;
    const articlesEnAlerte = articlesWithStock.filter(
        (a) => a.stock > 0 && a.stock <= a.seuilAlerte
    ).length;
    const mouvementsRecents = mouvements.length;

    const handleFilterChange = (key: keyof StockFilters, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value === "all" ? undefined : value,
        }));
    };

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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total articles
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalArticles}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Articles avec gestion de stock
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            En rupture
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">
                            {articlesEnRupture}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Articles à réapprovisionner
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            En alerte
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {articlesEnAlerte}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Stock sous le seuil minimum
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Mouvements
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {mouvementsRecents}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Mouvements enregistrés
                        </p>
                    </CardContent>
                </Card>
            </div>

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
                    <Card>
                        <CardHeader>
                            <CardTitle>Filtres</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Article
                                    </label>
                                    <Select
                                        value={filters.articleId || "all"}
                                        onValueChange={(value) =>
                                            handleFilterChange(
                                                "articleId",
                                                value
                                            )
                                        }
                                        disabled={loadingArticles}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tous les articles" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Tous les articles
                                            </SelectItem>
                                            {articlesWithStock.map(
                                                (article) => (
                                                    <SelectItem
                                                        key={article.id}
                                                        value={article.id}
                                                    >
                                                        {article.reference} -{" "}
                                                        {article.nom}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Type de mouvement
                                    </label>
                                    <Select
                                        value={filters.type || "all"}
                                        onValueChange={(value) =>
                                            handleFilterChange("type", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tous les types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Tous les types
                                            </SelectItem>
                                            {STOCK_MOVEMENT_TYPES.map(
                                                (type) => (
                                                    <SelectItem
                                                        key={type.value}
                                                        value={type.value}
                                                    >
                                                        {type.label}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {(filters.articleId || filters.type) && (
                                    <div className="flex items-end">
                                        <Button
                                            variant="outline"
                                            onClick={() => setFilters({})}
                                            className="w-full"
                                        >
                                            Réinitialiser les filtres
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

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
