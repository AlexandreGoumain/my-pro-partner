"use client";

import { ArticleCard } from "@/components/article-card";
import { ArticleCreateDialog } from "@/components/article-create-dialog";
import { ArticleEditDialog } from "@/components/article-edit-dialog";
import { ArticleViewDialog } from "@/components/article-view-dialog";
import { CategoryFilter } from "@/components/category-filter";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { ArticleCardSkeleton, TableSkeleton } from "@/components/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    useArticles,
    useDeleteArticle,
    useDuplicateArticle,
} from "@/hooks/use-articles";
import { useCategories } from "@/hooks/use-categories";
import { expandCategoryIds } from "@/lib/types/category";
import {
    AlertCircle,
    Briefcase,
    Grid,
    List,
    Package,
    Plus,
    Search,
    ShoppingBag,
    TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { createColumns, type Article } from "./_components/data-table/columns";
import { DataTable } from "./_components/data-table";

const sortOptions = [
    "Nom A-Z",
    "Nom Z-A",
    "Prix croissant",
    "Prix décroissant",
    "Stock",
];

export default function CataloguePage() {
    // Hooks
    const router = useRouter();

    // React Query hooks
    const { data: articles = [], isLoading } = useArticles();
    const { data: categories = [] } = useCategories();
    const duplicateArticle = useDuplicateArticle();
    const deleteArticle = useDeleteArticle();

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

    // Modal states
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(
        null
    );

    // Article handlers
    const handleCreate = useCallback(() => {
        setCreateDialogOpen(true);
    }, []);

    const handleCreateSuccess = useCallback(() => {
        toast.success("Article créé", {
            description: "L'article a été créé avec succès",
        });
        // React Query invalide automatiquement le cache
    }, []);

    const handleView = useCallback((article: Article) => {
        router.push(`/dashboard/articles/${article.id}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEdit = useCallback((article: Article) => {
        setSelectedArticle(article);
        setEditDialogOpen(true);
    }, []);

    const handleDuplicate = useCallback(
        (article: Article) => {
            duplicateArticle.mutate(article, {
                onSuccess: () => {
                    toast.success("Article dupliqué", {
                        description: "L'article a été dupliqué avec succès",
                    });
                },
                onError: (error) => {
                    toast.error("Erreur", {
                        description:
                            error instanceof Error
                                ? error.message
                                : "Impossible de dupliquer l'article",
                    });
                },
            });
        },
        [duplicateArticle]
    );

    const handleDelete = useCallback((article: Article) => {
        setSelectedArticle(article);
        setDeleteDialogOpen(true);
    }, []);

    const confirmDelete = useCallback(() => {
        if (!selectedArticle) return;

        deleteArticle.mutate(selectedArticle.id, {
            onSuccess: () => {
                toast.success("Article supprimé", {
                    description: "L'article a été supprimé avec succès",
                });
                setDeleteDialogOpen(false);
                setSelectedArticle(null);
            },
            onError: (error) => {
                toast.error("Erreur", {
                    description:
                        error instanceof Error
                            ? error.message
                            : "Impossible de supprimer l'article",
                });
            },
        });
    }, [selectedArticle, deleteArticle]);

    const handleEditSuccess = useCallback(() => {
        toast.success("Article modifié", {
            description: "L'article a été modifié avec succès",
        });
        // React Query invalide automatiquement le cache
    }, []);

    // Create columns with handlers
    const columns = useMemo(
        () =>
            createColumns({
                onView: handleView,
                onEdit: handleEdit,
                onDuplicate: handleDuplicate,
                onDelete: handleDelete,
            }),
        [handleView, handleEdit, handleDuplicate, handleDelete]
    );

    // Filter handlers with toggle functionality
    const handleTypeFilterToggle = useCallback((type: "TOUS" | "PRODUIT" | "SERVICE") => {
        if (typeFilter === type && type !== "TOUS") {
            setTypeFilter("TOUS");
        } else {
            setTypeFilter(type);
        }
    }, [typeFilter]);

    // Statistiques par type
    const stats = useMemo(() => {
        const produits = articles.filter(
            (a) =>
                !(a as Article & { type?: string }).type ||
                (a as Article & { type?: string }).type === "PRODUIT"
        );
        const services = articles.filter(
            (a) => (a as Article & { type?: string }).type === "SERVICE"
        );

        return {
            total: articles.length,
            produits: produits.length,
            services: services.length,
            actifs: articles.filter((a) => a.statut === "ACTIF").length,
            stockFaible: articles.filter(
                (a) =>
                    a.stock <=
                        (a as Article & { seuilAlerte?: number }).seuilAlerte &&
                    (!(a as Article & { type?: string }).type ||
                        (a as Article & { type?: string }).type === "PRODUIT")
            ).length,
        };
    }, [articles]);

    // Obtenir tous les IDs de catégories incluant les enfants
    const getAllCategoryIds = useMemo(() => {
        return expandCategoryIds(selectedCategoryIds, categories);
    }, [selectedCategoryIds, categories]);

    // Filtrer et trier les articles
    const filteredAndSortedArticles = useMemo(() => {
        // Filtrage
        const filtered = articles.filter((article) => {
            const articleWithType = article as Article & {
                type?: string;
                categorieId?: string;
            };
            const matchesSearch =
                article.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.reference
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                article.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            const matchesCategory =
                selectedCategoryIds.length === 0 ||
                (articleWithType.categorieId &&
                    getAllCategoryIds.includes(articleWithType.categorieId));
            const matchesType =
                typeFilter === "TOUS" ||
                (typeFilter === "PRODUIT" &&
                    (!articleWithType.type ||
                        articleWithType.type === "PRODUIT")) ||
                (typeFilter === "SERVICE" &&
                    articleWithType.type === "SERVICE");
            return matchesSearch && matchesCategory && matchesType;
        });

        // Tri
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "Nom A-Z":
                    return a.nom.localeCompare(b.nom);
                case "Nom Z-A":
                    return b.nom.localeCompare(a.nom);
                case "Prix croissant":
                    return a.prix - b.prix;
                case "Prix décroissant":
                    return b.prix - a.prix;
                case "Stock":
                    return a.stock - b.stock;
                default:
                    return 0;
            }
        });

        return sorted;
    }, [
        articles,
        searchTerm,
        selectedCategoryIds,
        getAllCategoryIds,
        sortBy,
        typeFilter,
    ]);

    // Messages d'état vide personnalisés
    const getEmptyStateMessage = () => {
        // Si vraiment aucune donnée du tout et filtre sur "TOUS"
        const hasNoDataAtAll = articles.length === 0;

        if (typeFilter === "PRODUIT") {
            return {
                title: "Aucun produit trouvé",
                description:
                    "Aucun produit ne correspond à vos critères. Essayez de modifier vos filtres ou ajoutez un nouveau produit.",
                buttonText: "Ajouter un produit",
                icon: Package,
            };
        } else if (typeFilter === "SERVICE") {
            return {
                title: "Aucun service trouvé",
                description:
                    "Aucun service ne correspond à vos critères. Essayez de modifier vos filtres ou ajoutez un nouveau service.",
                buttonText: "Ajouter un service",
                icon: Briefcase,
            };
        } else if (typeFilter === "TOUS" && hasNoDataAtAll) {
            // Cas spécial : vraiment aucune donnée
            return {
                title: "Commencez votre catalogue",
                description:
                    "Vous n'avez pas encore de produits ni de services. Créez votre premier article pour commencer à gérer votre activité.",
                buttonText: "Créer mon premier article",
                icon: ShoppingBag,
            };
        } else {
            // Filtre actif mais pas de résultats
            return {
                title: "Aucun article trouvé",
                description:
                    "Aucun article ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou ajoutez un nouvel article.",
                buttonText: "Ajouter un article",
                icon: Search,
            };
        }
    };

    const emptyState = getEmptyStateMessage();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Catalogue & Services</h2>
                    <p className="text-muted-foreground">
                        Gérez votre catalogue de produits et services
                    </p>
                </div>
                <Button onClick={handleCreate} className="cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card
                    className={`cursor-pointer hover:border-primary transition-colors ${
                        typeFilter === "TOUS"
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : ""
                    }`}
                    onClick={() => handleTypeFilterToggle("TOUS")}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Total
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.total}
                                </p>
                            </div>
                            <ShoppingBag
                                className={`h-8 w-8 ${
                                    typeFilter === "TOUS"
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                }`}
                            />
                        </div>
                    </div>
                </Card>

                <Card
                    className={`cursor-pointer hover:border-blue-500 transition-colors ${
                        typeFilter === "PRODUIT"
                            ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20"
                            : ""
                    }`}
                    onClick={() => handleTypeFilterToggle("PRODUIT")}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                    <Package className="h-4 w-4 text-blue-600" />
                                    Produits
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.produits}
                                </p>
                            </div>
                            <Badge
                                variant="outline"
                                className="bg-blue-100 text-blue-700 border-blue-300"
                            >
                                {stats.total > 0
                                    ? (
                                          (stats.produits / stats.total) *
                                          100
                                      ).toFixed(0)
                                    : 0}
                                %
                            </Badge>
                        </div>
                    </div>
                </Card>

                <Card
                    className={`cursor-pointer hover:border-purple-500 transition-colors ${
                        typeFilter === "SERVICE"
                            ? "border-purple-500 bg-purple-50/50 ring-2 ring-purple-500/20"
                            : ""
                    }`}
                    onClick={() => handleTypeFilterToggle("SERVICE")}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                    <Briefcase className="h-4 w-4 text-purple-600" />
                                    Services
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.services}
                                </p>
                            </div>
                            <Badge
                                variant="outline"
                                className="bg-purple-100 text-purple-700 border-purple-300"
                            >
                                {stats.total > 0
                                    ? (
                                          (stats.services / stats.total) *
                                          100
                                      ).toFixed(0)
                                    : 0}
                                %
                            </Badge>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                    Actifs
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.actifs}
                                </p>
                            </div>
                            <Badge
                                variant="outline"
                                className="bg-green-100 text-green-700 border-green-300"
                            >
                                {stats.total > 0
                                    ? (
                                          (stats.actifs / stats.total) *
                                          100
                                      ).toFixed(0)
                                    : 0}
                                %
                            </Badge>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                    <AlertCircle className="h-4 w-4 text-amber-600" />
                                    Stock faible
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.stockFaible}
                                </p>
                            </div>
                            {stats.stockFaible > 0 && (
                                <Badge
                                    variant="outline"
                                    className="bg-amber-100 text-amber-700 border-amber-300"
                                >
                                    Alerte
                                </Badge>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filtres et recherche */}
            <div className="flex flex-col lg:flex-row gap-4 p-4 bg-muted/30 rounded-lg border">
                <div className="flex flex-1 items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher par nom, référence ou description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-1 p-1 bg-background rounded-lg border">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <CategoryFilter
                        selectedCategoryIds={selectedCategoryIds}
                        onSelectionChange={setSelectedCategoryIds}
                    />
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Trier par" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Catalogue en vue grille */}
            {viewMode === "grid" && (
                <>
                    {isLoading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <ArticleCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredAndSortedArticles.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredAndSortedArticles.map((article) => (
                                <ArticleCard
                                    key={article.id}
                                    article={article}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onDuplicate={handleDuplicate}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card className="p-12">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div
                                    className={`rounded-full p-6 ${
                                        typeFilter === "PRODUIT"
                                            ? "bg-blue-100"
                                            : typeFilter === "SERVICE"
                                            ? "bg-purple-100"
                                            : articles.length === 0
                                            ? "bg-primary/10"
                                            : "bg-muted"
                                    }`}
                                >
                                    {(() => {
                                        const Icon = emptyState.icon;
                                        return (
                                            <Icon
                                                className={`w-12 h-12 ${
                                                    typeFilter === "PRODUIT"
                                                        ? "text-blue-600"
                                                        : typeFilter ===
                                                          "SERVICE"
                                                        ? "text-purple-600"
                                                        : articles.length === 0
                                                        ? "text-primary"
                                                        : "text-muted-foreground"
                                                }`}
                                            />
                                        );
                                    })()}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        {emptyState.title}
                                    </h3>
                                    <p className="text-muted-foreground max-w-md">
                                        {emptyState.description}
                                    </p>
                                </div>
                                <Button
                                    onClick={handleCreate}
                                    size={
                                        articles.length === 0 ? "lg" : "default"
                                    }
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    {emptyState.buttonText}
                                </Button>
                            </div>
                        </Card>
                    )}
                </>
            )}

            {/* Catalogue en vue liste */}
            {viewMode === "list" && (
                <>
                    {isLoading ? (
                        <TableSkeleton rows={8} columns={6} />
                    ) : (
                        <DataTable
                            columns={columns}
                            data={filteredAndSortedArticles}
                            emptyMessage={emptyState.description}
                        />
                    )}
                </>
            )}

            {/* Dialogs */}
            <ArticleCreateDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={handleCreateSuccess}
            />

            <ArticleViewDialog
                article={selectedArticle}
                open={viewDialogOpen}
                onOpenChange={setViewDialogOpen}
            />

            <ArticleEditDialog
                article={selectedArticle}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSuccess={handleEditSuccess}
            />

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                isLoading={deleteArticle.isPending}
                title="Supprimer l'article"
                description={`Êtes-vous sûr de vouloir supprimer l'article "${selectedArticle?.nom}" ? Cette action est irréversible.`}
            />
        </div>
    );
}
