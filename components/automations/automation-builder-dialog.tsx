"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { Textarea } from "@/components/ui/textarea";
import {
    ActionConfig,
    Automation,
    CreateAutomationData,
    TriggerConfig,
    useCreateAutomation,
    useUpdateAutomation,
} from "@/hooks/use-automations";
import { useFormDialog } from "@/hooks/use-form-dialog";
import { useSegments } from "@/hooks/use-segments";
import { ArrowRight } from "lucide-react";
import { ActionConfigSection } from "./action-config-section";
import { TriggerConfigSection } from "./trigger-config-section";

interface AutomationFormValues extends Record<string, unknown> {
    nom: string;
    description: string;
    triggerType: string;
    actionType: string;
    triggerConfig: TriggerConfig;
    actionConfig: ActionConfig;
}

const defaultValues: AutomationFormValues = {
    nom: "",
    description: "",
    triggerType: "",
    actionType: "",
    triggerConfig: {},
    actionConfig: {},
};

interface AutomationBuilderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    automation?: Automation | null;
}

export function AutomationBuilderDialog({
    open,
    onOpenChange,
    automation,
}: AutomationBuilderDialogProps) {
    const { data: segmentsData } = useSegments({ actif: true });
    const segments = segmentsData?.data || [];

    const createAutomation = useCreateAutomation();
    const updateAutomation = useUpdateAutomation();

    const { values, setValue, handleSubmit, isSubmitting, isEditMode } =
        useFormDialog<
            Automation,
            AutomationFormValues,
            CreateAutomationData,
            Partial<CreateAutomationData>
        >({
            open,
            onOpenChange,
            initialData: automation,
            defaultValues,
            createMutation: createAutomation,
            updateMutation: updateAutomation,
            dataToFormValues: (a) => ({
                nom: a.nom,
                description: a.description || "",
                triggerType: a.triggerType,
                actionType: a.actionType,
                triggerConfig: a.triggerConfig || {},
                actionConfig: a.actionConfig || {},
            }),
            formValuesToCreateInput: (v) => ({
                nom: v.nom,
                description: v.description,
                triggerType: v.triggerType,
                triggerConfig: v.triggerConfig,
                actionType: v.actionType,
                actionConfig: v.actionConfig,
                actif: true,
            }),
            formValuesToUpdateInput: (v) => ({
                nom: v.nom,
                description: v.description,
                triggerType: v.triggerType,
                triggerConfig: v.triggerConfig,
                actionType: v.actionType,
                actionConfig: v.actionConfig,
                actif: true,
            }),
            validate: (v) => {
                if (!v.nom || !v.triggerType || !v.actionType) {
                    return "Veuillez remplir tous les champs requis";
                }
                return null;
            },
            createSuccessMessage: "Automation créée",
            updateSuccessMessage: "Automation mise à jour",
        });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.01em]">
                        {isEditMode
                            ? "Modifier l'automation"
                            : "Nouvelle automation"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[13px] font-medium text-black/80">
                                Nom de l&apos;automation *
                            </Label>
                            <Input
                                value={values.nom}
                                onChange={(e) =>
                                    setValue("nom", e.target.value)
                                }
                                className="h-11 border-black/10 text-[14px]"
                                placeholder="Ex: Bienvenue nouveaux VIP"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[13px] font-medium text-black/80">
                                Description
                            </Label>
                            <Textarea
                                value={values.description}
                                onChange={(e) =>
                                    setValue("description", e.target.value)
                                }
                                className="min-h-[80px] border-black/10 text-[14px]"
                                placeholder="Description de l'automation"
                            />
                        </div>
                    </div>

                    <TriggerConfigSection
                        triggerType={values.triggerType}
                        setTriggerType={(v) => setValue("triggerType", v)}
                        triggerConfig={values.triggerConfig}
                        setTriggerConfig={(v) => setValue("triggerConfig", v)}
                        segments={segments}
                    />

                    {/* Arrow */}
                    {values.triggerType && values.actionType && (
                        <div className="flex justify-center">
                            <div className="h-10 w-10 rounded-full bg-black/5 flex items-center justify-center">
                                <ArrowRight
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                    )}

                    <ActionConfigSection
                        actionType={values.actionType}
                        setActionType={(v) => setValue("actionType", v)}
                        actionConfig={values.actionConfig}
                        setActionConfig={(v) => setValue("actionConfig", v)}
                        segments={segments}
                    />
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t border-black/10">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-11 px-6 text-[14px] border-black/10 hover:bg-black/5"
                    >
                        Annuler
                    </Button>
                    <PrimaryActionButton
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isEditMode ? "Enregistrer" : "Créer"}
                    </PrimaryActionButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}
