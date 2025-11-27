"use client";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogActionButtons } from "@/components/ui/dialog-action-buttons";
import { DialogHeaderSection } from "@/components/ui/dialog-header-section";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FormDatePicker } from "@/components/ui/form-date-picker";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useClientsPaginated, type Client } from "@/hooks/use-clients";
import { useCreateAbonnement, useTypesAbonnements } from "@/hooks/use-fitness";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format";
import {
    abonnementCreateSchema,
    type AbonnementCreateInput,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, CreditCard, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface CreateAbonnementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

const MODES_PAIEMENT = [
    { value: "CB", label: "Carte bancaire" },
    { value: "ESPECES", label: "Espèces" },
    { value: "VIREMENT", label: "Virement" },
    { value: "CHEQUE", label: "Chèque" },
    { value: "PRELEVEMENT", label: "Prélèvement automatique" },
];

const defaultValues: AbonnementCreateInput = {
    clientId: "",
    typeAbonnementId: "",
    dateDebut: new Date(),
    dateFin: null,
    statut: "ACTIF",
    seancesRestantes: null,
    montantPaye: 0,
    prochainPaiement: null,
    modePaiement: "",
    numeroCarte: "",
    codeAcces: "",
    notes: "",
};

export function CreateAbonnementDialog({
    open,
    onOpenChange,
    onSuccess,
}: CreateAbonnementDialogProps) {
    const [clientSearch, setClientSearch] = useState("");
    const [clientOpen, setClientOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const { data: typesAbonnements } = useTypesAbonnements({ actif: true });
    const { data: clientsData } = useClientsPaginated(
        clientSearch.length >= 2
            ? { search: clientSearch, limit: 10 }
            : undefined
    );
    const createAbonnement = useCreateAbonnement();

    const form = useForm<AbonnementCreateInput>({
        resolver: zodResolver(abonnementCreateSchema),
        defaultValues,
    });

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            form.reset(defaultValues);
            setSelectedClient(null);
            setClientSearch("");
        }
    }, [open, form]);

    // Sync selectedClient with form
    useEffect(() => {
        if (selectedClient) {
            form.setValue("clientId", selectedClient.id);
        }
    }, [selectedClient, form]);

    const typeAbonnementId = form.watch("typeAbonnementId");
    const selectedType = typesAbonnements?.find(
        (t) => t.id === typeAbonnementId
    );

    const typeOptions = (typesAbonnements || []).map((type) => ({
        value: type.id,
        label: type.nom,
        description: formatCurrency(type.prix),
    }));

    function onSubmit(values: AbonnementCreateInput) {
        createAbonnement.mutate(
            {
                ...values,
                dateDebut: values.dateDebut,
                modePaiement: values.modePaiement || undefined,
                notes: values.notes || undefined,
            },
            {
                onSuccess: () => {
                    onSuccess?.();
                    onOpenChange(false);
                },
                onError: (error) => {
                    form.setError("root", {
                        message:
                            error instanceof Error
                                ? error.message
                                : "Une erreur est survenue",
                    });
                },
            }
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeaderSection
                    title="Nouvel abonnement"
                    description="Créez un nouvel abonnement client"
                    titleClassName="text-[18px] font-semibold tracking-[-0.02em]"
                    descriptionClassName="text-[14px] text-black/60"
                />

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        {/* Sélection du client (Combobox custom) */}
                        <FormField
                            control={form.control}
                            name="clientId"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-[13px] font-medium">
                                        Client{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FormLabel>
                                    <Popover
                                        open={clientOpen}
                                        onOpenChange={setClientOpen}
                                    >
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={clientOpen}
                                                    className="w-full justify-between h-11 border-black/10"
                                                >
                                                    {selectedClient ? (
                                                        <span className="flex items-center gap-2">
                                                            <User className="w-4 h-4 text-black/40" />
                                                            {
                                                                selectedClient.prenom
                                                            }{" "}
                                                            {selectedClient.nom}
                                                        </span>
                                                    ) : (
                                                        <span className="text-black/40">
                                                            Rechercher un
                                                            client...
                                                        </span>
                                                    )}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-[450px] p-0"
                                            align="start"
                                        >
                                            <Command shouldFilter={false}>
                                                <CommandInput
                                                    placeholder="Rechercher par nom, email..."
                                                    value={clientSearch}
                                                    onValueChange={
                                                        setClientSearch
                                                    }
                                                />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        {clientSearch.length < 2
                                                            ? "Tapez au moins 2 caractères"
                                                            : "Aucun client trouvé"}
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {clientsData?.data?.map(
                                                            (
                                                                client: Client
                                                            ) => (
                                                                <CommandItem
                                                                    key={
                                                                        client.id
                                                                    }
                                                                    value={
                                                                        client.id
                                                                    }
                                                                    onSelect={() => {
                                                                        setSelectedClient(
                                                                            client
                                                                        );
                                                                        setClientOpen(
                                                                            false
                                                                        );
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            selectedClient?.id ===
                                                                                client.id
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    <div>
                                                                        <p className="font-medium">
                                                                            {
                                                                                client.prenom
                                                                            }{" "}
                                                                            {
                                                                                client.nom
                                                                            }
                                                                        </p>
                                                                        <p className="text-[12px] text-black/40">
                                                                            {client.email ||
                                                                                client.telephone ||
                                                                                "Pas de contact"}
                                                                        </p>
                                                                    </div>
                                                                </CommandItem>
                                                            )
                                                        )}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Type d'abonnement */}
                        <div className="space-y-2">
                            <FormSelect
                                control={form.control}
                                name="typeAbonnementId"
                                label="Type d'abonnement"
                                options={typeOptions}
                                placeholder="Sélectionner une formule"
                                required
                                labelClassName="text-[13px] font-medium"
                            />
                            {selectedType?.description && (
                                <p className="text-[12px] text-black/50">
                                    {selectedType.description}
                                </p>
                            )}
                        </div>

                        {/* Date de début */}
                        <FormDatePicker
                            control={form.control}
                            name="dateDebut"
                            label="Date de début"
                            required
                            labelClassName="text-[13px] font-medium"
                        />

                        {/* Mode de paiement et Montant payé */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect
                                control={form.control}
                                name="modePaiement"
                                label="Mode de paiement"
                                options={MODES_PAIEMENT}
                                placeholder="Sélectionner"
                                labelClassName="text-[13px] font-medium"
                            />
                            <FormInput
                                control={form.control}
                                name="montantPaye"
                                label="Montant payé (€)"
                                type="number"
                                placeholder="0.00"
                                className="h-11 border-black/10"
                                labelClassName="text-[13px] font-medium"
                            />
                        </div>

                        {/* Notes */}
                        <FormInput
                            control={form.control}
                            name="notes"
                            label="Notes"
                            textarea
                            rows={3}
                            placeholder="Notes internes sur cet abonnement..."
                            className="border-black/10 resize-none"
                            labelClassName="text-[13px] font-medium"
                        />

                        {/* Résumé */}
                        {selectedType && (
                            <div className="bg-black/2 rounded-lg p-4 space-y-2">
                                <div className="flex items-center gap-2 text-[14px] font-medium">
                                    <CreditCard className="w-4 h-4 text-black/60" />
                                    Récapitulatif
                                </div>
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-black/60">
                                        Formule
                                    </span>
                                    <span className="font-medium">
                                        {selectedType.nom}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-black/60">Tarif</span>
                                    <span className="font-medium">
                                        {formatCurrency(selectedType.prix)}
                                    </span>
                                </div>
                                {selectedType.nombreSeances && (
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-black/60">
                                            Séances incluses
                                        </span>
                                        <span className="font-medium">
                                            {selectedType.nombreSeances}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {form.formState.errors.root && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.root.message}
                            </p>
                        )}

                        <DialogActionButtons
                            onCancel={() => onOpenChange(false)}
                            submitLabel="Créer l'abonnement"
                            isLoading={createAbonnement.isPending}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
