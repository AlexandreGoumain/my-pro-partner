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
import { useClients, type Client } from "@/hooks/use-clients";
import { useCreateContrat } from "@/hooks/use-contrats";
import {
    type PeriodiciteContrat,
    type TypeContratEntretien,
} from "@/lib/types/contrats";
import { zodResolver } from "@hookform/resolvers/zod";
import { addYears, format } from "date-fns";
import {
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
            const client = clients.find(
                (c: Client) => c.id === selectedClientId
            );
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

                <StepperIndicator steps={steps} currentStep={currentStep} />

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
                                        onClick={() => onOpenChange(false)}
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
                                        onCancel={() => onOpenChange(false)}
                                        submitLabel="Créer le contrat"
                                        isLoading={createContrat.isPending}
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
