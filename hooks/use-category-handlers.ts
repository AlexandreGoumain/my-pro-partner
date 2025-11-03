import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    buildCategoryTree,
    type CategorieWithCount,
} from "@/lib/types/category";
import type { ChampPersonnaliseCreateInput } from "@/lib/types/custom-fields";
import { useCategories, useCreateCategorie, useUpdateCategorie, useDeleteCategorie } from "./use-categories";

type Category = CategorieWithCount;

interface CategoryFormData {
    nom: string;
    description: string;
    parentId: string | null;
    champsCustom: ChampPersonnaliseCreateInput[];
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
    currentStep: number;
    setCurrentStep: (step: number) => void;
    direction: "left" | "right";
    setDirection: (dir: "left" | "right") => void;

    // Handlers
    openCreateDialog: (parentId?: string | null) => void;
    openEditDialog: (category: Category) => Promise<void>;
    handleSubmit: () => Promise<void>;
    handleDelete: (category: Category) => void;
    confirmDelete: () => Promise<void>;
    toggleExpand: (id: string) => void;
    handleNext: () => void;
    handlePrevious: () => void;
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
        champsCustom: [],
    });
    const [showExamples, setShowExamples] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState<"left" | "right">("right");

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
        setCurrentStep(1);
        setFormData({
            nom: "",
            description: "",
            parentId,
            champsCustom: [],
        });
        setDialogOpen(true);
    }, []);

    const openEditDialog = useCallback(async (category: Category) => {
        setEditMode(true);
        setSelectedCategory(category);
        setCurrentStep(1);

        let champsCustom: ChampPersonnaliseCreateInput[] = [];
        if (category.parentId) {
            try {
                const response = await fetch(`/api/categories/${category.id}/champs`);
                if (response.ok) {
                    champsCustom = await response.json();
                }
            } catch (error) {
                console.error("Erreur lors du chargement des champs:", error);
            }
        }

        setFormData({
            nom: category.nom,
            description: category.description || "",
            parentId: category.parentId || null,
            champsCustom,
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

            let savedCategory;
            if (editMode && selectedCategory) {
                savedCategory = await updateCategorie.mutateAsync({
                    id: selectedCategory.id,
                    data: categoryData,
                });
            } else {
                savedCategory = await createCategorie.mutateAsync(categoryData);
            }

            const categoryId = savedCategory.id;

            // Handle custom fields for sub-categories
            if (formData.parentId) {
                if (editMode) {
                    const existingFields = await fetch(
                        `/api/categories/${categoryId}/champs`
                    ).then((r) => r.json());

                    for (const field of existingFields) {
                        await fetch(
                            `/api/categories/${categoryId}/champs/${field.id}`,
                            { method: "DELETE" }
                        );
                    }
                }

                if (formData.champsCustom.length > 0) {
                    for (const champ of formData.champsCustom) {
                        const champResponse = await fetch(`/api/categories/${categoryId}/champs`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(champ),
                        });

                        if (!champResponse.ok) {
                            const errorData = await champResponse.json().catch(() => ({}));
                            throw new Error(errorData.message || "Erreur lors de la création d'un champ personnalisé");
                        }
                    }
                }
            }

            const isSubCategory = !!formData.parentId;
            const hasTemplate = formData.champsCustom.length > 0;

            let successMessage = "";
            if (editMode) {
                successMessage = isSubCategory
                    ? hasTemplate
                        ? "Sous-catégorie modifiée avec son template"
                        : "Sous-catégorie modifiée avec succès"
                    : "Catégorie modifiée avec succès";
            } else {
                successMessage = isSubCategory
                    ? hasTemplate
                        ? "Sous-catégorie créée avec son template"
                        : "Sous-catégorie créée avec succès"
                    : "Catégorie créée avec succès";
            }

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

    const handleNext = useCallback(() => {
        if (currentStep < 2 && formData.nom.trim()) {
            setDirection("right");
            setCurrentStep(2);
        }
    }, [currentStep, formData.nom]);

    const handlePrevious = useCallback(() => {
        if (currentStep > 1) {
            setDirection("left");
            setCurrentStep(1);
        }
    }, [currentStep]);

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
        currentStep,
        setCurrentStep,
        direction,
        setDirection,
        openCreateDialog,
        openEditDialog,
        handleSubmit,
        handleDelete,
        confirmDelete,
        toggleExpand,
        handleNext,
        handlePrevious,
    };
}
