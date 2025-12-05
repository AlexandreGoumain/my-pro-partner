"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WizardFooterProps {
    currentStep: number;
    totalSteps: number;
    isLoading?: boolean;
    isEditMode: boolean;
    onPrev: () => void;
    onNext: () => void;
    onCancel: () => void;
    onSubmit: () => void;
}

export function WizardFooter({
    currentStep,
    totalSteps,
    isLoading,
    isEditMode,
    onPrev,
    onNext,
    onCancel,
    onSubmit,
}: WizardFooterProps) {
    const isLastStep = currentStep === totalSteps;

    return (
        <DialogFooter className="flex items-center justify-between pt-4 border-t border-black/8">
            <Button
                type="button"
                variant="ghost"
                onClick={onPrev}
                disabled={currentStep === 1}
                className="text-black/60 hover:text-black"
            >
                <ChevronLeft className="w-4 h-4 mr-1" strokeWidth={2} />
                Précédent
            </Button>
            <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="h-11 px-6"
                >
                    Annuler
                </Button>
                {!isLastStep ? (
                    <Button
                        type="button"
                        onClick={onNext}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6"
                    >
                        Suivant
                        <ChevronRight className="w-4 h-4 ml-1" strokeWidth={2} />
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={onSubmit}
                        disabled={isLoading}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6"
                    >
                        {isLoading
                            ? "Enregistrement..."
                            : isEditMode
                              ? "Enregistrer"
                              : "Créer l'employé"}
                    </Button>
                )}
            </div>
        </DialogFooter>
    );
}
