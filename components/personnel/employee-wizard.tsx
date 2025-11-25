"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Employee } from "@/hooks/use-employees";
import { STATUT_LABELS, TYPE_CONTRAT_LABELS } from "@/lib/types/personnel.types";
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Check, ChevronLeft, ChevronRight, User, Briefcase, Wallet, Calendar } from "lucide-react";

const wizardSchema = z.object({
    // Step 1: Personal
    prenom: z.string().min(1, "Le prénom est requis").max(100),
    nom: z.string().min(1, "Le nom est requis").max(100),
    email: z.string().email("Email invalide"),
    telephone: z.string().max(20).optional().or(z.literal("")),
    dateNaissance: z.string().optional().or(z.literal("")),
    adresse: z.string().max(200).optional().or(z.literal("")),
    ville: z.string().max(100).optional().or(z.literal("")),
    codePostal: z.string().max(10).optional().or(z.literal("")),
    pays: z.string().max(100).default("France"),
    // Step 2: Professional
    poste: z.string().min(1, "Le poste est requis").max(100),
    departement: z.string().max(100).optional().or(z.literal("")),
    statut: z.enum(["ACTIF", "CONGE", "MALADIE", "ABSENT", "INACTIF"]).default("ACTIF"),
    typeContrat: z.enum(["CDI", "CDD", "INTERIM", "APPRENTI", "STAGE", "FREELANCE"]).default("CDI"),
    dateEmbauche: z.string().min(1, "La date d'embauche est requise"),
    dateFin: z.string().optional().or(z.literal("")),
    // Step 3: Compensation
    salaireBrut: z.number().min(0, "Le salaire doit être positif").max(999999.99),
    devise: z.string().max(10).default("EUR"),
    heuresHebdo: z.number().int().min(1).max(70).default(35).optional(),
    joursTravail: z.string().max(100).optional().or(z.literal("")),
    // Step 4: Leave & Notes
    congesRestants: z.number().int().min(0).max(365).default(25).optional(),
    congesPris: z.number().int().min(0).max(365).default(0).optional(),
    notes: z.string().max(2000).optional().or(z.literal("")),
    competences: z.string().max(2000).optional().or(z.literal("")),
});

export type WizardFormData = z.infer<typeof wizardSchema>;

export interface EmployeeWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employee?: Employee | null;
    onSubmit: (data: WizardFormData) => void;
    isLoading?: boolean;
}

const defaultValues: WizardFormData = {
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    dateNaissance: "",
    adresse: "",
    ville: "",
    codePostal: "",
    pays: "France",
    poste: "",
    departement: "",
    statut: "ACTIF",
    typeContrat: "CDI",
    dateEmbauche: new Date().toISOString().split("T")[0],
    dateFin: "",
    salaireBrut: 0,
    devise: "EUR",
    heuresHebdo: 35,
    joursTravail: "",
    congesRestants: 25,
    congesPris: 0,
    notes: "",
    competences: "",
};

const steps = [
    { id: 1, title: "Personnel", icon: User, fields: ["prenom", "nom", "email", "telephone", "dateNaissance", "adresse", "ville", "codePostal", "pays"] },
    { id: 2, title: "Professionnel", icon: Briefcase, fields: ["poste", "departement", "statut", "typeContrat", "dateEmbauche", "dateFin"] },
    { id: 3, title: "Rémunération", icon: Wallet, fields: ["salaireBrut", "devise", "heuresHebdo", "joursTravail"] },
    { id: 4, title: "Congés & Notes", icon: Calendar, fields: ["congesRestants", "congesPris", "notes", "competences"] },
];

export function EmployeeWizard({
    open,
    onOpenChange,
    employee,
    onSubmit,
    isLoading,
}: EmployeeWizardProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const isEditMode = !!employee;

    const form = useForm<WizardFormData>({
        resolver: zodResolver(wizardSchema),
        defaultValues,
        mode: "onChange",
    });

    useEffect(() => {
        if (open) {
            setCurrentStep(1);
            if (employee) {
                form.reset({
                    prenom: employee.prenom,
                    nom: employee.nom,
                    email: employee.email,
                    telephone: employee.telephone || "",
                    dateNaissance: employee.dateNaissance
                        ? new Date(employee.dateNaissance).toISOString().split("T")[0]
                        : "",
                    adresse: employee.adresse || "",
                    ville: employee.ville || "",
                    codePostal: employee.codePostal || "",
                    pays: employee.pays || "France",
                    poste: employee.poste,
                    departement: employee.departement || "",
                    statut: employee.statut,
                    typeContrat: employee.typeContrat,
                    dateEmbauche: new Date(employee.dateEmbauche).toISOString().split("T")[0],
                    dateFin: employee.dateFin
                        ? new Date(employee.dateFin).toISOString().split("T")[0]
                        : "",
                    salaireBrut: Number(employee.salaireBrut),
                    devise: employee.devise || "EUR",
                    heuresHebdo: employee.heuresHebdo || 35,
                    joursTravail: employee.joursTravail || "",
                    notes: employee.notes || "",
                    competences: employee.competences || "",
                    congesRestants: employee.congesRestants || 25,
                    congesPris: employee.congesPris || 0,
                });
            } else {
                form.reset(defaultValues);
            }
        }
    }, [open, employee, form]);

    const validateCurrentStep = async () => {
        const currentStepConfig = steps[currentStep - 1];
        const fieldsToValidate = currentStepConfig.fields as (keyof WizardFormData)[];
        const result = await form.trigger(fieldsToValidate);
        return result;
    };

    const handleNext = async () => {
        const isValid = await validateCurrentStep();
        if (isValid && currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = (data: WizardFormData) => {
        onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header with Steps */}
                <div className="pb-4 border-b border-black/8">
                    <h2 className="text-[18px] font-semibold text-black mb-1">
                        {isEditMode ? "Modifier l'employé" : "Nouvel employé"}
                    </h2>
                    <p className="text-[13px] text-black/50">
                        Étape {currentStep} sur {steps.length}
                    </p>

                    {/* Progress Steps */}
                    <div className="flex items-center gap-2 mt-4">
                        {steps.map((step, index) => {
                            const StepIcon = step.icon;
                            const isCompleted = currentStep > step.id;
                            const isCurrent = currentStep === step.id;

                            return (
                                <div key={step.id} className="flex items-center flex-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (isCompleted) setCurrentStep(step.id);
                                        }}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 w-full ${
                                            isCurrent
                                                ? "bg-black text-white"
                                                : isCompleted
                                                  ? "bg-black/5 text-black cursor-pointer hover:bg-black/10"
                                                  : "bg-black/[0.02] text-black/40"
                                        }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                            isCurrent ? "bg-white/20" : isCompleted ? "bg-black/10" : "bg-black/5"
                                        }`}>
                                            {isCompleted ? (
                                                <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                                            ) : (
                                                <StepIcon className="w-3.5 h-3.5" strokeWidth={2} />
                                            )}
                                        </div>
                                        <span className="text-[12px] font-medium hidden sm:block">
                                            {step.title}
                                        </span>
                                    </button>
                                    {index < steps.length - 1 && (
                                        <div className={`w-4 h-[2px] mx-1 ${
                                            isCompleted ? "bg-black/20" : "bg-black/10"
                                        }`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form Content */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-1 overflow-y-auto py-4">
                        {/* Step 1: Personal Information */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="prenom"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Prénom *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Jean" {...field} className="h-11" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="nom"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nom *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Dupont" {...field} className="h-11" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email *</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="jean.dupont@email.fr" {...field} className="h-11" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="telephone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Téléphone</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="06 12 34 56 78" {...field} className="h-11" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="dateNaissance"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Date de naissance</FormLabel>
                                                <FormControl>
                                                    <DatePicker
                                                        date={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date: Date | undefined) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="adresse"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Adresse</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123 rue de la Paix" {...field} className="h-11" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="codePostal"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Code postal</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="75001" {...field} className="h-11" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="ville"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ville</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Paris" {...field} className="h-11" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pays"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Pays</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="France" {...field} className="h-11" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Professional Information */}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="poste"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Poste *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Technicien" {...field} className="h-11" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="departement"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Département</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Technique" {...field} className="h-11" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="typeContrat"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type de contrat *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-11">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.entries(TYPE_CONTRAT_LABELS).map(([value, label]) => (
                                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="statut"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Statut</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-11">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.entries(STATUT_LABELS).map(([value, label]) => (
                                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="dateEmbauche"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Date d&apos;embauche *</FormLabel>
                                                <FormControl>
                                                    <DatePicker
                                                        date={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date: Date | undefined) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="dateFin"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Date de fin</FormLabel>
                                                <FormControl>
                                                    <DatePicker
                                                        date={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date: Date | undefined) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Compensation */}
                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="salaireBrut"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Salaire brut mensuel</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="2500"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                        className="h-11"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="devise"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Devise</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-11">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="EUR">EUR (€)</SelectItem>
                                                        <SelectItem value="USD">USD ($)</SelectItem>
                                                        <SelectItem value="GBP">GBP (£)</SelectItem>
                                                        <SelectItem value="CHF">CHF</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="heuresHebdo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Heures hebdomadaires</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="35"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 35)}
                                                        className="h-11"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="joursTravail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Jours de travail</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Lun-Ven" {...field} className="h-11" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Leave & Notes */}
                        {currentStep === 4 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="congesRestants"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Congés restants (jours)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="25"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 25)}
                                                        className="h-11"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="congesPris"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Congés pris (jours)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                        className="h-11"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="competences"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Compétences</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Plomberie, électricité, soudure..."
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Notes internes</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Remarques, informations complémentaires..."
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                    </form>
                </Form>

                {/* Footer Navigation */}
                <DialogFooter className="flex items-center justify-between pt-4 border-t border-black/8">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handlePrev}
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
                            onClick={() => onOpenChange(false)}
                            className="h-11 px-6"
                        >
                            Annuler
                        </Button>
                        {currentStep < steps.length ? (
                            <Button
                                type="button"
                                onClick={handleNext}
                                className="bg-black hover:bg-black/90 text-white h-11 px-6"
                            >
                                Suivant
                                <ChevronRight className="w-4 h-4 ml-1" strokeWidth={2} />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={form.handleSubmit(handleSubmit)}
                                disabled={isLoading}
                                className="bg-black hover:bg-black/90 text-white h-11 px-6"
                            >
                                {isLoading ? "Enregistrement..." : (isEditMode ? "Enregistrer" : "Créer l'employé")}
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
