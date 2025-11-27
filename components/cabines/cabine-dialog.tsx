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
    CABINE_TYPES,
    useCreateCabine,
    useUpdateCabine,
    type Cabine,
} from "@/hooks/use-cabines";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const COLORS = [
    { value: "#EC4899", label: "Rose" },
    { value: "#8B5CF6", label: "Violet" },
    { value: "#3B82F6", label: "Bleu" },
    { value: "#10B981", label: "Vert" },
    { value: "#F59E0B", label: "Orange" },
    { value: "#EF4444", label: "Rouge" },
    { value: "#6B7280", label: "Gris" },
    { value: "#000000", label: "Noir" },
];

const cabineSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    description: z.string().optional(),
    type: z.string().optional(),
    capacite: z.coerce.number().min(1, "Capacité minimum : 1"),
    equipements: z.string().optional(),
    couleur: z.string().optional(),
    actif: z.boolean(),
});

type CabineFormValues = z.infer<typeof cabineSchema>;

interface CabineDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    cabine?: Cabine | null;
}

export function CabineDialog({
    open,
    onOpenChange,
    onSuccess,
    cabine,
}: CabineDialogProps) {
    const isEditing = !!cabine;
    const createCabine = useCreateCabine();
    const updateCabine = useUpdateCabine();

    const form = useForm<CabineFormValues>({
        resolver: zodResolver(cabineSchema),
        defaultValues: {
            nom: "",
            description: "",
            type: "",
            capacite: 1,
            equipements: "",
            couleur: "#EC4899",
            actif: true,
        },
    });

    useEffect(() => {
        if (open) {
            if (cabine) {
                form.reset({
                    nom: cabine.nom,
                    description: cabine.description || "",
                    type: cabine.type || "",
                    capacite: cabine.capacite,
                    equipements: cabine.equipements || "",
                    couleur: cabine.couleur || "#EC4899",
                    actif: cabine.actif,
                });
            } else {
                form.reset({
                    nom: "",
                    description: "",
                    type: "",
                    capacite: 1,
                    equipements: "",
                    couleur: "#EC4899",
                    actif: true,
                });
            }
        }
    }, [open, cabine, form]);

    const onSubmit = async (values: CabineFormValues) => {
        try {
            const data = {
                ...values,
                type: values.type || undefined,
            };
            if (isEditing && cabine) {
                await updateCabine.mutateAsync({ id: cabine.id, data });
            } else {
                await createCabine.mutateAsync(data);
            }
            onSuccess();
        } catch {
            // Error handled by mutation
        }
    };

    const isPending = createCabine.isPending || updateCabine.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em]">
                        {isEditing ? "Modifier la cabine" : "Nouvelle cabine"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        {/* Nom */}
                        <FormField
                            control={form.control}
                            name="nom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[14px]">
                                        Nom de la cabine *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Cabine Zen, Salle Hammam..."
                                            className="h-11 text-[14px] border-black/10"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Type & Capacité */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[14px]">
                                            Type
                                        </FormLabel>
                                        <Select
                                            value={field.value || "__none__"}
                                            onValueChange={(val) =>
                                                field.onChange(
                                                    val === "__none__"
                                                        ? ""
                                                        : val
                                                )
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-11 text-[14px] border-black/10">
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="__none__">
                                                    Non spécifié
                                                </SelectItem>
                                                {CABINE_TYPES.map((type) => (
                                                    <SelectItem
                                                        key={type.value}
                                                        value={type.value}
                                                    >
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="capacite"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[14px]">
                                            Capacité
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                min={1}
                                                className="h-11 text-[14px] border-black/10"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Couleur */}
                        <FormField
                            control={form.control}
                            name="couleur"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[14px]">
                                        Couleur (planning)
                                    </FormLabel>
                                    <div className="flex gap-2 flex-wrap">
                                        {COLORS.map((color) => (
                                            <button
                                                key={color.value}
                                                type="button"
                                                onClick={() =>
                                                    field.onChange(color.value)
                                                }
                                                className={`w-8 h-8 rounded-full transition-all ${
                                                    field.value === color.value
                                                        ? "ring-2 ring-offset-2 ring-black"
                                                        : ""
                                                }`}
                                                style={{
                                                    backgroundColor:
                                                        color.value,
                                                }}
                                                title={color.label}
                                            />
                                        ))}
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Équipements */}
                        <FormField
                            control={form.control}
                            name="equipements"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[14px]">
                                        Équipements
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Table de massage, jacuzzi, douche..."
                                            className="h-11 text-[14px] border-black/10"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Description */}
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
                                            {...field}
                                            placeholder="Description de la cabine..."
                                            className="text-[14px] border-black/10 resize-none"
                                            rows={2}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Actif */}
                        {isEditing && (
                            <FormField
                                control={form.control}
                                name="actif"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border border-black/10 p-4">
                                        <div>
                                            <FormLabel className="text-[14px]">
                                                Cabine active
                                            </FormLabel>
                                            <p className="text-[13px] text-black/50">
                                                Les cabines inactives ne sont
                                                pas proposées lors de la
                                                réservation
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
                        )}

                        <DialogActionButtons
                            onCancel={() => onOpenChange(false)}
                            isLoading={isPending}
                            isEditing={isEditing}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
