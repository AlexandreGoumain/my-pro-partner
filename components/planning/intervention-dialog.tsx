"use client";

import { Button } from "@/components/ui/button";
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClients, type Client } from "@/hooks/use-clients";
import { useFlotte } from "@/hooks/use-flotte";
import { useCreateIntervention } from "@/hooks/use-interventions";
import {
    PRIORITE_LABELS,
    TYPE_EQUIPEMENT_LABELS,
    TYPE_INTERVENTION_LABELS,
    type PrioriteIntervention,
    type TypeEquipementPlomberie,
    type TypeIntervention,
} from "@/lib/types/intervention";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const interventionSchema = z.object({
    clientId: z.string().min(1, "Le client est requis"),
    typeIntervention: z.string().min(1, "Le type est requis"),
    priorite: z.string(),
    description: z.string().min(1, "La description est requise"),
    adresse: z.string().min(1, "L'adresse est requise"),
    codePostal: z.string().min(1, "Le code postal est requis"),
    ville: z.string().min(1, "La ville est requise"),
    complementAdresse: z.string().optional(),
    equipement: z.string().optional(),
    marqueEquipement: z.string().optional(),
    modeleEquipement: z.string().optional(),
    datePrevisionnelle: z.string().optional(),
    heurePrevisionnelle: z.string().optional(),
    dureeEstimeeH: z.coerce.number().min(0).optional(),
    plombierId: z.string().optional(),
    camionnetteId: z.string().optional(),
});

type InterventionFormValues = z.infer<typeof interventionSchema>;

interface InterventionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    defaultDate?: Date;
    plombiers?: { id: string; name: string | null }[];
}

export function InterventionDialog({
    open,
    onOpenChange,
    onSuccess,
    defaultDate,
    plombiers = [],
}: InterventionDialogProps) {
    const [searchClient, setSearchClient] = useState("");

    const { data: clientsData } = useClients();
    const clients = useMemo(() => clientsData || [], [clientsData]);

    const { data: camionnettes = [] } = useFlotte();

    const filteredClients = useMemo(() => {
        if (!searchClient) return clients.slice(0, 50);
        const search = searchClient.toLowerCase();
        return clients
            .filter(
                (c: Client) =>
                    c.nom?.toLowerCase().includes(search) ||
                    c.prenom?.toLowerCase().includes(search) ||
                    c.telephone?.includes(search)
            )
            .slice(0, 50);
    }, [clients, searchClient]);

    const form = useForm<InterventionFormValues>({
        resolver: zodResolver(interventionSchema),
        defaultValues: {
            clientId: "",
            typeIntervention: "DEPANNAGE",
            priorite: "NORMALE",
            description: "",
            adresse: "",
            codePostal: "",
            ville: "",
            complementAdresse: "",
            equipement: "",
            marqueEquipement: "",
            modeleEquipement: "",
            datePrevisionnelle: defaultDate
                ? format(defaultDate, "yyyy-MM-dd")
                : "",
            heurePrevisionnelle: "09:00",
            dureeEstimeeH: 1,
            plombierId: "",
            camionnetteId: "",
        },
    });

    // Reset form when dialog opens with new date
    useEffect(() => {
        if (open && defaultDate) {
            form.setValue("datePrevisionnelle", format(defaultDate, "yyyy-MM-dd"));
        }
    }, [open, defaultDate, form]);

    const selectedClientId = form.watch("clientId");

    // Auto-fill address when client is selected
    useEffect(() => {
        if (selectedClientId) {
            const client = clients.find((c: Client) => c.id === selectedClientId);
            if (client) {
                form.setValue("adresse", client.adresse || "");
                form.setValue("codePostal", client.codePostal || "");
                form.setValue("ville", client.ville || "");
            }
        }
    }, [selectedClientId, clients, form]);

    const createIntervention = useCreateIntervention();

    const onSubmit = (data: InterventionFormValues) => {
        let datePrevisionnelle: string | undefined;
        if (data.datePrevisionnelle) {
            const date = new Date(data.datePrevisionnelle);
            if (data.heurePrevisionnelle) {
                const [hours, minutes] = data.heurePrevisionnelle.split(":");
                date.setHours(parseInt(hours), parseInt(minutes));
            }
            datePrevisionnelle = date.toISOString();
        }

        const payload = {
            clientId: data.clientId,
            typeIntervention: data.typeIntervention as TypeIntervention,
            priorite: data.priorite as PrioriteIntervention,
            description: data.description,
            adresse: data.adresse,
            codePostal: data.codePostal,
            ville: data.ville,
            complementAdresse: data.complementAdresse || undefined,
            equipement: (data.equipement as TypeEquipementPlomberie) || undefined,
            marqueEquipement: data.marqueEquipement || undefined,
            modeleEquipement: data.modeleEquipement || undefined,
            datePrevisionnelle,
            plombierId: data.plombierId || undefined,
            camionnetteId: data.camionnetteId || undefined,
        };

        createIntervention.mutate(payload, {
            onSuccess: () => {
                toast.success("Intervention créée", {
                    description: "L'intervention a été planifiée",
                });
                form.reset();
                onSuccess();
            },
            onError: (error) => {
                toast.error("Erreur", {
                    description:
                        error instanceof Error
                            ? error.message
                            : "Impossible de créer l'intervention",
                });
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[24px] font-semibold">
                        Nouvelle intervention
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        {/* Client Selection */}
                        <FormField
                            control={form.control}
                            name="clientId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Client</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Sélectionner un client" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <div className="p-2">
                                                <Input
                                                    placeholder="Rechercher..."
                                                    value={searchClient}
                                                    onChange={(e) =>
                                                        setSearchClient(e.target.value)
                                                    }
                                                    className="h-9"
                                                />
                                            </div>
                                            {filteredClients.map((client: Client) => (
                                                <SelectItem
                                                    key={client.id}
                                                    value={client.id}
                                                >
                                                    {client.prenom} {client.nom}
                                                    {client.telephone &&
                                                        ` - ${client.telephone}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Type & Priorité */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="typeIntervention"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type d&apos;intervention</FormLabel>
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
                                                    TYPE_INTERVENTION_LABELS
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
                                name="priorite"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priorité</FormLabel>
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
                                                {Object.entries(PRIORITE_LABELS).map(
                                                    ([value, label]) => (
                                                        <SelectItem
                                                            key={value}
                                                            value={value}
                                                        >
                                                            {label}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
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
                                    <FormLabel>Description du problème</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Décrivez le problème ou la demande..."
                                            className="min-h-[80px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Address */}
                        <FormField
                            control={form.control}
                            name="adresse"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Adresse</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Adresse complète"
                                            className="h-11"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="codePostal"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code postal</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="75000"
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
                                name="ville"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ville</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Paris"
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Équipement */}
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="equipement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Équipement</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Optionnel" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    Non spécifié
                                                </SelectItem>
                                                {Object.entries(
                                                    TYPE_EQUIPEMENT_LABELS
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
                                name="marqueEquipement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Marque</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Saunier Duval"
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
                                name="modeleEquipement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Modèle</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Thema Plus"
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Planning */}
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="datePrevisionnelle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date prévue</FormLabel>
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
                                name="heurePrevisionnelle"
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

                            <FormField
                                control={form.control}
                                name="dureeEstimeeH"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Durée estimée (h)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.5"
                                                min={0}
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Assignment */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="plombierId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Technicien assigné</FormLabel>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(
                                                    value === "none" ? "" : value
                                                )
                                            }
                                            value={field.value || "none"}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Optionnel" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    Non assigné
                                                </SelectItem>
                                                {plombiers.map((p) => (
                                                    <SelectItem key={p.id} value={p.id}>
                                                        {p.name || "Sans nom"}
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
                                name="camionnetteId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Véhicule</FormLabel>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(
                                                    value === "none" ? "" : value
                                                )
                                            }
                                            value={field.value || "none"}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Optionnel" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    Non assigné
                                                </SelectItem>
                                                {camionnettes.map((c) => (
                                                    <SelectItem key={c.id} value={c.id}>
                                                        {c.immatriculation}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Annuler
                            </Button>
                            <PrimaryActionButton
                                type="submit"
                                disabled={createIntervention.isPending}
                            >
                                {createIntervention.isPending
                                    ? "Création..."
                                    : "Créer l'intervention"}
                            </PrimaryActionButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
