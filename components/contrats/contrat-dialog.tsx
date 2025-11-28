"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DialogActionButtons } from "@/components/ui/dialog-action-buttons";
import { Form } from "@/components/ui/form";
import { StepperIndicator } from "@/components/ui/stepper-indicator";
import {
    useContratDialog,
    type ContratFormValues,
} from "@/hooks/use-contrat-dialog";

export type { ContratFormValues };
import {
    ChevronLeft,
    ChevronRight,
    CreditCard,
    FileText,
    User,
} from "lucide-react";
import { ClientStep } from "./steps/client-step";
import { ContratStep } from "./steps/contrat-step";
import { TarificationStep } from "./steps/tarification-step";

interface ContratDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

const steps = [
    { id: 1, name: "Client", icon: User },
    { id: 2, name: "Contrat", icon: FileText },
    { id: 3, name: "Tarification", icon: CreditCard },
];

export function ContratDialog({
    open,
    onOpenChange,
    onSuccess,
}: ContratDialogProps) {
    const {
        form,
        formKey,
        currentStep,
        isPending,
        clients,
        handleOpenChange,
        handleClientChange,
        handleNext,
        handlePrevious,
        handleSubmit,
    } = useContratDialog({
        open,
        onOpenChange,
        onSuccess,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em]">
                        Nouveau contrat d&apos;entretien
                    </DialogTitle>
                </DialogHeader>

                <StepperIndicator steps={steps} currentStep={currentStep} />

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-6"
                    >
                        {/* Step Content - use key to force re-render on form reset */}
                        <div key={formKey} className="min-h-[300px]">
                            {currentStep === 1 && (
                                <ClientStep
                                    form={form}
                                    clients={clients}
                                    onClientChange={handleClientChange}
                                />
                            )}
                            {currentStep === 2 && <ContratStep form={form} />}
                            {currentStep === 3 && (
                                <TarificationStep form={form} />
                            )}
                        </div>

                        <div className="flex justify-between pt-4">
                            <div>
                                {currentStep > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handlePrevious}
                                        className="gap-2 h-11 px-6 text-[14px] border-black/10"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Précédent
                                    </Button>
                                )}
                            </div>
                            {currentStep < 3 ? (
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleOpenChange(false)}
                                        className="h-11 px-6 text-[14px] border-black/10"
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                        className="gap-2 h-11 px-6 text-[14px] bg-black hover:bg-black/90"
                                    >
                                        Suivant
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex-1">
                                    <DialogActionButtons
                                        onCancel={() => handleOpenChange(false)}
                                        submitLabel="Créer le contrat"
                                        isLoading={isPending}
                                        className="pt-0"
                                    />
                                </div>
                            )}
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
