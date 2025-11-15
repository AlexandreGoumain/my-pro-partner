"use client";

import { Button } from "@/components/ui/button";
import { DialogHeaderSection } from "@/components/ui/dialog-header-section";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { useCreateClient } from "@/hooks/use-clients";
import { useFormReset } from "@/hooks/use-form-reset";
import { clientCreateSchema, type ClientCreateInput } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface ClientCreateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

const defaultValues: ClientCreateInput = {
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    codePostal: "",
    ville: "",
    pays: "France",
    notes: "",
};

export function ClientCreateDialog({
    open,
    onOpenChange,
    onSuccess,
}: ClientCreateDialogProps) {
    const createClient = useCreateClient();

    const form = useForm<ClientCreateInput>({
        resolver: zodResolver(clientCreateSchema),
        defaultValues,
    });

    // Reset form when dialog opens using custom hook
    useFormReset(form, open, defaultValues);

    function onSubmit(values: ClientCreateInput) {
        createClient.mutate(values, {
            onSuccess: () => {
                onSuccess();
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
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeaderSection
                    title="Nouveau client"
                    description="Ajoutez un nouveau client à votre base de données"
                    titleClassName="text-[20px] font-semibold tracking-[-0.02em]"
                    descriptionClassName="text-[14px] text-black/60"
                />

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Identité */}
                        <div className="space-y-4">
                            <h3 className="text-[15px] font-medium tracking-[-0.01em]">
                                Identité
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                    control={form.control}
                                    name="nom"
                                    label="Nom"
                                    placeholder="Dupont"
                                    required
                                    className="h-11 border-black/10"
                                    labelClassName="text-[13px] text-black/60"
                                />

                                <FormInput
                                    control={form.control}
                                    name="prenom"
                                    label="Prénom"
                                    placeholder="Jean"
                                    className="h-11 border-black/10"
                                    labelClassName="text-[13px] text-black/60"
                                />
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="space-y-4">
                            <h3 className="text-[15px] font-medium tracking-[-0.01em]">
                                Contact
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                    control={form.control}
                                    name="email"
                                    label="Email"
                                    type="email"
                                    placeholder="jean.dupont@example.com"
                                    className="h-11 border-black/10"
                                    labelClassName="text-[13px] text-black/60"
                                />

                                <FormInput
                                    control={form.control}
                                    name="telephone"
                                    label="Téléphone"
                                    type="tel"
                                    placeholder="06 12 34 56 78"
                                    className="h-11 border-black/10"
                                    labelClassName="text-[13px] text-black/60"
                                />
                            </div>
                        </div>

                        {/* Adresse */}
                        <div className="space-y-4">
                            <h3 className="text-[15px] font-medium tracking-[-0.01em]">
                                Adresse
                            </h3>
                            <FormInput
                                control={form.control}
                                name="adresse"
                                label="Adresse"
                                placeholder="12 rue de la Paix"
                                className="h-11 border-black/10"
                                labelClassName="text-[13px] text-black/60"
                            />

                            <div className="grid grid-cols-3 gap-4">
                                <FormInput
                                    control={form.control}
                                    name="codePostal"
                                    label="Code postal"
                                    placeholder="75001"
                                    className="h-11 border-black/10"
                                    labelClassName="text-[13px] text-black/60"
                                />

                                <FormInput
                                    control={form.control}
                                    name="ville"
                                    label="Ville"
                                    placeholder="Paris"
                                    className="h-11 border-black/10"
                                    labelClassName="text-[13px] text-black/60"
                                />

                                <FormInput
                                    control={form.control}
                                    name="pays"
                                    label="Pays"
                                    placeholder="France"
                                    className="h-11 border-black/10"
                                    labelClassName="text-[13px] text-black/60"
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-4">
                            <h3 className="text-[15px] font-medium tracking-[-0.01em]">
                                Notes
                            </h3>
                            <FormInput
                                control={form.control}
                                name="notes"
                                label="Notes internes"
                                textarea
                                rows={4}
                                placeholder="Informations complémentaires..."
                                className="border-black/10"
                                labelClassName="text-[13px] text-black/60"
                            />
                        </div>

                        {form.formState.errors.root && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.root.message}
                            </p>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="border-black/10 hover:bg-black/5 h-11 px-6 text-[14px] font-medium"
                            >
                                Annuler
                            </Button>
                            <PrimaryActionButton
                                type="submit"
                                disabled={createClient.isPending}
                            >
                                {createClient.isPending
                                    ? "Création..."
                                    : "Créer le client"}
                            </PrimaryActionButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
