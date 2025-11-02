import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    buildCategoryTree,
    type CategorieWithCount,
} from "@/lib/types/category";
import type { ChampPersonnaliseCreateInput } from "@/lib/types/custom-fields";

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
    fetchCategories: () => Promise<void>;
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
    const [categories, setCategories] = useState<Category[]>([]);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [formData, setFormData] = useState<CategoryFormData>({
        nom: "",
        description: "",
        parentId: null,
        champsCustom: [],
    });
    const [showExamples, setShowExamples] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState<"left" | "right">("right");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/categories");
            if (response.ok) {
                const data = await response.json();
                setCategories(buildCategoryTree(data));
                const allIds = new Set<string>(data.map((c: Category) => c.id));
                setExpandedIds(allIds);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Erreur lors du chargement");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

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
        if (!formData.nom.trim() || isSubmitting) return;

        try {
            setIsSubmitting(true);
            const url = editMode && selectedCategory
                ? `/api/categories/${selectedCategory.id}`
                : "/api/categories";

            const response = await fetch(url, {
                method: editMode ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nom: formData.nom,
                    description: formData.description,
                    parentId: formData.parentId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Erreur lors de la sauvegarde");
            }

            const savedCategory = await response.json();
            const categoryId = savedCategory.id;

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
            fetchCategories();
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Erreur lors de l'enregistrement"
            );
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, isSubmitting, editMode, selectedCategory, fetchCategories]);

    const handleDelete = useCallback((category: Category) => {
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!categoryToDelete) return;

        try {
            setIsDeleting(true);
            const response = await fetch(
                `/api/categories/${categoryToDelete.id}`,
                { method: "DELETE" }
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
    }, [categoryToDelete, fetchCategories]);

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
        isDeleting,
        isSubmitting,
        formData,
        setFormData,
        showExamples,
        setShowExamples,
        currentStep,
        setCurrentStep,
        direction,
        setDirection,
        fetchCategories,
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
