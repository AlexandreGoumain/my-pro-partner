"use client";

import { ArticleCard } from "@/components/article-card";
import { ArticleCreateDialog } from "@/components/article-create-dialog";
import { ArticleEditDialog } from "@/components/article-edit-dialog";
import { ArticleViewDialog } from "@/components/article-view-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { ArticleCardSkeleton, TableSkeleton } from "@/components/skeletons";
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
import { Filter, Grid, List, Plus, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { createColumns, type Article } from "./columns";
import { DataTable } from "./data-table";
import {
    useArticles,
    useDeleteArticle,
    useDuplicateArticle,
} from "@/hooks/use-articles";

// Options de filtrage et tri (à terme, categories sera dynamique depuis l'API)
const categories = ["Toutes", "Mobilier", "Éclairage", "Rangement", "Accessoires", "Outils", "Équipements", "Services", "Consommables"];
const sortOptions = ["Nom A-Z", "Nom Z-A", "Prix croissant", "Prix décroissant", "Stock"];

export default function CataloguePage() {
    // React Query hooks
    const { data: articles = [], isLoading } = useArticles();
    const duplicateArticle = useDuplicateArticle();
    const deleteArticle = useDeleteArticle();

    // UI states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Toutes");
    const [sortBy, setSortBy] = useState("Nom A-Z");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
        setSelectedArticle(article);
        setViewDialogOpen(true);
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

    // Filtrer et trier les articles
    const filteredAndSortedArticles = useMemo(() => {
        // Filtrage
        const filtered = articles.filter((article) => {
            const matchesSearch =
                article.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.reference
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                article.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            const matchesCategory =
                selectedCategory === "Toutes" ||
                article.categorie === selectedCategory;
            return matchesSearch && matchesCategory;
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
    }, [articles, searchTerm, selectedCategory, sortBy]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Catalogue</h2>
                    <p className="text-muted-foreground">
                        Gérez votre catalogue de produits et services
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un article
                </Button>
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
                    <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                                <div className="rounded-full bg-muted p-6">
                                    <Search className="w-12 h-12 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        Aucun article trouvé
                                    </h3>
                                    <p className="text-muted-foreground max-w-md">
                                        Aucun article ne correspond à vos
                                        critères de recherche. Essayez de
                                        modifier vos filtres ou ajoutez un
                                        nouvel article.
                                    </p>
                                </div>
                                <Button onClick={handleCreate}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Ajouter un article
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
                        <DataTable columns={columns} data={filteredAndSortedArticles} />
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
