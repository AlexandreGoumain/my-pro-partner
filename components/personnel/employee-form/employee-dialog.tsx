"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogActionButtons } from "@/components/ui/dialog-action-buttons";
import { DialogHeaderSection } from "@/components/ui/dialog-header-section";
import { Form } from "@/components/ui/form";
import type { Employee } from "@/hooks/use-employees";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
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

export interface EmployeeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employee?: Employee | null;
    onSubmit: (data: EmployeeFormData) => void;
    isLoading?: boolean;
}

export function EmployeeDialog({
    open,
    onOpenChange,
    employee,
    onSubmit,
    isLoading,
}: EmployeeDialogProps) {
    const form = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeFormSchema),
        defaultValues: defaultFormValues,
    });

    const [formKey, setFormKey] = useState(0);
    const isEditMode = !!employee;

    // Handle dialog open/close - reset form when opening
    const handleOpenChange = useCallback(
        (newOpen: boolean) => {
            if (newOpen) {
                if (employee) {
                    form.reset(employeeToFormData(employee));
                } else {
                    form.reset(defaultFormValues);
                }
                setFormKey((k) => k + 1);
            }
            onOpenChange(newOpen);
        },
        [employee, form, onOpenChange]
    );

    const handleSubmit = (data: EmployeeFormData) => {
        onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeaderSection
                    title={isEditMode ? "Modifier l'employé" : "Nouvel employé"}
                    description={
                        isEditMode
                            ? "Modifiez les informations de l'employé"
                            : "Ajoutez un nouvel employé à votre équipe"
                    }
                    titleClassName="text-[20px] font-semibold tracking-[-0.02em]"
                    descriptionClassName="text-[14px] text-black/60"
                />

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-6"
                        key={formKey}
                    >
                        <PersonalInfoSection form={form} />
                        <ProfessionalInfoSection form={form} />
                        <CompensationSection form={form} showTitle={false} />
                        <LeaveNotesSection form={form} variant="dialog" />

                        <DialogActionButtons
                            onCancel={() => handleOpenChange(false)}
                            submitLabel={
                                isEditMode ? "Enregistrer" : "Ajouter l'employé"
                            }
                            isLoading={isLoading}
                            isEditing={isEditMode}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

// Re-export types for backward compatibility
export type { EmployeeFormData } from "./types";
