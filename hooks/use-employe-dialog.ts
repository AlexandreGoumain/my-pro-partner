import {
    useCreateEmploye,
    useUpdateEmploye,
    type Employe,
} from "@/hooks/use-employes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const COLORS = [
    "#000000", // Black
    "#374151", // Gray 700
    "#6B7280", // Gray 500
    "#1F2937", // Gray 800
    "#4B5563", // Gray 600
    "#111827", // Gray 900
];

const employeSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    prenom: z.string().min(1, "Le prénom est requis"),
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    telephone: z.string().optional(),
    couleur: z.string().optional(),
    actif: z.boolean().default(true),
});

export type EmployeFormValues = z.infer<typeof employeSchema>;

const getDefaultValues = (employe?: Employe | null): EmployeFormValues => {
    if (employe) {
        return {
            nom: employe.nom,
            prenom: employe.prenom,
            email: employe.email || "",
            telephone: employe.telephone || "",
            couleur: employe.couleur || COLORS[0],
            actif: employe.actif,
        };
    }

    return {
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        couleur: COLORS[Math.floor(Math.random() * COLORS.length)],
        actif: true,
    };
};

interface UseEmployeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    employe?: Employe | null;
}

export function useEmployeDialog({
    open,
    onOpenChange,
    onSuccess,
    employe,
}: UseEmployeDialogProps) {
    const isEditing = !!employe;
    const [formKey, setFormKey] = useState(0);

    const createEmploye = useCreateEmploye();
    const updateEmploye = useUpdateEmploye();

    const form = useForm<EmployeFormValues>({
        resolver: zodResolver(employeSchema),
        defaultValues: getDefaultValues(employe),
    });

    // Handle dialog open/close - reset form when opening
    const handleOpenChange = useCallback(
        (newOpen: boolean) => {
            if (newOpen) {
                form.reset(getDefaultValues(employe));
                setFormKey((k) => k + 1);
            }
            onOpenChange(newOpen);
        },
        [onOpenChange, employe, form]
    );

    // Submit
    const handleSubmit = useCallback(
        async (values: EmployeFormValues) => {
            try {
                const data = {
                    ...values,
                    email: values.email || undefined,
                };
                if (isEditing && employe) {
                    await updateEmploye.mutateAsync({
                        id: employe.id,
                        data,
                    });
                } else {
                    await createEmploye.mutateAsync(data);
                }
                onSuccess();
            } catch {
                // Error handled by mutation
            }
        },
        [isEditing, employe, updateEmploye, createEmploye, onSuccess]
    );

    return {
        // State
        form,
        formKey,
        isEditing,
        isPending: createEmploye.isPending || updateEmploye.isPending,

        // Constants
        colors: COLORS,

        // Actions
        handleOpenChange,
        handleSubmit,
    };
}
