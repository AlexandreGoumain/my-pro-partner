"use client";

import type { Article } from "@/app/(dashboard)/dashboard/articles/_components/data-table/columns";
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
import { useArticles } from "@/hooks/use-articles";
import { useFormReset } from "@/hooks/use-form-reset";
import { useCreateStockMouvement } from "@/hooks/use-stock";
import { STOCK_MOVEMENT_TYPES } from "@/lib/constants/stock-movements";
import {
    mouvementStockCreateSchema,
    type MouvementStockCreateInput,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface StockMovementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    defaultArticleId?: string;
}

export function StockMovementDialog({
    open,
    onOpenChange,
    onSuccess,
    defaultArticleId,
}: StockMovementDialogProps) {
    const createMouvement = useCreateStockMouvement();
    const { data: articlesData, isLoading: loadingArticles } = useArticles();
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(
        null
    );

    // Calculate form default values using useMemo
    const formValues = useMemo<MouvementStockCreateInput>(
        () => ({
            articleId: defaultArticleId || "",
            type: "ENTREE",
            quantite: 0,
            motif: "",
            reference: "",
            notes: "",
        }),
        [defaultArticleId]
    );

    const form = useForm<MouvementStockCreateInput>({
        resolver: zodResolver(mouvementStockCreateSchema),
        defaultValues: formValues,
    });

    // Reset form when dialog opens using custom hook
    useFormReset(form, open, formValues);

    // Reset selectedArticle when dialog opens
    useEffect(() => {
        if (open) {
            setSelectedArticle(null);
        }
    }, [open]);

    // eslint-disable-next-line react-hooks/incompatible-library
    const watchedArticleId = form.watch("articleId");

    // Mettre à jour l'article sélectionné quand l'ID change
    useEffect(() => {
        if (watchedArticleId && articlesData) {
            const article = articlesData.find((a) => a.id === watchedArticleId);
            setSelectedArticle(article || null);
        } else {
            setSelectedArticle(null);
        }
    }, [watchedArticleId, articlesData]);

    // Filtrer les articles avec gestion de stock activée
    const stockEnabledArticles =
        articlesData?.filter((article) => article.gestionStock === true) || [];

    function onSubmit(values: MouvementStockCreateInput) {
        createMouvement.mutate(values, {
            onSuccess: () => {
                toast.success("Mouvement de stock créé avec succès");
                onSuccess?.();
                onOpenChange(false);
            },
            onError: (error) => {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Erreur lors de la création du mouvement"
                );
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Créer un mouvement de stock</DialogTitle>
                    <DialogDescription>
                        Enregistrer une entrée, sortie ou ajustement de stock
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Sélection de l'article */}
                        <FormField
                            control={form.control}
                            name="articleId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Article *</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={
                                            loadingArticles ||
                                            !!defaultArticleId
                                        }
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un article" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {stockEnabledArticles.map(
                                                (article) => (
                                                    <SelectItem
                                                        key={article.id}
                                                        value={article.id}
                                                    >
                                                        {article.reference} -{" "}
                                                        {article.nom} (Stock:{" "}
                                                        {article.stock})
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {selectedArticle && (
                                        <FormDescription>
                                            Stock actuel:{" "}
                                            {selectedArticle.stock} | Stock min:{" "}
                                            {selectedArticle.seuilAlerte}
                                        </FormDescription>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Type de mouvement et quantité */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Type de mouvement *
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner un type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {STOCK_MOVEMENT_TYPES.map(
                                                    (type) => (
                                                        <SelectItem
                                                            key={type.value}
                                                            value={type.value}
                                                        >
                                                            {type.label}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="quantite"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantité *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="ex: 10 ou -5"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Positif pour entrée, négatif pour
                                            sortie
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Informations complémentaires */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm">
                                Informations complémentaires (optionnel)
                            </h3>

                            <FormField
                                control={form.control}
                                name="motif"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Motif</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="ex: Réception fournisseur, Vente, Casse, etc."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="reference"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Référence</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="ex: N° de bon de livraison, commande, etc."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notes</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Notes additionnelles..."
                                                className="resize-none"
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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
                                disabled={createMouvement.isPending}
                            >
                                Annuler
                            </Button>
                            <ButtonWithSpinner
                                type="submit"
                                isLoading={createMouvement.isPending}
                            >
                                Créer le mouvement
                            </ButtonWithSpinner>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
