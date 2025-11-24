"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Employee } from "@/hooks/use-employees";
import type { StatutEmploye, TypeContrat } from "@/lib/types/personnel.types";
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
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { DialogHeaderSection } from "@/components/ui/dialog-header-section";
import { DatePicker } from "@/components/ui/date-picker";

// Schema adapté pour le formulaire (avec string dates)
const employeeFormSchema = z.object({
    prenom: z.string().min(1, "Le prénom est requis").max(100),
    nom: z.string().min(1, "Le nom est requis").max(100),
    email: z.string().email("Email invalide"),
    telephone: z.string().max(20).optional().or(z.literal("")),
    dateNaissance: z.string().optional().or(z.literal("")),
    adresse: z.string().max(200).optional().or(z.literal("")),
    ville: z.string().max(100).optional().or(z.literal("")),
    codePostal: z.string().max(10).optional().or(z.literal("")),
    pays: z.string().max(100).default("France"),
    poste: z.string().min(1, "Le poste est requis").max(100),
    departement: z.string().max(100).optional().or(z.literal("")),
    statut: z.enum(["ACTIF", "CONGE", "MALADIE", "ABSENT", "INACTIF"]).default("ACTIF"),
    typeContrat: z.enum(["CDI", "CDD", "INTERIM", "APPRENTI", "STAGE", "FREELANCE"]).default("CDI"),
    dateEmbauche: z.string().min(1, "La date d'embauche est requise"),
    dateFin: z.string().optional().or(z.literal("")),
    salaireBrut: z.number().positive("Le salaire doit être positif").max(999999.99),
    devise: z.string().max(10).default("EUR"),
    heuresHebdo: z.number().int().min(1).max(70).default(35).optional(),
    joursTravail: z.string().max(100).optional().or(z.literal("")),
    notes: z.string().max(2000).optional().or(z.literal("")),
    competences: z.string().max(2000).optional().or(z.literal("")),
    congesRestants: z.number().int().min(0).max(365).default(25).optional(),
    congesPris: z.number().int().min(0).max(365).default(0).optional(),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;

export interface EmployeeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employee?: Employee | null;
    onSubmit: (data: EmployeeFormData) => void;
    isLoading?: boolean;
}

const defaultValues: EmployeeFormData = {
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
    notes: "",
    competences: "",
    congesRestants: 25,
    congesPris: 0,
};

export function EmployeeDialog({
    open,
    onOpenChange,
    employee,
    onSubmit,
    isLoading,
}: EmployeeDialogProps) {
    const form = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeFormSchema),
        defaultValues,
    });

    const isEditMode = !!employee;

    // Reset form when employee changes or dialog opens
    useEffect(() => {
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
    }, [employee, form]);

    const handleSubmit = (data: EmployeeFormData) => {
        onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        {/* Informations personnelles */}
                        <div className="space-y-4">
                            <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                                Informations personnelles
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="prenom"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[13px] text-black/60">
                                                Prénom *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Jean"
                                                    className="h-11 border-black/10 focus:border-black/30"
                                                    {...field}
                                                />
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
                                            <FormLabel className="text-[13px] text-black/60">
                                                Nom *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Dupont"
                                                    className="h-11 border-black/10 focus:border-black/30"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[13px] text-black/60">
                                                Email *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="jean.dupont@example.com"
                                                    className="h-11 border-black/10 focus:border-black/30"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="telephone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[13px] text-black/60">
                                                Téléphone
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    placeholder="06 12 34 56 78"
                                                    className="h-11 border-black/10 focus:border-black/30"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="dateNaissance"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[13px] text-black/60">
                                            Date de naissance
                                        </FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                date={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                                                placeholder="Sélectionner une date"
                                                className="border-black/10"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="adresse"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[13px] text-black/60">
                                            Adresse
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="12 rue de la Paix"
                                                className="h-11 border-black/10 focus:border-black/30"
                                                {...field}
                                            />
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
                                            <FormLabel className="text-[13px] text-black/60">
                                                Code postal
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="75001"
                                                    className="h-11 border-black/10 focus:border-black/30"
                                                    {...field}
                                                />
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
                                            <FormLabel className="text-[13px] text-black/60">
                                                Ville
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Paris"
                                                    className="h-11 border-black/10 focus:border-black/30"
                                                    {...field}
                                                />
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
                                            <FormLabel className="text-[13px] text-black/60">
                                                Pays
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="France"
                                                    className="h-11 border-black/10 focus:border-black/30"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Informations professionnelles */}
                        <div className="space-y-4">
                            <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                                Informations professionnelles
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="poste"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[13px] text-black/60">
                                                Poste *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Technicien informatique"
                                                    className="h-11 border-black/10 focus:border-black/30"
                                                    {...field}
                                                />
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
                                            <FormLabel className="text-[13px] text-black/60">
                                                Département
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Atelier"
                                                    className="h-11 border-black/10 focus:border-black/30"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="statut"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[13px] text-black/60">
                                                Statut *
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-11 border-black/10">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.entries(STATUT_LABELS).map(([value, label]) => (
                                                        <SelectItem key={value} value={value}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="typeContrat"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[13px] text-black/60">
                                                Type de contrat *
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-11 border-black/10">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.entries(TYPE_CONTRAT_LABELS).map(([value, label]) => (
                                                        <SelectItem key={value} value={value}>
                                                            {label}
                                                        </SelectItem>
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
                                            <FormLabel className="text-[13px] text-black/60">
                                                Date d&apos;embauche *
                                            </FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    date={field.value ? new Date(field.value) : undefined}
                                                    onSelect={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                                                    placeholder="Sélectionner une date"
                                                    className="border-black/10"
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
                                            <FormLabel className="text-[13px] text-black/60">
                                                Date de fin
                                            </FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    date={field.value ? new Date(field.value) : undefined}
                                                    onSelect={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                                                    placeholder="Sélectionner une date"
                                                    className="border-black/10"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="salaireBrut"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel className="text-[13px] text-black/60">
                                                Salaire brut *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    className="h-11 border-black/10 focus:border-black/30"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(parseFloat(e.target.value) || 0)
                                                    }
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
                                            <FormLabel className="text-[13px] text-black/60">
                                                Devise
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="EUR"
                                                    className="h-11 border-black/10 focus:border-black/30"
                                                    {...field}
                                                />
                                            </FormControl>
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
                                            <FormLabel className="text-[13px] text-black/60">
                                                Heures hebdomadaires
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="35"
                                                    className="h-11 border-black/10 focus:border-black/30"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(parseInt(e.target.value) || 35)
                                                    }
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
                                            <FormLabel className="text-[13px] text-black/60">
                                                Jours de travail
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Lundi - Vendredi"
                                                    className="h-11 border-black/10 focus:border-black/30"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Congés */}
                        <div className="space-y-4">
                            <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                                Gestion des congés
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="congesRestants"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[13px] text-black/60">
                                                Congés restants (jours)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="25"
                                                    className="h-11 border-black/10 focus:border-black/30"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(parseInt(e.target.value) || 0)
                                                    }
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
                                            <FormLabel className="text-[13px] text-black/60">
                                                Congés pris (jours)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    className="h-11 border-black/10 focus:border-black/30"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(parseInt(e.target.value) || 0)
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Notes et compétences */}
                        <div className="space-y-4">
                            <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                                Informations complémentaires
                            </h3>

                            <FormField
                                control={form.control}
                                name="competences"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[13px] text-black/60">
                                            Compétences
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Listez les compétences techniques et soft skills..."
                                                rows={3}
                                                className="border-black/10 focus:border-black/30 resize-none"
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
                                        <FormLabel className="text-[13px] text-black/60">
                                            Notes internes
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Informations complémentaires..."
                                                rows={3}
                                                className="border-black/10 focus:border-black/30 resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                                className="border-black/10 hover:bg-black/5 h-11 px-6 text-[14px] font-medium"
                            >
                                Annuler
                            </Button>
                            <PrimaryActionButton type="submit" disabled={isLoading}>
                                {isLoading
                                    ? "Enregistrement..."
                                    : isEditMode
                                    ? "Enregistrer"
                                    : "Ajouter l'employé"}
                            </PrimaryActionButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
