import { ArticleCreateDialog } from "@/components/article-create-dialog";
import { ArticleEditDialog } from "@/components/article-edit-dialog";
import { ArticleViewDialog } from "@/components/article-view-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { Article } from "@/app/(dashboard)/dashboard/articles/_components/data-table/columns";

export interface ArticleDialogsProps {
    // Create dialog
    createDialogOpen: boolean;
    onCreateDialogChange: (open: boolean) => void;
    onCreateSuccess: () => void;

    // View dialog
    viewDialogOpen: boolean;
    onViewDialogChange: (open: boolean) => void;

    // Edit dialog
    editDialogOpen: boolean;
    onEditDialogChange: (open: boolean) => void;
    onEditSuccess: () => void;

    // Delete dialog
    deleteDialogOpen: boolean;
    onDeleteDialogChange: (open: boolean) => void;
    onDeleteConfirm: () => void;
    isDeleting: boolean;

    // Selected article
    selectedArticle: Article | null;
}

export function ArticleDialogs({
    createDialogOpen,
    onCreateDialogChange,
    onCreateSuccess,
    viewDialogOpen,
    onViewDialogChange,
    editDialogOpen,
    onEditDialogChange,
    onEditSuccess,
    deleteDialogOpen,
    onDeleteDialogChange,
    onDeleteConfirm,
    isDeleting,
    selectedArticle,
}: ArticleDialogsProps) {
    return (
        <>
            <ArticleCreateDialog
                open={createDialogOpen}
                onOpenChange={onCreateDialogChange}
                onSuccess={onCreateSuccess}
            />

            <ArticleViewDialog
                article={selectedArticle}
                open={viewDialogOpen}
                onOpenChange={onViewDialogChange}
            />

            <ArticleEditDialog
                article={selectedArticle}
                open={editDialogOpen}
                onOpenChange={onEditDialogChange}
                onSuccess={onEditSuccess}
            />

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={onDeleteDialogChange}
                onConfirm={onDeleteConfirm}
                isLoading={isDeleting}
                title="Supprimer l'article"
                description={`Êtes-vous sûr de vouloir supprimer l'article "${selectedArticle?.nom}" ? Cette action est irréversible.`}
            />
        </>
    );
}
