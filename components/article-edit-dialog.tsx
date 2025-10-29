"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    articleUpdateSchema,
    type ArticleUpdateInput,
} from "@/lib/validation";
import { useUpdateArticle } from "@/hooks/use-articles";
import {
    Dialog,
    DialogContent,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonWithSpinner } from "@/components/ui/button-with-spinner";
import { ArticleDisplay } from "@/lib/types/article";
import { Checkbox } from "@/components/ui/checkbox";

interface Category {
    id: string;
    nom: string;
}

interface ArticleEditDialogProps {
    article: ArticleDisplay | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ArticleEditDialog({
    article,
    open,
    onOpenChange,
    onSuccess,
}: ArticleEditDialogProps) {
    const updateArticle = useUpdateArticle();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const form = useForm<ArticleUpdateInput>({
        resolver: zodResolver(articleUpdateSchema),
        defaultValues: {
            reference: "",
            nom: "",
            description: "",
            prix_ht: 0,
            tva_taux: 20,
            categorieId: "",
            stock_actuel: 0,
            stock_min: 0,
            gestion_stock: false,
            actif: true,
        },
    });

    // Charger les catégories
    useEffect(() => {
        async function fetchCategories() {
            try {
                setLoadingCategories(true);
                const response = await fetch("/api/categories");
                if (!response.ok) throw new Error("Erreur chargement catégories");
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoadingCategories(false);
            }
        }
        fetchCategories();
    }, []);

    // Charger les données de l'article dans le formulaire
    useEffect(() => {
        if (article && open) {
            // Trouver l'ID de la catégorie
            const category = categories.find((c) => c.nom === article.categorie);

            form.reset({
                reference: article.reference,
                nom: article.nom,
                description: article.description || "",
                prix_ht: article.prix,
                tva_taux: article.tva,
                categorieId: category?.id || "",
                stock_actuel: article.stock,
                stock_min: article.seuilAlerte,
                gestion_stock: true,
                actif: article.statut !== "INACTIF",
            });
        }
    }, [article, open, categories, form]);

    function onSubmit(values: ArticleUpdateInput) {
        if (!article) return;

        updateArticle.mutate(
            { id: article.id, data: values },
            {
                onSuccess: () => {
                    onSuccess();
                    onOpenChange(false);
                },
                onError: (error) => {
                    form.setError("root", {
                        message:
                            error instanceof Error
                                ? error.message
                                : "Une erreur est survenue",
                    });
                },
            }
        );
    }

    if (!article) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Modifier l&apos;article</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Informations de base */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Informations de base</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="reference"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Référence</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="nom"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
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
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="categorieId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Catégorie</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={loadingCategories}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner une catégorie" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.nom}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Tarification */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Tarification</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="prix_ht"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Prix HT</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseFloat(e.target.value)
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tva_taux"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>TVA (%)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseFloat(e.target.value)
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Gestion du stock */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Stock</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="stock_actuel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stock actuel</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseInt(e.target.value, 10)
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="stock_min"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stock minimum</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseInt(e.target.value, 10)
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Seuil d&apos;alerte
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="gestion_stock"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Activer la gestion du stock
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Statut */}
                        <FormField
                            control={form.control}
                            name="actif"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Article actif</FormLabel>
                                        <FormDescription>
                                            Un article inactif n&apos;apparaît pas dans le
                                            catalogue
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {form.formState.errors.root && (
                            <div className="text-sm text-destructive">
                                {form.formState.errors.root.message}
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={updateArticle.isPending}
                            >
                                Annuler
                            </Button>
                            <ButtonWithSpinner
                                type="submit"
                                isLoading={updateArticle.isPending}
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
