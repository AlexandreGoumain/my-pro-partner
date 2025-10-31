"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Client, useUpdateClient } from "@/hooks/use-clients";
import { clientUpdateSchema, type ClientUpdateInput } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface ClientEditDialogProps {
    client: Client | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ClientEditDialog({
    client,
    open,
    onOpenChange,
    onSuccess,
}: ClientEditDialogProps) {
    const updateClient = useUpdateClient();

    const form = useForm<ClientUpdateInput>({
        resolver: zodResolver(clientUpdateSchema),
        defaultValues: {
            nom: "",
            prenom: "",
            email: "",
            telephone: "",
            adresse: "",
            codePostal: "",
            ville: "",
            pays: "France",
            notes: "",
        },
    });

    // Reset form when client or dialog state changes
    useEffect(() => {
        if (open && client) {
            form.reset({
                nom: client.nom,
                prenom: client.prenom || "",
                email: client.email || "",
                telephone: client.telephone || "",
                adresse: client.adresse || "",
                codePostal: client.codePostal || "",
                ville: client.ville || "",
                pays: client.pays || "France",
                notes: client.notes || "",
            });
        }
    }, [open, client, form]);

    function onSubmit(values: ClientUpdateInput) {
        if (!client) return;

        updateClient.mutate(
            { id: client.id, data: values },
            {
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
            }
        );
    }

    if (!client) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em]">
                        Modifier le client
                    </DialogTitle>
                    <DialogDescription className="text-[14px] text-black/60">
                        Modifiez les informations du client
                    </DialogDescription>
                </DialogHeader>

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
                                                    {...field}
                                                    value={field.value || ""}
                                                    placeholder="Dupont"
                                                    className="h-11 border-black/10"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="prenom"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[13px] text-black/60">
                                                Prénom
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value || ""}
                                                    placeholder="Jean"
                                                    className="h-11 border-black/10"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="space-y-4">
                            <h3 className="text-[15px] font-medium tracking-[-0.01em]">
                                Contact
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[13px] text-black/60">
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value || ""}
                                                    type="email"
                                                    placeholder="jean.dupont@example.com"
                                                    className="h-11 border-black/10"
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
                                                    {...field}
                                                    value={field.value || ""}
                                                    type="tel"
                                                    placeholder="06 12 34 56 78"
                                                    className="h-11 border-black/10"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Adresse */}
                        <div className="space-y-4">
                            <h3 className="text-[15px] font-medium tracking-[-0.01em]">
                                Adresse
                            </h3>
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
                                                {...field}
                                                value={field.value || ""}
                                                placeholder="12 rue de la Paix"
                                                className="h-11 border-black/10"
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
                                                    {...field}
                                                    value={field.value || ""}
                                                    placeholder="75001"
                                                    className="h-11 border-black/10"
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
                                                    {...field}
                                                    value={field.value || ""}
                                                    placeholder="Paris"
                                                    className="h-11 border-black/10"
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
                                                    {...field}
                                                    value={field.value || "France"}
                                                    placeholder="France"
                                                    className="h-11 border-black/10"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-4">
                            <h3 className="text-[15px] font-medium tracking-[-0.01em]">
                                Notes
                            </h3>
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
                                                {...field}
                                                value={field.value || ""}
                                                placeholder="Informations complémentaires..."
                                                className="min-h-[100px] border-black/10"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
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
                            <Button
                                type="submit"
                                disabled={updateClient.isPending}
                                className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                            >
                                {updateClient.isPending
                                    ? "Modification..."
                                    : "Modifier le client"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
