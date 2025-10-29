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
import { useCategories, useCreateCategorie } from "@/hooks/use-categories";
import {
    categorieCreateSchema,
    type CategorieCreateInput,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CategoryCreateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function CategoryCreateDialog({
    open,
    onOpenChange,
    onSuccess,
}: CategoryCreateDialogProps) {
    const createCategorie = useCreateCategorie();
    const { data: categories = [], isLoading: loadingCategories } =
        useCategories();

    const form = useForm<CategorieCreateInput>({
        resolver: zodResolver(categorieCreateSchema),
        defaultValues: {
            nom: "",
            description: "",
            parentId: "",
            ordre: 0,
        },
    });

    // Réinitialiser le formulaire quand le dialog s'ouvre
    useEffect(() => {
        if (open) {
            form.reset({
                nom: "",
                description: "",
                parentId: "",
                ordre: 0,
            });
        }
    }, [open, form]);

    function onSubmit(values: CategorieCreateInput) {
        // Nettoyer les valeurs vides
        const cleanedValues = {
            ...values,
            parentId: values.parentId || undefined,
            description: values.description || undefined,
        };

        createCategorie.mutate(cleanedValues, {
            onSuccess: () => {
                toast.success("Catégorie créée avec succès");
                onSuccess?.();
                onOpenChange(false);
            },
            onError: (error) => {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Erreur lors de la création de la catégorie"
                );
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
                    <DialogDescription>
                        Organisez vos articles en catégories et sous-catégories
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
                                            {categories
                                                .filter((cat) => !cat.parentId) // Seulement les catégories racines
                                                .map((categorie) => (
                                                    <SelectItem
                                                        key={categorie.id}
                                                        value={categorie.id}
                                                    >
                                                        {categorie.nom}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Créez une sous-catégorie en
                                        sélectionnant une catégorie parente
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
                                disabled={createCategorie.isPending}
                            >
                                Annuler
                            </Button>
                            <ButtonWithSpinner
                                type="submit"
                                isLoading={createCategorie.isPending}
                            >
                                Créer la catégorie
                            </ButtonWithSpinner>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
