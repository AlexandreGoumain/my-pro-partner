import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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

/**
 * Navigation pour l'étape 1 de l'onboarding (2 étapes total).
 * L'étape 2 gère sa propre navigation dans OnboardingStepPlan.
 */
export function OnboardingNavigation({
    canGoNext,
    selectedTemplate,
    onNextStep,
    className,
}: OnboardingNavigationProps) {
    const isDisabled = !canGoNext || !selectedTemplate;

    return (
        <div className={className}>
            <Button
                type="button"
                onClick={onNextStep}
                disabled={isDisabled}
                className="gap-2 bg-black hover:bg-black/90 text-white h-11 px-8 text-[14px] font-medium rounded-md shadow-sm transition-all duration-200 disabled:opacity-40"
            >
                Continuer
                <ArrowRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
