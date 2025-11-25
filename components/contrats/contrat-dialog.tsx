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
import { useCreateContrat } from "@/hooks/use-contrats";
import {
    PERIODICITE_LABELS,
    TYPE_CONTRAT_LABELS,
    type PeriodiciteContrat,
    type TypeContratEntretien,
} from "@/lib/types/contrats";
import { zodResolver } from "@hookform/resolvers/zod";
import { addYears, format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const TVA_RATE = 0.1; // 10% TVA for maintenance contracts

const contratSchema = z.object({
    clientId: z.string().min(1, "Le client est requis"),
    typeContrat: z.enum([
        "CHAUDIERE",
        "ADOUCISSEUR",
        "PLOMBERIE_GENERAL",
        "MULTI_EQUIPEMENTS",
        "PERSONNALISE",
    ]),
    nom: z.string().min(1, "Le nom du contrat est requis"),
    description: z.string().optional(),
    adresse: z.string().min(1, "L'adresse est requise"),
    codePostal: z.string().min(1, "Le code postal est requis"),
    ville: z.string().min(1, "La ville est requise"),
    dateDebut: z.string().min(1, "La date de début est requise"),
    dureeAnnees: z.coerce.number().min(1).max(10),
    montantHT: z.coerce.number().min(0, "Le montant doit être positif"),
    periodicite: z.enum(["MENSUEL", "TRIMESTRIEL", "SEMESTRIEL", "ANNUEL"]),
    nombreRevisionsAn: z.coerce.number().min(0).max(12),
    interventionsIncluses: z.coerce.number().min(0),
    remisePieces: z.coerce.number().min(0).max(100).optional(),
    renouvellementAuto: z.boolean(),
    notes: z.string().optional(),
});

type ContratFormValues = z.infer<typeof contratSchema>;

interface ContratDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ContratDialog({
    open,
    onOpenChange,
    onSuccess,
}: ContratDialogProps) {
    const [searchClient, setSearchClient] = useState("");

    const { data: clientsData } = useClients();
    const clients = useMemo(() => clientsData || [], [clientsData]);

    const filteredClients = useMemo(() => {
        if (!searchClient) return clients.slice(0, 50);
        const search = searchClient.toLowerCase();
        return clients
            .filter(
                (c: Client) =>
                    c.nom?.toLowerCase().includes(search) ||
                    c.prenom?.toLowerCase().includes(search) ||
                    c.email?.toLowerCase().includes(search)
            )
            .slice(0, 50);
    }, [clients, searchClient]);

    const form = useForm<ContratFormValues>({
        resolver: zodResolver(contratSchema),
        defaultValues: {
            clientId: "",
            typeContrat: "CHAUDIERE",
            nom: "",
            description: "",
            adresse: "",
            codePostal: "",
            ville: "",
            dateDebut: format(new Date(), "yyyy-MM-dd"),
            dureeAnnees: 1,
            montantHT: 0,
            periodicite: "ANNUEL",
            nombreRevisionsAn: 1,
            interventionsIncluses: 0,
            remisePieces: 0,
            renouvellementAuto: true,
            notes: "",
        },
    });

    const selectedClientId = form.watch("clientId");
    const montantHT = form.watch("montantHT");
    const dureeAnnees = form.watch("dureeAnnees");
    const dateDebut = form.watch("dateDebut");

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

    // Calculate TTC
    const montantTTC = useMemo(() => {
        return Number(montantHT) * (1 + TVA_RATE);
    }, [montantHT]);

    // Calculate end date
    const dateFin = useMemo(() => {
        if (!dateDebut) return "";
        const start = new Date(dateDebut);
        return format(addYears(start, dureeAnnees || 1), "yyyy-MM-dd");
    }, [dateDebut, dureeAnnees]);

    const createContrat = useCreateContrat();

    const onSubmit = (data: ContratFormValues) => {
        const payload = {
            clientId: data.clientId,
            typeContrat: data.typeContrat as TypeContratEntretien,
            nom: data.nom,
            description: data.description || undefined,
            equipements: [], // Empty for now, can be enhanced later
            adresse: data.adresse,
            codePostal: data.codePostal,
            ville: data.ville,
            dateDebut: data.dateDebut,
            dateFin: dateFin,
            dureeAnnees: data.dureeAnnees,
            montantHT: data.montantHT,
            montantTTC: montantTTC,
            periodicite: data.periodicite as PeriodiciteContrat,
            nombreRevisionsAn: data.nombreRevisionsAn,
            interventionsIncluses: data.interventionsIncluses,
            remisePieces: data.remisePieces || 0,
            renouvellementAuto: data.renouvellementAuto,
            notes: data.notes || undefined,
        };

        createContrat.mutate(payload, {
            onSuccess: () => {
                toast.success("Contrat créé", {
                    description: "Le contrat a été créé avec succès",
                });
                form.reset();
                onSuccess();
            },
            onError: (error) => {
                toast.error("Erreur", {
                    description:
                        error instanceof Error
                            ? error.message
                            : "Impossible de créer le contrat",
                });
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[24px] font-semibold">
                        Nouveau contrat d&apos;entretien
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
                                                    placeholder="Rechercher un client..."
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
                                                    {client.ville && ` - ${client.ville}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Type & Nom */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="typeContrat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type de contrat</FormLabel>
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
                                                {Object.entries(TYPE_CONTRAT_LABELS).map(
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

                            <FormField
                                control={form.control}
                                name="nom"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom du contrat</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Entretien chaudière annuel"
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Address */}
                        <FormField
                            control={form.control}
                            name="adresse"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Adresse d&apos;intervention</FormLabel>
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

                        {/* Dates & Duration */}
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="dateDebut"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date de début</FormLabel>
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
                                name="dureeAnnees"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Durée (années)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={10}
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormItem>
                                <FormLabel>Date de fin</FormLabel>
                                <Input
                                    type="date"
                                    value={dateFin}
                                    disabled
                                    className="h-11 bg-black/5"
                                />
                            </FormItem>
                        </div>

                        {/* Pricing */}
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="montantHT"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Montant HT (€)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min={0}
                                                placeholder="150.00"
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormItem>
                                <FormLabel>Montant TTC (€)</FormLabel>
                                <Input
                                    value={montantTTC.toFixed(2)}
                                    disabled
                                    className="h-11 bg-black/5 font-medium"
                                />
                            </FormItem>

                            <FormField
                                control={form.control}
                                name="periodicite"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Périodicité</FormLabel>
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
                                                {Object.entries(PERIODICITE_LABELS).map(
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

                        {/* Services inclus */}
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="nombreRevisionsAn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Révisions/an</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                max={12}
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
                                name="interventionsIncluses"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Interventions incluses</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
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
                                name="remisePieces"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Remise pièces (%)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                max={100}
                                                placeholder="10"
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Renouvellement */}
                        <FormField
                            control={form.control}
                            name="renouvellementAuto"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border border-black/10 p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Renouvellement automatique
                                        </FormLabel>
                                        <p className="text-[13px] text-black/50">
                                            Le contrat sera renouvelé automatiquement à
                                            échéance
                                        </p>
                                    </div>
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={field.onChange}
                                            className="h-5 w-5 rounded border-black/20"
                                        />
                                    </FormControl>
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
                                            placeholder="Notes ou conditions particulières..."
                                            className="min-h-[80px] resize-none"
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
                                disabled={createContrat.isPending}
                            >
                                {createContrat.isPending
                                    ? "Création..."
                                    : "Créer le contrat"}
                            </PrimaryActionButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
