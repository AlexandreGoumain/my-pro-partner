import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Article } from "@/app/(dashboard)/dashboard/articles/_components/data-table/columns";
import { useDeleteArticle, useDuplicateArticle } from "@/hooks/use-articles";

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

    // Modal states
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    // Article handlers
    const handleCreate = useCallback(() => {
        setCreateDialogOpen(true);
    }, []);

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
        setSelectedArticle(article);
        setEditDialogOpen(true);
    }, []);

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
        setSelectedArticle(article);
        setDeleteDialogOpen(true);
    }, []);

    const confirmDelete = useCallback(() => {
        if (!selectedArticle) return;

        deleteArticle.mutate(selectedArticle.id, {
            onSuccess: () => {
                toast.success("Article supprimé", {
                    description: "L'article a été supprimé avec succès",
                });
                setDeleteDialogOpen(false);
                setSelectedArticle(null);
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
    }, [selectedArticle, deleteArticle]);

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
        createDialogOpen,
        setCreateDialogOpen,
        viewDialogOpen,
        setViewDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        selectedArticle,
        setSelectedArticle,
        isDeleting: deleteArticle.isPending,
    };
}
