"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogActionButtons } from "@/components/ui/dialog-action-buttons";
import { DialogHeaderSection } from "@/components/ui/dialog-header-section";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormSwitch } from "@/components/ui/form-switch";
import { useCreateTypeAbonnement } from "@/hooks/use-fitness";
import { useFormReset } from "@/hooks/use-form-reset";
import { PERIODICITE_LABELS } from "@/lib/types/fitness";
import { formatCurrency } from "@/lib/utils/format";
import {
    typeAbonnementCreateSchema,
    type TypeAbonnementCreateInput,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Crown, Dumbbell, Infinity } from "lucide-react";
import { useForm } from "react-hook-form";

interface CreateTypeAbonnementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

const COULEURS_PREDEFINIES = [
    { value: "#000000", label: "Noir" },
    { value: "#6B7280", label: "Gris" },
    { value: "#3B82F6", label: "Bleu" },
    { value: "#8B5CF6", label: "Violet" },
    { value: "#EC4899", label: "Rose" },
    { value: "#EF4444", label: "Rouge" },
    { value: "#F97316", label: "Orange" },
    { value: "#EAB308", label: "Jaune" },
    { value: "#22C55E", label: "Vert" },
    { value: "#14B8A6", label: "Teal" },
];

const PERIODICITE_OPTIONS = Object.entries(PERIODICITE_LABELS).map(
    ([value, label]) => ({ value, label })
);

const defaultValues: TypeAbonnementCreateInput = {
    nom: "",
    description: "",
    prix: 0,
    periodicite: "MENSUEL",
    dureeJours: null,
    nombreSeances: null,
    accesIllimite: true,
    nombreAccesSemaine: null,
    accesCours: true,
    accesZonesPremium: false,
    engagementMois: 0,
    fraisInscription: 0,
    actif: true,
    ordre: 0,
    couleur: "#000000",
};

export function CreateTypeAbonnementDialog({
    open,
    onOpenChange,
    onSuccess,
}: CreateTypeAbonnementDialogProps) {
    const createTypeAbonnement = useCreateTypeAbonnement();

    const form = useForm<TypeAbonnementCreateInput>({
        resolver: zodResolver(typeAbonnementCreateSchema),
        defaultValues,
    });

    useFormReset(form, open, defaultValues);

    const accesIllimite = form.watch("accesIllimite");
    const periodicite = form.watch("periodicite");
    const nom = form.watch("nom");
    const prix = form.watch("prix");
    const couleur = form.watch("couleur");
    const engagementMois = form.watch("engagementMois");
    const fraisInscription = form.watch("fraisInscription");

    function onSubmit(values: TypeAbonnementCreateInput) {
        createTypeAbonnement.mutate(
            {
                ...values,
                description: values.description || undefined,
                couleur: values.couleur || undefined,
                dureeJours: values.dureeJours || undefined,
                nombreSeances: accesIllimite ? undefined : values.nombreSeances,
                nombreAccesSemaine: accesIllimite
                    ? undefined
                    : values.nombreAccesSemaine,
            },
            {
                onSuccess: () => {
                    onSuccess?.();
                    onOpenChange(false);
                },
                onError: (error) => {
                    form.setError("root", {
                        message:
                            error instanceof Error
                                ? error.message
                                : "Une erreur est survenue",
                    });
                },
            }
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeaderSection
                    title="Nouvelle formule d'abonnement"
                    description="Créez une nouvelle formule tarifaire"
                    titleClassName="text-[18px] font-semibold tracking-[-0.02em]"
                    descriptionClassName="text-[14px] text-black/60"
                />

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        {/* Nom et Couleur */}
                        <div className="grid grid-cols-[1fr_auto] gap-4">
                            <FormInput
                                control={form.control}
                                name="nom"
                                label="Nom de la formule"
                                placeholder="ex: Pass Mensuel, Formule Annuelle..."
                                required
                                className="h-11 border-black/10"
                                labelClassName="text-[13px] font-medium"
                            />
                            <FormSelect
                                control={form.control}
                                name="couleur"
                                label="Couleur"
                                options={COULEURS_PREDEFINIES}
                                className="w-[120px]"
                                labelClassName="text-[13px] font-medium"
                            />
                        </div>

                        {/* Description */}
                        <FormInput
                            control={form.control}
                            name="description"
                            label="Description"
                            textarea
                            rows={2}
                            placeholder="Description de la formule..."
                            className="border-black/10 resize-none"
                            labelClassName="text-[13px] font-medium"
                        />

                        {/* Prix et Périodicité */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput
                                control={form.control}
                                name="prix"
                                label="Prix (€)"
                                type="number"
                                placeholder="0.00"
                                required
                                className="h-11 border-black/10"
                                labelClassName="text-[13px] font-medium"
                            />
                            <FormSelect
                                control={form.control}
                                name="periodicite"
                                label="Périodicité"
                                options={PERIODICITE_OPTIONS}
                                required
                                labelClassName="text-[13px] font-medium"
                            />
                        </div>

                        {/* Type d'accès */}
                        <div className="space-y-3">
                            <p className="text-[13px] font-medium">
                                Type d&apos;accès
                            </p>
                            <div className="bg-black/2 rounded-lg p-4 space-y-3">
                                <FormSwitch
                                    control={form.control}
                                    name="accesIllimite"
                                    label="Accès illimité"
                                    icon={
                                        <Infinity
                                            className="w-4 h-4 text-black/60"
                                            strokeWidth={2}
                                        />
                                    }
                                />

                                {!accesIllimite && (
                                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-black/5">
                                        <FormInput
                                            control={form.control}
                                            name="nombreSeances"
                                            label="Nombre de séances"
                                            type="number"
                                            placeholder="ex: 10"
                                            className="h-10 border-black/10"
                                            labelClassName="text-[12px] text-black/60"
                                        />
                                        <FormInput
                                            control={form.control}
                                            name="nombreAccesSemaine"
                                            label="Accès / semaine"
                                            type="number"
                                            placeholder="ex: 3"
                                            className="h-10 border-black/10"
                                            labelClassName="text-[12px] text-black/60"
                                        />
                                    </div>
                                )}

                                {periodicite !== "ILLIMITE" && (
                                    <div className="pt-2 border-t border-black/5">
                                        <FormInput
                                            control={form.control}
                                            name="dureeJours"
                                            label="Durée personnalisée (jours)"
                                            type="number"
                                            placeholder="auto"
                                            className="h-9 border-black/10 w-24 ml-auto"
                                            labelClassName="text-[12px] text-black/60"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Options supplémentaires */}
                        <div className="space-y-3">
                            <p className="text-[13px] font-medium">
                                Options incluses
                            </p>
                            <div className="bg-black/2 rounded-lg p-4 space-y-3">
                                <FormSwitch
                                    control={form.control}
                                    name="accesCours"
                                    label="Accès aux cours collectifs"
                                    icon={
                                        <Dumbbell
                                            className="w-4 h-4 text-black/60"
                                            strokeWidth={2}
                                        />
                                    }
                                />
                                <FormSwitch
                                    control={form.control}
                                    name="accesZonesPremium"
                                    label="Accès zones premium"
                                    icon={
                                        <Crown
                                            className="w-4 h-4 text-yellow-500"
                                            strokeWidth={2}
                                        />
                                    }
                                />
                            </div>
                        </div>

                        {/* Engagement et Frais */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput
                                control={form.control}
                                name="engagementMois"
                                label="Engagement (mois)"
                                type="number"
                                placeholder="0"
                                className="h-11 border-black/10"
                                labelClassName="text-[13px] font-medium"
                            />
                            <FormInput
                                control={form.control}
                                name="fraisInscription"
                                label="Frais d'inscription (€)"
                                type="number"
                                placeholder="0.00"
                                className="h-11 border-black/10"
                                labelClassName="text-[13px] font-medium"
                            />
                        </div>

                        {/* Récapitulatif */}
                        {nom && (
                            <div className="bg-black/2 rounded-lg p-4 space-y-2">
                                <div className="flex items-center gap-2 text-[14px] font-medium">
                                    <CreditCard className="w-4 h-4 text-black/60" />
                                    Récapitulatif
                                </div>
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-black/60">
                                        Formule
                                    </span>
                                    <span className="font-medium flex items-center gap-2">
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    couleur || "#000",
                                            }}
                                        />
                                        {nom}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-black/60">Tarif</span>
                                    <span className="font-medium">
                                        {formatCurrency(prix || 0)} /{" "}
                                        {PERIODICITE_LABELS[
                                            periodicite as keyof typeof PERIODICITE_LABELS
                                        ]?.toLowerCase()}
                                    </span>
                                </div>
                                {(engagementMois ?? 0) > 0 && (
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-black/60">
                                            Engagement
                                        </span>
                                        <span className="font-medium">
                                            {engagementMois} mois
                                        </span>
                                    </div>
                                )}
                                {(fraisInscription ?? 0) > 0 && (
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-black/60">
                                            Frais d&apos;inscription
                                        </span>
                                        <span className="font-medium">
                                            {formatCurrency(
                                                fraisInscription ?? 0
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {form.formState.errors.root && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.root.message}
                            </p>
                        )}

                        <DialogActionButtons
                            onCancel={() => onOpenChange(false)}
                            submitLabel="Créer la formule"
                            isLoading={createTypeAbonnement.isPending}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
