import { useCreateIntervention } from "@/hooks/use-interventions";
import type {
    InterventionCreateInput,
    PrioriteIntervention,
    TypeIntervention,
} from "@/lib/types/intervention";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface Client {
    id: string;
    nom: string;
    prenom?: string | null;
    telephone?: string | null;
    adresse?: string | null;
    codePostal?: string | null;
    ville?: string | null;
}

type ClientMode = "existing" | "new";

interface FormState {
    clientMode: ClientMode;
    clientId: string;
    newClientNom: string;
    newClientPrenom: string;
    newClientTelephone: string;
    typeIntervention: TypeIntervention | "";
    priorite: PrioriteIntervention;
    description: string;
    adresse: string;
    codePostal: string;
    ville: string;
    showDetails: boolean;
    equipement: string;
    marqueEquipement: string;
    datePrevisionnelle: string;
}

const getInitialFormState = (): FormState => ({
    clientMode: "existing",
    clientId: "",
    newClientNom: "",
    newClientPrenom: "",
    newClientTelephone: "",
    typeIntervention: "",
    priorite: "NORMALE",
    description: "",
    adresse: "",
    codePostal: "",
    ville: "",
    showDetails: false,
    equipement: "",
    marqueEquipement: "",
    datePrevisionnelle: "",
});

export interface UseInterventionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    businessType: string;
}

export function useInterventionDialog({
    open,
    onOpenChange,
    onSuccess,
    businessType,
}: UseInterventionDialogProps) {
    const [form, setForm] = useState<FormState>(getInitialFormState);
    // Key to force re-render and reset form when dialog opens
    const [formKey, setFormKey] = useState(0);

    // Fetch clients
    const { data: clientsData } = useQuery({
        queryKey: ["clients", "list", { limit: 100 }],
        queryFn: async () => {
            const response = await fetch("/api/clients?limit=100");
            if (!response.ok) throw new Error("Failed to fetch clients");
            return response.json();
        },
        enabled: open,
    });

    const clients: Client[] = clientsData?.items || clientsData?.clients || [];

    // Derive selected client without useEffect
    const selectedClient = useMemo(
        () => clients.find((c) => c.id === form.clientId),
        [clients, form.clientId]
    );

    const createIntervention = useCreateIntervention();

    // Update form field - handles address auto-fill for existing clients
    const updateField = useCallback(
        <K extends keyof FormState>(field: K, value: FormState[K]) => {
            setForm((prev) => {
                const newForm = { ...prev, [field]: value };

                // When selecting an existing client, auto-fill address
                if (field === "clientId" && prev.clientMode === "existing") {
                    const client = clients.find((c) => c.id === value);
                    if (client) {
                        newForm.adresse = client.adresse || "";
                        newForm.codePostal = client.codePostal || "";
                        newForm.ville = client.ville || "";
                    }
                }

                // When switching to new client mode, clear address
                if (field === "clientMode" && value === "new") {
                    newForm.adresse = "";
                    newForm.codePostal = "";
                    newForm.ville = "";
                }

                return newForm;
            });
        },
        [clients]
    );

    // Handle dialog close - reset form
    const handleOpenChange = useCallback(
        (newOpen: boolean) => {
            if (!newOpen) {
                // Reset form when closing
                setForm(getInitialFormState());
                setFormKey((k) => k + 1);
            }
            onOpenChange(newOpen);
        },
        [onOpenChange]
    );

    // Validation
    const validate = useCallback((): boolean => {
        if (form.clientMode === "existing" && !form.clientId) {
            toast.error("Veuillez sélectionner un client");
            return false;
        }

        if (form.clientMode === "new") {
            if (!form.newClientNom.trim()) {
                toast.error("Le nom du client est requis");
                return false;
            }
            if (!form.newClientTelephone.trim()) {
                toast.error("Le téléphone du client est requis");
                return false;
            }
        }

        if (!form.typeIntervention || !form.description) {
            toast.error("Veuillez remplir les champs obligatoires");
            return false;
        }

        if (form.description.length < 10) {
            toast.error("La description doit faire au moins 10 caractères");
            return false;
        }

        if (!form.adresse || !form.codePostal || !form.ville) {
            toast.error("L'adresse est incomplète");
            return false;
        }

        if (!/^\d{5}$/.test(form.codePostal)) {
            toast.error("Code postal invalide");
            return false;
        }

        return true;
    }, [form]);

    // Submit
    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();

            if (!validate()) return;

            // Type guard ensures typeIntervention is valid after validation
            if (!form.typeIntervention) return;

            const baseFields = {
                typeIntervention: form.typeIntervention as TypeIntervention,
                priorite: form.priorite,
                description: form.description,
                adresse: form.adresse,
                codePostal: form.codePostal,
                ville: form.ville,
                equipement: form.equipement || undefined,
                marqueEquipement: form.marqueEquipement || undefined,
                datePrevisionnelle: form.datePrevisionnelle || undefined,
            };

            const payload = (
                form.clientMode === "existing"
                    ? { ...baseFields, clientId: form.clientId }
                    : {
                          ...baseFields,
                          newClient: {
                              nom: form.newClientNom.trim(),
                              prenom: form.newClientPrenom.trim() || undefined,
                              telephone: form.newClientTelephone.trim(),
                          },
                      }
            ) as InterventionCreateInput;

            createIntervention.mutate(payload, {
                onSuccess: () => {
                    toast.success(
                        form.clientMode === "new"
                            ? "Intervention créée et client ajouté"
                            : "Intervention créée"
                    );
                    onSuccess();
                },
                onError: (error) => {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Erreur lors de la création"
                    );
                },
            });
        },
        [form, validate, createIntervention, onSuccess]
    );

    return {
        // State
        form,
        formKey,
        clients,
        selectedClient,
        isLoading: createIntervention.isPending,
        businessType,

        // Actions
        updateField,
        handleOpenChange,
        handleSubmit,
        setShowDetails: (show: boolean) => updateField("showDetails", show),
    };
}
