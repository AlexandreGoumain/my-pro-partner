import { Card, CardContent } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { TrendingUp } from "lucide-react";
import { StepProps } from "../types";

export function PricingStep({ form, articleType }: StepProps) {
    const prixHT = form.watch("prix_ht");
    const tvaTaux = form.watch("tva_taux");
    const prixTTC = prixHT * (1 + tvaTaux / 100);

    // Pour les occasions, récupérer le prix de rachat
    const prixRachat = articleType === "OCCASION" ? form.watch("prixRachat") || 0 : 0;
    const marge = prixRachat > 0 ? prixHT - prixRachat : 0;
    const margePourcentage = prixRachat > 0 ? ((marge / prixRachat) * 100) : 0;

    return (
        <div className="space-y-3 py-4">
            <div className="space-y-1">
                <h3 className="text-[24px] font-semibold text-black tracking-[-0.02em]">
                    Tarification
                </h3>
                <p className="text-[14px] text-black/60">
                    {articleType === "OCCASION"
                        ? "Définissez le prix de vente de cet article d'occasion"
                        : "Définissez le prix de vente"}
                </p>
            </div>

            {/* Prix de rachat rappel pour OCCASION */}
            {articleType === "OCCASION" && prixRachat > 0 && (
                <Card className="bg-black/2 border-black/10">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-black/40" />
                                <span className="text-[13px] font-medium text-black/60">
                                    Prix de rachat (coût)
                                </span>
                            </div>
                            <span className="text-[16px] font-semibold text-black">
                                {prixRachat.toFixed(2)} € HT
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="prix_ht"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-[13px] font-medium">
                                Prix de vente HT *
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        className="h-11 pr-12"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseFloat(e.target.value) || 0
                                            )
                                        }
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-black/60 font-medium">
                                        € HT
                                    </span>
                                </div>
                            </FormControl>
                            <FormDescription className="text-[12px]">
                                {articleType === "OCCASION"
                                    ? "Prix auquel vous allez vendre cet article"
                                    : "Saisissez le prix hors taxes"}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tva_taux"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-[13px] font-medium">Taux TVA *</FormLabel>
                            <Select
                                onValueChange={(value) =>
                                    field.onChange(parseFloat(value))
                                }
                                defaultValue={field.value.toString()}
                            >
                                <FormControl>
                                    <SelectTrigger className="h-11 border-black/10">
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="0">0%</SelectItem>
                                    <SelectItem value="5.5">5,5%</SelectItem>
                                    <SelectItem value="10">10%</SelectItem>
                                    <SelectItem value="20">20%</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription className="text-[12px]">
                                Sélectionnez le taux de TVA applicable
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <Card className="bg-black/2 border-black/10 shadow-sm">
                <CardContent className="p-6 space-y-4">
                    {/* Marge pour OCCASION */}
                    {articleType === "OCCASION" && prixRachat > 0 && (
                        <>
                            <div className="flex justify-between items-center">
                                <span className="text-[14px] text-black/60 font-medium">
                                    Coût de rachat
                                </span>
                                <span className="font-semibold text-[17px] text-black">
                                    {prixRachat.toFixed(2)} €
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[14px] text-black/60 font-medium">
                                    Prix de vente HT
                                </span>
                                <span className="font-semibold text-[17px] text-black">
                                    {prixHT.toFixed(2)} €
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[14px] font-medium text-green-700">
                                    Marge brute
                                </span>
                                <div className="text-right">
                                    <span className="font-semibold text-[17px] text-green-700">
                                        {marge.toFixed(2)} €
                                    </span>
                                    <span className="text-[13px] text-green-700/70 ml-2">
                                        (+{margePourcentage.toFixed(1)}%)
                                    </span>
                                </div>
                            </div>
                            <Separator className="bg-black/8" />
                        </>
                    )}

                    {/* Standard pricing info */}
                    {articleType !== "OCCASION" && (
                        <>
                            <div className="flex justify-between items-center">
                                <span className="text-[14px] text-black/60 font-medium">
                                    Prix HT
                                </span>
                                <span className="font-semibold text-[17px] text-black">
                                    {prixHT.toFixed(2)} €
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[14px] text-black/60 font-medium">
                                    TVA ({tvaTaux}%)
                                </span>
                                <span className="font-semibold text-[17px] text-black">
                                    {(prixHT * (tvaTaux / 100)).toFixed(2)} €
                                </span>
                            </div>
                            <Separator className="bg-black/8" />
                        </>
                    )}

                    <div className="flex justify-between items-center pt-2">
                        <span className="font-semibold text-[15px] text-black">
                            Prix TTC final
                        </span>
                        <span className="text-[32px] font-semibold text-black tracking-[-0.02em]">
                            {prixTTC.toFixed(2)} €
                        </span>
                    </div>

                    {/* TVA info for OCCASION */}
                    {articleType === "OCCASION" && (
                        <div className="text-[12px] text-black/40 pt-2 border-t border-black/5">
                            TVA {tvaTaux}% : {(prixHT * (tvaTaux / 100)).toFixed(2)} € inclus
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
