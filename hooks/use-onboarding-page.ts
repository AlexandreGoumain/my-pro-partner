import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const onboardingSchema = z.object({
    nomEntreprise: z
        .string()
        .min(2, "Le nom doit contenir au moins 2 caractères"),
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
}

export function useOnboardingPage(): OnboardingPageHandlers {
    const { data: session, update } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<OnboardingInput>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            nomEntreprise: session?.user?.name || "",
            siret: "",
            adresse: "",
            telephone: "",
        },
    });

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
    };
}
