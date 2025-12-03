"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import type { Employee } from "@/hooks/use-employees";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    CompensationSection,
    LeaveNotesSection,
    PersonalInfoSection,
    ProfessionalInfoSection,
} from "./form-sections";
import {
    defaultFormValues,
    employeeFormSchema,
    employeeToFormData,
    type EmployeeFormData,
} from "./types";
import { WizardFooter, WizardHeader, WIZARD_STEPS } from "./wizard";

export interface EmployeeWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employee?: Employee | null;
    onSubmit: (data: EmployeeFormData) => void;
    isLoading?: boolean;
}

export function EmployeeWizard({
    open,
    onOpenChange,
    employee,
    onSubmit,
    isLoading,
}: EmployeeWizardProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const isEditMode = !!employee;

    const form = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeFormSchema),
        defaultValues: defaultFormValues,
        mode: "onChange",
    });

    useEffect(() => {
        if (open) {
            setCurrentStep(1);
            if (employee) {
                form.reset(employeeToFormData(employee));
            } else {
                form.reset(defaultFormValues);
            }
        }
    }, [open, employee, form]);

    const validateCurrentStep = async () => {
        const currentStepConfig = WIZARD_STEPS[currentStep - 1];
        const fieldsToValidate =
            currentStepConfig.fields as (keyof EmployeeFormData)[];
        const result = await form.trigger(fieldsToValidate);
        return result;
    };

    const handleNext = async () => {
        const isValid = await validateCurrentStep();
        if (isValid && currentStep < WIZARD_STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = (data: EmployeeFormData) => {
        onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
                <WizardHeader
                    currentStep={currentStep}
                    isEditMode={isEditMode}
                    onStepClick={setCurrentStep}
                />

                {/* Form Content */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex-1 overflow-y-auto py-4"
                    >
                        {currentStep === 1 && (
                            <PersonalInfoSection form={form} showTitle={false} />
                        )}

                        {currentStep === 2 && (
                            <ProfessionalInfoSection
                                form={form}
                                showTitle={false}
                            />
                        )}

                        {currentStep === 3 && (
                            <CompensationSection form={form} showTitle={false} />
                        )}

                        {currentStep === 4 && (
                            <LeaveNotesSection
                                form={form}
                                variant="wizard"
                                showLeaveTitle={false}
                                showNotesTitle={false}
                            />
                        )}
                    </form>
                </Form>

                <WizardFooter
                    currentStep={currentStep}
                    totalSteps={WIZARD_STEPS.length}
                    isLoading={isLoading}
                    isEditMode={isEditMode}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onCancel={() => onOpenChange(false)}
                    onSubmit={form.handleSubmit(handleSubmit)}
                />
            </DialogContent>
        </Dialog>
    );
}

// Re-export types for backward compatibility
export type { EmployeeFormData as WizardFormData } from "./types";
