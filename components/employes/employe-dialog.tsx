"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DialogActionButtons } from "@/components/ui/dialog-action-buttons";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    useCreateEmploye,
    useUpdateEmploye,
    type Employe,
} from "@/hooks/use-employes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const employeSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    prenom: z.string().min(1, "Le prénom est requis"),
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    telephone: z.string().optional(),
    couleur: z.string().optional(),
    actif: z.boolean().default(true),
});

type EmployeFormValues = z.infer<typeof employeSchema>;

const COLORS = [
    "#000000", // Black
    "#374151", // Gray 700
    "#6B7280", // Gray 500
    "#1F2937", // Gray 800
    "#4B5563", // Gray 600
    "#111827", // Gray 900
];

interface EmployeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    employe?: Employe | null;
}

export function EmployeDialog({
    open,
    onOpenChange,
    onSuccess,
    employe,
}: EmployeDialogProps) {
    const isEditing = !!employe;
    const createEmploye = useCreateEmploye();
    const updateEmploye = useUpdateEmploye();

    const form = useForm<EmployeFormValues>({
        resolver: zodResolver(employeSchema),
        defaultValues: {
            nom: "",
            prenom: "",
            email: "",
            telephone: "",
            couleur: COLORS[0],
            actif: true,
        },
    });

    // Reset form when dialog opens/closes or employe changes
    useEffect(() => {
        if (open) {
            if (employe) {
                form.reset({
                    nom: employe.nom,
                    prenom: employe.prenom,
                    email: employe.email || "",
                    telephone: employe.telephone || "",
                    couleur: employe.couleur || COLORS[0],
                    actif: employe.actif,
                });
            } else {
                form.reset({
                    nom: "",
                    prenom: "",
                    email: "",
                    telephone: "",
                    couleur: COLORS[Math.floor(Math.random() * COLORS.length)],
                    actif: true,
                });
            }
        }
    }, [open, employe, form]);

    const onSubmit = async (values: EmployeFormValues) => {
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
    };

    const isPending = createEmploye.isPending || updateEmploye.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em]">
                        {isEditing ? "Modifier l'employé" : "Nouvel employé"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="prenom"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[14px]">
                                            Prénom
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Marie"
                                                className="h-11 text-[14px] border-black/10"
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
                                        <FormLabel className="text-[14px]">
                                            Nom
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Dupont"
                                                className="h-11 text-[14px] border-black/10"
                                            />
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
                                    <FormLabel className="text-[14px]">
                                        Email (optionnel)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="marie@exemple.com"
                                            className="h-11 text-[14px] border-black/10"
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
                                    <FormLabel className="text-[14px]">
                                        Téléphone (optionnel)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="06 12 34 56 78"
                                            className="h-11 text-[14px] border-black/10"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="couleur"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[14px]">
                                        Couleur (calendrier)
                                    </FormLabel>
                                    <div className="flex gap-2">
                                        {COLORS.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                className={`w-8 h-8 rounded-full transition-all ${
                                                    field.value === color
                                                        ? "ring-2 ring-offset-2 ring-black"
                                                        : "hover:scale-110"
                                                }`}
                                                style={{
                                                    backgroundColor: color,
                                                }}
                                                onClick={() =>
                                                    field.onChange(color)
                                                }
                                            />
                                        ))}
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="actif"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border border-black/10 p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-[14px]">
                                            Employé actif
                                        </FormLabel>
                                        <p className="text-[13px] text-black/50">
                                            Les employés inactifs ne peuvent pas
                                            prendre de RDV
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

                        <DialogActionButtons
                            onCancel={() => onOpenChange(false)}
                            isLoading={isPending}
                            isEditing={isEditing}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
