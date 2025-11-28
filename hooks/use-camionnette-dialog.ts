import { useCreateCamionnette, useUpdateCamionnette } from "@/hooks/use-flotte";
import type { Camionnette } from "@/lib/types/flotte";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
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

export type CamionnetteFormValues = z.infer<typeof camionnetteSchema>;

const getDefaultValues = (
    camionnette?: Camionnette | null
): CamionnetteFormValues => {
    if (camionnette) {
        return {
            immatriculation: camionnette.immatriculation || "",
            marque: camionnette.marque || "",
            modele: camionnette.modele || "",
            annee: camionnette.annee || "",
            plombierPrincipalId: camionnette.plombierPrincipalId || "",
            kilometres: camionnette.kilometres || 0,
            actif: camionnette.actif,
        };
    }

    return {
        immatriculation: "",
        marque: "",
        modele: "",
        annee: "",
        plombierPrincipalId: "",
        kilometres: 0,
        actif: true,
    };
};

interface UseCamionnetteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    camionnette?: Camionnette | null;
}

export function useCamionnetteDialog({
    open,
    onOpenChange,
    onSuccess,
    camionnette,
}: UseCamionnetteDialogProps) {
    const isEditing = !!camionnette;
    const [formKey, setFormKey] = useState(0);

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

    const createCamionnette = useCreateCamionnette();
    const updateCamionnette = useUpdateCamionnette();

    const form = useForm<CamionnetteFormValues>({
        resolver: zodResolver(camionnetteSchema),
        defaultValues: getDefaultValues(camionnette),
    });

    // Handle dialog open/close - reset form when opening
    const handleOpenChange = useCallback(
        (newOpen: boolean) => {
            if (newOpen) {
                form.reset(getDefaultValues(camionnette));
                setFormKey((k) => k + 1);
            }
            onOpenChange(newOpen);
        },
        [onOpenChange, camionnette, form]
    );

    // Submit
    const handleSubmit = useCallback(
        (data: CamionnetteFormValues) => {
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
        },
        [
            isEditing,
            camionnette,
            updateCamionnette,
            createCamionnette,
            form,
            onSuccess,
        ]
    );

    return {
        // State
        form,
        formKey,
        isEditing,
        isPending:
            createCamionnette.isPending || updateCamionnette.isPending,

        // Data
        users,

        // Actions
        handleOpenChange,
        handleSubmit,
    };
}
