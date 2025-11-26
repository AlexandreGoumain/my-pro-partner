"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
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
import { cn } from "@/lib/utils";
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Settings,
    User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CaracteristiquesStep } from "./steps/caracteristiques-step";
import { ClientTypeStep } from "./steps/client-type-step";
import { LocalisationStep } from "./steps/localisation-step";

type Step = 1 | 2 | 3;

interface EquipementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    equipement?: EquipementClient | null;
    preselectedClientId?: string;
}

const steps = [
    { id: 1, name: "Client & Type", icon: User },
    { id: 2, name: "Caractéristiques", icon: Settings },
    { id: 3, name: "Localisation", icon: MapPin },
];

export function EquipementDialog({
    open,
    onOpenChange,
    onSuccess,
    equipement,
    preselectedClientId,
}: EquipementDialogProps) {
    const { data: clients = [] } = useClients();
    const createEquipement = useCreateEquipement();
    const updateEquipement = useUpdateEquipement();

    const isEdit = !!equipement;
    const [currentStep, setCurrentStep] = useState<Step>(1);

    const [formData, setFormData] = useState<Partial<EquipementCreateInput>>({
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
    });

    // Reset form when dialog opens/closes or equipement changes
    useEffect(() => {
        if (open) {
            setCurrentStep(1);
            if (equipement) {
                setFormData({
                    clientId: equipement.clientId,
                    type: equipement.type,
                    marque: equipement.marque,
                    modele: equipement.modele || "",
                    numeroSerie: equipement.numeroSerie || "",
                    puissanceKw: equipement.puissanceKw || undefined,
                    typeEnergie: equipement.typeEnergie || undefined,
                    dateInstallation:
                        equipement.dateInstallation?.split("T")[0] || "",
                    dateMiseEnService:
                        equipement.dateMiseEnService?.split("T")[0] || "",
                    installePar: equipement.installePar || "",
                    garantieJusquau:
                        equipement.garantieJusquau?.split("T")[0] || "",
                    emplacement: equipement.emplacement || "",
                    adresse: equipement.adresse || "",
                    codePostal: equipement.codePostal || "",
                    ville: equipement.ville || "",
                    accessibilite: equipement.accessibilite || "",
                    controleObligatoire: equipement.controleObligatoire,
                    frequenceControleAnnuel: equipement.frequenceControleAnnuel,
                    notes: equipement.notes || "",
                });
            } else {
                setFormData({
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
                });
            }
        }
    }, [open, equipement, preselectedClientId]);

    // Auto-detect if equipment requires mandatory inspection
    useEffect(() => {
        if (formData.type) {
            const requiresControl = EQUIPEMENTS_CONTROLE_OBLIGATOIRE.includes(
                formData.type as TypeEquipement
            );
            if (requiresControl && !formData.controleObligatoire) {
                setFormData((prev) => ({
                    ...prev,
                    controleObligatoire: true,
                }));
            }
        }
    }, [formData.type, formData.controleObligatoire]);

    const handleNext = () => {
        if (currentStep === 1) {
            if (!formData.clientId || !formData.type || !formData.marque) {
                toast.error("Veuillez remplir les champs obligatoires");
                return;
            }
        }
        if (currentStep < 3) {
            setCurrentStep((prev) => (prev + 1) as Step);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as Step);
        }
    };

    const handleSubmit = async () => {
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
        } catch (error) {
            toast.error(
                isEdit
                    ? "Erreur lors de la mise à jour"
                    : "Erreur lors de la création"
            );
        }
    };

    const isLoading = createEquipement.isPending || updateEquipement.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em]">
                        {isEdit ? "Modifier l'équipement" : "Nouvel équipement"}
                    </DialogTitle>
                </DialogHeader>

                {/* Stepper */}
                <div className="flex items-center justify-between px-2 py-4">
                    {steps.map((step, index) => {
                        const isActive = step.id === currentStep;
                        const isCompleted = step.id < currentStep;
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.id}
                                className="flex items-center flex-1"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                            isCompleted
                                                ? "bg-black text-white"
                                                : isActive
                                                  ? "bg-black text-white"
                                                  : "bg-black/5 text-black/40"
                                        )}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2
                                                className="w-5 h-5"
                                                strokeWidth={2}
                                            />
                                        ) : (
                                            <Icon
                                                className="w-5 h-5"
                                                strokeWidth={2}
                                            />
                                        )}
                                    </div>
                                    <span
                                        className={cn(
                                            "text-[11px] font-medium text-center",
                                            isActive || isCompleted
                                                ? "text-black"
                                                : "text-black/40"
                                        )}
                                    >
                                        {step.name}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={cn(
                                            "flex-1 h-[2px] mx-4 mt-[-20px]",
                                            isCompleted
                                                ? "bg-black"
                                                : "bg-black/10"
                                        )}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Step Content */}
                <div className="min-h-[350px]">
                    {currentStep === 1 && (
                        <ClientTypeStep
                            formData={formData}
                            setFormData={setFormData}
                            clients={clients}
                            preselectedClientId={preselectedClientId}
                        />
                    )}
                    {currentStep === 2 && (
                        <CaracteristiquesStep
                            formData={formData}
                            setFormData={setFormData}
                        />
                    )}
                    {currentStep === 3 && (
                        <LocalisationStep
                            formData={formData}
                            setFormData={setFormData}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between pt-4 border-t border-black/10">
                    <div>
                        {currentStep > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrevious}
                                className="gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Précédent
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Annuler
                        </Button>
                        {currentStep < 3 ? (
                            <PrimaryActionButton
                                type="button"
                                onClick={handleNext}
                                className="gap-2"
                            >
                                Suivant
                                <ChevronRight className="w-4 h-4" />
                            </PrimaryActionButton>
                        ) : (
                            <PrimaryActionButton
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? "Enregistrement..."
                                    : isEdit
                                      ? "Mettre à jour"
                                      : "Créer l'équipement"}
                            </PrimaryActionButton>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
