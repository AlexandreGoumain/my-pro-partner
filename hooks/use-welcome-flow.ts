import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

export interface UseWelcomeFlowReturn {
    currentStep: number;
    isLastStep: boolean;
    goToNextStep: () => void;
    skipOnboarding: () => void;
}

/**
 * Custom hook for managing the welcome onboarding flow
 * Handles step navigation and localStorage for completion tracking
 */
export function useWelcomeFlow(totalSteps: number): UseWelcomeFlowReturn {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);

    const isLastStep = currentStep === totalSteps - 1;

    const completeOnboarding = useCallback(() => {
        localStorage.setItem("clientOnboardingComplete", "true");
        router.push("/client/dashboard");
    }, [router]);

    const goToNextStep = useCallback(() => {
        if (!isLastStep) {
            setCurrentStep((prev) => prev + 1);
        } else {
            completeOnboarding();
        }
    }, [isLastStep, completeOnboarding]);

    const skipOnboarding = useCallback(() => {
        completeOnboarding();
    }, [completeOnboarding]);

    return {
        currentStep,
        isLastStep,
        goToNextStep,
        skipOnboarding,
    };
}
