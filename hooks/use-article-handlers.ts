import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Article } from "@/app/(dashboard)/dashboard/articles/_components/data-table/columns";
import { useDeleteArticle, useDuplicateArticle } from "@/hooks/use-articles";
import { useCrudDialogs } from "@/hooks/use-crud-dialogs";

export interface ArticleHandlers {
    // Handlers
    handleCreate: () => void;
    handleCreateSuccess: () => void;
    handleView: (article: Article) => void;
    handleEdit: (article: Article) => void;
    handleDuplicate: (article: Article) => void;
    handleDelete: (article: Article) => void;
    handleEditSuccess: () => void;
    confirmDelete: () => void;

    // Modal states
    createDialogOpen: boolean;
    setCreateDialogOpen: (open: boolean) => void;
    viewDialogOpen: boolean;
    setViewDialogOpen: (open: boolean) => void;
    editDialogOpen: boolean;
    setEditDialogOpen: (open: boolean) => void;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;

    // Selected article
    selectedArticle: Article | null;
    setSelectedArticle: (article: Article | null) => void;

    // Mutation states
    isDeleting: boolean;
}

export function useArticleHandlers(): ArticleHandlers {
    const router = useRouter();
    const duplicateArticle = useDuplicateArticle();
    const deleteArticle = useDeleteArticle();

    // CRUD Dialogs management (create, edit, delete, view)
    const { dialogs, selected: selectedArticle, handlers: dialogHandlers, setDialogs, setSelected: setSelectedArticle } = useCrudDialogs<Article>();

    // Article handlers
    const handleCreate = useCallback(() => {
        dialogHandlers.openCreate();
    }, [dialogHandlers]);

    const handleCreateSuccess = useCallback(() => {
        toast.success("Article créé", {
            description: "L'article a été créé avec succès",
        });
    }, []);

    const handleView = useCallback((article: Article) => {
        router.push(`/dashboard/articles/${article.id}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEdit = useCallback((article: Article) => {
        dialogHandlers.openEdit(article);
    }, [dialogHandlers]);

    const handleDuplicate = useCallback(
        (article: Article) => {
            duplicateArticle.mutate(article, {
                onSuccess: () => {
                    toast.success("Article dupliqué", {
                        description: "L'article a été dupliqué avec succès",
                    });
                },
                onError: (error) => {
                    toast.error("Erreur", {
                        description:
                            error instanceof Error
                                ? error.message
                                : "Impossible de dupliquer l'article",
                    });
                },
            });
        },
        [duplicateArticle]
    );

    const handleDelete = useCallback((article: Article) => {
        dialogHandlers.openDelete(article);
    }, [dialogHandlers]);

    const confirmDelete = useCallback(() => {
        if (!selectedArticle) return;

        deleteArticle.mutate(selectedArticle.id, {
            onSuccess: () => {
                toast.success("Article supprimé", {
                    description: "L'article a été supprimé avec succès",
                });
                dialogHandlers.closeDelete();
            },
            onError: (error) => {
                toast.error("Erreur", {
                    description:
                        error instanceof Error
                            ? error.message
                            : "Impossible de supprimer l'article",
                });
            },
        });
    }, [selectedArticle, deleteArticle, dialogHandlers]);

    const handleEditSuccess = useCallback(() => {
        toast.success("Article modifié", {
            description: "L'article a été modifié avec succès",
        });
    }, []);

    return {
        handleCreate,
        handleCreateSuccess,
        handleView,
        handleEdit,
        handleDuplicate,
        handleDelete,
        handleEditSuccess,
        confirmDelete,
        // CRUD dialogs (using useCrudDialogs hook)
        createDialogOpen: dialogs.create,
        setCreateDialogOpen: (open: boolean) => setDialogs(prev => ({ ...prev, create: open })),
        viewDialogOpen: dialogs.view,
        setViewDialogOpen: (open: boolean) => setDialogs(prev => ({ ...prev, view: open })),
        editDialogOpen: dialogs.edit,
        setEditDialogOpen: (open: boolean) => setDialogs(prev => ({ ...prev, edit: open })),
        deleteDialogOpen: dialogs.delete,
        setDeleteDialogOpen: (open: boolean) => setDialogs(prev => ({ ...prev, delete: open })),
        selectedArticle,
        setSelectedArticle,
        isDeleting: deleteArticle.isPending,
    };
}
