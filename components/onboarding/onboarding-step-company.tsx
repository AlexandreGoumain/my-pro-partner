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
import type { UseFormReturn } from "react-hook-form";
import type { OnboardingInput } from "@/hooks/use-onboarding-page";

export interface OnboardingStepCompanyProps {
  form: UseFormReturn<OnboardingInput>;
  className?: string;
}

export function OnboardingStepCompany({
  form,
  className,
}: OnboardingStepCompanyProps) {
  return (
    <div className={className}>
      <div>
        <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-black">
          Parlez-nous de votre entreprise
        </h2>
        <p className="text-[14px] text-black/40 mt-1">
          Commençons par les informations essentielles
        </p>
      </div>

      <Separator />

      <FormField
        control={form.control}
        name="nomEntreprise"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[14px]">
              Nom de l&apos;entreprise *
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Ex: Plomberie Dupont"
                className="h-11 text-[14px]"
                autoFocus
              />
            </FormControl>
            <FormMessage className="text-[13px]" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="siret"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[14px]">SIRET (optionnel)</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="123 456 789 00012"
                className="h-11 text-[14px]"
              />
            </FormControl>
            <FormDescription className="text-[13px] text-black/40">
              Nécessaire pour l&apos;export FEC comptable
            </FormDescription>
            <FormMessage className="text-[13px]" />
          </FormItem>
        )}
      />
    </div>
  );
}
