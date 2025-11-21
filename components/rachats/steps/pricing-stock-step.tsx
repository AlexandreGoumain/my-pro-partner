"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Euro, TrendingUp, Package, AlertTriangle, Wrench, ShoppingBag } from "lucide-react";

interface PricingStockStepProps {
  form: UseFormReturn<any>;
}

export function PricingStockStep({ form }: PricingStockStepProps) {
  const [destinationType, setDestinationType] = useState<"revente" | "atelier">("revente");

  const prixRachat = form.watch("prixRachat") || 0;
  const prixHT = form.watch("prix_ht") || 0;
  const tvaTaux = form.watch("tva_taux") || 20;
  const prixTTC = prixHT * (1 + tvaTaux / 100);
  const marge = prixHT - prixRachat;
  const margePourcentage = prixRachat > 0 ? ((marge / prixRachat) * 100).toFixed(1) : 0;

  // Update form field when tab changes
  const handleTabChange = (value: string) => {
    setDestinationType(value as "revente" | "atelier");

    if (value === "atelier") {
      // Reset pricing fields for atelier items
      form.setValue("prix_ht", 0);
      form.setValue("stock_actuel", 1);
      form.setValue("stock_min", 0);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <h3 className="text-[20px] font-semibold text-black tracking-[-0.02em]">
          Destination de l'article
        </h3>
        <p className="text-[14px] text-black/60">
          Choisissez si cet article sera revendu ou utilisé en atelier
        </p>
      </div>

      <Tabs value={destinationType} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-black/5 rounded-lg">
          <TabsTrigger
            value="revente"
            className="data-[state=active]:bg-black data-[state=active]:text-white h-11 text-[14px] font-medium rounded-md transition-all"
          >
            <ShoppingBag className="h-4 w-4 mr-2" strokeWidth={2} />
            Revente directe
          </TabsTrigger>
          <TabsTrigger
            value="atelier"
            className="data-[state=active]:bg-black data-[state=active]:text-white h-11 text-[14px] font-medium rounded-md transition-all"
          >
            <Wrench className="h-4 w-4 mr-2" strokeWidth={2} />
            Atelier
          </TabsTrigger>
        </TabsList>

        {/* REVENTE TAB */}
        <TabsContent value="revente" className="space-y-6 mt-6">
          {/* Marge indicator */}
          {prixRachat > 0 && prixHT > 0 && (
            <div
              className={`p-4 rounded-lg border ${
                marge >= 0
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {marge >= 0 ? (
                  <TrendingUp
                    className="h-5 w-5 text-green-600"
                    strokeWidth={2}
                  />
                ) : (
                  <AlertTriangle
                    className="h-5 w-5 text-red-600"
                    strokeWidth={2}
                  />
                )}
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-black">
                    Marge prévue : {marge.toFixed(2)} € ({margePourcentage}%)
                  </p>
                  <p className="text-[12px] text-black/60 mt-0.5">
                    Prix rachat : {prixRachat.toFixed(2)} € → Prix vente HT :{" "}
                    {prixHT.toFixed(2)} €
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Prix HT */}
            <FormField
              control={form.control}
              name="prix_ht"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-medium text-black">
                    Prix de vente HT <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="h-11 border-black/10 focus:border-black/20 pr-12"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-black/40">
                        <Euro className="h-4 w-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription className="text-[13px] text-black/50">
                    Hors taxes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TVA */}
            <FormField
              control={form.control}
              name="tva_taux"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-medium text-black">
                    Taux de TVA <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseFloat(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 border-black/10 focus:border-black/20">
                        <SelectValue placeholder="Sélectionner un taux" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="5.5">5.5%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="20">20%</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Prix TTC display */}
          <div className="bg-black/5 rounded-lg p-4 border border-black/10">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-medium text-black">
                Prix de vente TTC
              </span>
              <span className="text-[24px] font-semibold text-black tracking-[-0.02em]">
                {prixTTC.toFixed(2)} €
              </span>
            </div>
          </div>

          <div className="h-px bg-black/8" />

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-black/60" strokeWidth={2} />
              <h4 className="text-[16px] font-semibold text-black">Stock</h4>
            </div>
            <p className="text-[13px] text-black/60">
              Définissez le stock initial et le seuil d'alerte
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Stock initial */}
            <FormField
              control={form.control}
              name="stock_actuel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-medium text-black">
                    Stock initial <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="1"
                      className="h-11 border-black/10 focus:border-black/20"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription className="text-[13px] text-black/50">
                    Nombre d'unités disponibles
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Seuil d'alerte */}
            <FormField
              control={form.control}
              name="stock_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-medium text-black">
                    Seuil d'alerte <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      className="h-11 border-black/10 focus:border-black/20"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription className="text-[13px] text-black/50">
                    Stock minimum avant alerte
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>

        {/* ATELIER TAB */}
        <TabsContent value="atelier" className="space-y-6 mt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Wrench className="h-5 w-5 text-yellow-600 mt-0.5" strokeWidth={2} />
              <div className="flex-1">
                <p className="text-[14px] font-medium text-yellow-900 mb-1">
                  Article destiné à l'atelier
                </p>
                <p className="text-[13px] text-yellow-800">
                  Cet article sera marqué comme ressource atelier. Il ne sera pas mis en vente
                  et pourra être démonté pour récupérer des pièces détachées ou utilisé pour
                  des réparations.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[16px] font-semibold text-black">
              Informations atelier
            </h4>

            <div className="bg-black/5 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-black/60">Prix de rachat</span>
                <span className="text-[16px] font-semibold text-black">
                  {prixRachat.toFixed(2)} €
                </span>
              </div>

              <div className="h-px bg-black/10" />

              <div className="flex items-center justify-between">
                <span className="text-[14px] text-black/60">Destination</span>
                <span className="text-[14px] font-medium text-black">
                  Atelier (Pas de revente)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[14px] text-black/60">Stock initial</span>
                <span className="text-[14px] font-medium text-black">
                  1 unité
                </span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-blue-600 mt-0.5" strokeWidth={2} />
                <div className="text-[13px] text-blue-900">
                  <p className="font-medium mb-1">Prochaines étapes</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    <li>L'article sera ajouté au catalogue avec un prix de vente de 0€</li>
                    <li>Vous pourrez le démonter depuis la page "Atelier"</li>
                    <li>Les pièces récupérées seront ajoutées aux ressources internes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
