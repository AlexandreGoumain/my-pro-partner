"use client";

import { CategoriesList } from "@/components/categories-list";
import { CategoryCreateDialog } from "@/components/category-create-dialog";
import { CategoryEditDialog } from "@/components/category-edit-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCategories, type Categorie } from "@/hooks/use-categories";
import { Folder, FolderPlus, Layers, Package, Search } from "lucide-react";
import { useState } from "react";

export default function CategoriesPage() {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedCategorie, setSelectedCategorie] =
        useState<Categorie | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data: categories = [], isLoading } = useCategories();

    // Filtrer les catégories selon la recherche
    const filteredCategories = categories.filter((cat) =>
        cat.nom.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculer les statistiques
    const totalCategories = categories.length;
    const rootCategories = categories.filter((cat) => !cat.parentId).length;
    const subCategories = totalCategories - rootCategories;
    const totalArticles = categories.reduce(
        (acc, cat) => acc + cat.articles.length,
        0
    );

    const handleEdit = (categorie: Categorie) => {
        setSelectedCategorie(categorie);
        setEditDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Catégories d&apos;articles
                    </h1>
                    <p className="text-muted-foreground">
                        Organisez vos articles en catégories et sous-catégories
                    </p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Nouvelle catégorie
                </Button>
            </div>

            {/* Statistiques */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total catégories
                        </CardTitle>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalCategories}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Toutes les catégories
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Catégories racines
                        </CardTitle>
                        <Folder className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {rootCategories}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Catégories principales
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Sous-catégories
                        </CardTitle>
                        <Folder className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {subCategories}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Catégories imbriquées
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Articles catégorisés
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalArticles}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Articles avec catégorie
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Barre de recherche */}
            <Card>
                <CardHeader>
                    <CardTitle>Rechercher une catégorie</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher par nom..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Liste des catégories */}
            <CategoriesList
                categories={filteredCategories}
                onEdit={handleEdit}
                isLoading={isLoading}
            />

            {/* Dialogs */}
            <CategoryCreateDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={() => setCreateDialogOpen(false)}
            />

            <CategoryEditDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                categorie={selectedCategorie}
                onSuccess={() => {
                    setEditDialogOpen(false);
                    setSelectedCategorie(null);
                }}
            />
        </div>
    );
}
