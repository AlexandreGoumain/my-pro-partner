"use client";

import { useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Euro } from "lucide-react";

interface RachatDetailsStepProps {
  form: UseFormReturn<any>;
}

export function RachatDetailsStep({ form }: RachatDetailsStepProps) {
  const clientId = form.watch("clientId");
  const hasClientSelected = clientId && clientId !== "no-client";

  // Forcer la provenance à RACHAT_CLIENT si un client est sélectionné
  useEffect(() => {
    if (hasClientSelected) {
      form.setValue("provenance", "RACHAT_CLIENT");
    }
  }, [hasClientSelected, form]);

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <h3 className="text-[20px] font-semibold text-black tracking-[-0.02em]">
          Détails du rachat
        </h3>
        <p className="text-[14px] text-black/60">
          Informations sur l'acquisition de l'article
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* État */}
        <FormField
          control={form.control}
          name="etat"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[14px] font-medium text-black">
                État <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11 border-black/10 focus:border-black/20">
                    <SelectValue placeholder="Sélectionner l'état" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="COMME_NEUF">Comme neuf</SelectItem>
                  <SelectItem value="TRES_BON">Très bon état</SelectItem>
                  <SelectItem value="BON">Bon état</SelectItem>
                  <SelectItem value="CORRECT">État correct</SelectItem>
                  <SelectItem value="POUR_PIECES">
                    Pour pièces détachées
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Provenance */}
        <FormField
          control={form.control}
          name="provenance"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[14px] font-medium text-black">
                Provenance <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={hasClientSelected}
              >
                <FormControl>
                  <SelectTrigger className="h-11 border-black/10 focus:border-black/20">
                    <SelectValue placeholder="Sélectionner la provenance" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="RACHAT_CLIENT">Rachat client</SelectItem>
                  <SelectItem value="MARKETPLACE_OCCASION">
                    Marketplace (occasion)
                  </SelectItem>
                  <SelectItem value="REPRISE">Reprise</SelectItem>
                  <SelectItem value="DON">Don</SelectItem>
                  <SelectItem value="RETOUR_SAV">Retour SAV</SelectItem>
                  <SelectItem value="AUTRE">Autre</SelectItem>
                </SelectContent>
              </Select>
              {hasClientSelected && (
                <FormDescription className="text-[13px] text-black/50">
                  Automatiquement défini car un client est sélectionné
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Prix de rachat */}
      <FormField
        control={form.control}
        name="prixRachat"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[14px] font-medium text-black">
              Prix de rachat <span className="text-red-500">*</span>
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
              Montant payé au client
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="numeroSerie"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[14px] font-medium text-black">
              Numéro de série / IMEI
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: 356789012345678"
                className="h-11 border-black/10 focus:border-black/20 font-mono"
                {...field}
              />
            </FormControl>
            <FormDescription className="text-[13px] text-black/50">
              Pour la traçabilité de l'article
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[14px] font-medium text-black">
              Notes
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Défauts constatés, accessoires inclus, conditions particulières..."
                className="min-h-[80px] border-black/10 focus:border-black/20 resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription className="text-[13px] text-black/50">
              Informations complémentaires sur le rachat
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
