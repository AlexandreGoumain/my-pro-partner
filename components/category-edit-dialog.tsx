"use client";

import { Button } from "@/components/ui/button";
import { ButtonWithSpinner } from "@/components/ui/button-with-spinner";
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";
import { DialogHeaderSection } from "@/components/ui/dialog-header-section";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    useCategories,
    useUpdateCategorie,
    type Categorie,
} from "@/hooks/use-categories";
import { useFormReset } from "@/hooks/use-form-reset";
import {
    categorieUpdateSchema,
    type CategorieUpdateInput,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
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

    // Calculate form values from categorie using useMemo
    const formValues = useMemo<CategorieUpdateInput>(() => {
        if (categorie) {
            return {
                nom: categorie.nom,
                description: categorie.description || "",
                parentId: categorie.parentId || "",
                ordre: categorie.ordre,
            };
        }
        return {
            nom: "",
            description: "",
            parentId: "",
            ordre: 0,
        };
    }, [categorie]);

    const form = useForm<CategorieUpdateInput>({
        resolver: zodResolver(categorieUpdateSchema),
        defaultValues: formValues,
    });

    // Reset form when dialog opens using custom hook
    useFormReset(form, open, formValues);

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
                <DialogHeaderSection
                    title="Modifier la catégorie"
                    description="Modifiez les informations de la catégorie"
                />

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormInput
                            control={form.control}
                            name="nom"
                            label="Nom"
                            placeholder="ex: Électronique, Services, etc."
                            required
                        />

                        <FormInput
                            control={form.control}
                            name="description"
                            label="Description"
                            placeholder="Description de la catégorie..."
                            textarea
                            rows={3}
                            className="resize-none"
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

                        <FormInput
                            control={form.control}
                            name="ordre"
                            label="Ordre d'affichage"
                            type="number"
                            placeholder="0"
                            description="Les catégories seront affichées par ordre croissant"
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
