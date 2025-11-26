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
import type { Camionnette } from "@/lib/types/flotte";
import type { UseFormReturn } from "react-hook-form";
import type { TourneeFormValues } from "../tournee-dialog";

interface DateTechnicienStepProps {
    form: UseFormReturn<TourneeFormValues>;
    plombiers: { id: string; name: string | null }[];
    camionnettes: Camionnette[];
}

export function DateTechnicienStep({
    form,
    plombiers,
    camionnettes,
}: DateTechnicienStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-[16px] font-medium">Date et technicien</h3>
                <p className="text-[13px] text-black/50">
                    Choisissez la date de la tournée et le technicien assigné
                </p>
            </div>

            <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Date de la tournée</FormLabel>
                        <FormControl>
                            <Input type="date" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="plombierId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Technicien</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            <FormControl>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Sélectionner un technicien" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {plombiers.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.name || "Sans nom"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="camionnetteId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Véhicule (optionnel)</FormLabel>
                        <Select
                            onValueChange={(value) =>
                                field.onChange(value === "none" ? "" : value)
                            }
                            value={field.value || "none"}
                        >
                            <FormControl>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Sélectionner un véhicule" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="none">
                                    Aucun véhicule
                                </SelectItem>
                                {camionnettes.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.immatriculation}
                                        {c.marque && ` - ${c.marque}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="heureDebut"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Heure de début</FormLabel>
                            <FormControl>
                                <Input type="time" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="heureFin"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Heure de fin</FormLabel>
                            <FormControl>
                                <Input type="time" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
