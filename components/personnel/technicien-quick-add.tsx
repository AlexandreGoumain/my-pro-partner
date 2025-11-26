"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Truck, User } from "lucide-react";

const technicienSchema = z.object({
    prenom: z.string().min(1, "Le prénom est requis").max(100),
    nom: z.string().min(1, "Le nom est requis").max(100),
    email: z.string().email("Email invalide"),
    telephone: z.string().min(1, "Le téléphone est requis").max(20),
    camionnetteId: z.string().optional(),
});

export type TechnicienFormData = z.infer<typeof technicienSchema>;

export interface Camionnette {
    id: string;
    nom: string;
    immatriculation: string;
}

export interface TechnicienQuickAddProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: TechnicienFormData) => void;
    camionnettes?: Camionnette[];
    isLoading?: boolean;
    businessLabel?: string;
}

const defaultValues: TechnicienFormData = {
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    camionnetteId: undefined,
};

export function TechnicienQuickAdd({
    open,
    onOpenChange,
    onSubmit,
    camionnettes = [],
    isLoading,
    businessLabel = "Technicien",
}: TechnicienQuickAddProps) {
    const form = useForm<TechnicienFormData>({
        resolver: zodResolver(technicienSchema),
        defaultValues,
    });

    useEffect(() => {
        if (open) {
            form.reset(defaultValues);
        }
    }, [open, form]);

    const handleSubmit = (data: TechnicienFormData) => {
        onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[440px]">
                <DialogHeaderSection
                    title={`Ajouter un ${businessLabel.toLowerCase()}`}
                    description="Ajoutez rapidement un membre de votre équipe terrain"
                />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                                                {...field}
                                                className="h-11 border-black/10"
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
                                                {...field}
                                                className="h-11 border-black/10"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="telephone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[13px] text-black/60">
                                        Téléphone *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            placeholder="06 12 34 56 78"
                                            {...field}
                                            className="h-11 border-black/10"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                            placeholder="jean.dupont@entreprise.fr"
                                            {...field}
                                            className="h-11 border-black/10"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {camionnettes.length > 0 && (
                            <FormField
                                control={form.control}
                                name="camionnetteId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[13px] text-black/60 flex items-center gap-2">
                                            <Truck className="w-4 h-4" strokeWidth={2} />
                                            Véhicule assigné
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-11 border-black/10">
                                                    <SelectValue placeholder="Aucun véhicule" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">Aucun véhicule</SelectItem>
                                                {camionnettes.map((cam) => (
                                                    <SelectItem key={cam.id} value={cam.id}>
                                                        {cam.nom} ({cam.immatriculation})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <div className="p-3 rounded-lg bg-black/[0.02] border border-black/[0.06]">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 text-black/40" strokeWidth={2} />
                                </div>
                                <div className="text-[13px] text-black/60">
                                    <p className="font-medium text-black/80 mb-1">
                                        Accès automatique
                                    </p>
                                    <p>
                                        Un email sera envoyé avec les identifiants de connexion
                                        pour accéder à l&apos;application mobile et au planning.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="pt-4 border-t border-black/8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="h-11 px-6 border-black/10"
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
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
