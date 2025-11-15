import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TemplateSummary } from "@/components/onboarding/template-summary";
import type { UseFormReturn } from "react-hook-form";
import type { OnboardingInput } from "@/hooks/use-onboarding-page";
import type { BusinessTemplate } from "@/lib/services/business-template.service";

export interface OnboardingStepDetailsProps {
  form: UseFormReturn<OnboardingInput>;
  selectedTemplate: BusinessTemplate | null;
  className?: string;
}

export function OnboardingStepDetails({
  form,
  selectedTemplate,
  className,
}: OnboardingStepDetailsProps) {
  return (
    <div className={className}>
      <div>
        <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-black">
          Derniers détails
        </h2>
        <p className="text-[14px] text-black/40 mt-1">
          Informations optionnelles pour compléter votre profil
        </p>
      </div>

      <Separator />

      <FormField
        control={form.control}
        name="adresse"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[14px]">Adresse</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="123 Rue de la République, 75001 Paris"
                className="h-11 text-[14px]"
              />
            </FormControl>
            <FormMessage className="text-[13px]" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="telephone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[14px]">Téléphone</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="tel"
                placeholder="01 23 45 67 89"
                className="h-11 text-[14px]"
              />
            </FormControl>
            <FormMessage className="text-[13px]" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="secteur"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[14px]">
              Secteur d&apos;activité détaillé (optionnel)
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Ex: Plomberie chauffage sanitaire"
                className="h-11 text-[14px]"
              />
            </FormControl>
            <FormDescription className="text-[13px] text-black/40">
              Pour mieux personnaliser votre expérience
            </FormDescription>
            <FormMessage className="text-[13px]" />
          </FormItem>
        )}
      />

      {/* Récapitulatif */}
      {selectedTemplate && (
        <>
          <Separator />
          <TemplateSummary template={selectedTemplate} />
        </>
      )}
    </div>
  );
}
