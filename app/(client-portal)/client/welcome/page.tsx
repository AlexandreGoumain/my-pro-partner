"use client";

import { ProgressDots } from "@/components/client-portal/welcome/progress-dots";
import { WelcomeActions } from "@/components/client-portal/welcome/welcome-actions";
import { WelcomeStepCard } from "@/components/client-portal/welcome/welcome-step-card";
import { ConditionalSkeleton } from "@/components/ui/conditional-skeleton";
import { LoadingState } from "@/components/ui/loading-state";
import { useClientAuth } from "@/hooks/use-client-auth";
import { useWelcomeFlow } from "@/hooks/use-welcome-flow";
import type { WelcomeStep } from "@/lib/types/welcome";
import { Award, CheckCircle2, FileText, Sparkles } from "lucide-react";
import { useMemo } from "react";

/**
 * Welcome page shown to users after first registration
 * Goal: Show immediate value and guide them through features
 * Inspired by Apple's onboarding: simple, visual, one thing at a time
 */
export default function ClientWelcomePage() {
    // Use custom auth hook to verify user is authenticated and get entreprise name
    const { entrepriseName, isLoading } = useClientAuth();

    // Define onboarding steps with memoization
    const steps: WelcomeStep[] = useMemo(
        () => [
            {
                icon: Sparkles,
                title: "Bienvenue !",
                description: `Votre espace client ${entrepriseName ? `chez ${entrepriseName}` : ""} est prêt.`,
                detail: "En quelques secondes, vous allez découvrir tout ce que vous pouvez faire ici.",
            },
            {
                icon: FileText,
                title: "Vos documents en un clic",
                description:
                    "Accédez à tous vos devis, factures et avoirs à tout moment.",
                detail: "Téléchargez-les, consultez leur statut, et suivez vos paiements en temps réel.",
            },
            {
                icon: Award,
                title: "Programme de fidélité",
                description:
                    "Gagnez des points à chaque achat et profitez de réductions exclusives.",
                detail: "Plus vous êtes fidèle, plus vous bénéficiez d'avantages et de remises importantes.",
            },
            {
                icon: CheckCircle2,
                title: "Tout est prêt !",
                description:
                    "Vous pouvez maintenant explorer votre espace client.",
                detail: "Commencez par consulter vos documents ou votre programme de fidélité.",
            },
        ],
        [entrepriseName]
    );

    // Use welcome flow hook for step navigation
    const { currentStep, isLastStep, goToNextStep, skipOnboarding } =
        useWelcomeFlow(steps.length);

    const currentStepData = steps[currentStep];

    return (
        <ConditionalSkeleton
            isLoading={isLoading}
            fallback={<LoadingState variant="fullscreen" />}
        >
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                {/* Progress dots */}
                <ProgressDots
                    totalSteps={steps.length}
                    currentStep={currentStep}
                    className="mb-12"
                />

                {/* Main card */}
                <WelcomeStepCard step={currentStepData} className="mb-12" />

                {/* Actions */}
                <WelcomeActions
                    isLastStep={isLastStep}
                    onNext={goToNextStep}
                    onSkip={skipOnboarding}
                />

                {/* Footer */}
                <p className="text-center text-[13px] text-black/40 mt-6">
                    Vous pouvez modifier vos informations à tout moment dans
                    votre profil
                </p>
            </div>
            </div>
        </ConditionalSkeleton>
    );
}
