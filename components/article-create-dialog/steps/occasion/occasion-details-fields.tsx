import {
    FormControl,
    FormDescription,
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
import { Info } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface OccasionDetailsFieldsProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
    showSectionTitle?: boolean;
}

export function OccasionDetailsFields({
    form,
    showSectionTitle = false,
}: OccasionDetailsFieldsProps) {
    return (
        <>
            {showSectionTitle && (
                <div className="space-y-1 pt-2">
                    <h4 className="text-[16px] font-semibold text-black">
                        Détails de l&apos;occasion
                    </h4>
                    <p className="text-[13px] text-black/60">
                        Informations sur l&apos;acquisition de cet article
                    </p>
                </div>
            )}

            {/* État */}
            <FormField
                control={form.control}
                name="etat"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[14px]">
                            État <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                            <FormControl>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Sélectionner l'état" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="COMME_NEUF">
                                    Comme neuf
                                </SelectItem>
                                <SelectItem value="TRES_BON">
                                    Très bon état
                                </SelectItem>
                                <SelectItem value="BON">Bon état</SelectItem>
                                <SelectItem value="CORRECT">
                                    État correct
                                </SelectItem>
                                <SelectItem value="POUR_PIECES">
                                    Pour pièces détachées
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <FormDescription className="text-[12px]">
                            Évaluation de l&apos;état général du produit
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                {/* Provenance */}
                <FormField
                    control={form.control}
                    name="provenance"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[14px]">
                                Provenance{" "}
                                <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="RACHAT_CLIENT">
                                        Rachat client
                                    </SelectItem>
                                    <SelectItem value="MARKETPLACE_OCCASION">
                                        Marketplace (occasion)
                                    </SelectItem>
                                    <SelectItem value="REPRISE">
                                        Reprise
                                    </SelectItem>
                                    <SelectItem value="DON">Don</SelectItem>
                                    <SelectItem value="RETOUR_SAV">
                                        Retour SAV
                                    </SelectItem>
                                    <SelectItem value="AUTRE">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Prix de rachat */}
                <FormField
                    control={form.control}
                    name="prixRachat"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[14px]">
                                Prix de rachat HT{" "}
                                <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="h-11 pr-8"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseFloat(e.target.value) || 0
                                            )
                                        }
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-black/60">
                                        €
                                    </span>
                                </div>
                            </FormControl>
                            <FormDescription className="text-[12px]">
                                Prix payé au vendeur
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Numéro de série / IMEI */}
            <FormField
                control={form.control}
                name="numeroSerie"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[14px]">
                            Numéro de série / IMEI
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Ex: 354123456789012"
                                className="h-11"
                                {...field}
                            />
                        </FormControl>
                        <FormDescription className="text-[12px]">
                            Pour traçabilité
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Notes */}
            <FormField
                control={form.control}
                name="notesRachat"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[14px]">
                            Notes sur l&apos;état
                        </FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Défauts constatés, accessoires inclus, etc."
                                className="resize-none min-h-[100px]"
                                {...field}
                            />
                        </FormControl>
                        <FormDescription className="text-[12px]">
                            Détails sur l&apos;état, défauts, accessoires
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Info box */}
            <div className="bg-black/2 border border-black/10 rounded-lg p-4 mt-4">
                <div className="flex gap-3">
                    <Info className="h-5 w-5 text-black/40 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-[14px] font-semibold text-black">
                            Traçabilité complète
                        </p>
                        <p className="text-[13px] text-black/60 leading-relaxed">
                            Ces informations permettront de tracer
                            l&apos;historique complet de l&apos;article et de
                            calculer la marge réalisée.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
