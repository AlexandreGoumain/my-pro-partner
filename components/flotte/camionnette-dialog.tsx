"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
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
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateCamionnette, useUpdateCamionnette } from "@/hooks/use-flotte";
import type { Camionnette } from "@/lib/types/flotte";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const camionnetteSchema = z.object({
    immatriculation: z.string().min(1, "L'immatriculation est requise"),
    marque: z.string().optional(),
    modele: z.string().optional(),
    annee: z.coerce.number().min(1900).max(2100).optional().or(z.literal("")),
    plombierPrincipalId: z.string().optional(),
    kilometres: z.coerce.number().min(0).optional(),
    actif: z.boolean().default(true),
});

type CamionnetteFormValues = z.infer<typeof camionnetteSchema>;

interface CamionnetteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    camionnette?: Camionnette | null;
}

export function CamionnetteDialog({
    open,
    onOpenChange,
    onSuccess,
    camionnette,
}: CamionnetteDialogProps) {
    const isEditing = !!camionnette;

    // Fetch plombiers for assignment
    const { data: usersData } = useQuery({
        queryKey: ["users", "plombiers"],
        queryFn: async () => {
            const response = await fetch("/api/users?role=USER");
            if (!response.ok) throw new Error("Failed to fetch users");
            return response.json();
        },
        enabled: open,
    });

    const users = usersData?.users || [];

    const form = useForm<CamionnetteFormValues>({
        resolver: zodResolver(camionnetteSchema),
        defaultValues: {
            immatriculation: "",
            marque: "",
            modele: "",
            annee: "",
            plombierPrincipalId: "",
            kilometres: 0,
            actif: true,
        },
    });

    // Reset form when camionnette changes
    useEffect(() => {
        if (camionnette) {
            form.reset({
                immatriculation: camionnette.immatriculation || "",
                marque: camionnette.marque || "",
                modele: camionnette.modele || "",
                annee: camionnette.annee || "",
                plombierPrincipalId: camionnette.plombierPrincipalId || "",
                kilometres: camionnette.kilometres || 0,
                actif: camionnette.actif,
            });
        } else {
            form.reset({
                immatriculation: "",
                marque: "",
                modele: "",
                annee: "",
                plombierPrincipalId: "",
                kilometres: 0,
                actif: true,
            });
        }
    }, [camionnette, form]);

    const createCamionnette = useCreateCamionnette();
    const updateCamionnette = useUpdateCamionnette();

    const onSubmit = (data: CamionnetteFormValues) => {
        const payload = {
            immatriculation: data.immatriculation,
            marque: data.marque || undefined,
            modele: data.modele || undefined,
            annee: data.annee ? Number(data.annee) : undefined,
            plombierPrincipalId: data.plombierPrincipalId || undefined,
            kilometres: data.kilometres,
            actif: data.actif,
        };

        if (isEditing && camionnette) {
            updateCamionnette.mutate(
                { id: camionnette.id, data: payload },
                {
                    onSuccess: () => {
                        toast.success("Véhicule modifié", {
                            description:
                                "Le véhicule a été modifié avec succès",
                        });
                        form.reset();
                        onSuccess();
                    },
                    onError: (error) => {
                        toast.error("Erreur", {
                            description:
                                error instanceof Error
                                    ? error.message
                                    : "Impossible de modifier le véhicule",
                        });
                    },
                }
            );
        } else {
            createCamionnette.mutate(payload, {
                onSuccess: () => {
                    toast.success("Véhicule créé", {
                        description: "Le véhicule a été ajouté à la flotte",
                    });
                    form.reset();
                    onSuccess();
                },
                onError: (error) => {
                    toast.error("Erreur", {
                        description:
                            error instanceof Error
                                ? error.message
                                : "Impossible de créer le véhicule",
                    });
                },
            });
        }
    };

    const isPending =
        createCamionnette.isPending || updateCamionnette.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-[24px] font-semibold">
                        {isEditing
                            ? "Modifier le véhicule"
                            : "Nouveau véhicule"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Immatriculation */}
                        <FormField
                            control={form.control}
                            name="immatriculation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Immatriculation</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: AB-123-CD"
                                            className="h-11"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Marque & Modèle */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="marque"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Marque</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Renault"
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="modele"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Modèle</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Kangoo"
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Année & Kilométrage */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="annee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Année</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Ex: 2020"
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="kilometres"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kilométrage</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Plombier assigné */}
                        <FormField
                            control={form.control}
                            name="plombierPrincipalId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Technicien assigné (optionnel)
                                    </FormLabel>
                                    <Select
                                        onValueChange={(value) =>
                                            field.onChange(
                                                value === "none" ? "" : value
                                            )
                                        }
                                        value={field.value || "none"}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Sélectionner un technicien" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                Aucun
                                            </SelectItem>
                                            {users.map(
                                                (user: {
                                                    id: string;
                                                    name: string | null;
                                                }) => (
                                                    <SelectItem
                                                        key={user.id}
                                                        value={user.id}
                                                    >
                                                        {user.name ||
                                                            "Sans nom"}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Actif */}
                        {isEditing && (
                            <FormField
                                control={form.control}
                                name="actif"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border border-black/10 p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Véhicule actif
                                            </FormLabel>
                                            <p className="text-[13px] text-black/50">
                                                Désactiver si le véhicule
                                                n&apos;est plus utilisé
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Annuler
                            </Button>
                            <PrimaryActionButton
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending
                                    ? isEditing
                                        ? "Modification..."
                                        : "Création..."
                                    : isEditing
                                      ? "Modifier"
                                      : "Créer le véhicule"}
                            </PrimaryActionButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
