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
import type { UseFormReturn } from "react-hook-form";
import type { EmployeeFormData } from "../types";

interface PersonalInfoSectionProps {
    form: UseFormReturn<EmployeeFormData>;
    showTitle?: boolean;
}

export function PersonalInfoSection({
    form,
    showTitle = true,
}: PersonalInfoSectionProps) {
    return (
        <div className="space-y-4">
            {showTitle && (
                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                    Informations personnelles
                </h3>
            )}

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
                    name="nom"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] text-black/60">
                                Nom *
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Dupont"
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] text-black/60">
                                Email *
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="jean.dupont@example.com"
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
                    name="telephone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] text-black/60">
                                Téléphone
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="tel"
                                    placeholder="06 12 34 56 78"
                                    className="h-11 border-black/10 focus:border-black/30"
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
                name="dateNaissance"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[13px] text-black/60">
                            Date de naissance
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
                                            ? date.toISOString().split("T")[0]
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
                name="adresse"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[13px] text-black/60">
                            Adresse
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder="12 rue de la Paix"
                                className="h-11 border-black/10 focus:border-black/30"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="codePostal"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] text-black/60">
                                Code postal
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="75001"
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
                    name="ville"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] text-black/60">
                                Ville
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Paris"
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
                    name="pays"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] text-black/60">
                                Pays
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="France"
                                    className="h-11 border-black/10 focus:border-black/30"
                                    {...field}
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
