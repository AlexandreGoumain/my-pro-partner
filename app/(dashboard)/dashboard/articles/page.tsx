"use client";

import {
    ArticleDialogs,
    ArticleFiltersBar,
    ArticleGridView,
    ArticleListView,
    ArticleStatsGrid,
} from "@/components/articles";
import { LimitIndicator } from "@/components/paywall";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useArticlesPage } from "@/hooks/use-articles-page";
import { ARTICLE_SORT_OPTIONS } from "@/lib/constants/article-sort-options";
import { Package, Plus } from "lucide-react";
import { Suspense } from "react";

function CataloguePageContent() {
    const page = useArticlesPage();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Catalogue & Services"
                description="Gérez votre catalogue de produits et services"
                actions={
                    <Button
                        onClick={page.handleCreateWithLimitCheck}
                        className="cursor-pointer"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter
                    </Button>
                }
            />

            {/* KPI Cards */}
            <ArticleStatsGrid
                stats={page.stats}
                typeFilter={page.typeFilter}
                onTypeFilterToggle={page.handleTypeFilterToggle}
            />

            {/* Indicateur de limite de plan */}
            <Card className="border-black/10">
                <CardHeader>
                    <CardTitle className="text-[16px] font-semibold text-black flex items-center gap-2">
                        <Package
                            className="w-5 h-5 text-black/60"
                            strokeWidth={2}
                        />
                        Utilisation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <LimitIndicator
                        userPlan={page.userPlan}
                        limitKey="maxProducts"
                        currentValue={page.articlesCount}
                        label="Articles"
                        showProgress
                        showUpgradeLink
                    />
                </CardContent>
            </Card>

            {/* Filtres et recherche */}
            <ArticleFiltersBar
                searchTerm={page.searchTerm}
                onSearchChange={page.setSearchTerm}
                selectedCategoryIds={page.selectedCategoryIds}
                onCategoryChange={page.setSelectedCategoryIds}
                sortBy={page.sortBy}
                onSortChange={page.setSortBy}
                sortOptions={ARTICLE_SORT_OPTIONS}
                viewMode={page.viewMode}
                onViewModeChange={page.setViewMode}
            />

            {/* Catalogue en vue grille */}
            {page.viewMode === "grid" && (
                <ArticleGridView
                    articles={page.filteredAndSortedArticles}
                    isLoading={page.isLoading}
                    emptyState={page.emptyState}
                    typeFilter={page.typeFilter}
                    hasNoDataAtAll={page.articles.length === 0}
                    onView={page.handleView}
                    onEdit={page.handleEdit}
                    onDuplicate={page.handleDuplicate}
                    onDelete={page.handleDelete}
                    onCreateClick={page.handleCreate}
                />
            )}

            {/* Catalogue en vue liste */}
            {page.viewMode === "list" && (
                <ArticleListView
                    articles={page.filteredAndSortedArticles}
                    columns={page.columns}
                    isLoading={page.isLoading}
                    emptyMessage={page.emptyState.description}
                />
            )}

            {/* Dialogs */}
            <ArticleDialogs
                createDialogOpen={page.createDialogOpen}
                onCreateDialogChange={page.setCreateDialogOpen}
                onCreateSuccess={page.handleCreateSuccess}
                viewDialogOpen={page.viewDialogOpen}
                onViewDialogChange={page.setViewDialogOpen}
                editDialogOpen={page.editDialogOpen}
                onEditDialogChange={page.setEditDialogOpen}
                onEditSuccess={page.handleEditSuccess}
                deleteDialogOpen={page.deleteDialogOpen}
                onDeleteDialogChange={page.setDeleteDialogOpen}
                onDeleteConfirm={page.confirmDelete}
                isDeleting={page.isDeleting}
                selectedArticle={page.selectedArticle}
            />

            {/* Dialog de limite atteinte géré globalement par le LimitDialogProvider */}
        </div>
    );
}

function CataloguePageFallback() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="h-9 w-60 bg-black/5 rounded-md animate-pulse" />
                    <div className="h-5 w-96 bg-black/5 rounded-md animate-pulse" />
                </div>
                <div className="h-11 w-28 bg-black/5 rounded-md animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="h-24 bg-black/5 rounded-lg animate-pulse"
                    />
                ))}
            </div>
            <div className="h-32 bg-black/5 rounded-lg animate-pulse" />
        </div>
    );
}

export default function CataloguePage() {
    return (
        <Suspense fallback={<CataloguePageFallback />}>
            <CataloguePageContent />
        </Suspense>
    );
}
