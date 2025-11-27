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
import { useClients } from "@/hooks/use-clients";
import { useActiveEmployes } from "@/hooks/use-employes";
import { useActivePrestations } from "@/hooks/use-prestations";
import {
    useCreateRendezVous,
    useUpdateRendezVous,
    type RendezVous,
} from "@/hooks/use-rendez-vous";
import type { RendezVousStatut } from "@/lib/types/rendez-vous.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ClientStep } from "./steps/client-step";
import { RdvDetailsStep } from "./steps/rdv-details-step";

const rdvSchema = z.object({
    clientId: z.string().optional(),
    nomClient: z.string().min(1, "Le nom du client est requis"),
    telephone: z.string().optional(),
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    date: z.string().min(1, "La date est requise"),
    heure: z.string().min(1, "L'heure est requise"),
    duree: z.coerce.number().min(5, "La durée minimum est de 5 minutes"),
    prestationId: z.string().optional(),
    employeId: z.string().optional(),
    notes: z.string().optional(),
    statut: z.string().optional(),
});

export type RdvFormValues = z.infer<typeof rdvSchema>;
type Step = 1 | 2;

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
    const isEditing = !!rdv;
    const [currentStep, setCurrentStep] = useState<Step>(1);

    const createRdv = useCreateRendezVous();
    const updateRdv = useUpdateRendezVous();

    const { data: prestations = [] } = useActivePrestations();
    const { data: employes = [] } = useActiveEmployes();
    const { data: clients = [] } = useClients(100);

    const [selectedPrestationId, setSelectedPrestationId] =
        useState<string>("");

    const form = useForm<RdvFormValues>({
        resolver: zodResolver(rdvSchema),
        defaultValues: {
            clientId: "",
            nomClient: "",
            telephone: "",
            email: "",
            date: defaultDate
                ? format(defaultDate, "yyyy-MM-dd")
                : format(new Date(), "yyyy-MM-dd"),
            heure: "09:00",
            duree: 60,
            prestationId: "",
            employeId: "",
            notes: "",
            statut: "EN_ATTENTE",
        },
    });

    // Reset form and step when dialog opens/closes or rdv changes
    useEffect(() => {
        if (open) {
            setCurrentStep(1);
            if (rdv) {
                form.reset({
                    clientId: rdv.clientId || "",
                    nomClient: rdv.nomClient,
                    telephone: rdv.telephone || "",
                    email: rdv.email || "",
                    date: format(new Date(rdv.date), "yyyy-MM-dd"),
                    heure: rdv.heure,
                    duree: rdv.duree,
                    prestationId: rdv.prestationId || "",
                    employeId: rdv.employeId || "",
                    notes: rdv.notes || "",
                    statut: rdv.statut,
                });
                setSelectedPrestationId(rdv.prestationId || "");
            } else {
                form.reset({
                    clientId: "",
                    nomClient: "",
                    telephone: "",
                    email: "",
                    date: defaultDate
                        ? format(defaultDate, "yyyy-MM-dd")
                        : format(new Date(), "yyyy-MM-dd"),
                    heure: "09:00",
                    duree: 60,
                    prestationId: "",
                    employeId: "",
                    notes: "",
                    statut: "EN_ATTENTE",
                });
                setSelectedPrestationId("");
            }
        }
    }, [open, rdv, defaultDate, form]);

    // Update duration when prestation changes
    useEffect(() => {
        if (selectedPrestationId && prestations) {
            const prestation = prestations.find(
                (p) => p.id === selectedPrestationId
            );
            if (prestation) {
                form.setValue("duree", prestation.duree);
            }
        }
    }, [selectedPrestationId, prestations, form]);

    // Update client info when client is selected
    const handleClientChange = (clientId: string) => {
        form.setValue("clientId", clientId);
        if (clientId && clients) {
            const client = clients.find((c) => c.id === clientId);
            if (client) {
                form.setValue(
                    "nomClient",
                    `${client.prenom || ""} ${client.nom}`.trim()
                );
                form.setValue("telephone", client.telephone || "");
                form.setValue("email", client.email || "");
            }
        }
    };

    const handlePrestationChange = (prestationId: string) => {
        setSelectedPrestationId(prestationId);
    };

    const handleNext = async () => {
        if (currentStep === 1) {
            const isValid = await form.trigger(["nomClient"]);
            if (isValid) {
                setCurrentStep(2);
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as Step);
        }
    };

    const onSubmit = async (values: RdvFormValues) => {
        try {
            const data = {
                ...values,
                clientId: values.clientId || undefined,
                email: values.email || undefined,
                prestationId: values.prestationId || undefined,
                employeId: values.employeId || undefined,
                statut: values.statut as RendezVousStatut | undefined,
            };
            if (isEditing && rdv) {
                await updateRdv.mutateAsync({
                    id: rdv.id,
                    data,
                });
            } else {
                await createRdv.mutateAsync(data);
            }
            onSuccess();
        } catch {
            // Error handled by mutation
        }
    };

    const isPending = createRdv.isPending || updateRdv.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Step Content */}
                        <div className="min-h-[280px]">
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
                                    onClick={() => onOpenChange(false)}
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
