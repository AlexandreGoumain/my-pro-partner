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
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { StepProps } from "../types";

export function OccasionDetailsStep({ form }: StepProps) {
    return (
        <div className="space-y-4 py-4">
            <div className="space-y-1">
                <h3 className="text-[24px] font-semibold text-black tracking-[-0.02em]">
                    Informations de rachat
                </h3>
                <p className="text-[14px] text-black/60">
                    Détails sur l'acquisition de cet article d'occasion
                </p>
            </div>

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
                            Évaluation de l'état général du produit
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
                                Provenance <span className="text-red-500">*</span>
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
                                    <SelectItem value="MARKETPLACE_LEBONCOIN">
                                        Leboncoin
                                    </SelectItem>
                                    <SelectItem value="MARKETPLACE_EBAY">
                                        eBay
                                    </SelectItem>
                                    <SelectItem value="MARKETPLACE_AUTRE">
                                        Autre marketplace
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
                                Prix de rachat HT <span className="text-red-500">*</span>
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

            <div className="grid grid-cols-2 gap-4">
                {/* Garantie */}
                <FormField
                    control={form.control}
                    name="dureeGarantie"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[14px]">
                                Garantie
                            </FormLabel>
                            <Select
                                onValueChange={(value) =>
                                    field.onChange(
                                        value === "0" ? undefined : parseInt(value)
                                    )
                                }
                                defaultValue={field.value?.toString() || "0"}
                            >
                                <FormControl>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Sans garantie" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="0">
                                        Sans garantie
                                    </SelectItem>
                                    <SelectItem value="3">3 mois</SelectItem>
                                    <SelectItem value="6">6 mois</SelectItem>
                                    <SelectItem value="12">12 mois</SelectItem>
                                    <SelectItem value="24">24 mois</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription className="text-[12px]">
                                Durée de garantie offerte
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
                                Pour traçabilité et garantie
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Date de rachat */}
            <FormField
                control={form.control}
                name="dateRachat"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel className="text-[14px]">
                            Date de rachat
                        </FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "h-11 pl-3 text-left font-normal border-black/10",
                                            !field.value && "text-black/40"
                                        )}
                                    >
                                        {field.value ? (
                                            format(field.value, "PPP", {
                                                locale: fr,
                                            })
                                        ) : (
                                            <span>Sélectionner une date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                        date > new Date() ||
                                        date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                    locale={fr}
                                />
                            </PopoverContent>
                        </Popover>
                        <FormDescription className="text-[12px]">
                            Date d'acquisition de l'article
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
                            Notes sur l'état
                        </FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Défauts constatés, accessoires inclus, etc."
                                className="resize-none min-h-[100px]"
                                {...field}
                            />
                        </FormControl>
                        <FormDescription className="text-[12px]">
                            Détails sur l'état, défauts, accessoires
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
                            Ces informations permettront de tracer l'historique
                            complet de l'article, de calculer la marge réalisée et
                            de gérer la garantie client.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
