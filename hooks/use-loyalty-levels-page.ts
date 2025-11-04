import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    NiveauFidelite,
    useCreateLoyaltyLevel,
    useDeleteLoyaltyLevel,
    useLoyaltyLevels,
    useUpdateLoyaltyLevel,
} from "@/hooks/use-loyalty-levels";
import {
    niveauFideliteCreateSchema,
    type NiveauFideliteCreateInput,
} from "@/lib/validation";

export interface LoyaltyLevelsPageHandlers {
    // Data
    niveaux: NiveauFidelite[];
    sortedNiveaux: NiveauFidelite[];
    isLoading: boolean;

    // Stats
    stats: {
        activeCount: number;
        totalCount: number;
        maxDiscount: number;
    };

    // Dialogs
    createDialogOpen: boolean;
    setCreateDialogOpen: (open: boolean) => void;
    editDialogOpen: boolean;
    setEditDialogOpen: (open: boolean) => void;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    selectedLevel: NiveauFidelite | null;

    // Form
    form: ReturnType<typeof useForm<NiveauFideliteCreateInput>>;
    onSubmitCreate: (values: NiveauFideliteCreateInput) => void;
    onSubmitEdit: (values: NiveauFideliteCreateInput) => void;

    // Handlers
    handleCreate: () => void;
    handleEdit: (level: NiveauFidelite) => void;
    handleDelete: (level: NiveauFidelite) => void;
    confirmDelete: () => void;

    // Loading states
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}

export function useLoyaltyLevelsPage(): LoyaltyLevelsPageHandlers {
    const { data: niveaux = [], isLoading } = useLoyaltyLevels();
    const createLevel = useCreateLoyaltyLevel();
    const updateLevel = useUpdateLoyaltyLevel();
    const deleteLevel = useDeleteLoyaltyLevel();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<NiveauFidelite | null>(
        null
    );

    const form = useForm<NiveauFideliteCreateInput>({
        resolver: zodResolver(niveauFideliteCreateSchema),
        defaultValues: {
            nom: "",
            description: "",
            seuilPoints: 0,
            remise: 0,
            couleur: "#000000",
            icone: "",
            avantages: "",
            actif: true,
        },
    });

    // Reset form when opening create dialog
    useEffect(() => {
        if (createDialogOpen) {
            form.reset({
                nom: "",
                description: "",
                seuilPoints: 0,
                remise: 0,
                couleur: "#000000",
                icone: "",
                avantages: "",
                actif: true,
            });
        }
    }, [createDialogOpen, form]);

    // Reset form when opening edit dialog
    useEffect(() => {
        if (editDialogOpen && selectedLevel) {
            form.reset({
                nom: selectedLevel.nom,
                description: selectedLevel.description || "",
                seuilPoints: selectedLevel.seuilPoints,
                remise: Number(selectedLevel.remise),
                couleur: selectedLevel.couleur,
                icone: selectedLevel.icone || "",
                avantages: selectedLevel.avantages || "",
                actif: selectedLevel.actif,
            });
        }
    }, [editDialogOpen, selectedLevel, form]);

    // Sorted levels by order
    const sortedNiveaux = useMemo(
        () => [...niveaux].sort((a, b) => a.ordre - b.ordre),
        [niveaux]
    );

    // Calculate stats
    const stats = useMemo(() => {
        const activeCount = niveaux.filter((n) => n.actif).length;
        const totalCount = niveaux.length;
        const maxDiscount =
            niveaux.length > 0
                ? Math.max(...niveaux.map((n) => Number(n.remise)))
                : 0;

        return { activeCount, totalCount, maxDiscount };
    }, [niveaux]);

    const handleCreate = useCallback(() => {
        setCreateDialogOpen(true);
    }, []);

    const handleEdit = useCallback((level: NiveauFidelite) => {
        setSelectedLevel(level);
        setEditDialogOpen(true);
    }, []);

    const handleDelete = useCallback((level: NiveauFidelite) => {
        setSelectedLevel(level);
        setDeleteDialogOpen(true);
    }, []);

    const confirmDelete = useCallback(() => {
        if (!selectedLevel) return;

        deleteLevel.mutate(selectedLevel.id, {
            onSuccess: () => {
                toast.success("Niveau supprimé", {
                    description: "Le niveau de fidélité a été supprimé avec succès",
                });
                setDeleteDialogOpen(false);
                setSelectedLevel(null);
            },
            onError: (error) => {
                toast.error("Erreur", {
                    description:
                        error instanceof Error
                            ? error.message
                            : "Impossible de supprimer le niveau",
                });
            },
        });
    }, [selectedLevel, deleteLevel]);

    const onSubmitCreate = useCallback(
        (values: NiveauFideliteCreateInput) => {
            createLevel.mutate(values, {
                onSuccess: () => {
                    toast.success("Niveau créé", {
                        description: "Le niveau de fidélité a été créé avec succès",
                    });
                    setCreateDialogOpen(false);
                },
                onError: (error) => {
                    toast.error("Erreur", {
                        description:
                            error instanceof Error
                                ? error.message
                                : "Une erreur est survenue",
                    });
                },
            });
        },
        [createLevel]
    );

    const onSubmitEdit = useCallback(
        (values: NiveauFideliteCreateInput) => {
            if (!selectedLevel) return;

            updateLevel.mutate(
                { id: selectedLevel.id, data: values },
                {
                    onSuccess: () => {
                        toast.success("Niveau modifié", {
                            description:
                                "Le niveau de fidélité a été modifié avec succès",
                        });
                        setEditDialogOpen(false);
                        setSelectedLevel(null);
                    },
                    onError: (error) => {
                        toast.error("Erreur", {
                            description:
                                error instanceof Error
                                    ? error.message
                                    : "Une erreur est survenue",
                        });
                    },
                }
            );
        },
        [selectedLevel, updateLevel]
    );

    return {
        niveaux,
        sortedNiveaux,
        isLoading,
        stats,
        createDialogOpen,
        setCreateDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        selectedLevel,
        form,
        onSubmitCreate,
        onSubmitEdit,
        handleCreate,
        handleEdit,
        handleDelete,
        confirmDelete,
        isCreating: createLevel.isPending,
        isUpdating: updateLevel.isPending,
        isDeleting: deleteLevel.isPending,
    };
}
