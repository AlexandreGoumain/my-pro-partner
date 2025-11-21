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
import { SuspensePage } from "@/components/ui/suspense-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsageLimitCard } from "@/components/ui/usage-limit-card";
import { useArticlesPage } from "@/hooks/use-articles-page";
import { ARTICLE_SORT_OPTIONS } from "@/lib/constants/article-sort-options";
import { ArticleType } from "@/lib/generated/prisma/client";
import { Package, Plus, RotateCcw, Settings2, Wrench } from "lucide-react";
import Link from "next/link";

function CataloguePageContent() {
    const page = useArticlesPage();

    // Map active tab to type filter
    const activeTab = page.typeFilter === "TOUS" ? "all" : page.typeFilter;

    const handleTabChange = (value: string) => {
        if (value === "all") {
            page.setTypeFilter("TOUS");
        } else {
            page.setTypeFilter(value as ArticleType);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Catalogue"
                description="Gérez tous vos articles, services, et pièces détachées"
                actions={
                    <div className="flex gap-3">
                        <Link href="/dashboard/catalogue/categories">
                            <Button
                                variant="outline"
                                className="border-black/10 hover:bg-black/5"
                            >
                                <Settings2
                                    className="h-4 w-4 mr-2"
                                    strokeWidth={2}
                                />
                                Catégories
                            </Button>
                        </Link>
                        <Button
                            onClick={page.handleCreateWithLimitCheck}
                            className="bg-black hover:bg-black/90 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Nouvel article
                        </Button>
                    </div>
                }
            />

            {/* Tabs par type (UX INFORMATIQUE) */}
            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="space-y-6"
            >
                <TabsList className="bg-black/5 p-1">
                    <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-white data-[state=active]:text-black text-[14px]"
                    >
                        <Package className="h-4 w-4 mr-2" strokeWidth={2} />
                        Tous
                    </TabsTrigger>
                    <TabsTrigger
                        value="PRODUIT"
                        className="data-[state=active]:bg-white data-[state=active]:text-black text-[14px]"
                    >
                        <Package className="h-4 w-4 mr-2" strokeWidth={2} />
                        Produits neufs
                    </TabsTrigger>
                    <TabsTrigger
                        value="SERVICE"
                        className="data-[state=active]:bg-white data-[state=active]:text-black text-[14px]"
                    >
                        <Settings2 className="h-4 w-4 mr-2" strokeWidth={2} />
                        Services
                    </TabsTrigger>
                    <TabsTrigger
                        value="OCCASION"
                        className="data-[state=active]:bg-white data-[state=active]:text-black text-[14px]"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" strokeWidth={2} />
                        Occasion
                    </TabsTrigger>
                    <TabsTrigger
                        value="PIECE"
                        className="data-[state=active]:bg-white data-[state=active]:text-black text-[14px]"
                    >
                        <Wrench className="h-4 w-4 mr-2" strokeWidth={2} />
                        Pièces détachées
                    </TabsTrigger>
                </TabsList>

                {/* Content for all tabs */}
                <TabsContent value={activeTab} className="space-y-6">
                    {/* KPI Cards */}
                    <ArticleStatsGrid
                        stats={page.stats}
                        typeFilter={page.typeFilter}
                        onTypeFilterToggle={page.handleTypeFilterToggle}
                    />

                    <UsageLimitCard
                        userPlan={page.userPlan}
                        limitKey="maxProducts"
                        currentValue={page.articlesCount}
                        label="Articles"
                        icon={Package}
                    />

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
                        onViewModeChange={page.handleViewModeChange}
                    />

                    {/* Catalogue en vue grille */}
                    {page.viewMode === "grid" && (
                        <ArticleGridView
                            articles={page.filteredAndSortedArticles}
                            isLoading={page.isLoading}
                            emptyState={page.emptyState}
                            typeFilter={page.typeFilter}
                            hasNoDataAtAll={page.articles.length === 0}
                            pagination={page.pagination}
                            showPagination={page.showPagination}
                            onView={page.handleView}
                            onEdit={page.handleEdit}
                            onDuplicate={page.handleDuplicate}
                            onDelete={page.handleDelete}
                            onCreateClick={page.handleCreate}
                            onPageChange={page.handlePageChange}
                            onPageSizeChange={page.handlePageSizeChange}
                        />
                    )}

                    {/* Catalogue en vue liste */}
                    {page.viewMode === "list" && (
                        <ArticleListView
                            articles={page.filteredAndSortedArticles}
                            columns={page.columns}
                            isLoading={page.isLoading}
                            emptyMessage={page.emptyState.description}
                            pagination={page.pagination}
                            onPageChange={page.handlePageChange}
                            onPageSizeChange={page.handlePageSizeChange}
                        />
                    )}
                </TabsContent>
            </Tabs>

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
        </div>
    );
}

export default function CataloguePage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "stats",
                headerActionsCount: 2,
                statsCount: 5,
                statsHeight: "h-24",
            }}
        >
            <CataloguePageContent />
        </SuspensePage>
    );
}
