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
import { useFlotte } from "@/hooks/use-flotte";
import { useInterventions, useUpdateIntervention } from "@/hooks/use-interventions";
import type { Camionnette } from "@/lib/types/flotte";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    Route,
    User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DateTechnicienStep } from "./steps/date-technicien-step";
import {
    SelectInterventionsStep,
    type InterventionNonPlanifiee,
} from "./steps/select-interventions-step";
import { OrganiserTourneeStep } from "./steps/organiser-tournee-step";

const tourneeSchema = z.object({
    date: z.string().min(1, "La date est requise"),
    plombierId: z.string().min(1, "Le technicien est requis"),
    camionnetteId: z.string().optional(),
    heureDebut: z.string().min(1, "L'heure de début est requise"),
    heureFin: z.string().optional(),
});

export type TourneeFormValues = z.infer<typeof tourneeSchema>;
type Step = 1 | 2 | 3;

interface TourneeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    defaultDate?: Date;
    plombiers: { id: string; name: string | null }[];
}

const steps = [
    { id: 1, name: "Date & Technicien", icon: User },
    { id: 2, name: "Interventions", icon: ClipboardList },
    { id: 3, name: "Organisation", icon: Route },
];

interface InterventionAvecHoraire extends InterventionNonPlanifiee {
    heureDebut: string;
}

export function TourneeDialog({
    open,
    onOpenChange,
    onSuccess,
    defaultDate,
    plombiers,
}: TourneeDialogProps) {
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [selectedInterventionIds, setSelectedInterventionIds] = useState<string[]>([]);
    const [interventionsOrdered, setInterventionsOrdered] = useState<InterventionAvecHoraire[]>([]);

    const { data: camionnettes = [] } = useFlotte();
    const updateIntervention = useUpdateIntervention();

    // Fetch non-planified interventions (statut = DEMANDE = not yet scheduled)
    const { data: interventionsData, isLoading: loadingInterventions } = useInterventions({
        statut: "DEMANDE",
    });

    const interventionsNonPlanifiees = useMemo(() => {
        if (!interventionsData || !Array.isArray(interventionsData)) return [];
        return interventionsData.map((i) => ({
            id: i.id,
            client: {
                nom: i.client?.nom || "Inconnu",
                prenom: i.client?.prenom,
            },
            typeIntervention: i.typeIntervention,
            priorite: i.priorite,
            description: i.description,
            adresse: i.adresse,
            codePostal: i.codePostal,
            ville: i.ville,
            dureeEstimeeH: (i as any).dureeEstimeeH || null,
            createdAt: (i as any).createdAt || "",
        })) as InterventionNonPlanifiee[];
    }, [interventionsData]);

    const form = useForm<TourneeFormValues>({
        resolver: zodResolver(tourneeSchema),
        defaultValues: {
            date: defaultDate ? format(defaultDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
            plombierId: "",
            camionnetteId: "",
            heureDebut: "08:00",
            heureFin: "18:00",
        },
    });

    const heureDebut = form.watch("heureDebut");

    // Reset when dialog opens
    useEffect(() => {
        if (open) {
            setCurrentStep(1);
            setSelectedInterventionIds([]);
            setInterventionsOrdered([]);
            form.reset({
                date: defaultDate ? format(defaultDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
                plombierId: "",
                camionnetteId: "",
                heureDebut: "08:00",
                heureFin: "18:00",
            });
        }
    }, [open, defaultDate, form]);

    // Update ordered interventions when selection changes
    useEffect(() => {
        if (currentStep === 3) {
            const selectedInterventions = interventionsNonPlanifiees.filter((i) =>
                selectedInterventionIds.includes(i.id)
            );

            // Keep existing order for already ordered ones, add new ones at the end
            const existingIds = interventionsOrdered.map((i) => i.id);
            const newInterventions = selectedInterventions.filter(
                (i) => !existingIds.includes(i.id)
            );
            const keptInterventions = interventionsOrdered.filter((i) =>
                selectedInterventionIds.includes(i.id)
            );

            // Calculate start times based on heureDebut
            let currentHour = heureDebut;
            const allInterventions = [...keptInterventions];

            // Add new interventions with calculated times
            newInterventions.forEach((intervention) => {
                allInterventions.push({
                    ...intervention,
                    heureDebut: currentHour,
                });
            });

            // Recalculate times for all
            let time = heureDebut;
            const withTimes = allInterventions.map((intervention, index) => {
                const result = {
                    ...intervention,
                    heureDebut: index === 0 ? heureDebut : time,
                };
                // Add duration to get next start time
                const [h, m] = time.split(":").map(Number);
                const duration = intervention.dureeEstimeeH || 1;
                const newH = h + Math.floor(duration);
                const newM = m + (duration % 1) * 60;
                time = `${String(Math.floor(newH + newM / 60)).padStart(2, "0")}:${String(Math.floor(newM % 60)).padStart(2, "0")}`;
                return result;
            });

            setInterventionsOrdered(withTimes);
        }
    }, [currentStep, selectedInterventionIds, interventionsNonPlanifiees, heureDebut]);

    const handleNext = async () => {
        let isValid = true;

        if (currentStep === 1) {
            isValid = await form.trigger(["date", "plombierId", "heureDebut"]);
        } else if (currentStep === 2) {
            isValid = selectedInterventionIds.length > 0;
            if (!isValid) {
                toast.error("Sélectionnez au moins une intervention");
            }
        }

        if (isValid && currentStep < 3) {
            setCurrentStep((prev) => (prev + 1) as Step);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as Step);
        }
    };

    const handleHeureChange = (id: string, heure: string) => {
        setInterventionsOrdered((prev) =>
            prev.map((i) => (i.id === id ? { ...i, heureDebut: heure } : i))
        );
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async () => {
        const data = form.getValues();
        setIsSubmitting(true);

        try {
            // Update each intervention with the assigned date, time, and technician
            for (const intervention of interventionsOrdered) {
                const dateTime = new Date(`${data.date}T${intervention.heureDebut}`);

                await updateIntervention.mutateAsync({
                    id: intervention.id,
                    data: {
                        datePrevisionnelle: dateTime.toISOString(),
                        plombierId: data.plombierId,
                        camionnetteId: data.camionnetteId || undefined,
                    },
                });
            }

            toast.success(`Tournée planifiée avec ${interventionsOrdered.length} intervention${interventionsOrdered.length > 1 ? "s" : ""}`);
            onSuccess();
        } catch (error) {
            toast.error("Erreur lors de la planification de la tournée");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em]">
                        Planifier une tournée
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

                <Form {...form}>
                    <form className="space-y-6">
                        {/* Step Content */}
                        <div className="min-h-[350px]">
                            {currentStep === 1 && (
                                <DateTechnicienStep
                                    form={form}
                                    plombiers={plombiers}
                                    camionnettes={camionnettes}
                                />
                            )}
                            {currentStep === 2 && (
                                <SelectInterventionsStep
                                    interventions={interventionsNonPlanifiees}
                                    selectedIds={selectedInterventionIds}
                                    onSelectionChange={setSelectedInterventionIds}
                                    isLoading={loadingInterventions}
                                />
                            )}
                            {currentStep === 3 && (
                                <OrganiserTourneeStep
                                    interventions={interventionsOrdered}
                                    onReorder={setInterventionsOrdered}
                                    onHeureChange={handleHeureChange}
                                    heureDebutTournee={heureDebut}
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
                                        onClick={onSubmit}
                                        disabled={isSubmitting || interventionsOrdered.length === 0}
                                    >
                                        {isSubmitting
                                            ? "Planification..."
                                            : "Planifier la tournée"}
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
