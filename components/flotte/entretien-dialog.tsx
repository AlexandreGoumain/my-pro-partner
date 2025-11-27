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
import { Textarea } from "@/components/ui/textarea";
import {
    useCreateEntretienVehicule,
    useUpdateEntretienVehicule,
} from "@/hooks/use-entretiens-vehicules";
import type {
    Camionnette,
    EntretienVehicule,
    TypeEntretienVehicule,
} from "@/lib/types/flotte";
import { TYPE_ENTRETIEN_LABELS } from "@/lib/types/flotte";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const entretienSchema = z.object({
    camionnetteId: z.string().min(1, "Le véhicule est requis"),
    type: z.enum([
        "VIDANGE",
        "REVISION",
        "PNEUS",
        "FREINS",
        "CONTROLE_TECHNIQUE",
        "REPARATION",
        "AUTRE",
    ]),
    description: z.string().optional(),
    kilometrage: z.coerce.number().min(0).optional().or(z.literal("")),
    cout: z.coerce.number().min(0).optional().or(z.literal("")),
    dateEntretien: z.string().min(1, "La date est requise"),
    dateProchain: z.string().optional(),
    prestataire: z.string().optional(),
    numeroFacture: z.string().optional(),
    notes: z.string().optional(),
});

type EntretienFormValues = z.infer<typeof entretienSchema>;

interface EntretienDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    entretien?: EntretienVehicule | null;
    camionnettes: Camionnette[];
}

export function EntretienDialog({
    open,
    onOpenChange,
    onSuccess,
    entretien,
    camionnettes,
}: EntretienDialogProps) {
    const isEditing = !!entretien;

    const form = useForm<EntretienFormValues>({
        resolver: zodResolver(entretienSchema),
        defaultValues: {
            camionnetteId: "",
            type: "REVISION",
            description: "",
            kilometrage: "",
            cout: "",
            dateEntretien: format(new Date(), "yyyy-MM-dd"),
            dateProchain: "",
            prestataire: "",
            numeroFacture: "",
            notes: "",
        },
    });

    // Reset form when entretien changes
    useEffect(() => {
        if (entretien) {
            form.reset({
                camionnetteId: entretien.camionnetteId,
                type: entretien.type,
                description: entretien.description || "",
                kilometrage: entretien.kilometrage || "",
                cout: entretien.cout || "",
                dateEntretien: format(
                    new Date(entretien.dateEntretien),
                    "yyyy-MM-dd"
                ),
                dateProchain: entretien.dateProchain
                    ? format(new Date(entretien.dateProchain), "yyyy-MM-dd")
                    : "",
                prestataire: entretien.prestataire || "",
                numeroFacture: entretien.numeroFacture || "",
                notes: entretien.notes || "",
            });
        } else {
            form.reset({
                camionnetteId: "",
                type: "REVISION",
                description: "",
                kilometrage: "",
                cout: "",
                dateEntretien: format(new Date(), "yyyy-MM-dd"),
                dateProchain: "",
                prestataire: "",
                numeroFacture: "",
                notes: "",
            });
        }
    }, [entretien, form]);

    const createEntretien = useCreateEntretienVehicule();
    const updateEntretien = useUpdateEntretienVehicule();

    const onSubmit = (data: EntretienFormValues) => {
        const payload = {
            camionnetteId: data.camionnetteId,
            type: data.type as TypeEntretienVehicule,
            description: data.description || undefined,
            kilometrage: data.kilometrage
                ? Number(data.kilometrage)
                : undefined,
            cout: data.cout ? Number(data.cout) : undefined,
            dateEntretien: data.dateEntretien,
            dateProchain: data.dateProchain || undefined,
            prestataire: data.prestataire || undefined,
            numeroFacture: data.numeroFacture || undefined,
            notes: data.notes || undefined,
        };

        if (isEditing && entretien) {
            updateEntretien.mutate(
                { id: entretien.id, data: payload },
                {
                    onSuccess: () => {
                        toast.success("Entretien modifié", {
                            description:
                                "L'entretien a été modifié avec succès",
                        });
                        form.reset();
                        onSuccess();
                    },
                    onError: (error) => {
                        toast.error("Erreur", {
                            description:
                                error instanceof Error
                                    ? error.message
                                    : "Impossible de modifier l'entretien",
                        });
                    },
                }
            );
        } else {
            createEntretien.mutate(payload, {
                onSuccess: () => {
                    toast.success("Entretien créé", {
                        description: "L'entretien a été enregistré",
                    });
                    form.reset();
                    onSuccess();
                },
                onError: (error) => {
                    toast.error("Erreur", {
                        description:
                            error instanceof Error
                                ? error.message
                                : "Impossible de créer l'entretien",
                    });
                },
            });
        }
    };

    const isPending = createEntretien.isPending || updateEntretien.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[24px] font-semibold">
                        {isEditing
                            ? "Modifier l'entretien"
                            : "Nouvel entretien"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        {/* Véhicule */}
                        <FormField
                            control={form.control}
                            name="camionnetteId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Véhicule</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={isEditing}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Sélectionner un véhicule" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {camionnettes.map((c) => (
                                                <SelectItem
                                                    key={c.id}
                                                    value={c.id}
                                                >
                                                    {c.immatriculation}
                                                    {c.marque &&
                                                        ` - ${c.marque} ${c.modele || ""}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Type & Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Type d&apos;entretien
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-11">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.entries(
                                                    TYPE_ENTRETIEN_LABELS
                                                ).map(([value, label]) => (
                                                    <SelectItem
                                                        key={value}
                                                        value={value}
                                                    >
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dateEntretien"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Kilométrage & Coût */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="kilometrage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kilométrage</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Ex: 45000"
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
                                name="cout"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Coût (€)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="Ex: 150.00"
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Détails de l'entretien..."
                                            className="min-h-[80px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Prestataire & Facture */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="prestataire"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prestataire</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nom du garage"
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
                                name="numeroFacture"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>N° Facture</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: FAC-2024-001"
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Date prochain entretien */}
                        <FormField
                            control={form.control}
                            name="dateProchain"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Prochain entretien prévu
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            className="h-11"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Notes */}
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Notes additionnelles..."
                                            className="min-h-[60px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogActionButtons
                            onCancel={() => onOpenChange(false)}
                            isLoading={isPending}
                            isEditing={isEditing}
                            submitLabel={
                                isEditing ? "Modifier" : "Créer l'entretien"
                            }
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
