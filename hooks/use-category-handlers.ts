import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    buildCategoryTree,
    type CategorieWithCount,
} from "@/lib/types/category";
import { useCategories, useCreateCategorie, useUpdateCategorie, useDeleteCategorie } from "./use-categories";

type Category = CategorieWithCount;

interface CategoryFormData {
    nom: string;
    description: string;
    parentId: string | null;
}

export interface CategoryHandlers {
    // Data
    categories: Category[];
    isLoading: boolean;
    expandedIds: Set<string>;

    // Dialog states
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    editMode: boolean;
    selectedCategory: Category | null;
    categoryToDelete: Category | null;
    isDeleting: boolean;
    isSubmitting: boolean;

    // Form states
    formData: CategoryFormData;
    setFormData: (data: CategoryFormData) => void;
    showExamples: boolean;
    setShowExamples: (show: boolean) => void;

    // Handlers
    openCreateDialog: (parentId?: string | null) => void;
    openEditDialog: (category: Category) => void;
    handleSubmit: () => Promise<void>;
    handleDelete: (category: Category) => void;
    confirmDelete: () => Promise<void>;
    toggleExpand: (id: string) => void;
}

export function useCategoryHandlers(): CategoryHandlers {
    const router = useRouter();

    // React Query hooks
    const { data: categoriesData = [], isLoading } = useCategories();
    const createCategorie = useCreateCategorie();
    const updateCategorie = useUpdateCategorie();
    const deleteCategorie = useDeleteCategorie();

    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [formData, setFormData] = useState<CategoryFormData>({
        nom: "",
        description: "",
        parentId: null,
    });
    const [showExamples, setShowExamples] = useState(false);

    // Build category tree avec useMemo pour performance
    const categories = useMemo(() => buildCategoryTree(categoriesData), [categoriesData]);

    // Expand all categories by default when data loads
    useEffect(() => {
        if (categoriesData.length > 0) {
            const allIds = new Set<string>(categoriesData.map((c) => c.id));
            setExpandedIds(allIds);
        }
    }, [categoriesData]);

    const openCreateDialog = useCallback((parentId: string | null = null) => {
        setEditMode(false);
        setSelectedCategory(null);
        setFormData({
            nom: "",
            description: "",
            parentId,
        });
        setDialogOpen(true);
    }, []);

    const openEditDialog = useCallback((category: Category) => {
        setEditMode(true);
        setSelectedCategory(category);
        setFormData({
            nom: category.nom,
            description: category.description || "",
            parentId: category.parentId || null,
        });
        setDialogOpen(true);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!formData.nom.trim()) return;

        try {
            const categoryData = {
                nom: formData.nom,
                description: formData.description,
                parentId: formData.parentId,
            };

            if (editMode && selectedCategory) {
                await updateCategorie.mutateAsync({
                    id: selectedCategory.id,
                    data: categoryData,
                });
            } else {
                await createCategorie.mutateAsync({ ...categoryData, ordre: 0 });
            }

            const isSubCategory = !!formData.parentId;
            const successMessage = editMode
                ? isSubCategory
                    ? "Sous-catégorie modifiée avec succès"
                    : "Catégorie modifiée avec succès"
                : isSubCategory
                ? "Sous-catégorie créée avec succès"
                : "Catégorie créée avec succès";

            toast.success(successMessage);
            setDialogOpen(false);
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Erreur lors de l'enregistrement"
            );
        }
    }, [formData, editMode, selectedCategory, createCategorie, updateCategorie]);

    const handleDelete = useCallback((category: Category) => {
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!categoryToDelete) return;

        try {
            await deleteCategorie.mutateAsync(categoryToDelete.id);
            toast.success("Catégorie supprimée");
            setDeleteDialogOpen(false);
            setCategoryToDelete(null);
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Erreur lors de la suppression");
        }
    }, [categoryToDelete, deleteCategorie]);

    const toggleExpand = useCallback((id: string) => {
        setExpandedIds(prev => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(id)) {
                newExpanded.delete(id);
            } else {
                newExpanded.add(id);
            }
            return newExpanded;
        });
    }, []);

    return {
        categories,
        isLoading,
        expandedIds,
        dialogOpen,
        setDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        editMode,
        selectedCategory,
        categoryToDelete,
        isDeleting: deleteCategorie.isPending,
        isSubmitting: createCategorie.isPending || updateCategorie.isPending,
        formData,
        setFormData,
        showExamples,
        setShowExamples,
        openCreateDialog,
        openEditDialog,
        handleSubmit,
        handleDelete,
        confirmDelete,
        toggleExpand,
    };
}
