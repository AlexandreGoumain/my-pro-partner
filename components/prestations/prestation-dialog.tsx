"use client";

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
    PRESTATION_CATEGORIES,
    useCreatePrestation,
    useUpdatePrestation,
    type Prestation,
} from "@/hooks/use-prestations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const prestationSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    description: z.string().optional(),
    duree: z.coerce.number().min(5, "La durée minimum est de 5 minutes"),
    prix: z.coerce.number().min(0, "Le prix doit être positif"),
    categorie: z.string().optional(),
    actif: z.boolean().default(true),
});

type PrestationFormValues = z.infer<typeof prestationSchema>;

interface PrestationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    prestation?: Prestation | null;
}

export function PrestationDialog({
    open,
    onOpenChange,
    onSuccess,
    prestation,
}: PrestationDialogProps) {
    const isEditing = !!prestation;
    const createPrestation = useCreatePrestation();
    const updatePrestation = useUpdatePrestation();

    const form = useForm<PrestationFormValues>({
        resolver: zodResolver(prestationSchema),
        defaultValues: {
            nom: "",
            description: "",
            duree: 60,
            prix: 0,
            categorie: "",
            actif: true,
        },
    });

    const [formKey, setFormKey] = useState(0);

    // Handle dialog open/close - reset form when opening
    const handleOpenChange = useCallback(
        (newOpen: boolean) => {
            if (newOpen) {
                if (prestation) {
                    form.reset({
                        nom: prestation.nom,
                        description: prestation.description || "",
                        duree: prestation.duree,
                        prix: prestation.prix,
                        categorie: prestation.categorie || "",
                        actif: prestation.actif,
                    });
                } else {
                    form.reset({
                        nom: "",
                        description: "",
                        duree: 60,
                        prix: 0,
                        categorie: "",
                        actif: true,
                    });
                }
                setFormKey((k) => k + 1);
            }
            onOpenChange(newOpen);
        },
        [prestation, form, onOpenChange]
    );

    const onSubmit = async (values: PrestationFormValues) => {
        try {
            if (isEditing && prestation) {
                await updatePrestation.mutateAsync({
                    id: prestation.id,
                    data: values,
                });
            } else {
                await createPrestation.mutateAsync(values);
            }
            onSuccess();
        } catch {
            // Error handled by mutation
        }
    };

    const isPending = createPrestation.isPending || updatePrestation.isPending;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em]">
                        {isEditing
                            ? "Modifier la prestation"
                            : "Nouvelle prestation"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                        key={formKey}
                    >
                        <FormField
                            control={form.control}
                            name="nom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[14px]">
                                        Nom
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Coupe femme"
                                            className="h-11 text-[14px] border-black/10"
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
                                    <FormLabel className="text-[14px]">
                                        Description (optionnel)
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Description de la prestation..."
                                            className="text-[14px] border-black/10 resize-none"
                                            rows={3}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="duree"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[14px]">
                                            Durée (minutes)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                min={5}
                                                step={5}
                                                className="h-11 text-[14px] border-black/10"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="prix"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[14px]">
                                            Prix (€)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                min={0}
                                                step={0.5}
                                                className="h-11 text-[14px] border-black/10"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="categorie"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[14px]">
                                        Catégorie (optionnel)
                                    </FormLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="h-11 text-[14px] border-black/10">
                                                <SelectValue placeholder="Sélectionner une catégorie" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {PRESTATION_CATEGORIES.map(
                                                (cat) => (
                                                    <SelectItem
                                                        key={cat}
                                                        value={cat}
                                                    >
                                                        {cat}
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
                            name="actif"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border border-black/10 p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-[14px]">
                                            Prestation active
                                        </FormLabel>
                                        <p className="text-[13px] text-black/50">
                                            Les prestations inactives ne sont
                                            pas proposées
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
                            onCancel={() => handleOpenChange(false)}
                            isLoading={isPending}
                            isEditing={isEditing}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
