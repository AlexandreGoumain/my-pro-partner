"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { StepperIndicator } from "@/components/ui/stepper-indicator";
import { useRdvDialog, type RdvFormValues } from "@/hooks/use-rdv-dialog";
import type { RendezVous } from "@/hooks/use-rendez-vous";

export type { RdvFormValues };
import { CalendarDays, ChevronLeft, ChevronRight, User } from "lucide-react";
import { ClientStep } from "./steps/client-step";
import { RdvDetailsStep } from "./steps/rdv-details-step";

interface RdvDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    rdv?: RendezVous | null;
    defaultDate?: Date;
}

const steps = [
    { id: 1, name: "Client", icon: User },
    { id: 2, name: "Rendez-vous", icon: CalendarDays },
];

export function RdvDialog({
    open,
    onOpenChange,
    onSuccess,
    rdv,
    defaultDate,
}: RdvDialogProps) {
    const {
        form,
        formKey,
        currentStep,
        isEditing,
        isPending,
        prestations,
        employes,
        clients,
        handleOpenChange,
        handleClientChange,
        handlePrestationChange,
        handleNext,
        handlePrevious,
        handleSubmit,
    } = useRdvDialog({
        open,
        onOpenChange,
        onSuccess,
        rdv,
        defaultDate,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em]">
                        {isEditing
                            ? "Modifier le rendez-vous"
                            : "Nouveau rendez-vous"}
                    </DialogTitle>
                </DialogHeader>

                <StepperIndicator steps={steps} currentStep={currentStep} />

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-6"
                    >
                        {/* Step Content - use key to force re-render on form reset */}
                        <div key={formKey} className="min-h-[280px]">
                            {currentStep === 1 && (
                                <ClientStep
                                    form={form}
                                    clients={clients}
                                    onClientChange={handleClientChange}
                                />
                            )}
                            {currentStep === 2 && (
                                <RdvDetailsStep
                                    form={form}
                                    prestations={prestations}
                                    employes={employes}
                                    onPrestationChange={handlePrestationChange}
                                    isEditing={isEditing}
                                />
                            )}
                        </div>

                        <DialogFooter className="flex justify-between">
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
                                {currentStep < 2 ? (
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
                                        type="submit"
                                        disabled={isPending}
                                    >
                                        {isPending
                                            ? "En cours..."
                                            : isEditing
                                              ? "Enregistrer"
                                              : "Créer le RDV"}
                                    </PrimaryActionButton>
                                )}
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
