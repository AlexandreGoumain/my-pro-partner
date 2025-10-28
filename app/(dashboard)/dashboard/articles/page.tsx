"use client";

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
import { ArticleCard } from "@/components/article-card";
import { ArticleCardSkeleton, TableSkeleton } from "@/components/skeletons";
import { mapArticleToDisplay } from "@/lib/types/article";
import { Filter, Grid, List, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { columns, type Article } from "./columns";
import { DataTable } from "./data-table";

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
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Toutes");
    const [sortBy, setSortBy] = useState("Nom A-Z");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Fetch articles from API
    useEffect(() => {
        async function fetchArticles() {
            try {
                setIsLoading(true);
                const response = await fetch("/api/articles");

                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des articles");
                }

                const result = await response.json();
                // Handle both paginated and non-paginated responses
                const data = result.data || result;
                const mappedArticles = data.map(mapArticleToDisplay);
                setArticles(mappedArticles);
            } catch (err) {
                console.error("Error fetching articles:", err);
                setArticles(mockArticles); // Fallback to mock data
            } finally {
                setIsLoading(false);
            }
        }

        fetchArticles();
    }, []);

    // Article handlers
    const handleView = (article: Article) => {
        console.log("View article:", article);
    };

    const handleEdit = (article: Article) => {
        console.log("Edit article:", article);
    };

    const handleDuplicate = (article: Article) => {
        console.log("Duplicate article:", article);
    };

    const handleDelete = (article: Article) => {
        console.log("Delete article:", article);
    };

    const filteredArticles = articles.filter((article) => {
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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Catalogue</h2>
                    <p className="text-muted-foreground">
                        Gérez votre catalogue de produits et services
                    </p>
                </div>
                <Button>
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
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
                    ) : filteredArticles.length > 0 ? (
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
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="rounded-full bg-muted p-6">
                                    <Search className="w-12 h-12 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        Aucun article trouvé
                                    </h3>
                                    <p className="text-muted-foreground max-w-md">
                                        Aucun article ne correspond à vos critères de recherche.
                                        Essayez de modifier vos filtres ou ajoutez un nouvel article.
                                    </p>
                                </div>
                                <Button>
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
                        <DataTable columns={columns} data={filteredArticles} />
                    )}
                </>
            )}
        </div>
    );
}
