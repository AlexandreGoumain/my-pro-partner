"use client";

import { DatePicker } from "@/components/ui/date-picker";
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
import {
    STATUT_LABELS,
    TYPE_CONTRAT_LABELS,
} from "@/lib/types/personnel.types";
import type { UseFormReturn } from "react-hook-form";
import type { EmployeeFormData } from "../types";

interface ProfessionalInfoSectionProps {
    form: UseFormReturn<EmployeeFormData>;
    showTitle?: boolean;
}

export function ProfessionalInfoSection({
    form,
    showTitle = true,
}: ProfessionalInfoSectionProps) {
    return (
        <div className="space-y-4">
            {showTitle && (
                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                    Informations professionnelles
                </h3>
            )}

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="poste"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] text-black/60">
                                Poste *
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Technicien informatique"
                                    className="h-11 border-black/10 focus:border-black/30"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="departement"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] text-black/60">
                                Département
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Atelier"
                                    className="h-11 border-black/10 focus:border-black/30"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="typeContrat"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] text-black/60">
                                Type de contrat *
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="h-11 border-black/10">
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
                    name="statut"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] text-black/60">
                                Statut *
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="h-11 border-black/10">
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.entries(STATUT_LABELS).map(
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
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="dateEmbauche"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] text-black/60">
                                Date d&apos;embauche *
                            </FormLabel>
                            <FormControl>
                                <DatePicker
                                    date={
                                        field.value
                                            ? new Date(field.value)
                                            : undefined
                                    }
                                    onSelect={(date) =>
                                        field.onChange(
                                            date
                                                ? date
                                                      .toISOString()
                                                      .split("T")[0]
                                                : ""
                                        )
                                    }
                                    placeholder="Sélectionner une date"
                                    className="border-black/10"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dateFin"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] text-black/60">
                                Date de fin
                            </FormLabel>
                            <FormControl>
                                <DatePicker
                                    date={
                                        field.value
                                            ? new Date(field.value)
                                            : undefined
                                    }
                                    onSelect={(date) =>
                                        field.onChange(
                                            date
                                                ? date
                                                      .toISOString()
                                                      .split("T")[0]
                                                : ""
                                        )
                                    }
                                    placeholder="Sélectionner une date"
                                    className="border-black/10"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
