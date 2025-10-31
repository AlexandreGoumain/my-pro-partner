import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { StepProps } from "../types";

export function StockStep({ form }: StepProps) {
    return (
        <div className="space-y-3 py-4">
            <div className="space-y-1">
                <h3 className="text-[24px] font-semibold text-black tracking-[-0.02em]">
                    Gestion du stock
                </h3>
                <p className="text-[14px] text-black/60">
                    Configurez le stock initial et les alertes
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 gap-y-2">
                <FormField
                    control={form.control}
                    name="stock_actuel"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-[13px]">
                                Stock initial
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(parseInt(e.target.value, 10) || 0)
                                    }
                                />
                            </FormControl>
                            <FormDescription className="text-[12px] mt-1">
                                Quantité en stock
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="stock_min"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-[13px]">
                                Seuil d&apos;alerte
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(parseInt(e.target.value, 10) || 0)
                                    }
                                />
                            </FormControl>
                            <FormDescription className="text-[12px] mt-1">
                                Stock minimum avant alerte
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <Card className="bg-black/2 border-black/10">
                <CardContent className="p-5">
                    <div className="flex gap-3">
                        <Info className="h-5 w-5 text-black/40 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-[14px] font-semibold text-black">
                                À propos du seuil d&apos;alerte
                            </p>
                            <p className="text-[13px] text-black/60 leading-relaxed">
                                Vous recevrez une notification lorsque le stock
                                atteindra ou passera sous ce seuil.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <FormField
                control={form.control}
                name="gestion_stock"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-black/10 p-4">
                        <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-0.5 leading-none">
                            <FormLabel className="text-[13px]">
                                Activer la gestion automatique du stock
                            </FormLabel>
                            <FormDescription className="text-[12px]">
                                Le stock sera automatiquement déduit lors des ventes
                            </FormDescription>
                        </div>
                    </FormItem>
                )}
            />
        </div>
    );
}
