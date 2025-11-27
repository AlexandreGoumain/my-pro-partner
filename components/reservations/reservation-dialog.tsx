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
    ReservationStatut,
    useCreateReservation,
    useUpdateReservation,
} from "@/hooks/use-reservations";
import { useTables, type Table } from "@/hooks/use-tables";
import type { Reservation } from "@/lib/types/reservation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const reservationSchema = z.object({
    nomClient: z.string().min(1, "Le nom du client est requis"),
    telephone: z.string().optional(),
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    date: z.string().min(1, "La date est requise"),
    heure: z
        .string()
        .regex(
            /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            "Format d'heure invalide (HH:MM)"
        ),
    personnes: z.coerce.number().int().min(1, "Au moins 1 personne requise"),
    tableId: z.string().optional(),
    notes: z.string().optional(),
    statut: z.nativeEnum(ReservationStatut).optional(),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

interface ReservationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    reservation?: Reservation | null;
}

export function ReservationDialog({
    open,
    onOpenChange,
    onSuccess,
    reservation,
}: ReservationDialogProps) {
    const isEditing = !!reservation;

    // Fetch tables for assignment
    const { data: tables = [] as Table[] } = useTables();

    const form = useForm<ReservationFormValues>({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            nomClient: "",
            telephone: "",
            email: "",
            date: new Date().toISOString().split("T")[0],
            heure: "19:00",
            personnes: 2,
            tableId: "",
            notes: "",
            statut: ReservationStatut.EN_ATTENTE,
        },
    });

    // Reset form when reservation changes
    useEffect(() => {
        if (reservation) {
            const dateStr =
                typeof reservation.date === "string"
                    ? reservation.date.split("T")[0]
                    : new Date(reservation.date).toISOString().split("T")[0];

            form.reset({
                nomClient: reservation.nomClient,
                telephone: reservation.telephone || "",
                email: reservation.email || "",
                date: dateStr,
                heure: reservation.heure,
                personnes: reservation.personnes,
                tableId: reservation.tableId || "",
                notes: reservation.notes || "",
                statut: reservation.statut,
            });
        } else {
            form.reset({
                nomClient: "",
                telephone: "",
                email: "",
                date: new Date().toISOString().split("T")[0],
                heure: "19:00",
                personnes: 2,
                tableId: "",
                notes: "",
                statut: ReservationStatut.EN_ATTENTE,
            });
        }
    }, [reservation, form]);

    const createReservation = useCreateReservation();
    const updateReservation = useUpdateReservation();

    const onSubmit = (data: ReservationFormValues) => {
        const payload = {
            nomClient: data.nomClient,
            telephone: data.telephone || undefined,
            email: data.email || undefined,
            date: data.date,
            heure: data.heure,
            personnes: data.personnes,
            tableId: data.tableId || undefined,
            notes: data.notes || undefined,
        };

        if (isEditing && reservation) {
            updateReservation.mutate(
                {
                    id: reservation.id,
                    data: {
                        ...payload,
                        statut: data.statut,
                    },
                },
                {
                    onSuccess: () => {
                        toast.success("Réservation modifiée", {
                            description:
                                "La réservation a été modifiée avec succès",
                        });
                        form.reset();
                        onSuccess();
                    },
                    onError: (error) => {
                        toast.error("Erreur", {
                            description:
                                error instanceof Error
                                    ? error.message
                                    : "Impossible de modifier la réservation",
                        });
                    },
                }
            );
        } else {
            createReservation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Réservation créée", {
                        description: "La réservation a été enregistrée",
                    });
                    form.reset();
                    onSuccess();
                },
                onError: (error) => {
                    toast.error("Erreur", {
                        description:
                            error instanceof Error
                                ? error.message
                                : "Impossible de créer la réservation",
                    });
                },
            });
        }
    };

    const isPending =
        createReservation.isPending || updateReservation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-[24px] font-semibold">
                        {isEditing
                            ? "Modifier la réservation"
                            : "Nouvelle réservation"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Nom du client */}
                        <FormField
                            control={form.control}
                            name="nomClient"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom du client</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Martin Dupont"
                                            className="h-11"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Téléphone & Email */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="telephone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Téléphone</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="06 12 34 56 78"
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
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="client@email.com"
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Date & Heure */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
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

                            <FormField
                                control={form.control}
                                name="heure"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Heure</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="time"
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Personnes & Table */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="personnes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Nombre de personnes
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={50}
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
                                name="tableId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Table (optionnel)</FormLabel>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(
                                                    value === "none"
                                                        ? ""
                                                        : value
                                                )
                                            }
                                            value={field.value || "none"}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Sélectionner une table" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    Non assignée
                                                </SelectItem>
                                                {tables.map((table) => (
                                                    <SelectItem
                                                        key={table.id}
                                                        value={table.id}
                                                    >
                                                        Table {table.numero} -{" "}
                                                        {table.zone} (
                                                        {table.capacite} pers.)
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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
                                                    value={
                                                        ReservationStatut.EN_ATTENTE
                                                    }
                                                >
                                                    En attente
                                                </SelectItem>
                                                <SelectItem
                                                    value={
                                                        ReservationStatut.CONFIRMEE
                                                    }
                                                >
                                                    Confirmée
                                                </SelectItem>
                                                <SelectItem
                                                    value={
                                                        ReservationStatut.ARRIVEE
                                                    }
                                                >
                                                    Arrivée
                                                </SelectItem>
                                                <SelectItem
                                                    value={
                                                        ReservationStatut.TERMINEE
                                                    }
                                                >
                                                    Terminée
                                                </SelectItem>
                                                <SelectItem
                                                    value={
                                                        ReservationStatut.ANNULEE
                                                    }
                                                >
                                                    Annulée
                                                </SelectItem>
                                                <SelectItem
                                                    value={
                                                        ReservationStatut.NO_SHOW
                                                    }
                                                >
                                                    No-show
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Notes */}
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes (optionnel)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Allergies, préférences, demandes spéciales..."
                                            className="min-h-[80px] resize-none"
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
                                isEditing ? "Modifier" : "Créer la réservation"
                            }
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
