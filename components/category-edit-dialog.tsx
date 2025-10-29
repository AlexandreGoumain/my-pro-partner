"use client";

import { Button } from "@/components/ui/button";
import { ButtonWithSpinner } from "@/components/ui/button-with-spinner";
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    useCategories,
    useUpdateCategorie,
    type Categorie,
} from "@/hooks/use-categories";
import {
    categorieUpdateSchema,
    type CategorieUpdateInput,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CategoryEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categorie: Categorie | null;
    onSuccess?: () => void;
}

export function CategoryEditDialog({
    open,
    onOpenChange,
    categorie,
    onSuccess,
}: CategoryEditDialogProps) {
    const updateCategorie = useUpdateCategorie();
    const { data: categories = [], isLoading: loadingCategories } =
        useCategories();

    const form = useForm<CategorieUpdateInput>({
        resolver: zodResolver(categorieUpdateSchema),
        defaultValues: {
            nom: "",
            description: "",
            parentId: "",
            ordre: 0,
        },
    });

    // Charger les données de la catégorie quand elle change
    useEffect(() => {
        if (categorie && open) {
            form.reset({
                nom: categorie.nom,
                description: categorie.description || "",
                parentId: categorie.parentId || "",
                ordre: categorie.ordre,
            });
        }
    }, [categorie, open, form]);

    function onSubmit(values: CategorieUpdateInput) {
        if (!categorie) return;

        // Nettoyer les valeurs vides
        const cleanedValues = {
            ...values,
            parentId: values.parentId || null,
            description: values.description || undefined,
        };

        updateCategorie.mutate(
            { id: categorie.id, data: cleanedValues },
            {
                onSuccess: () => {
                    toast.success("Catégorie modifiée avec succès");
                    onSuccess?.();
                    onOpenChange(false);
                },
                onError: (error) => {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Erreur lors de la modification de la catégorie"
                    );
                },
            }
        );
    }

    // Filtrer les catégories disponibles comme parent
    // (exclure la catégorie elle-même et ses enfants)
    const availableParents = categories.filter((cat) => {
        if (!categorie) return true;
        // Exclure la catégorie elle-même
        if (cat.id === categorie.id) return false;
        // Exclure les enfants directs
        if (cat.parentId === categorie.id) return false;
        // Seulement les catégories racines
        return !cat.parentId;
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Modifier la catégorie</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations de la catégorie
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="nom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="ex: Électronique, Services, etc."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Description de la catégorie..."
                                            className="resize-none"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="parentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Catégorie parente (optionnel)
                                    </FormLabel>
                                    <Select
                                        onValueChange={(value) =>
                                            field.onChange(
                                                value === "none" ? "" : value
                                            )
                                        }
                                        value={field.value || "none"}
                                        disabled={loadingCategories}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Aucune (catégorie racine)" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                Aucune (catégorie racine)
                                            </SelectItem>
                                            {availableParents.map((cat) => (
                                                <SelectItem
                                                    key={cat.id}
                                                    value={cat.id}
                                                >
                                                    {cat.nom}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Déplacez cette catégorie sous une autre
                                        catégorie
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="ordre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Ordre d&apos;affichage
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    parseInt(e.target.value) ||
                                                        0
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Les catégories seront affichées par
                                        ordre croissant
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {categorie && categorie.articles.length > 0 && (
                            <div className="rounded-md bg-muted p-3 text-sm">
                                <p className="font-medium">
                                    Cette catégorie contient{" "}
                                    {categorie.articles.length} article (s)
                                </p>
                            </div>
                        )}

                        {form.formState.errors.root && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.root.message}
                            </p>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={updateCategorie.isPending}
                            >
                                Annuler
                            </Button>
                            <ButtonWithSpinner
                                type="submit"
                                isLoading={updateCategorie.isPending}
                            >
                                Enregistrer
                            </ButtonWithSpinner>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
