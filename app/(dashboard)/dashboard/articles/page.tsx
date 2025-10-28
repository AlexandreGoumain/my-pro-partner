"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArticleCard } from "@/components/article-card";
import { Filter, Grid, List, Plus, Search } from "lucide-react";
import { useState } from "react";
import { columns, type Article } from "./columns";
import { DataTable } from "./data-table";

// Données mockées pour les articles
const mockArticles: Article[] = [
    {
        id: "1",
        nom: "Chaise de bureau ergonomique",
        reference: "CHA-001",
        prix: 299.99,
        stock: 15,
        seuilAlerte: 5,
        categorie: "Mobilier",
        statut: "ACTIF",
        image: "/api/placeholder/300/200",
        description: "Chaise ergonomique avec support lombaire réglable",
        tva: 20,
    },
    {
        id: "2",
        nom: "Lampe LED design",
        reference: "LAM-002",
        prix: 89.99,
        stock: 8,
        seuilAlerte: 5,
        categorie: "Éclairage",
        statut: "ACTIF",
        image: "/api/placeholder/300/200",
        description: "Lampe LED moderne avec variateur d'intensité",
        tva: 20,
    },
    {
        id: "3",
        nom: "Bureau en bois massif",
        reference: "BUR-003",
        prix: 599.99,
        stock: 3,
        seuilAlerte: 5,
        categorie: "Mobilier",
        statut: "ACTIF",
        image: "/api/placeholder/300/200",
        description: "Bureau en chêne massif avec tiroirs intégrés",
        tva: 20,
    },
    {
        id: "4",
        nom: "Étagère murale flottante",
        reference: "ETG-004",
        prix: 149.99,
        stock: 0,
        seuilAlerte: 5,
        categorie: "Rangement",
        statut: "RUPTURE",
        image: "/api/placeholder/300/200",
        description: "Étagère murale invisible avec fixation dissimulée",
        tva: 20,
    },
    {
        id: "5",
        nom: "Tapis de bureau antifatigue",
        reference: "TAP-005",
        prix: 79.99,
        stock: 25,
        seuilAlerte: 10,
        categorie: "Accessoires",
        statut: "ACTIF",
        image: "/api/placeholder/300/200",
        description: "Tapis ergonomique pour réduire la fatigue",
        tva: 20,
    },
    {
        id: "6",
        nom: "Support moniteur réglable",
        reference: "SUP-006",
        prix: 129.99,
        stock: 12,
        seuilAlerte: 5,
        categorie: "Accessoires",
        statut: "ACTIF",
        image: "/api/placeholder/300/200",
        description: "Support VESA avec réglage en hauteur et inclinaison",
        tva: 20,
    },
    {
        id: "7",
        nom: "Clavier mécanique gaming",
        reference: "CLE-007",
        prix: 159.99,
        stock: 2,
        seuilAlerte: 5,
        categorie: "Équipements",
        statut: "ACTIF",
        image: "/api/placeholder/300/200",
        description: "Clavier mécanique RGB avec switches Cherry MX",
        tva: 20,
    },
    {
        id: "8",
        nom: "Ensemble de tournevis professionnel",
        reference: "TOU-008",
        prix: 89.99,
        stock: 18,
        seuilAlerte: 10,
        categorie: "Outils",
        statut: "ACTIF",
        image: "/api/placeholder/300/200",
        description: "Set complet de 32 tournevis magnétiques",
        tva: 20,
    },
];

const categories = [
    "Toutes",
    "Mobilier",
    "Éclairage",
    "Rangement",
    "Accessoires",
    "Outils",
    "Équipements",
    "Services",
    "Consommables",
];
const sortOptions = [
    "Nom A-Z",
    "Nom Z-A",
    "Prix croissant",
    "Prix décroissant",
    "Stock",
];

export default function CataloguePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Toutes");
    const [sortBy, setSortBy] = useState("Nom A-Z");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Article handlers
    const handleView = (article: Article) => {
        console.log("View article:", article);
        // TODO: Implement view detail modal/page
    };

    const handleEdit = (article: Article) => {
        console.log("Edit article:", article);
        // TODO: Implement edit modal/page
    };

    const handleDuplicate = (article: Article) => {
        console.log("Duplicate article:", article);
        // TODO: Implement duplicate functionality
    };

    const handleDelete = (article: Article) => {
        console.log("Delete article:", article);
        // TODO: Implement delete confirmation modal
    };

    const filteredArticles = mockArticles.filter((article) => {
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Catalogue
                    </h2>
                    <p className="text-muted-foreground">
                        Gérez votre catalogue de produits et services
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter un article
                </Button>
            </div>

            {/* Filtres et recherche - toujours visible */}
            <div className="flex flex-col lg:flex-row gap-4 p-4 bg-muted/20 rounded-lg border border-border/30">
                <div className="flex flex-1 items-center gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par nom, référence ou description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-border/50 bg-background/50"
                            />
                        </div>
                    </div>
                    <div className="flex gap-1 p-1 bg-background/50 rounded-lg border border-border/50">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className="h-8"
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className="h-8"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                    >
                        <SelectTrigger className="w-full sm:w-[180px] border-border/50 bg-background/50">
                            <Filter className="mr-2 h-4 w-4" />
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
                        <SelectTrigger className="w-full sm:w-[180px] border-border/50 bg-background/50">
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
                    {filteredArticles.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredArticles.map((article) => (
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
                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                <div className="rounded-full bg-muted p-6">
                                    <Search className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold">
                                        Aucun article trouvé
                                    </h3>
                                    <p className="text-muted-foreground max-w-md">
                                        Aucun article ne correspond à vos critères de recherche.
                                        Essayez de modifier vos filtres ou ajoutez un nouvel article.
                                    </p>
                                </div>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Ajouter un article
                                </Button>
                            </div>
                        </Card>
                    )}
                </>
            )}

            {/* Catalogue en vue table */}
            {viewMode === "list" && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                            Liste des articles
                        </h3>
                    </div>
                    <Card className="border-border/50 bg-background/50 shadow-sm">
                        <CardContent className="p-0">
                            <DataTable
                                columns={columns}
                                data={filteredArticles}
                            />
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
