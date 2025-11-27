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
import { Textarea } from "@/components/ui/textarea";
import type { Employe } from "@/hooks/use-employes";
import type { Prestation } from "@/hooks/use-prestations";
import { RENDEZ_VOUS_STATUTS } from "@/hooks/use-rendez-vous";
import type { UseFormReturn } from "react-hook-form";
import type { RdvFormValues } from "../rdv-dialog";

interface RdvDetailsStepProps {
    form: UseFormReturn<RdvFormValues>;
    prestations: Prestation[];
    employes: Employe[];
    onPrestationChange: (prestationId: string) => void;
    isEditing: boolean;
}

export function RdvDetailsStep({
    form,
    prestations,
    employes,
    onPrestationChange,
    isEditing,
}: RdvDetailsStepProps) {
    return (
        <div className="space-y-4">
            <p className="text-[14px] text-black/60 mb-6">
                Définissez les détails du rendez-vous.
            </p>

            {/* Date & Time */}
            <div className="grid grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[14px]">
                                Date *
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="date"
                                    className="h-11 text-[14px] border-black/10"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="heure"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[14px]">
                                Heure *
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="time"
                                    className="h-11 text-[14px] border-black/10"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="duree"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[14px]">
                                Durée (min) *
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    min={5}
                                    step={5}
                                    className="h-11 text-[14px] border-black/10"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Prestation & Employee */}
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="prestationId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[14px]">
                                Prestation
                            </FormLabel>
                            <Select
                                value={field.value || "__none__"}
                                onValueChange={(value) => {
                                    const val =
                                        value === "__none__" ? "" : value;
                                    field.onChange(val);
                                    onPrestationChange(val);
                                }}
                            >
                                <FormControl>
                                    <SelectTrigger className="h-11 text-[14px] border-black/10">
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="__none__">
                                        Aucune
                                    </SelectItem>
                                    {prestations?.map((prestation) => (
                                        <SelectItem
                                            key={prestation.id}
                                            value={prestation.id}
                                        >
                                            {prestation.nom} ({prestation.duree}{" "}
                                            min)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="employeId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[14px]">
                                Employé
                            </FormLabel>
                            <Select
                                value={field.value || "__none__"}
                                onValueChange={(val) =>
                                    field.onChange(
                                        val === "__none__" ? "" : val
                                    )
                                }
                            >
                                <FormControl>
                                    <SelectTrigger className="h-11 text-[14px] border-black/10">
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="__none__">
                                        Aucun
                                    </SelectItem>
                                    {employes?.map((employe) => (
                                        <SelectItem
                                            key={employe.id}
                                            value={employe.id}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            employe.couleur ||
                                                            "#000",
                                                    }}
                                                />
                                                {employe.prenom} {employe.nom}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
            </div>

            {/* Status (only for editing) */}
            {isEditing && (
                <FormField
                    control={form.control}
                    name="statut"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[14px]">
                                Statut
                            </FormLabel>
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <FormControl>
                                    <SelectTrigger className="h-11 text-[14px] border-black/10">
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {RENDEZ_VOUS_STATUTS.map((statut) => (
                                        <SelectItem
                                            key={statut.value}
                                            value={statut.value}
                                        >
                                            {statut.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
            )}

            {/* Notes */}
            <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[14px]">Notes</FormLabel>
                        <FormControl>
                            <Textarea
                                {...field}
                                placeholder="Notes internes..."
                                className="text-[14px] border-black/10 resize-none"
                                rows={3}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>
    );
}
