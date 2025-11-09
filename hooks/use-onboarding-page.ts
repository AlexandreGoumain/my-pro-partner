import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const onboardingSchema = z.object({
    nomEntreprise: z
        .string()
        .min(2, "Le nom doit contenir au moins 2 caractères"),
    businessType: z.string().min(1, "Veuillez sélectionner un type d'activité"),
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
}

export function useOnboardingPage(): OnboardingPageHandlers {
    const { data: session, update } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState(1); // Étape actuelle (1, 2, ou 3)

    const form = useForm<OnboardingInput>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            nomEntreprise: session?.user?.name || "",
            businessType: "",
            secteur: "",
            siret: "",
            adresse: "",
            telephone: "",
        },
    });

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    // Vérifier si on peut passer à l'étape suivante
    const canGoNext = (): boolean => {
        if (step === 1) {
            return !!form.watch("nomEntreprise") && form.watch("nomEntreprise").length >= 2;
        }
        if (step === 2) {
            return !!form.watch("businessType");
        }
        return true;
    };

    const onSubmit = async (data: OnboardingInput) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/onboarding/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
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
    };
}
