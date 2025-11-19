import { PLAN_ABONNEMENT } from "@/lib/config/activity-plan-mapping";
import type { BusinessTemplate } from "@/lib/services/business-template.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type PlanAbonnement = (typeof PLAN_ABONNEMENT)[keyof typeof PLAN_ABONNEMENT];

const onboardingSchema = z.object({
    nomEntreprise: z
        .string()
        .min(2, "Le nom doit contenir au moins 2 caractères"),
    businessType: z.string().min(1, "Veuillez sélectionner un type d'activité"),
    selectedPlan: z.enum(["FREE", "STARTER", "PRO", "ENTERPRISE"]).optional(),
    secteur: z.string().optional(),
    siret: z.string().optional(),
    adresse: z.string().optional(),
    telephone: z.string().optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export interface OnboardingPageHandlers {
    form: ReturnType<typeof useForm<OnboardingInput>>;
    isLoading: boolean;
    error: string | null;
    onSubmit: (data: OnboardingInput) => Promise<void>;
    step: number;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    canGoNext: boolean;
    handleNext: (selectedTemplate?: BusinessTemplate | null) => void;
    selectedPlan: PlanAbonnement | null;
    setSelectedPlan: (plan: PlanAbonnement | null) => void;
}

export function useOnboardingPage(): OnboardingPageHandlers {
    const { data: session, update } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState(1); // Étape actuelle (1, 2, 3, ou 4)
    const [selectedPlan, setSelectedPlan] = useState<PlanAbonnement | null>(
        null
    );

    const form = useForm<OnboardingInput>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            nomEntreprise: session?.user?.name || "",
            businessType: "",
            selectedPlan: undefined,
            secteur: "",
            siret: "",
            adresse: "",
            telephone: "",
        },
    });

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    // Vérifier si on peut passer à l'étape suivante
    const canGoNext = (): boolean => {
        if (step === 1) {
            return (
                !!form.watch("nomEntreprise") &&
                form.watch("nomEntreprise").length >= 2
            );
        }
        if (step === 2) {
            return !!form.watch("businessType");
        }
        if (step === 3) {
            // Étape plan : on peut continuer même sans sélection (FREE par défaut)
            return true;
        }
        return true;
    };

    const onSubmit = async (data: OnboardingInput) => {
        setIsLoading(true);
        setError(null);

        try {
            // Inclure selectedPlan dans la requête
            const payload = {
                ...data,
                selectedPlan: selectedPlan || "FREE",
            };

            const response = await fetch("/api/onboarding/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || "Une erreur est survenue");
                setIsLoading(false);
                return;
            }

            // Update session to reflect onboarding completion
            await update();

            // Force full page reload to refresh JWT token in middleware
            window.location.replace("/dashboard");
        } catch {
            setError("Une erreur est survenue");
            setIsLoading(false);
        }
    };

    const handleNext = (selectedTemplate?: BusinessTemplate | null) => {
        if (step === 1 && canGoNext()) {
            nextStep();
        } else if (step === 2 && selectedTemplate) {
            nextStep();
        } else if (step === 3 && canGoNext()) {
            // Étape plan : on peut passer à la suivante
            nextStep();
        }
    };

    return {
        form,
        isLoading,
        error,
        onSubmit,
        step,
        setStep,
        nextStep,
        prevStep,
        canGoNext: canGoNext(),
        handleNext,
        selectedPlan,
        setSelectedPlan,
    };
}
