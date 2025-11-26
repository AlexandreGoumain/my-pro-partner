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
import { PERIODICITE_LABELS } from "@/lib/types/contrats";
import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ContratFormValues } from "../contrat-dialog";

const TVA_RATE = 0.1; // 10% TVA for maintenance contracts

interface TarificationStepProps {
    form: UseFormReturn<ContratFormValues>;
}

export function TarificationStep({ form }: TarificationStepProps) {
    const montantHT = form.watch("montantHT");

    const montantTTC = useMemo(() => {
        return Number(montantHT || 0) * (1 + TVA_RATE);
    }, [montantHT]);

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-[16px] font-medium">Tarification</h3>
                <p className="text-[13px] text-black/50">
                    Définissez le prix et les services inclus dans le contrat
                </p>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="montantHT"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Montant HT (€/an)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    placeholder="150.00"
                                    className="h-11"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormItem>
                    <FormLabel>Montant TTC (€/an)</FormLabel>
                    <div className="h-11 px-3 flex items-center rounded-md border border-black/10 bg-black/[0.02] text-[14px] font-medium">
                        {montantTTC.toFixed(2)} €
                    </div>
                </FormItem>

                <FormField
                    control={form.control}
                    name="periodicite"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Facturation</FormLabel>
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
                                    {Object.entries(PERIODICITE_LABELS).map(
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

            {/* Services inclus */}
            <div className="space-y-3">
                <p className="text-[13px] font-medium text-black/70">
                    Services inclus
                </p>
                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="nombreRevisionsAn"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Révisions / an</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={12}
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
                        name="interventionsIncluses"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dépannages inclus</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
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
                        name="remisePieces"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Remise pièces (%)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={100}
                                        placeholder="10"
                                        className="h-11"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            {/* Renouvellement */}
            <FormField
                control={form.control}
                name="renouvellementAuto"
                render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border border-black/10 p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-[14px] font-medium">
                                Renouvellement automatique
                            </FormLabel>
                            <p className="text-[13px] text-black/50">
                                Le contrat sera renouvelé automatiquement à
                                échéance
                            </p>
                        </div>
                        <FormControl>
                            <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-5 w-5 rounded border-black/20 accent-black"
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>
    );
}
