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
import type { UseFormReturn } from "react-hook-form";
import type { EmployeeFormData } from "../types";

interface CompensationSectionProps {
    form: UseFormReturn<EmployeeFormData>;
    showTitle?: boolean;
}

export function CompensationSection({
    form,
    showTitle = true,
}: CompensationSectionProps) {
    return (
        <div className="space-y-4">
            {showTitle && (
                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                    Rémunération
                </h3>
            )}

            <div className="grid grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="salaireBrut"
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                            <FormLabel className="text-[13px] text-black/60">
                                Salaire brut *
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="h-11 border-black/10 focus:border-black/30"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="devise"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] text-black/60">
                                Devise
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
                                    <SelectItem value="EUR">EUR (€)</SelectItem>
                                    <SelectItem value="USD">USD ($)</SelectItem>
                                    <SelectItem value="GBP">GBP (£)</SelectItem>
                                    <SelectItem value="CHF">CHF</SelectItem>
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
                    name="heuresHebdo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] text-black/60">
                                Heures hebdomadaires
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="35"
                                    className="h-11 border-black/10 focus:border-black/30"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseInt(e.target.value) || 35
                                        )
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="joursTravail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] text-black/60">
                                Jours de travail
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Lundi - Vendredi"
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
