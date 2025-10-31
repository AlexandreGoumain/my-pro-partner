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

            <div className="grid grid-cols-2 gap-4 gap-y-2">
                <FormField
                    control={form.control}
                    name="prix_ht"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-[13px]">Prix HT *</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(parseFloat(e.target.value) || 0)
                                    }
                                />
                            </FormControl>
                            <FormDescription className="text-[12px] mt-1">
                                Prix hors taxes en €
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tva_taux"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-[13px]">Taux TVA *</FormLabel>
                            <Select
                                onValueChange={(value) =>
                                    field.onChange(parseFloat(value))
                                }
                                defaultValue={field.value.toString()}
                            >
                                <FormControl>
                                    <SelectTrigger>
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
                            <FormDescription className="text-[12px] mt-1">
                                Taux de TVA
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {prixHT > 0 && (
                <Card className="bg-black/2 border-black/10 shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
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
            )}
        </div>
    );
}
