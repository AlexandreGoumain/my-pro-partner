"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TYPE_CONTRAT_LABELS } from "@/lib/types/contrats";
import { addYears, format } from "date-fns";
import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ContratFormValues } from "../contrat-dialog";

interface ContratStepProps {
    form: UseFormReturn<ContratFormValues>;
}

export function ContratStep({ form }: ContratStepProps) {
    const dateDebut = form.watch("dateDebut");
    const dureeAnnees = form.watch("dureeAnnees");

    const dateFin = useMemo(() => {
        if (!dateDebut) return "";
        const start = new Date(dateDebut);
        return format(addYears(start, dureeAnnees || 1), "dd/MM/yyyy");
    }, [dateDebut, dureeAnnees]);

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-[16px] font-medium">
                    Détails du contrat
                </h3>
                <p className="text-[13px] text-black/50">
                    Définissez le type de contrat et sa durée
                </p>
            </div>

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
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.entries(TYPE_CONTRAT_LABELS).map(
                                        ([value, label]) => (
                                            <SelectItem
                                                key={value}
                                                value={value}
                                            >
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
                    name="nom"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom du contrat</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ex: Entretien chaudière"
                                    className="h-11"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="adresse"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Adresse d&apos;intervention</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Adresse complète"
                                className="h-11"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="codePostal"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code postal</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="75000"
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
                    name="ville"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ville</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Paris"
                                    className="h-11"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="dateDebut"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date de début</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
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
                    name="dureeAnnees"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Durée (années)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={1}
                                    max={10}
                                    className="h-11"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormItem>
                    <FormLabel>Fin prévue</FormLabel>
                    <div className="h-11 px-3 flex items-center rounded-md border border-black/10 bg-black/[0.02] text-[14px] text-black/60">
                        {dateFin || "-"}
                    </div>
                </FormItem>
            </div>
        </div>
    );
}
