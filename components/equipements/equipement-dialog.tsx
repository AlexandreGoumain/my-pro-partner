"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { useEquipementDialog } from "@/hooks/use-equipement-dialog";
import type { EquipementClient } from "@/lib/types/equipement";
import { cn } from "@/lib/utils";
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Settings,
    User,
} from "lucide-react";
import { CaracteristiquesStep } from "./steps/caracteristiques-step";
import { ClientTypeStep } from "./steps/client-type-step";
import { LocalisationStep } from "./steps/localisation-step";

const steps = [
    { id: 1, name: "Client & Type", icon: User },
    { id: 2, name: "Caractéristiques", icon: Settings },
    { id: 3, name: "Localisation", icon: MapPin },
];

interface EquipementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    equipement?: EquipementClient | null;
    preselectedClientId?: string;
}

export function EquipementDialog({
    open,
    onOpenChange,
    onSuccess,
    equipement,
    preselectedClientId,
}: EquipementDialogProps) {
    const {
        formKey,
        currentStep,
        formData,
        clients,
        isEdit,
        isLoading,
        setFormData,
        handleOpenChange,
        handleNext,
        handlePrevious,
        handleSubmit,
    } = useEquipementDialog({
        open,
        onOpenChange,
        onSuccess,
        equipement,
        preselectedClientId,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
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

                {/* Step Content - use key to force re-render on form reset */}
                <div key={formKey} className="min-h-[350px]">
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
                            onClick={() => handleOpenChange(false)}
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
