import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import type { BusinessTemplate } from "@/lib/services/business-template.service";

export interface OnboardingNavigationProps {
  step: number;
  isLoading: boolean;
  canGoNext: boolean;
  selectedTemplate: BusinessTemplate | null;
  onPrevStep: () => void;
  onNextStep: () => void;
  className?: string;
}

export function OnboardingNavigation({
  step,
  isLoading,
  canGoNext,
  selectedTemplate,
  onPrevStep,
  onNextStep,
  className,
}: OnboardingNavigationProps) {
  return (
    <div className={className}>
      <Button
        type="button"
        variant="outline"
        onClick={onPrevStep}
        disabled={step === 1 || isLoading}
        className="gap-2 border-black/10 hover:bg-black/5 h-11 px-6 text-[14px] font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Button>

      <div className="flex gap-3">
        {step < 3 ? (
          <Button
            type="button"
            onClick={onNextStep}
            disabled={
              (step === 1 && !canGoNext) ||
              (step === 2 && !selectedTemplate)
            }
            className="gap-2 bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
          >
            Continuer
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isLoading || !selectedTemplate}
            className="gap-2 bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm min-w-[180px]"
          >
            {isLoading ? (
              <>
                <Spinner className="h-4 w-4" />
                Configuration...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Lancer l&apos;application
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
