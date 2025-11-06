import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CategoryTreeSelect } from "@/components/category-tree-select";
import { FolderTree, Info } from "lucide-react";
import { StepProps } from "../types";

export function InfoStep({
    form,
    articleType,
    categories,
    loadingCategories,
    onNavigateToCategories,
}: StepProps) {
    return (
        <div className="space-y-3 py-4">
            <div className="space-y-1">
                <h3 className="text-[24px] font-semibold text-black tracking-[-0.02em]">
                    Informations générales
                </h3>
                <p className="text-[14px] text-black/60">
                    Renseignez les informations de base
                </p>
            </div>

            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="nom"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-[13px] font-medium">
                                Nom *
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={
                                        articleType === "SERVICE"
                                            ? "Ex: Installation électrique"
                                            : "Ex: Tournevis électrique"
                                    }
                                    className="h-10"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-[12px]">
                                Nom commercial du{" "}
                                {articleType === "SERVICE"
                                    ? "service"
                                    : "produit"} (la référence sera générée automatiquement)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="categorieId"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-[13px] font-medium">
                                Catégorie *
                            </FormLabel>
                            <FormControl>
                                {categories.length === 0 ? (
                                    <div className="flex items-center gap-3 p-4 border border-dashed border-black/10 rounded-lg bg-black/2">
                                        <FolderTree
                                            className="h-5 w-5 text-black/30 shrink-0"
                                            strokeWidth={2}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-medium text-black mb-0.5">
                                                Aucune catégorie disponible
                                            </p>
                                            <p className="text-[12px] text-black/60">
                                                Organisez votre catalogue avec des
                                                catégories
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="border-black/10 hover:bg-black/5 h-8 text-[12px] shrink-0"
                                            onClick={onNavigateToCategories}
                                        >
                                            <FolderTree
                                                className="h-3.5 w-3.5 mr-1.5"
                                                strokeWidth={2}
                                            />
                                            Créer
                                        </Button>
                                    </div>
                                ) : (
                                    <CategoryTreeSelect
                                        categories={categories}
                                        value={field.value || ""}
                                        onValueChange={field.onChange}
                                        disabled={loadingCategories}
                                    />
                                )}
                            </FormControl>
                            {categories.length === 0 ? (
                                <div className="flex items-start gap-2 p-3 bg-black/2 rounded-md border border-black/8">
                                    <Info
                                        className="h-4 w-4 text-black/40 shrink-0 mt-0.5"
                                        strokeWidth={2}
                                    />
                                    <p className="text-[12px] text-black/60 leading-relaxed">
                                        Commencez par créer vos catégories pour
                                        organiser votre catalogue efficacement
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <FormDescription className="text-[12px]">
                                        Utilisez l&apos;arborescence pour naviguer
                                    </FormDescription>
                                    <Button
                                        type="button"
                                        variant="link"
                                        size="sm"
                                        className="h-auto p-0 text-[11px]"
                                        onClick={onNavigateToCategories}
                                    >
                                        <FolderTree className="h-3 w-3 mr-1" />
                                        Gérer les catégories
                                    </Button>
                                </div>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-[13px] font-medium">
                                Description
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Description détaillée..."
                                    className="resize-none"
                                    rows={3}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-[12px]">
                                Décrivez le{" "}
                                {articleType === "SERVICE" ? "service" : "produit"}{" "}
                                (optionnel)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
