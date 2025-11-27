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
import {
    TableStatus,
    useCreateTable,
    useUpdateTable,
    useUpdateTableStatus,
} from "@/hooks/use-tables";
import type { Table } from "@/lib/types/table.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ZONES = [
    "Salle principale",
    "Terrasse",
    "Salle VIP",
    "Bar",
    "Extérieur",
    "Mezzanine",
    "Autre",
];

const tableSchema = z.object({
    numero: z.coerce.number().int().positive("Le numéro doit être positif"),
    nom: z.string().optional(),
    capacite: z.coerce.number().int().min(1, "Capacité minimum: 1 personne"),
    zone: z.string().min(1, "La zone est requise"),
    statut: z.nativeEnum(TableStatus).optional(),
});

type TableFormValues = z.infer<typeof tableSchema>;

interface TableDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    table?: Table | null;
}

export function TableDialog({
    open,
    onOpenChange,
    onSuccess,
    table,
}: TableDialogProps) {
    const isEditing = !!table;

    const form = useForm<TableFormValues>({
        resolver: zodResolver(tableSchema),
        defaultValues: {
            numero: 1,
            nom: "",
            capacite: 4,
            zone: "Salle principale",
            statut: TableStatus.LIBRE,
        },
    });

    // Reset form when table changes
    useEffect(() => {
        if (table) {
            form.reset({
                numero: table.numero,
                nom: table.nom ?? "",
                capacite: table.capacite,
                zone: table.zone,
                statut: table.statut,
            });
        } else {
            form.reset({
                numero: 1,
                nom: "",
                capacite: 4,
                zone: "Salle principale",
                statut: TableStatus.LIBRE,
            });
        }
    }, [table, form]);

    const createTable = useCreateTable();
    const updateTable = useUpdateTable();
    const updateTableStatus = useUpdateTableStatus();

    const onSubmit = (data: TableFormValues) => {
        if (isEditing && table) {
            // Handle status change separately if needed
            const statusChanged = data.statut && data.statut !== table.statut;

            if (statusChanged) {
                updateTableStatus.mutate(
                    { id: table.id, statut: data.statut! },
                    {
                        onSuccess: () => {
                            // Then update other fields
                            updateTable.mutate(
                                {
                                    id: table.id,
                                    data: {
                                        numero: data.numero,
                                        capacite: data.capacite,
                                        zone: data.zone as Table["zone"],
                                    },
                                },
                                {
                                    onSuccess: () => {
                                        toast.success("Table modifiée", {
                                            description:
                                                "La table a été modifiée avec succès",
                                        });
                                        form.reset();
                                        onSuccess();
                                    },
                                    onError: (error) => {
                                        toast.error("Erreur", {
                                            description:
                                                error instanceof Error
                                                    ? error.message
                                                    : "Impossible de modifier la table",
                                        });
                                    },
                                }
                            );
                        },
                        onError: (error) => {
                            toast.error("Erreur", {
                                description:
                                    error instanceof Error
                                        ? error.message
                                        : "Impossible de changer le statut",
                            });
                        },
                    }
                );
            } else {
                updateTable.mutate(
                    {
                        id: table.id,
                        data: {
                            numero: data.numero,
                            capacite: data.capacite,
                            zone: data.zone as Table["zone"],
                        },
                    },
                    {
                        onSuccess: () => {
                            toast.success("Table modifiée", {
                                description:
                                    "La table a été modifiée avec succès",
                            });
                            form.reset();
                            onSuccess();
                        },
                        onError: (error) => {
                            toast.error("Erreur", {
                                description:
                                    error instanceof Error
                                        ? error.message
                                        : "Impossible de modifier la table",
                            });
                        },
                    }
                );
            }
        } else {
            createTable.mutate(
                {
                    numero: data.numero,
                    capacite: data.capacite,
                    zone: data.zone as Table["zone"],
                },
                {
                    onSuccess: () => {
                        toast.success("Table créée", {
                            description:
                                "La table a été ajoutée au plan de salle",
                        });
                        form.reset();
                        onSuccess();
                    },
                    onError: (error) => {
                        toast.error("Erreur", {
                            description:
                                error instanceof Error
                                    ? error.message
                                    : "Impossible de créer la table",
                        });
                    },
                }
            );
        }
    };

    const isPending =
        createTable.isPending ||
        updateTable.isPending ||
        updateTableStatus.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-[24px] font-semibold">
                        {isEditing ? "Modifier la table" : "Nouvelle table"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Numéro et Capacité */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="numero"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Numéro</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
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
                                name="capacite"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Capacité</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={20}
                                                placeholder="4"
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Zone */}
                        <FormField
                            control={form.control}
                            name="zone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Zone</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Sélectionner une zone" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {ZONES.map((zone) => (
                                                <SelectItem
                                                    key={zone}
                                                    value={zone}
                                                >
                                                    {zone}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Statut (only when editing) */}
                        {isEditing && (
                            <FormField
                                control={form.control}
                                name="statut"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Statut</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Sélectionner un statut" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem
                                                    value={TableStatus.LIBRE}
                                                >
                                                    Libre
                                                </SelectItem>
                                                <SelectItem
                                                    value={TableStatus.OCCUPEE}
                                                >
                                                    Occupée
                                                </SelectItem>
                                                <SelectItem
                                                    value={TableStatus.RESERVEE}
                                                >
                                                    Réservée
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <DialogActionButtons
                            onCancel={() => onOpenChange(false)}
                            isLoading={isPending}
                            isEditing={isEditing}
                            submitLabel={
                                isEditing ? "Modifier" : "Créer la table"
                            }
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
