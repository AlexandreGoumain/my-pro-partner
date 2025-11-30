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
import { useBiens, type BienWithRelations } from "@/hooks/immobilier/use-biens";
import { useCreateBail, type CreateBailInput } from "@/hooks/immobilier/use-baux";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Home, User, FileText } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CreateBailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

const TYPE_BAIL_OPTIONS = [
    { value: "HABITATION_VIDE", label: "Habitation vide" },
    { value: "HABITATION_MEUBLEE", label: "Habitation meublée" },
    { value: "COMMERCIAL", label: "Commercial" },
    { value: "PROFESSIONNEL", label: "Professionnel" },
    { value: "MIXTE", label: "Mixte" },
    { value: "SAISONNIER", label: "Saisonnier" },
];

const DUREE_OPTIONS = [
    { value: "12", label: "12 mois (meublé)" },
    { value: "36", label: "36 mois (vide)" },
    { value: "6", label: "6 mois (saisonnier)" },
    { value: "9", label: "9 mois (étudiant)" },
    { value: "72", label: "72 mois (commercial)" },
];

const bailCreateSchema = z.object({
    bienId: z.string().min(1, "Le bien est requis"),
    locataireId: z.string().min(1, "Le locataire est requis"),
    proprietaireId: z.string().min(1, "Le propriétaire est requis"),
    typeBail: z.string().min(1, "Le type de bail est requis"),
    dateDebut: z.date({ required_error: "La date de début est requise" }),
    dureeMois: z.number().min(1, "La durée est requise"),
    loyerHC: z.number().min(0, "Le loyer doit être positif"),
    provisions: z.number().min(0),
    depotGarantie: z.number().min(0),
});

type BailFormValues = z.infer<typeof bailCreateSchema>;

const defaultValues: BailFormValues = {
    bienId: "",
    locataireId: "",
    proprietaireId: "",
    typeBail: "HABITATION_VIDE",
    dateDebut: new Date(),
    dureeMois: 36,
    loyerHC: 0,
    provisions: 0,
    depotGarantie: 0,
};

export function CreateBailDialog({
    open,
    onOpenChange,
    onSuccess,
}: CreateBailDialogProps) {
    // Search states
    const [locataireSearch, setLocataireSearch] = useState("");
    const [locataireOpen, setLocataireOpen] = useState(false);
    const [selectedLocataire, setSelectedLocataire] = useState<Client | null>(null);

    const [proprietaireSearch, setProprietaireSearch] = useState("");
    const [proprietaireOpen, setProprietaireOpen] = useState(false);
    const [selectedProprietaire, setSelectedProprietaire] = useState<Client | null>(null);

    const [bienOpen, setBienOpen] = useState(false);
    const [selectedBien, setSelectedBien] = useState<BienWithRelations | null>(null);

    // Data fetching
    const { data: biens = [] } = useBiens({ statut: "DISPONIBLE" });
    const { data: locatairesData } = useClientsPaginated(
        locataireSearch.length >= 2
            ? { search: locataireSearch, limit: 10 }
            : undefined
    );
    const { data: proprietairesData } = useClientsPaginated(
        proprietaireSearch.length >= 2
            ? { search: proprietaireSearch, limit: 10 }
            : undefined
    );
    const createBail = useCreateBail();

    const form = useForm<BailFormValues>({
        resolver: zodResolver(bailCreateSchema),
        defaultValues,
    });

    const [formKey, setFormKey] = useState(0);

    // Handle dialog open/close
    const handleOpenChange = useCallback(
        (newOpen: boolean) => {
            if (newOpen) {
                form.reset(defaultValues);
                setSelectedLocataire(null);
                setSelectedProprietaire(null);
                setSelectedBien(null);
                setLocataireSearch("");
                setProprietaireSearch("");
                setFormKey((k) => k + 1);
            }
            onOpenChange(newOpen);
        },
        [form, onOpenChange]
    );

    // Handle selections
    const handleLocataireSelect = useCallback(
        (client: Client) => {
            setSelectedLocataire(client);
            form.setValue("locataireId", client.id);
            setLocataireOpen(false);
        },
        [form]
    );

    const handleProprietaireSelect = useCallback(
        (client: Client) => {
            setSelectedProprietaire(client);
            form.setValue("proprietaireId", client.id);
            setProprietaireOpen(false);
        },
        [form]
    );

    const handleBienSelect = useCallback(
        (bien: BienWithRelations) => {
            setSelectedBien(bien);
            form.setValue("bienId", bien.id);
            // If bien has a proprietaire, auto-select it
            if (bien.proprietaire) {
                setSelectedProprietaire(bien.proprietaire as Client);
                form.setValue("proprietaireId", bien.proprietaire.id);
            }
            setBienOpen(false);
        },
        [form]
    );

    const typeBail = form.watch("typeBail");
    const loyerHC = form.watch("loyerHC");
    const provisions = form.watch("provisions");
    const loyerCC = loyerHC + provisions;

    function onSubmit(values: BailFormValues) {
        const input: CreateBailInput = {
            bienId: values.bienId,
            locataireId: values.locataireId,
            proprietaireId: values.proprietaireId,
            typeBail: values.typeBail as any,
            dateDebut: values.dateDebut.toISOString(),
            dureeMois: values.dureeMois,
            loyerHC: values.loyerHC,
            charges: values.provisions,
            depotGarantie: values.depotGarantie,
        };

        createBail.mutate(input, {
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
        });
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeaderSection
                    title="Nouveau bail"
                    description="Créez un nouveau contrat de location"
                    titleClassName="text-[18px] font-semibold tracking-[-0.02em]"
                    descriptionClassName="text-[14px] text-black/60"
                />

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                        key={formKey}
                    >
                        {/* Bien */}
                        <FormField
                            control={form.control}
                            name="bienId"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-[13px] font-medium">
                                        Bien <span className="text-destructive">*</span>
                                    </FormLabel>
                                    <Popover open={bienOpen} onOpenChange={setBienOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={bienOpen}
                                                    className="w-full justify-between h-11 border-black/10"
                                                >
                                                    {selectedBien ? (
                                                        <span className="flex items-center gap-2">
                                                            <Home className="w-4 h-4 text-black/40" />
                                                            {selectedBien.titre}
                                                        </span>
                                                    ) : (
                                                        <span className="text-black/40">
                                                            Sélectionner un bien disponible...
                                                        </span>
                                                    )}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[550px] p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="Rechercher un bien..." />
                                                <CommandList>
                                                    <CommandEmpty>Aucun bien disponible</CommandEmpty>
                                                    <CommandGroup>
                                                        {biens.map((bien) => (
                                                            <CommandItem
                                                                key={bien.id}
                                                                value={bien.id}
                                                                onSelect={() => handleBienSelect(bien)}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        selectedBien?.id === bien.id
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                <div>
                                                                    <p className="font-medium">{bien.titre}</p>
                                                                    <p className="text-[12px] text-black/40">
                                                                        {bien.adresse}, {bien.ville}
                                                                    </p>
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Locataire */}
                        <FormField
                            control={form.control}
                            name="locataireId"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-[13px] font-medium">
                                        Locataire <span className="text-destructive">*</span>
                                    </FormLabel>
                                    <Popover open={locataireOpen} onOpenChange={setLocataireOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={locataireOpen}
                                                    className="w-full justify-between h-11 border-black/10"
                                                >
                                                    {selectedLocataire ? (
                                                        <span className="flex items-center gap-2">
                                                            <User className="w-4 h-4 text-black/40" />
                                                            {selectedLocataire.prenom} {selectedLocataire.nom}
                                                        </span>
                                                    ) : (
                                                        <span className="text-black/40">
                                                            Rechercher un locataire...
                                                        </span>
                                                    )}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[550px] p-0" align="start">
                                            <Command shouldFilter={false}>
                                                <CommandInput
                                                    placeholder="Rechercher par nom, email..."
                                                    value={locataireSearch}
                                                    onValueChange={setLocataireSearch}
                                                />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        {locataireSearch.length < 2
                                                            ? "Tapez au moins 2 caractères"
                                                            : "Aucun client trouvé"}
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {locatairesData?.data?.map((client: Client) => (
                                                            <CommandItem
                                                                key={client.id}
                                                                value={client.id}
                                                                onSelect={() => handleLocataireSelect(client)}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        selectedLocataire?.id === client.id
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {client.prenom} {client.nom}
                                                                    </p>
                                                                    <p className="text-[12px] text-black/40">
                                                                        {client.email || client.telephone || "Pas de contact"}
                                                                    </p>
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Propriétaire */}
                        <FormField
                            control={form.control}
                            name="proprietaireId"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-[13px] font-medium">
                                        Propriétaire <span className="text-destructive">*</span>
                                    </FormLabel>
                                    <Popover open={proprietaireOpen} onOpenChange={setProprietaireOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={proprietaireOpen}
                                                    className="w-full justify-between h-11 border-black/10"
                                                >
                                                    {selectedProprietaire ? (
                                                        <span className="flex items-center gap-2">
                                                            <User className="w-4 h-4 text-black/40" />
                                                            {selectedProprietaire.prenom} {selectedProprietaire.nom}
                                                        </span>
                                                    ) : (
                                                        <span className="text-black/40">
                                                            Rechercher un propriétaire...
                                                        </span>
                                                    )}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[550px] p-0" align="start">
                                            <Command shouldFilter={false}>
                                                <CommandInput
                                                    placeholder="Rechercher par nom, email..."
                                                    value={proprietaireSearch}
                                                    onValueChange={setProprietaireSearch}
                                                />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        {proprietaireSearch.length < 2
                                                            ? "Tapez au moins 2 caractères"
                                                            : "Aucun client trouvé"}
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {proprietairesData?.data?.map((client: Client) => (
                                                            <CommandItem
                                                                key={client.id}
                                                                value={client.id}
                                                                onSelect={() => handleProprietaireSelect(client)}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        selectedProprietaire?.id === client.id
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {client.prenom} {client.nom}
                                                                    </p>
                                                                    <p className="text-[12px] text-black/40">
                                                                        {client.email || client.telephone || "Pas de contact"}
                                                                    </p>
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Type de bail et Durée */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect
                                control={form.control}
                                name="typeBail"
                                label="Type de bail"
                                options={TYPE_BAIL_OPTIONS}
                                placeholder="Sélectionner"
                                required
                                labelClassName="text-[13px] font-medium"
                            />
                            <FormField
                                control={form.control}
                                name="dureeMois"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[13px] font-medium">
                                            Durée <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <select
                                                className="w-full h-11 border border-black/10 rounded-md px-3 text-[14px]"
                                                value={String(field.value)}
                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                            >
                                                {DUREE_OPTIONS.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Date de début */}
                        <FormDatePicker
                            control={form.control}
                            name="dateDebut"
                            label="Date de début"
                            required
                            labelClassName="text-[13px] font-medium"
                        />

                        {/* Loyer */}
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="loyerHC"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[13px] font-medium">
                                            Loyer HC (€) <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full h-11 border border-black/10 rounded-md px-3 text-[14px]"
                                                value={field.value || ""}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                placeholder="0.00"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="provisions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[13px] font-medium">
                                            Provisions (€)
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full h-11 border border-black/10 rounded-md px-3 text-[14px]"
                                                value={field.value || ""}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                placeholder="0.00"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="depotGarantie"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[13px] font-medium">
                                            Dépôt garantie (€)
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full h-11 border border-black/10 rounded-md px-3 text-[14px]"
                                                value={field.value || ""}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                placeholder="0.00"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Récapitulatif */}
                        {(selectedBien || loyerHC > 0) && (
                            <div className="bg-black/[0.02] rounded-lg p-4 space-y-2">
                                <div className="flex items-center gap-2 text-[14px] font-medium">
                                    <FileText className="w-4 h-4 text-black/60" />
                                    Récapitulatif
                                </div>
                                {selectedBien && (
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-black/60">Bien</span>
                                        <span className="font-medium">{selectedBien.titre}</span>
                                    </div>
                                )}
                                {loyerHC > 0 && (
                                    <>
                                        <div className="flex justify-between text-[13px]">
                                            <span className="text-black/60">Loyer HC</span>
                                            <span className="font-medium">{loyerHC.toLocaleString("fr-FR")} €</span>
                                        </div>
                                        <div className="flex justify-between text-[13px]">
                                            <span className="text-black/60">Provisions</span>
                                            <span className="font-medium">{provisions.toLocaleString("fr-FR")} €</span>
                                        </div>
                                        <div className="flex justify-between text-[13px] pt-2 border-t border-black/5">
                                            <span className="text-black/80 font-medium">Loyer CC mensuel</span>
                                            <span className="font-bold">{loyerCC.toLocaleString("fr-FR")} €</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {form.formState.errors.root && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.root.message}
                            </p>
                        )}

                        <DialogActionButtons
                            onCancel={() => handleOpenChange(false)}
                            submitLabel="Créer le bail"
                            isLoading={createBail.isPending}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
