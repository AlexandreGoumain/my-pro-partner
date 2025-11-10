"use client";

import {
    ArticleDialogs,
    ArticleFiltersBar,
    ArticleGridView,
    ArticleListView,
    ArticleStatsGrid,
} from "@/components/articles";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { useArticleFilters } from "@/hooks/use-article-filters";
import { useArticleHandlers } from "@/hooks/use-article-handlers";
import { useArticleStats } from "@/hooks/use-article-stats";
import { useArticles } from "@/hooks/use-articles";
import { useCategories } from "@/hooks/use-categories";
import { ARTICLE_SORT_OPTIONS } from "@/lib/constants/article-sort-options";
import { expandCategoryIds } from "@/lib/types/category";
import { getArticleEmptyStateMessage } from "@/lib/utils/article-helpers";
import { Plus, Package } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { createColumns } from "./_components/data-table/columns";
import { LimitIndicator } from "@/components/paywall";
import { useLimitDialog } from "@/components/providers/limit-dialog-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CataloguePage() {
    // React Query hooks
    const { data: articles = [], isLoading } = useArticles();
    const { data: categories = [] } = useCategories();

    // Article handlers and modal states
    const handlers = useArticleHandlers();

    // Pricing limit check - maintenant global via provider
    const { checkLimit, userPlan } = useLimitDialog();
    const articlesCount = articles.length;

    // UI states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
        []
    );
    const [sortBy, setSortBy] = useState("Nom A-Z");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [typeFilter, setTypeFilter] = useState<
        "TOUS" | "PRODUIT" | "SERVICE"
    >("TOUS");

    // Create columns with handlers
    const columns = useMemo(
        () =>
            createColumns({
                onView: handlers.handleView,
                onEdit: handlers.handleEdit,
                onDuplicate: handlers.handleDuplicate,
                onDelete: handlers.handleDelete,
            }),
        [handlers]
    );

    // Filter handlers with toggle functionality
    const handleTypeFilterToggle = useCallback(
        (type: "TOUS" | "PRODUIT" | "SERVICE") => {
            if (typeFilter === type && type !== "TOUS") {
                setTypeFilter("TOUS");
            } else {
                setTypeFilter(type);
            }
        },
        [typeFilter]
    );

    // Statistiques par type
    const stats = useArticleStats(articles);

    // Obtenir tous les IDs de catégories incluant les enfants
    const getAllCategoryIds = useMemo(() => {
        return expandCategoryIds(selectedCategoryIds, categories);
    }, [selectedCategoryIds, categories]);

    // Filtrer et trier les articles
    const filteredAndSortedArticles = useArticleFilters({
        articles,
        searchTerm,
        selectedCategoryIds,
        allCategoryIds: getAllCategoryIds,
        sortBy,
        typeFilter,
    });

    // Messages d'état vide personnalisés
    const emptyState = useMemo(
        () => getArticleEmptyStateMessage(typeFilter, articles.length === 0),
        [typeFilter, articles.length]
    );

    // Wrapper pour vérifier la limite avant de créer
    const handleCreateWithLimitCheck = () => {
        if (!checkLimit("maxProducts", articlesCount)) {
            return; // Limite atteinte - dialog s'affiche automatiquement
        }
        handlers.handleCreate();
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Catalogue & Services"
                description="Gérez votre catalogue de produits et services"
                actions={
                    <Button
                        onClick={handleCreateWithLimitCheck}
                        className="cursor-pointer"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter
                    </Button>
                }
            />

            {/* KPI Cards */}
            <ArticleStatsGrid
                stats={stats}
                typeFilter={typeFilter}
                onTypeFilterToggle={handleTypeFilterToggle}
            />

            {/* Indicateur de limite de plan */}
            <Card className="border-black/10">
                <CardHeader>
                    <CardTitle className="text-[16px] font-semibold text-black flex items-center gap-2">
                        <Package className="w-5 h-5 text-black/60" strokeWidth={2} />
                        Utilisation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <LimitIndicator
                        userPlan={userPlan}
                        limitKey="maxProducts"
                        currentValue={articlesCount}
                        label="Articles"
                        showProgress
                        showUpgradeLink
                    />
                </CardContent>
            </Card>

            {/* Filtres et recherche */}
            <ArticleFiltersBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategoryIds={selectedCategoryIds}
                onCategoryChange={setSelectedCategoryIds}
                sortBy={sortBy}
                onSortChange={setSortBy}
                sortOptions={ARTICLE_SORT_OPTIONS}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            {/* Catalogue en vue grille */}
            {viewMode === "grid" && (
                <ArticleGridView
                    articles={filteredAndSortedArticles}
                    isLoading={isLoading}
                    emptyState={emptyState}
                    typeFilter={typeFilter}
                    hasNoDataAtAll={articles.length === 0}
                    onView={handlers.handleView}
                    onEdit={handlers.handleEdit}
                    onDuplicate={handlers.handleDuplicate}
                    onDelete={handlers.handleDelete}
                    onCreateClick={handlers.handleCreate}
                />
            )}

            {/* Catalogue en vue liste */}
            {viewMode === "list" && (
                <ArticleListView
                    articles={filteredAndSortedArticles}
                    columns={columns}
                    isLoading={isLoading}
                    emptyMessage={emptyState.description}
                />
            )}

            {/* Dialogs */}
            <ArticleDialogs
                createDialogOpen={handlers.createDialogOpen}
                onCreateDialogChange={handlers.setCreateDialogOpen}
                onCreateSuccess={handlers.handleCreateSuccess}
                viewDialogOpen={handlers.viewDialogOpen}
                onViewDialogChange={handlers.setViewDialogOpen}
                editDialogOpen={handlers.editDialogOpen}
                onEditDialogChange={handlers.setEditDialogOpen}
                onEditSuccess={handlers.handleEditSuccess}
                deleteDialogOpen={handlers.deleteDialogOpen}
                onDeleteDialogChange={handlers.setDeleteDialogOpen}
                onDeleteConfirm={handlers.confirmDelete}
                isDeleting={handlers.isDeleting}
                selectedArticle={handlers.selectedArticle}
            />

            {/* Dialog de limite atteinte géré globalement par le LimitDialogProvider */}
        </div>
    );
}
