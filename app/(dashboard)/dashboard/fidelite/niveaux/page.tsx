"use client";

import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import {
    LoyaltyLevelDialog,
    LoyaltyLevelGrid,
    LoyaltyLevelHeader,
    LoyaltyLevelStats,
} from "@/components/loyalty";
import { useLoyaltyLevelsPage } from "@/hooks/use-loyalty-levels-page";

export default function LoyaltyLevelsPage() {
    const handlers = useLoyaltyLevelsPage();

    return (
        <div className="space-y-6">
            <LoyaltyLevelHeader onCreateClick={handlers.handleCreate} />

            <LoyaltyLevelStats
                activeCount={handlers.stats.activeCount}
                totalCount={handlers.stats.totalCount}
                maxDiscount={handlers.stats.maxDiscount}
            />

            <LoyaltyLevelGrid
                levels={handlers.sortedNiveaux}
                isLoading={handlers.isLoading}
                onEdit={handlers.handleEdit}
                onDelete={handlers.handleDelete}
                onCreate={handlers.handleCreate}
            />

            <LoyaltyLevelDialog
                open={handlers.createDialogOpen || handlers.editDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        handlers.setCreateDialogOpen(false);
                        handlers.setEditDialogOpen(false);
                    }
                }}
                editMode={handlers.editDialogOpen}
                form={handlers.form}
                onSubmit={
                    handlers.editDialogOpen
                        ? handlers.onSubmitEdit
                        : handlers.onSubmitCreate
                }
                isSubmitting={handlers.isCreating || handlers.isUpdating}
            />

            <DeleteConfirmDialog
                open={handlers.deleteDialogOpen}
                onOpenChange={handlers.setDeleteDialogOpen}
                onConfirm={handlers.confirmDelete}
                isLoading={handlers.isDeleting}
                title="Supprimer le niveau"
                description={`Êtes-vous sûr de vouloir supprimer le niveau "${handlers.selectedLevel?.nom}" ? Cette action est irréversible.`}
            />
        </div>
    );
}
