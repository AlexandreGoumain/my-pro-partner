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
import { useCreateIntervention } from "@/hooks/use-interventions";
import {
    PRIORITE_INTERVENTION,
    PRIORITE_LABELS,
    TYPE_EQUIPEMENT_LABELS,
    TYPE_EQUIPEMENT_PLOMBERIE,
    TYPE_INTERVENTION,
    TYPE_INTERVENTION_LABELS,
} from "@/lib/types/intervention";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const interventionSchema = z.object({
    clientId: z.string().min(1, "Sélectionnez un client"),
    typeIntervention: z.enum(TYPE_INTERVENTION, {
        required_error: "Sélectionnez un type d'intervention",
    }),
    priorite: z.enum(PRIORITE_INTERVENTION).default("NORMALE"),
    description: z.string().min(10, "Description de 10 caractères minimum"),
    adresse: z.string().min(1, "L'adresse est requise"),
    codePostal: z.string().regex(/^\d{5}$/, "Code postal invalide"),
    ville: z.string().min(1, "La ville est requise"),
    complementAdresse: z.string().optional(),
    equipement: z.enum(TYPE_EQUIPEMENT_PLOMBERIE).optional(),
    marqueEquipement: z.string().optional(),
    modeleEquipement: z.string().optional(),
    datePrevisionnelle: z.string().optional(),
});

type InterventionFormValues = z.infer<typeof interventionSchema>;

interface InterventionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function InterventionDialog({
    open,
    onOpenChange,
    onSuccess,
}: InterventionDialogProps) {
    // Fetch clients for selection
    const { data: clientsData } = useQuery({
        queryKey: ["clients", "list", { limit: 100 }],
        queryFn: async () => {
            const response = await fetch("/api/clients?limit=100");
            if (!response.ok) throw new Error("Failed to fetch clients");
            return response.json();
        },
        enabled: open,
    });

    const clients = clientsData?.items || clientsData?.clients || [];

    const form = useForm<InterventionFormValues>({
        resolver: zodResolver(interventionSchema),
        defaultValues: {
            clientId: "",
            typeIntervention: undefined,
            priorite: "NORMALE",
            description: "",
            adresse: "",
            codePostal: "",
            ville: "",
            complementAdresse: "",
            equipement: undefined,
            marqueEquipement: "",
            modeleEquipement: "",
            datePrevisionnelle: "",
        },
    });

    const createIntervention = useCreateIntervention();

    // Auto-fill address when client is selected
    const handleClientChange = (clientId: string) => {
        form.setValue("clientId", clientId);
        const client = clients.find((c: { id: string }) => c.id === clientId);
        if (client) {
            if (client.adresse) form.setValue("adresse", client.adresse);
            if (client.codePostal)
                form.setValue("codePostal", client.codePostal);
            if (client.ville) form.setValue("ville", client.ville);
        }
    };

    const onSubmit = (data: InterventionFormValues) => {
        createIntervention.mutate(data, {
            onSuccess: () => {
                toast.success("Intervention créée", {
                    description: "L'intervention a été créée avec succès",
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
                        className="space-y-6"
                    >
                        {/* Client Selection */}
                        <FormField
                            control={form.control}
                            name="clientId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Client</FormLabel>
                                    <Select
                                        onValueChange={handleClientChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Sélectionner un client" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {clients.map(
                                                (client: {
                                                    id: string;
                                                    nom: string;
                                                    prenom?: string | null;
                                                    telephone?: string | null;
                                                }) => (
                                                    <SelectItem
                                                        key={client.id}
                                                        value={client.id}
                                                    >
                                                        {client.prenom
                                                            ? `${client.prenom} ${client.nom}`
                                                            : client.nom}
                                                        {client.telephone &&
                                                            ` - ${client.telephone}`}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Type and Priority */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="typeIntervention"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Type d&apos;intervention
                                        </FormLabel>
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
                                                {TYPE_INTERVENTION.map(
                                                    (type) => (
                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                        >
                                                            {
                                                                TYPE_INTERVENTION_LABELS[
                                                                    type
                                                                ]
                                                            }
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
                                                {PRIORITE_INTERVENTION.map(
                                                    (priorite) => (
                                                        <SelectItem
                                                            key={priorite}
                                                            value={priorite}
                                                        >
                                                            {
                                                                PRIORITE_LABELS[
                                                                    priorite
                                                                ]
                                                            }
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
                                    <FormLabel>
                                        Description du problème
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Décrivez le problème rencontré par le client..."
                                            className="resize-none min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Address Section */}
                        <div className="space-y-4">
                            <h3 className="text-[16px] font-semibold">
                                Adresse d&apos;intervention
                            </h3>

                            <FormField
                                control={form.control}
                                name="adresse"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Adresse</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="123 rue de la Plomberie"
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
                                                    maxLength={5}
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

                            <FormField
                                control={form.control}
                                name="complementAdresse"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Complément (optionnel)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Bâtiment A, 3ème étage..."
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Equipment Section */}
                        <div className="space-y-4">
                            <h3 className="text-[16px] font-semibold">
                                Équipement concerné (optionnel)
                            </h3>

                            <FormField
                                control={form.control}
                                name="equipement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Type d&apos;équipement
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Sélectionner (optionnel)" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {TYPE_EQUIPEMENT_PLOMBERIE.map(
                                                    (type) => (
                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                        >
                                                            {
                                                                TYPE_EQUIPEMENT_LABELS[
                                                                    type
                                                                ]
                                                            }
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
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
                                                    placeholder="Ex: Thema Plus F25"
                                                    className="h-11"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Date prévisionnelle */}
                        <FormField
                            control={form.control}
                            name="datePrevisionnelle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Date prévisionnelle (optionnel)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="datetime-local"
                                            className="h-11"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                    ? "Création en cours..."
                                    : "Créer l'intervention"}
                            </PrimaryActionButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
