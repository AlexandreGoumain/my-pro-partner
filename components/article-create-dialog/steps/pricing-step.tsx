import { Card, CardContent } from "@/components/ui/card";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { PriceInput } from "@/components/ui/price-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { StepProps } from "../types";

export function PricingStep({ form }: StepProps) {
    const prixHT = form.watch("prix_ht");
    const tvaTaux = form.watch("tva_taux");
    const prixTTC = prixHT * (1 + tvaTaux / 100);

    return (
        <div className="space-y-3 py-4">
            <div className="space-y-1">
                <h3 className="text-[24px] font-semibold text-black tracking-[-0.02em]">
                    Tarification
                </h3>
                <p className="text-[14px] text-black/60">
                    Définissez le prix de vente
                </p>
            </div>

            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="prix_ht"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-[13px] font-medium">Prix HT *</FormLabel>
                            <FormControl>
                                <PriceInput
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormDescription className="text-[12px]">
                                Saisissez le prix hors taxes
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
                    <div className="flex justify-between items-center pt-2">
                        <span className="font-semibold text-[15px] text-black">
                            Prix TTC
                        </span>
                        <span className="text-[32px] font-semibold text-black tracking-[-0.02em]">
                            {prixTTC.toFixed(2)} €
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
