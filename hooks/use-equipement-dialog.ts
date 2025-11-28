import { useClients } from "@/hooks/use-clients";
import {
    useCreateEquipement,
    useUpdateEquipement,
} from "@/hooks/use-equipements";
import {
    EQUIPEMENTS_CONTROLE_OBLIGATOIRE,
    type EquipementClient,
    type EquipementCreateInput,
} from "@/lib/types/equipement";
import type { TypeEquipement } from "@/lib/types/intervention";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

type Step = 1 | 2 | 3;

interface UseEquipementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    equipement?: EquipementClient | null;
    preselectedClientId?: string;
}

const getInitialFormData = (
    equipement?: EquipementClient | null,
    preselectedClientId?: string
): Partial<EquipementCreateInput> => {
    if (equipement) {
        return {
            clientId: equipement.clientId,
            type: equipement.type,
            marque: equipement.marque,
            modele: equipement.modele || "",
            numeroSerie: equipement.numeroSerie || "",
            puissanceKw: equipement.puissanceKw || undefined,
            typeEnergie: equipement.typeEnergie || undefined,
            dateInstallation: equipement.dateInstallation?.split("T")[0] || "",
            dateMiseEnService:
                equipement.dateMiseEnService?.split("T")[0] || "",
            installePar: equipement.installePar || "",
            garantieJusquau: equipement.garantieJusquau?.split("T")[0] || "",
            emplacement: equipement.emplacement || "",
            adresse: equipement.adresse || "",
            codePostal: equipement.codePostal || "",
            ville: equipement.ville || "",
            accessibilite: equipement.accessibilite || "",
            controleObligatoire: equipement.controleObligatoire,
            frequenceControleAnnuel: equipement.frequenceControleAnnuel,
            notes: equipement.notes || "",
        };
    }

    return {
        clientId: preselectedClientId || "",
        type: "CHAUDIERE_GAZ",
        marque: "",
        modele: "",
        numeroSerie: "",
        puissanceKw: undefined,
        typeEnergie: undefined,
        dateInstallation: "",
        dateMiseEnService: "",
        installePar: "",
        garantieJusquau: "",
        emplacement: "",
        adresse: "",
        codePostal: "",
        ville: "",
        accessibilite: "",
        controleObligatoire: false,
        frequenceControleAnnuel: 12,
        notes: "",
    };
};

export function useEquipementDialog({
    open,
    onOpenChange,
    onSuccess,
    equipement,
    preselectedClientId,
}: UseEquipementDialogProps) {
    const { data: clients = [] } = useClients();
    const createEquipement = useCreateEquipement();
    const updateEquipement = useUpdateEquipement();

    const isEdit = !!equipement;

    // Use key to track when we need to reset form
    const [formKey, setFormKey] = useState(0);
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [formData, setFormData] = useState<Partial<EquipementCreateInput>>(
        () => getInitialFormData(equipement, preselectedClientId)
    );

    // Calculate if control is required based on type - NO useEffect needed
    const requiresControl = useMemo(() => {
        if (!formData.type) return false;
        return EQUIPEMENTS_CONTROLE_OBLIGATOIRE.includes(
            formData.type as TypeEquipement
        );
    }, [formData.type]);

    // Update form data with auto-control logic
    const updateFormData = useCallback(
        (
            updates:
                | Partial<EquipementCreateInput>
                | ((
                      prev: Partial<EquipementCreateInput>
                  ) => Partial<EquipementCreateInput>)
        ) => {
            setFormData((prev) => {
                const newData =
                    typeof updates === "function"
                        ? updates(prev)
                        : { ...prev, ...updates };

                // Auto-enable controleObligatoire when type requires it
                if (
                    newData.type &&
                    EQUIPEMENTS_CONTROLE_OBLIGATOIRE.includes(
                        newData.type as TypeEquipement
                    )
                ) {
                    newData.controleObligatoire = true;
                }

                return newData;
            });
        },
        []
    );

    // Handle dialog open/close - reset form on close
    const handleOpenChange = useCallback(
        (newOpen: boolean) => {
            if (newOpen) {
                // Reset to initial state when opening
                setCurrentStep(1);
                setFormData(
                    getInitialFormData(equipement, preselectedClientId)
                );
                setFormKey((k) => k + 1);
            }
            onOpenChange(newOpen);
        },
        [onOpenChange, equipement, preselectedClientId]
    );

    const handleNext = useCallback(() => {
        if (currentStep === 1) {
            if (!formData.clientId || !formData.type || !formData.marque) {
                toast.error("Veuillez remplir les champs obligatoires");
                return;
            }
        }
        if (currentStep < 3) {
            setCurrentStep((prev) => (prev + 1) as Step);
        }
    }, [currentStep, formData.clientId, formData.type, formData.marque]);

    const handlePrevious = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as Step);
        }
    }, [currentStep]);

    const handleSubmit = useCallback(async () => {
        if (!formData.clientId || !formData.type || !formData.marque) {
            toast.error("Veuillez remplir les champs obligatoires");
            return;
        }

        try {
            if (isEdit && equipement) {
                await updateEquipement.mutateAsync({
                    id: equipement.id,
                    data: formData,
                });
                toast.success("Équipement mis à jour");
            } else {
                await createEquipement.mutateAsync(
                    formData as EquipementCreateInput
                );
                toast.success("Équipement créé");
            }
            onOpenChange(false);
            onSuccess?.();
        } catch {
            toast.error(
                isEdit
                    ? "Erreur lors de la mise à jour"
                    : "Erreur lors de la création"
            );
        }
    }, [
        formData,
        isEdit,
        equipement,
        updateEquipement,
        createEquipement,
        onOpenChange,
        onSuccess,
    ]);

    return {
        // State
        formKey,
        currentStep,
        formData,
        clients,
        isEdit,
        isLoading: createEquipement.isPending || updateEquipement.isPending,
        requiresControl,

        // Actions
        setFormData: updateFormData,
        handleOpenChange,
        handleNext,
        handlePrevious,
        handleSubmit,
    };
}
