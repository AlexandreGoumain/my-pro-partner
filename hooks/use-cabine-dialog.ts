import {
    useCreateCabine,
    useUpdateCabine,
    type Cabine,
} from "@/hooks/use-cabines";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const COLORS = [
    { value: "#EC4899", label: "Rose" },
    { value: "#8B5CF6", label: "Violet" },
    { value: "#3B82F6", label: "Bleu" },
    { value: "#10B981", label: "Vert" },
    { value: "#F59E0B", label: "Orange" },
    { value: "#EF4444", label: "Rouge" },
    { value: "#6B7280", label: "Gris" },
    { value: "#000000", label: "Noir" },
];

const cabineSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    description: z.string().optional(),
    type: z.string().optional(),
    capacite: z.coerce.number().min(1, "Capacité minimum : 1"),
    equipements: z.string().optional(),
    couleur: z.string().optional(),
    actif: z.boolean(),
});

export type CabineFormValues = z.infer<typeof cabineSchema>;

const getDefaultValues = (cabine?: Cabine | null): CabineFormValues => {
    if (cabine) {
        return {
            nom: cabine.nom,
            description: cabine.description || "",
            type: cabine.type || "",
            capacite: cabine.capacite,
            equipements: cabine.equipements || "",
            couleur: cabine.couleur || "#EC4899",
            actif: cabine.actif,
        };
    }

    return {
        nom: "",
        description: "",
        type: "",
        capacite: 1,
        equipements: "",
        couleur: "#EC4899",
        actif: true,
    };
};

interface UseCabineDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    cabine?: Cabine | null;
}

export function useCabineDialog({
    open,
    onOpenChange,
    onSuccess,
    cabine,
}: UseCabineDialogProps) {
    const isEditing = !!cabine;
    const [formKey, setFormKey] = useState(0);

    const createCabine = useCreateCabine();
    const updateCabine = useUpdateCabine();

    const form = useForm<CabineFormValues>({
        resolver: zodResolver(cabineSchema),
        defaultValues: getDefaultValues(cabine),
    });

    // Handle dialog open/close - reset form when opening
    const handleOpenChange = useCallback(
        (newOpen: boolean) => {
            if (newOpen) {
                form.reset(getDefaultValues(cabine));
                setFormKey((k) => k + 1);
            }
            onOpenChange(newOpen);
        },
        [onOpenChange, cabine, form]
    );

    // Submit
    const handleSubmit = useCallback(
        async (values: CabineFormValues) => {
            try {
                const data = {
                    ...values,
                    type: values.type || undefined,
                };
                if (isEditing && cabine) {
                    await updateCabine.mutateAsync({ id: cabine.id, data });
                } else {
                    await createCabine.mutateAsync(data);
                }
                onSuccess();
            } catch {
                // Error handled by mutation
            }
        },
        [isEditing, cabine, updateCabine, createCabine, onSuccess]
    );

    return {
        // State
        form,
        formKey,
        isEditing,
        isPending: createCabine.isPending || updateCabine.isPending,

        // Constants
        colors: COLORS,

        // Actions
        handleOpenChange,
        handleSubmit,
    };
}
