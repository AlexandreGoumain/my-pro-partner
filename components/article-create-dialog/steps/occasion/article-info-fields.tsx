import {
    FormControl,
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
import { UseFormReturn } from "react-hook-form";

interface Category {
    id: string;
    nom: string;
}

interface ArticleInfoFieldsProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
    categories: Category[];
    loadingCategories: boolean;
}

export function ArticleInfoFields({
    form,
    categories,
    loadingCategories,
}: ArticleInfoFieldsProps) {
    return (
        <>
            <div className="space-y-1 pt-2">
                <h4 className="text-[16px] font-semibold text-black">
                    Informations de l&apos;article
                </h4>
                <p className="text-[13px] text-black/60">
                    Détails du produit à mettre en vente
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="nom"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[14px]">
                                Nom <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ex: iPhone 13 Pro 256GB"
                                    className="h-11"
                                    {...field}
                                />
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
                            <FormLabel className="text-[14px]">
                                Catégorie{" "}
                                <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={loadingCategories}
                            >
                                <FormControl>
                                    <SelectTrigger className="h-11">
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

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[14px]">
                            Description
                        </FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Détails supplémentaires sur le produit"
                                className="resize-none min-h-[80px]"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}
