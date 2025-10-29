"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    articleCreateSchema,
    type ArticleCreateInput,
} from "@/lib/validation";
import { useCreateArticle } from "@/hooks/use-articles";
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
import { Checkbox } from "@/components/ui/checkbox";

interface Category {
    id: string;
    nom: string;
}

interface ArticleCreateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ArticleCreateDialog({
    open,
    onOpenChange,
    onSuccess,
}: ArticleCreateDialogProps) {
    const createArticle = useCreateArticle();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const form = useForm<ArticleCreateInput>({
        resolver: zodResolver(articleCreateSchema),
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

    // Réinitialiser le formulaire quand le dialog s'ouvre
    useEffect(() => {
        if (open) {
            form.reset({
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
            });
        }
    }, [open, form]);

    function onSubmit(values: ArticleCreateInput) {
        createArticle.mutate(values, {
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
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Créer un nouvel article</DialogTitle>
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
                                                <Input placeholder="ART-001" {...field} />
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
                                                <Input placeholder="Nom de l'article" {...field} />
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
                                            <Input placeholder="Description de l'article" {...field} />
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
                                                placeholder="0.00"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseFloat(e.target.value) || 0
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            TVA appliquée : 20%
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Affichage du calcul Prix TTC */}
                            {form.watch("prix_ht") > 0 && (
                                <div className="p-4 bg-muted rounded-lg space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">
                                            Prix HT
                                        </span>
                                        <span className="font-semibold">
                                            {form.watch("prix_ht").toFixed(2)} €
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">
                                            TVA (20%)
                                        </span>
                                        <span className="font-semibold">
                                            {(form.watch("prix_ht") * 0.2).toFixed(2)} €
                                        </span>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold">
                                                Prix TTC
                                            </span>
                                            <span className="text-lg font-bold">
                                                {(form.watch("prix_ht") * 1.2).toFixed(2)} €
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                                    placeholder="0"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseInt(e.target.value, 10) || 0
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                &nbsp;
                                            </FormDescription>
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
                                                    placeholder="0"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseInt(e.target.value, 10) || 0
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
                                disabled={createArticle.isPending}
                            >
                                Annuler
                            </Button>
                            <ButtonWithSpinner
                                type="submit"
                                isLoading={createArticle.isPending}
                            >
                                Créer l&apos;article
                            </ButtonWithSpinner>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
