import { useClients, type Client } from "@/hooks/use-clients";
import { useCreateContrat } from "@/hooks/use-contrats";
import type {
    PeriodiciteContrat,
    TypeContratEntretien,
} from "@/lib/types/contrats";
import { zodResolver } from "@hookform/resolvers/zod";
import { addYears, format } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const TVA_RATE = 0.1;

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
});

export type ContratFormValues = z.infer<typeof contratSchema>;
type Step = 1 | 2 | 3;

const getDefaultValues = (): ContratFormValues => ({
    clientId: "",
    typeContrat: "CHAUDIERE",
    nom: "",
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
});

interface UseContratDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function useContratDialog({
    open,
    onOpenChange,
    onSuccess,
}: UseContratDialogProps) {
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [formKey, setFormKey] = useState(0);

    const { data: clientsData } = useClients();
    const clients = useMemo(() => clientsData || [], [clientsData]);
    const createContrat = useCreateContrat();

    const form = useForm<ContratFormValues>({
        resolver: zodResolver(contratSchema),
        defaultValues: getDefaultValues(),
    });

    const montantHT = form.watch("montantHT");
    const dureeAnnees = form.watch("dureeAnnees");
    const dateDebut = form.watch("dateDebut");

    // Derived values using useMemo instead of state
    const montantTTC = useMemo(() => {
        return Number(montantHT) * (1 + TVA_RATE);
    }, [montantHT]);

    const dateFin = useMemo(() => {
        if (!dateDebut) return "";
        const start = new Date(dateDebut);
        return format(addYears(start, dureeAnnees || 1), "yyyy-MM-dd");
    }, [dateDebut, dureeAnnees]);

    // Handle dialog open/close - reset form when opening
    const handleOpenChange = useCallback(
        (newOpen: boolean) => {
            if (newOpen) {
                setCurrentStep(1);
                form.reset(getDefaultValues());
                setFormKey((k) => k + 1);
            }
            onOpenChange(newOpen);
        },
        [onOpenChange, form]
    );

    // Handle client selection - auto-fill address (NO useEffect needed)
    const handleClientChange = useCallback(
        (clientId: string) => {
            form.setValue("clientId", clientId);
            if (clientId) {
                const client = clients.find((c: Client) => c.id === clientId);
                if (client) {
                    form.setValue("adresse", client.adresse || "");
                    form.setValue("codePostal", client.codePostal || "");
                    form.setValue("ville", client.ville || "");
                }
            }
        },
        [clients, form]
    );

    // Navigation
    const handleNext = useCallback(async () => {
        let isValid = true;

        if (currentStep === 1) {
            isValid = await form.trigger(["clientId"]);
        } else if (currentStep === 2) {
            isValid = await form.trigger([
                "typeContrat",
                "nom",
                "adresse",
                "codePostal",
                "ville",
                "dateDebut",
                "dureeAnnees",
            ]);
        }

        if (isValid && currentStep < 3) {
            setCurrentStep((prev) => (prev + 1) as Step);
        }
    }, [currentStep, form]);

    const handlePrevious = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as Step);
        }
    }, [currentStep]);

    // Submit
    const handleSubmit = useCallback(
        (data: ContratFormValues) => {
            const payload = {
                clientId: data.clientId,
                typeContrat: data.typeContrat as TypeContratEntretien,
                nom: data.nom,
                equipements: [],
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
            };

            createContrat.mutate(payload, {
                onSuccess: () => {
                    toast.success("Contrat créé avec succès");
                    form.reset();
                    onSuccess();
                },
                onError: (error) => {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Impossible de créer le contrat"
                    );
                },
            });
        },
        [dateFin, montantTTC, createContrat, form, onSuccess]
    );

    return {
        // State
        form,
        formKey,
        currentStep,
        isPending: createContrat.isPending,

        // Data
        clients,

        // Derived values
        montantTTC,
        dateFin,

        // Actions
        handleOpenChange,
        handleClientChange,
        handleNext,
        handlePrevious,
        handleSubmit,
    };
}
