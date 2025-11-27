"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DialogActionButtons } from "@/components/ui/dialog-action-buttons";
import {
    Form,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
    ALLERGENS,
    MENU_CATEGORIES,
    useCreateMenuItem,
    useUpdateMenuItem,
    type Allergen,
    type MenuCategory,
    type MenuItem,
} from "@/hooks/use-menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const menuItemSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    description: z.string().optional(),
    prix: z.coerce.number().min(0, "Le prix doit être positif"),
    categorie: z
        .string()
        .min(1, "La catégorie est requise") as z.ZodType<MenuCategory>,
    allergenes: z.array(z.string()) as z.ZodType<Allergen[]>,
    tempsPreparation: z.coerce.number().optional(),
    disponible: z.boolean(),
});

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

interface MenuDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    item?: MenuItem | null;
}

export function MenuDialog({
    open,
    onOpenChange,
    onSuccess,
    item,
}: MenuDialogProps) {
    const isEditing = !!item;

    const form = useForm<MenuItemFormValues>({
        resolver: zodResolver(menuItemSchema),
        defaultValues: {
            nom: "",
            description: "",
            prix: 0,
            categorie: "Plats",
            allergenes: [],
            tempsPreparation: undefined,
            disponible: true,
        },
    });

    // Reset form when item changes
    useEffect(() => {
        if (item) {
            form.reset({
                nom: item.nom,
                description: item.description || "",
                prix: item.prix,
                categorie: item.categorie,
                allergenes: item.allergenes || [],
                tempsPreparation: item.tempsPreparation,
                disponible: item.disponible,
            });
        } else {
            form.reset({
                nom: "",
                description: "",
                prix: 0,
                categorie: "Plats",
                allergenes: [],
                tempsPreparation: undefined,
                disponible: true,
            });
        }
    }, [item, form]);

    const createItem = useCreateMenuItem();
    const updateItem = useUpdateMenuItem();

    const onSubmit = (data: MenuItemFormValues) => {
        const payload = {
            nom: data.nom,
            description: data.description || undefined,
            prix: data.prix,
            categorie: data.categorie,
            allergenes:
                data.allergenes.length > 0 ? data.allergenes : undefined,
            tempsPreparation: data.tempsPreparation || undefined,
            disponible: data.disponible,
        };

        if (isEditing && item) {
            updateItem.mutate(
                { id: item.id, data: payload },
                {
                    onSuccess: () => {
                        toast.success("Plat modifié", {
                            description: "Le plat a été modifié avec succès",
                        });
                        form.reset();
                        onSuccess();
                    },
                    onError: (error) => {
                        toast.error("Erreur", {
                            description:
                                error instanceof Error
                                    ? error.message
                                    : "Impossible de modifier le plat",
                        });
                    },
                }
            );
        } else {
            createItem.mutate(payload, {
                onSuccess: () => {
                    toast.success("Plat créé", {
                        description: "Le plat a été ajouté au menu",
                    });
                    form.reset();
                    onSuccess();
                },
                onError: (error) => {
                    toast.error("Erreur", {
                        description:
                            error instanceof Error
                                ? error.message
                                : "Impossible de créer le plat",
                    });
                },
            });
        }
    };

    const isPending = createItem.isPending || updateItem.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[24px] font-semibold">
                        {isEditing ? "Modifier le plat" : "Nouveau plat"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Nom */}
                        <FormField
                            control={form.control}
                            name="nom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom du plat</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Burger Classic"
                                            className="h-11"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Description (optionnel)
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Décrivez le plat..."
                                            className="min-h-[80px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Prix & Catégorie */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="prix"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prix (€)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
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
                                name="categorie"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Catégorie</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {MENU_CATEGORIES.map((cat) => (
                                                    <SelectItem
                                                        key={cat}
                                                        value={cat}
                                                    >
                                                        {cat}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Temps de préparation */}
                        <FormField
                            control={form.control}
                            name="tempsPreparation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Temps de préparation (minutes)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="Ex: 15"
                                            className="h-11"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Allergènes */}
                        <FormField
                            control={form.control}
                            name="allergenes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Allergènes</FormLabel>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {ALLERGENS.map((allergen) => (
                                            <div
                                                key={allergen}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={allergen}
                                                    checked={field.value?.includes(
                                                        allergen
                                                    )}
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        if (checked) {
                                                            field.onChange([
                                                                ...(field.value ||
                                                                    []),
                                                                allergen,
                                                            ]);
                                                        } else {
                                                            field.onChange(
                                                                field.value?.filter(
                                                                    (a) =>
                                                                        a !==
                                                                        allergen
                                                                )
                                                            );
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor={allergen}
                                                    className="text-[13px] text-black/70 cursor-pointer"
                                                >
                                                    {allergen}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Disponible */}
                        <FormField
                            control={form.control}
                            name="disponible"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border border-black/10 p-4">
                                    <div>
                                        <FormLabel className="text-[14px] font-medium">
                                            Disponible à la vente
                                        </FormLabel>
                                        <p className="text-[12px] text-black/40 mt-0.5">
                                            Désactivez si le plat est
                                            temporairement indisponible
                                        </p>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogActionButtons
                            onCancel={() => onOpenChange(false)}
                            isLoading={isPending}
                            isEditing={isEditing}
                            submitLabel={
                                isEditing ? "Modifier" : "Créer le plat"
                            }
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
