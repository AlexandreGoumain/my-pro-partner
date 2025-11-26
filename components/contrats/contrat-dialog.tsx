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
import { useClients, type Client } from "@/hooks/use-clients";
import { useCreateContrat } from "@/hooks/use-contrats";
import {
    type PeriodiciteContrat,
    type TypeContratEntretien,
} from "@/lib/types/contrats";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { addYears, format } from "date-fns";
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    FileText,
    User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ClientStep } from "./steps/client-step";
import { ContratStep } from "./steps/contrat-step";
import { TarificationStep } from "./steps/tarification-step";

const TVA_RATE = 0.1;

const contratSchema = z.object({
    clientId: z.string().min(1, "Le client est requis"),
    typeContrat: z.enum([
        "CHAUDIERE",
        "ADOUCISSEUR",
        "PLOMBERIE_GENERAL",
        "MULTI_EQUIPEMENTS",
        "PERSONNALISE",
    ]),
    nom: z.string().min(1, "Le nom du contrat est requis"),
    adresse: z.string().min(1, "L'adresse est requise"),
    codePostal: z.string().min(1, "Le code postal est requis"),
    ville: z.string().min(1, "La ville est requise"),
    dateDebut: z.string().min(1, "La date de début est requise"),
    dureeAnnees: z.coerce.number().min(1).max(10),
    montantHT: z.coerce.number().min(0, "Le montant doit être positif"),
    periodicite: z.enum(["MENSUEL", "TRIMESTRIEL", "SEMESTRIEL", "ANNUEL"]),
    nombreRevisionsAn: z.coerce.number().min(0).max(12),
    interventionsIncluses: z.coerce.number().min(0),
    remisePieces: z.coerce.number().min(0).max(100).optional(),
    renouvellementAuto: z.boolean(),
});

export type ContratFormValues = z.infer<typeof contratSchema>;
type Step = 1 | 2 | 3;

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
    const [currentStep, setCurrentStep] = useState<Step>(1);

    const { data: clientsData } = useClients();
    const clients = useMemo(() => clientsData || [], [clientsData]);
    const createContrat = useCreateContrat();

    const form = useForm<ContratFormValues>({
        resolver: zodResolver(contratSchema),
        defaultValues: {
            clientId: "",
            typeContrat: "CHAUDIERE",
            nom: "",
            adresse: "",
            codePostal: "",
            ville: "",
            dateDebut: format(new Date(), "yyyy-MM-dd"),
            dureeAnnees: 1,
            montantHT: 0,
            periodicite: "ANNUEL",
            nombreRevisionsAn: 1,
            interventionsIncluses: 0,
            remisePieces: 0,
            renouvellementAuto: true,
        },
    });

    const selectedClientId = form.watch("clientId");
    const montantHT = form.watch("montantHT");
    const dureeAnnees = form.watch("dureeAnnees");
    const dateDebut = form.watch("dateDebut");

    // Reset step when dialog opens
    useEffect(() => {
        if (open) {
            setCurrentStep(1);
            form.reset();
        }
    }, [open, form]);

    // Auto-fill address when client is selected
    useEffect(() => {
        if (selectedClientId) {
            const client = clients.find((c: Client) => c.id === selectedClientId);
            if (client) {
                form.setValue("adresse", client.adresse || "");
                form.setValue("codePostal", client.codePostal || "");
                form.setValue("ville", client.ville || "");
            }
        }
    }, [selectedClientId, clients, form]);

    const montantTTC = useMemo(() => {
        return Number(montantHT) * (1 + TVA_RATE);
    }, [montantHT]);

    const dateFin = useMemo(() => {
        if (!dateDebut) return "";
        const start = new Date(dateDebut);
        return format(addYears(start, dureeAnnees || 1), "yyyy-MM-dd");
    }, [dateDebut, dureeAnnees]);

    const handleNext = async () => {
        let isValid = true;

        if (currentStep === 1) {
            isValid = await form.trigger(["clientId"]);
        } else if (currentStep === 2) {
            isValid = await form.trigger([
                "typeContrat",
                "nom",
                "adresse",
                "codePostal",
                "ville",
                "dateDebut",
                "dureeAnnees",
            ]);
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

    const onSubmit = (data: ContratFormValues) => {
        const payload = {
            clientId: data.clientId,
            typeContrat: data.typeContrat as TypeContratEntretien,
            nom: data.nom,
            equipements: [],
            adresse: data.adresse,
            codePostal: data.codePostal,
            ville: data.ville,
            dateDebut: data.dateDebut,
            dateFin: dateFin,
            dureeAnnees: data.dureeAnnees,
            montantHT: data.montantHT,
            montantTTC: montantTTC,
            periodicite: data.periodicite as PeriodiciteContrat,
            nombreRevisionsAn: data.nombreRevisionsAn,
            interventionsIncluses: data.interventionsIncluses,
            remisePieces: data.remisePieces || 0,
            renouvellementAuto: data.renouvellementAuto,
        };

        createContrat.mutate(payload, {
            onSuccess: () => {
                toast.success("Contrat créé avec succès");
                form.reset();
                onSuccess();
            },
            onError: (error) => {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Impossible de créer le contrat"
                );
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em]">
                        Nouveau contrat d&apos;entretien
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
                                            "text-[12px] font-medium",
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
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Step Content */}
                        <div className="min-h-[300px]">
                            {currentStep === 1 && (
                                <ClientStep form={form} clients={clients} />
                            )}
                            {currentStep === 2 && <ContratStep form={form} />}
                            {currentStep === 3 && (
                                <TarificationStep form={form} />
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
                                        type="submit"
                                        disabled={createContrat.isPending}
                                    >
                                        {createContrat.isPending
                                            ? "Création..."
                                            : "Créer le contrat"}
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
