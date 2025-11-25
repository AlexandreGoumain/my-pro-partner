"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TYPE_CONTRAT_LABELS } from "@/lib/types/personnel.types";
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
import { Button } from "@/components/ui/button";
import { DialogHeaderSection } from "@/components/ui/dialog-header-section";
import { DatePicker } from "@/components/ui/date-picker";
import { Settings2 } from "lucide-react";

const quickAddSchema = z.object({
    prenom: z.string().min(1, "Le prénom est requis").max(100),
    nom: z.string().min(1, "Le nom est requis").max(100),
    email: z.string().email("Email invalide"),
    poste: z.string().min(1, "Le poste est requis").max(100),
    typeContrat: z.enum(["CDI", "CDD", "INTERIM", "APPRENTI", "STAGE", "FREELANCE"]).default("CDI"),
    dateEmbauche: z.string().min(1, "La date d'embauche est requise"),
});

export type QuickAddFormData = z.infer<typeof quickAddSchema>;

export interface EmployeeQuickAddProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: QuickAddFormData) => void;
    onAdvancedMode: () => void;
    isLoading?: boolean;
}

const defaultValues: QuickAddFormData = {
    prenom: "",
    nom: "",
    email: "",
    poste: "",
    typeContrat: "CDI",
    dateEmbauche: new Date().toISOString().split("T")[0],
};

export function EmployeeQuickAdd({
    open,
    onOpenChange,
    onSubmit,
    onAdvancedMode,
    isLoading,
}: EmployeeQuickAddProps) {
    const form = useForm<QuickAddFormData>({
        resolver: zodResolver(quickAddSchema),
        defaultValues,
    });

    useEffect(() => {
        if (open) {
            form.reset(defaultValues);
        }
    }, [open, form]);

    const handleSubmit = (data: QuickAddFormData) => {
        onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeaderSection
                    title="Ajouter un employé"
                    description="Renseignez les informations essentielles"
                />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="prenom"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prénom</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Jean"
                                                {...field}
                                                className="h-11"
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
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Dupont"
                                                {...field}
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="jean.dupont@entreprise.fr"
                                            {...field}
                                            className="h-11"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="poste"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Poste</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Technicien, Commercial..."
                                            {...field}
                                            className="h-11"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="typeContrat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type de contrat</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.entries(TYPE_CONTRAT_LABELS).map(
                                                    ([value, label]) => (
                                                        <SelectItem key={value} value={value}>
                                                            {label}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dateEmbauche"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date d&apos;embauche</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                date={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date: Date | undefined) =>
                                                    field.onChange(
                                                        date ? date.toISOString().split("T")[0] : ""
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="flex items-center justify-between pt-4 border-t border-black/8">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onAdvancedMode}
                                className="text-black/60 hover:text-black"
                            >
                                <Settings2 className="w-4 h-4 mr-2" strokeWidth={2} />
                                Mode avancé
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
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-black hover:bg-black/90 text-white h-11 px-6"
                                >
                                    {isLoading ? "Ajout..." : "Ajouter"}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
