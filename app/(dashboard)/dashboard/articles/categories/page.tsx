"use client";

import {
    CategoryDialog,
    CategoryExamples,
    CategoryHeader,
    CategoryInfoCard,
    CategoryStatsGrid,
    CategoryTreeView,
} from "@/components/categories";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { useCategoryHandlers } from "@/hooks/use-category-handlers";
import { useMemo } from "react";

export default function CategoriesPage() {
    const handlers = useCategoryHandlers();

    const rootCategories = handlers.categories;
    const totalCategories = useMemo(
        () =>
            handlers.categories.reduce(
                (acc, cat) => acc + 1 + (cat.enfants?.length || 0),
                0
            ),
        [handlers.categories]
    );
    const subCategoriesCount = totalCategories - rootCategories.length;

    return (
        <div className="container mx-auto py-6 space-y-6">
            <CategoryHeader
                showExamples={handlers.showExamples}
                onToggleExamples={() =>
                    handlers.setShowExamples(!handlers.showExamples)
                }
                onCreateCategory={() => handlers.openCreateDialog()}
            />

            <CategoryExamples
                showExamples={handlers.showExamples}
                onShowExamplesChange={handlers.setShowExamples}
            />

            <CategoryInfoCard />

            <CategoryStatsGrid
                totalCategories={totalCategories}
                rootCategoriesCount={rootCategories.length}
                subCategoriesCount={subCategoriesCount}
            />

            <CategoryTreeView
                categories={rootCategories}
                isLoading={handlers.isLoading}
                expandedIds={handlers.expandedIds}
                onToggleExpand={handlers.toggleExpand}
                onEdit={handlers.openEditDialog}
                onDelete={handlers.handleDelete}
                onCreateSubCategory={handlers.openCreateDialog}
                onCreateCategory={() => handlers.openCreateDialog()}
            />

            <CategoryDialog
                open={handlers.dialogOpen}
                onOpenChange={handlers.setDialogOpen}
                editMode={handlers.editMode}
                formData={handlers.formData}
                onFormDataChange={handlers.setFormData}
                currentStep={handlers.currentStep}
                direction={handlers.direction}
                categories={handlers.categories}
                isSubmitting={handlers.isSubmitting}
                onSubmit={handlers.handleSubmit}
                onNext={handlers.handleNext}
                onPrevious={handlers.handlePrevious}
            />

            <DeleteConfirmDialog
                open={handlers.deleteDialogOpen}
                onOpenChange={handlers.setDeleteDialogOpen}
                onConfirm={handlers.confirmDelete}
                isLoading={handlers.isDeleting}
                title={
                    handlers.categoryToDelete?.parentId
                        ? "Supprimer la sous-catégorie"
                        : "Supprimer la catégorie"
                }
                description={
                    handlers.categoryToDelete
                        ? `Êtes-vous sûr de vouloir supprimer ${
                              handlers.categoryToDelete.parentId
                                  ? "la sous-catégorie"
                                  : "la catégorie"
                          } "${
                              handlers.categoryToDelete.nom
                          }" ? Cette action est irréversible.`
                        : ""
                }
            />
        </div>
    );
}
