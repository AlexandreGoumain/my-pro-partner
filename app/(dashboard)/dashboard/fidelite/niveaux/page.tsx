"use client";

import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { ArticleCardSkeleton } from "@/components/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Award,
    Edit,
    Gift,
    Plus,
    Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoyaltyLevelsPage() {
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
            ordre: 0,
            seuilPoints: 0,
            remise: 0,
            couleur: "#000000",
            icone: "",
            avantages: "",
            actif: true,
        },
    });

    useEffect(() => {
        if (createDialogOpen) {
            form.reset({
                nom: "",
                description: "",
                ordre: niveaux.length,
                seuilPoints: 0,
                remise: 0,
                couleur: "#000000",
                icone: "",
                avantages: "",
                actif: true,
            });
        }
    }, [createDialogOpen, form, niveaux.length]);

    useEffect(() => {
        if (editDialogOpen && selectedLevel) {
            form.reset({
                nom: selectedLevel.nom,
                description: selectedLevel.description || "",
                ordre: selectedLevel.ordre,
                seuilPoints: selectedLevel.seuilPoints,
                remise: Number(selectedLevel.remise),
                couleur: selectedLevel.couleur,
                icone: selectedLevel.icone || "",
                avantages: selectedLevel.avantages || "",
                actif: selectedLevel.actif,
            });
        }
    }, [editDialogOpen, selectedLevel, form]);

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

    const onSubmitCreate = (values: NiveauFideliteCreateInput) => {
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
    };

    const onSubmitEdit = (values: NiveauFideliteCreateInput) => {
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
    };

    const sortedNiveaux = [...niveaux].sort((a, b) => a.ordre - b.ordre);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-[24px] font-bold tracking-[-0.02em]">
                        Niveaux de fidélité
                    </h2>
                    <p className="text-[14px] text-black/60">
                        Configurez les niveaux de votre programme de fidélité
                    </p>
                </div>
                <Button
                    onClick={handleCreate}
                    className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                    Ajouter un niveau
                </Button>
            </div>

            {/* Statistiques */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-black/8">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[13px] text-black/60">
                                    Niveaux actifs
                                </p>
                                <p className="text-[28px] font-bold tracking-[-0.02em]">
                                    {niveaux.filter((n) => n.actif).length}
                                </p>
                            </div>
                            <Award
                                className="h-8 w-8 text-black/40"
                                strokeWidth={2}
                            />
                        </div>
                    </div>
                </Card>

                <Card className="border-black/8">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[13px] text-black/60">
                                    Total niveaux
                                </p>
                                <p className="text-[28px] font-bold tracking-[-0.02em]">
                                    {niveaux.length}
                                </p>
                            </div>
                            <Gift
                                className="h-8 w-8 text-black/40"
                                strokeWidth={2}
                            />
                        </div>
                    </div>
                </Card>

                <Card className="border-black/8">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[13px] text-black/60">
                                    Remise max
                                </p>
                                <p className="text-[28px] font-bold tracking-[-0.02em]">
                                    {niveaux.length > 0
                                        ? `${Math.max(...niveaux.map((n) => Number(n.remise)))}%`
                                        : "0%"}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Liste des niveaux */}
            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ArticleCardSkeleton key={i} />
                    ))}
                </div>
            ) : sortedNiveaux.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sortedNiveaux.map((niveau) => (
                        <Card
                            key={niveau.id}
                            className="group overflow-hidden hover:shadow-md transition-all duration-200 border-black/8"
                        >
                            <div
                                className="h-2"
                                style={{ backgroundColor: niveau.couleur }}
                            />
                            <div className="p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-[18px] font-semibold tracking-[-0.01em] mb-1">
                                            {niveau.nom}
                                        </h3>
                                        {niveau.description && (
                                            <p className="text-[14px] text-black/60 line-clamp-2">
                                                {niveau.description}
                                            </p>
                                        )}
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={
                                            niveau.actif
                                                ? "bg-black/5 text-black border-black/10"
                                                : "bg-black/2 text-black/40 border-black/5"
                                        }
                                    >
                                        {niveau.actif ? "Actif" : "Inactif"}
                                    </Badge>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-black/60">
                                            Seuil de points
                                        </span>
                                        <span className="text-[14px] font-medium">
                                            {niveau.seuilPoints} pts
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-black/60">
                                            Remise
                                        </span>
                                        <span className="text-[14px] font-medium">
                                            {Number(niveau.remise)}%
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-black/60">
                                            Ordre
                                        </span>
                                        <span className="text-[14px] font-medium">
                                            {niveau.ordre}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-black/5 flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEdit(niveau)}
                                        className="flex-1 border-black/10 hover:bg-black/5 h-9 text-[13px]"
                                    >
                                        <Edit
                                            className="h-3.5 w-3.5 mr-1.5"
                                            strokeWidth={2}
                                        />
                                        Modifier
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDelete(niveau)}
                                        className="border-black/10 hover:bg-black/5 h-9 px-3"
                                    >
                                        <Trash2
                                            className="h-3.5 w-3.5"
                                            strokeWidth={2}
                                        />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="p-12 border-black/8">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="rounded-full p-6 bg-black/5">
                            <Award
                                className="w-12 h-12 text-black/40"
                                strokeWidth={2}
                            />
                        </div>
                        <div>
                            <h3 className="text-[18px] font-semibold mb-2 tracking-[-0.01em]">
                                Aucun niveau de fidélité
                            </h3>
                            <p className="text-[14px] text-black/60 max-w-md">
                                Créez votre premier niveau de fidélité pour
                                commencer à récompenser vos clients.
                            </p>
                        </div>
                        <Button
                            onClick={handleCreate}
                            className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                        >
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Créer un niveau
                        </Button>
                    </div>
                </Card>
            )}

            {/* Dialog Créer/Modifier */}
            <Dialog
                open={createDialogOpen || editDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setCreateDialogOpen(false);
                        setEditDialogOpen(false);
                        setSelectedLevel(null);
                    }
                }}
            >
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em]">
                            {editDialogOpen
                                ? "Modifier le niveau"
                                : "Nouveau niveau de fidélité"}
                        </DialogTitle>
                        <DialogDescription className="text-[14px] text-black/60">
                            {editDialogOpen
                                ? "Modifiez les paramètres du niveau de fidélité"
                                : "Créez un nouveau niveau pour votre programme de fidélité"}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(
                                editDialogOpen ? onSubmitEdit : onSubmitCreate
                            )}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="nom"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[13px] text-black/60">
                                                Nom du niveau *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Bronze, Argent, Or..."
                                                    className="h-11 border-black/10"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="ordre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[13px] text-black/60">
                                                Ordre *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseInt(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    className="h-11 border-black/10"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[13px] text-black/60">
                                            Description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                value={field.value || ""}
                                                placeholder="Décrivez ce niveau..."
                                                className="min-h-[80px] border-black/10"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="seuilPoints"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[13px] text-black/60">
                                                Seuil de points *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseInt(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    className="h-11 border-black/10"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="remise"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[13px] text-black/60">
                                                Remise (%)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    step="0.01"
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseFloat(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    className="h-11 border-black/10"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="couleur"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[13px] text-black/60">
                                                Couleur
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="color"
                                                    className="h-11 border-black/10"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="avantages"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[13px] text-black/60">
                                            Avantages
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                value={field.value || ""}
                                                placeholder="Listez les avantages de ce niveau..."
                                                className="min-h-[100px] border-black/10"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setCreateDialogOpen(false);
                                        setEditDialogOpen(false);
                                        setSelectedLevel(null);
                                    }}
                                    className="border-black/10 hover:bg-black/5 h-11 px-6 text-[14px] font-medium"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        createLevel.isPending ||
                                        updateLevel.isPending
                                    }
                                    className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                                >
                                    {createLevel.isPending ||
                                    updateLevel.isPending
                                        ? "Enregistrement..."
                                        : editDialogOpen
                                        ? "Modifier"
                                        : "Créer"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Dialog Delete */}
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                isLoading={deleteLevel.isPending}
                title="Supprimer le niveau"
                description={`Êtes-vous sûr de vouloir supprimer le niveau "${selectedLevel?.nom}" ? Cette action est irréversible.`}
            />
        </div>
    );
}
