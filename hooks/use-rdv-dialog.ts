import { useClients } from "@/hooks/use-clients";
import { useActiveEmployes } from "@/hooks/use-employes";
import { useActivePrestations } from "@/hooks/use-prestations";
import {
    useCreateRendezVous,
    useUpdateRendezVous,
    type RendezVous,
} from "@/hooks/use-rendez-vous";
import type { RendezVousStatut } from "@/lib/types/rendez-vous.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const rdvSchema = z.object({
    clientId: z.string().optional(),
    nomClient: z.string().min(1, "Le nom du client est requis"),
    telephone: z.string().optional(),
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    date: z.string().min(1, "La date est requise"),
    heure: z.string().min(1, "L'heure est requise"),
    duree: z.coerce.number().min(5, "La durée minimum est de 5 minutes"),
    prestationId: z.string().optional(),
    employeId: z.string().optional(),
    notes: z.string().optional(),
    statut: z.string().optional(),
});

export type RdvFormValues = z.infer<typeof rdvSchema>;
type Step = 1 | 2;

interface UseRdvDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    rdv?: RendezVous | null;
    defaultDate?: Date;
}

const getDefaultValues = (
    rdv?: RendezVous | null,
    defaultDate?: Date
): RdvFormValues => {
    if (rdv) {
        return {
            clientId: rdv.clientId || "",
            nomClient: rdv.nomClient,
            telephone: rdv.telephone || "",
            email: rdv.email || "",
            date: format(new Date(rdv.date), "yyyy-MM-dd"),
            heure: rdv.heure,
            duree: rdv.duree,
            prestationId: rdv.prestationId || "",
            employeId: rdv.employeId || "",
            notes: rdv.notes || "",
            statut: rdv.statut,
        };
    }

    return {
        clientId: "",
        nomClient: "",
        telephone: "",
        email: "",
        date: defaultDate
            ? format(defaultDate, "yyyy-MM-dd")
            : format(new Date(), "yyyy-MM-dd"),
        heure: "09:00",
        duree: 60,
        prestationId: "",
        employeId: "",
        notes: "",
        statut: "EN_ATTENTE",
    };
};

export function useRdvDialog({
    open,
    onOpenChange,
    onSuccess,
    rdv,
    defaultDate,
}: UseRdvDialogProps) {
    const isEditing = !!rdv;
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [formKey, setFormKey] = useState(0);

    const createRdv = useCreateRendezVous();
    const updateRdv = useUpdateRendezVous();

    const { data: prestations = [] } = useActivePrestations();
    const { data: employes = [] } = useActiveEmployes();
    const { data: clients = [] } = useClients(100);

    const form = useForm<RdvFormValues>({
        resolver: zodResolver(rdvSchema),
        defaultValues: getDefaultValues(rdv, defaultDate),
    });

    // Handle dialog open/close - reset form when opening
    const handleOpenChange = useCallback(
        (newOpen: boolean) => {
            if (newOpen) {
                // Reset to initial state when opening
                setCurrentStep(1);
                form.reset(getDefaultValues(rdv, defaultDate));
                setFormKey((k) => k + 1);
            }
            onOpenChange(newOpen);
        },
        [onOpenChange, rdv, defaultDate, form]
    );

    // Handle client selection - auto-fill client info
    const handleClientChange = useCallback(
        (clientId: string) => {
            form.setValue("clientId", clientId);
            if (clientId) {
                const client = clients.find((c) => c.id === clientId);
                if (client) {
                    form.setValue(
                        "nomClient",
                        `${client.prenom || ""} ${client.nom}`.trim()
                    );
                    form.setValue("telephone", client.telephone || "");
                    form.setValue("email", client.email || "");
                }
            }
        },
        [clients, form]
    );

    // Handle prestation change - auto-update duration (NO useEffect needed)
    const handlePrestationChange = useCallback(
        (prestationId: string) => {
            form.setValue("prestationId", prestationId);
            if (prestationId) {
                const prestation = prestations.find(
                    (p) => p.id === prestationId
                );
                if (prestation) {
                    form.setValue("duree", prestation.duree);
                }
            }
        },
        [prestations, form]
    );

    // Navigation
    const handleNext = useCallback(async () => {
        if (currentStep === 1) {
            const isValid = await form.trigger(["nomClient"]);
            if (isValid) {
                setCurrentStep(2);
            }
        }
    }, [currentStep, form]);

    const handlePrevious = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as Step);
        }
    }, [currentStep]);

    // Submit
    const handleSubmit = useCallback(
        async (values: RdvFormValues) => {
            try {
                const data = {
                    ...values,
                    clientId: values.clientId || undefined,
                    email: values.email || undefined,
                    prestationId: values.prestationId || undefined,
                    employeId: values.employeId || undefined,
                    statut: values.statut as RendezVousStatut | undefined,
                };

                if (isEditing && rdv) {
                    await updateRdv.mutateAsync({
                        id: rdv.id,
                        data,
                    });
                } else {
                    await createRdv.mutateAsync(data);
                }
                onSuccess();
            } catch {
                // Error handled by mutation
            }
        },
        [isEditing, rdv, updateRdv, createRdv, onSuccess]
    );

    return {
        // State
        form,
        formKey,
        currentStep,
        isEditing,
        isPending: createRdv.isPending || updateRdv.isPending,

        // Data
        prestations,
        employes,
        clients,

        // Actions
        handleOpenChange,
        handleClientChange,
        handlePrestationChange,
        handleNext,
        handlePrevious,
        handleSubmit,
    };
}
