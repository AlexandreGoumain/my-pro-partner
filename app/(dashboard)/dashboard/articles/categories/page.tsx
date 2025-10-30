"use client";

import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
    buildCategoryTree,
    type CategorieWithCount,
} from "@/lib/types/category";
import {
    ArrowLeft,
    ChevronDown,
    ChevronRight,
    Edit,
    Folder,
    FolderOpen,
    FolderTree,
    GripVertical,
    Info,
    Lightbulb,
    Plus,
    Sparkles,
    Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Category = CategorieWithCount;

const CATEGORY_EXAMPLES = [
    {
        title: "Exemple pour un plombier",
        categories: [
            {
                name: "Plomberie",
                children: ["Installation", "Réparation", "Maintenance"],
            },
            { name: "Sanitaires", children: ["Lavabos", "Douches", "WC"] },
        ],
    },
    {
        title: "Exemple pour un électricien",
        categories: [
            {
                name: "Électricité",
                children: ["Installation", "Dépannage", "Mise aux normes"],
            },
            {
                name: "Matériel",
                children: ["Câbles", "Disjoncteurs", "Prises"],
            },
        ],
    },
    {
        title: "Exemple pour un artisan général",
        categories: [
            {
                name: "Services",
                children: ["Installation", "Réparation", "Conseil"],
            },
            {
                name: "Produits",
                children: ["Matériaux", "Outils", "Fournitures"],
            },
        ],
    },
];

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    );
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
        null
    );
    const [isDeleting, setIsDeleting] = useState(false);
    const [formData, setFormData] = useState({
        nom: "",
        description: "",
        parentId: null as string | null,
    });
    const [showExamples, setShowExamples] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            setIsLoading(true);
            const response = await fetch("/api/categories");
            if (response.ok) {
                const data = await response.json();
                setCategories(buildCategoryTree(data));
                // Auto-expand all categories
                const allIds = new Set<string>(data.map((c: Category) => c.id));
                setExpandedIds(allIds);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Erreur lors du chargement");
        } finally {
            setIsLoading(false);
        }
    }

    function openCreateDialog(parentId: string | null = null) {
        setEditMode(false);
        setSelectedCategory(null);
        setFormData({ nom: "", description: "", parentId });
        setDialogOpen(true);
    }

    function openEditDialog(category: Category) {
        setEditMode(true);
        setSelectedCategory(category);
        setFormData({
            nom: category.nom,
            description: category.description || "",
            parentId: category.parentId || null,
        });
        setDialogOpen(true);
    }

    async function handleSubmit() {
        if (!formData.nom.trim()) return;

        try {
            const url =
                editMode && selectedCategory
                    ? `/api/categories/${selectedCategory.id}`
                    : "/api/categories";

            const response = await fetch(url, {
                method: editMode ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(
                    editMode ? "Catégorie modifiée" : "Catégorie créée"
                );
                setDialogOpen(false);
                fetchCategories();
            }
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error("Erreur lors de l'enregistrement");
        }
    }

    function handleDelete(category: Category) {
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    }

    async function confirmDelete() {
        if (!categoryToDelete) return;

        try {
            setIsDeleting(true);
            const response = await fetch(
                `/api/categories/${categoryToDelete.id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                toast.success("Catégorie supprimée");
                setDeleteDialogOpen(false);
                setCategoryToDelete(null);
                fetchCategories();
            } else {
                const error = await response.json();
                toast.error(error.message || "Erreur lors de la suppression");
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Erreur lors de la suppression");
        } finally {
            setIsDeleting(false);
        }
    }

    function toggleExpand(id: string) {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedIds(newExpanded);
    }

    function CategoryNode({
        category,
        level = 0,
    }: {
        category: Category;
        level?: number;
    }) {
        const hasChildren = category.enfants && category.enfants.length > 0;
        const isExpanded = expandedIds.has(category.id);
        const articleCount = category._count?.articles || 0;

        return (
            <div className="select-none">
                <div
                    className={`flex items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors group ${
                        level === 0 ? "bg-muted/30" : ""
                    }`}
                    style={{ marginLeft: `${level * 24}px` }}
                >
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />

                    {hasChildren ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleExpand(category.id)}
                        >
                            {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                    ) : (
                        <div className="w-6" />
                    )}

                    <div
                        className={`flex items-center gap-2 ${
                            level === 0
                                ? "text-primary"
                                : "text-muted-foreground"
                        }`}
                    >
                        {isExpanded ? (
                            <FolderOpen className="h-5 w-5" />
                        ) : (
                            <Folder className="h-5 w-5" />
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span
                                className={`font-medium ${
                                    level === 0 ? "text-base" : "text-sm"
                                }`}
                            >
                                {category.nom}
                            </span>
                            {articleCount > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                    {articleCount}
                                </Badge>
                            )}
                            {level === 0 && hasChildren && (
                                <Badge variant="outline" className="text-xs">
                                    {category.enfants?.length} sous-cat.
                                </Badge>
                            )}
                        </div>
                        {category.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {category.description}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Bouton pour créer une sous-catégorie - uniquement pour les catégories principales */}
                        {level === 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openCreateDialog(category.id)}
                                title="Créer une sous-catégorie"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(category)}
                            title="Modifier"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category)}
                            title="Supprimer"
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                </div>

                {isExpanded && hasChildren && (
                    <div className="mt-1">
                        {category.enfants?.map((child) => (
                            <CategoryNode
                                key={child.id}
                                category={child}
                                level={level + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    const rootCategories = categories;
    const totalCategories = categories.reduce(
        (acc, cat) => acc + 1 + (cat.enfants?.length || 0),
        0
    );

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Button
                        variant="default"
                        onClick={() => router.push("/dashboard/articles")}
                        className="gap-2 -ml-2 mb-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour au catalogue
                    </Button>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FolderTree className="h-8 w-8 text-primary" />
                        Organisation des catégories
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Créez une hiérarchie claire pour mieux ranger vos
                        produits et services
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowExamples(!showExamples)}
                    >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {showExamples ? "Masquer" : "Voir"} exemples
                    </Button>
                    <Button onClick={() => openCreateDialog()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle catégorie
                    </Button>
                </div>
            </div>

            {/* Examples Card */}
            {showExamples && (
                <Card className="border-purple-200 bg-purple-50/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            Exemples d&apos;organisation
                        </CardTitle>
                        <CardDescription>
                            Inspirez-vous de ces exemples pour organiser votre
                            catalogue (catégories principales et
                            sous-catégories)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {CATEGORY_EXAMPLES.map((example, idx) => (
                                <div key={idx} className="space-y-3">
                                    <p className="font-semibold text-sm">
                                        {example.title}
                                    </p>
                                    {example.categories.map((cat, catIdx) => (
                                        <div key={catIdx} className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Folder className="h-4 w-4 text-primary" />
                                                {cat.name}
                                            </div>
                                            <div className="ml-6 space-y-1">
                                                {cat.children.map(
                                                    (child, childIdx) => (
                                                        <div
                                                            key={childIdx}
                                                            className="flex items-center gap-2 text-xs text-muted-foreground"
                                                        >
                                                            <ChevronRight className="h-3 w-3" />
                                                            {child}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Info Card */}
            <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="p-4">
                    <div className="flex gap-3">
                        <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-blue-900 mb-1">
                                Comment ça marche ?
                            </p>
                            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                                <li>
                                    <strong>Catégorie principale</strong> : Par
                                    exemple "Plomberie" ou "Services"
                                </li>
                                <li>
                                    <strong>Sous-catégorie</strong> : Cliquez
                                    sur le + à droite d'une catégorie pour créer
                                    une sous-catégorie (ex: "Installation" sous
                                    "Plomberie")
                                </li>
                                <li>
                                    Survolez une catégorie pour voir les actions
                                    disponibles
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total catégories
                                </p>
                                <p className="text-3xl font-bold">
                                    {totalCategories}
                                </p>
                            </div>
                            <FolderTree className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Catégories principales
                                </p>
                                <p className="text-3xl font-bold">
                                    {rootCategories.length}
                                </p>
                            </div>
                            <Folder className="h-8 w-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Sous-catégories
                                </p>
                                <p className="text-3xl font-bold">
                                    {totalCategories - rootCategories.length}
                                </p>
                            </div>
                            <ChevronRight className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tree View */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FolderTree className="h-5 w-5" />
                        Votre organisation
                        <Badge
                            variant="secondary"
                            className="text-xs font-normal"
                        >
                            2 niveaux max
                        </Badge>
                    </CardTitle>
                    <CardDescription>
                        Cliquez sur les flèches pour déplier/replier • Survolez
                        pour voir les actions • Catégories et sous-catégories
                        uniquement
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-14 bg-muted animate-pulse rounded-lg"
                                />
                            ))}
                        </div>
                    ) : rootCategories.length === 0 ? (
                        <div className="text-center py-16">
                            <FolderTree className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">
                                Commencez votre organisation
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                Créez votre première catégorie principale pour
                                commencer à organiser vos produits et services
                            </p>
                            <Button
                                onClick={() => openCreateDialog()}
                                size="lg"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Créer ma première catégorie
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {rootCategories.map((category) => (
                                <CategoryNode
                                    key={category.id}
                                    category={category}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            {editMode ? "Modifier" : "Créer"}{" "}
                            {formData.parentId
                                ? "une sous-catégorie"
                                : "une catégorie"}
                        </DialogTitle>
                        <DialogDescription>
                            {formData.parentId ? (
                                <span className="flex items-center gap-1">
                                    Cette sous-catégorie sera rangée dans la
                                    catégorie parente. La hiérarchie est limitée
                                    à 2 niveaux.
                                </span>
                            ) : (
                                "Cette catégorie sera une catégorie principale. Vous pourrez ensuite créer des sous-catégories."
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {formData.parentId && (
                            <Card className="bg-muted/50">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Info className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                            Sous-catégorie de :{" "}
                                            <strong>
                                                {
                                                    categories.find(
                                                        (c) =>
                                                            c.id ===
                                                            formData.parentId
                                                    )?.nom
                                                }
                                            </strong>
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="nom" className="text-base">
                                Nom de la catégorie *
                            </Label>
                            <Input
                                id="nom"
                                placeholder={
                                    formData.parentId
                                        ? "Ex: Installation, Réparation..."
                                        : "Ex: Plomberie, Services, Matériaux..."
                                }
                                value={formData.nom}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        nom: e.target.value,
                                    })
                                }
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "Enter" &&
                                        formData.nom.trim()
                                    ) {
                                        handleSubmit();
                                    }
                                }}
                                autoFocus
                                className="text-base"
                            />
                            <p className="text-xs text-muted-foreground">
                                Choisissez un nom court et clair
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-base">
                                Description (optionnel)
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Une courte description pour vous aider à vous souvenir..."
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                rows={3}
                                className="resize-none"
                            />
                        </div>

                        <Separator />

                        <Card className="border-amber-200 bg-amber-50/50">
                            <CardContent className="p-4">
                                <div className="flex gap-3">
                                    <Lightbulb className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-medium text-amber-900 mb-1">
                                            Conseil
                                        </p>
                                        <p className="text-amber-700">
                                            Créez d'abord vos catégories
                                            principales, puis ajoutez des
                                            sous-catégories si besoin. Vous
                                            pourrez toujours modifier plus tard
                                            !
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!formData.nom.trim()}
                            size="lg"
                        >
                            {editMode ? "Enregistrer" : "Créer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
                title={
                    categoryToDelete?.parentId
                        ? "Supprimer la sous-catégorie"
                        : "Supprimer la catégorie"
                }
                description={
                    categoryToDelete
                        ? `Êtes-vous sûr de vouloir supprimer ${
                              categoryToDelete.parentId
                                  ? "la sous-catégorie"
                                  : "la catégorie"
                          } "${
                              categoryToDelete.nom
                          }" ? Cette action est irréversible.`
                        : ""
                }
            />
        </div>
    );
}
