import { PLAN_ABONNEMENT } from "@/lib/config/activity-plan-mapping";
import type { BusinessTemplate } from "@/lib/services/business-template.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

type PlanAbonnement = (typeof PLAN_ABONNEMENT)[keyof typeof PLAN_ABONNEMENT];

const STORAGE_KEY = "onboarding_progress";
const TOTAL_STEPS = 2;

/**
 * Schema simplifié pour l'onboarding en 2 étapes.
 * Les champs non-essentiels (SIRET, adresse, etc.) sont déplacés vers les paramètres.
 */
const onboardingSchema = z.object({
    nomEntreprise: z
        .string()
        .min(2, "Le nom doit contenir au moins 2 caractères"),
    businessType: z.string().min(1, "Veuillez sélectionner un type d'activité"),
    selectedPlan: z.enum(["FREE", "STARTER", "PRO", "ENTERPRISE"]).optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

interface StoredProgress {
    nomEntreprise: string;
    businessType: string;
    selectedPlan: PlanAbonnement | null;
    step: number;
}

/**
 * Récupère les données sauvegardées depuis localStorage (côté client uniquement)
 */
function getStoredProgress(): StoredProgress | null {
    if (typeof window === "undefined") return null;
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved) as StoredProgress;
        }
    } catch {
        // Ignorer les erreurs de parsing
    }
    return null;
}

export interface OnboardingPageHandlers {
    form: ReturnType<typeof useForm<OnboardingInput>>;
    isLoading: boolean;
    error: string | null;
    onSubmit: (data: OnboardingInput, billingPeriod?: "monthly" | "yearly") => Promise<void>;
    step: number;
    totalSteps: number;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    canGoNext: boolean;
    handleNext: (selectedTemplate?: BusinessTemplate | null) => void;
    selectedPlan: PlanAbonnement | null;
    setSelectedPlan: (plan: PlanAbonnement | null) => void;
    progress: number;
}

/**
 * Hook principal pour gérer l'onboarding.
 * - 2 étapes : Entreprise + Business Type → Plan
 * - Auto-save dans localStorage
 * - FREE sélectionné par défaut
 */
export function useOnboardingPage(): OnboardingPageHandlers {
    const { data: session, update } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialisation lazy depuis localStorage pour éviter setState dans useEffect
    const [step, setStep] = useState(() => {
        const stored = getStoredProgress();
        return stored?.step && stored.step <= TOTAL_STEPS ? stored.step : 1;
    });
    const [selectedPlan, setSelectedPlan] = useState<PlanAbonnement | null>(() => {
        const stored = getStoredProgress();
        return stored?.selectedPlan || "FREE";
    });

    // Récupérer les valeurs initiales pour le formulaire (une seule fois)
    const initialStored = useMemo(() => getStoredProgress(), []);

    const form = useForm<OnboardingInput>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            nomEntreprise: initialStored?.nomEntreprise || "",
            businessType: initialStored?.businessType || "",
            selectedPlan: initialStored?.selectedPlan || "FREE",
        },
    });

    // useWatch pour éviter les re-renders inutiles (au lieu de form.watch dans les deps)
    const watchedNomEntreprise = useWatch({ control: form.control, name: "nomEntreprise" });
    const watchedBusinessType = useWatch({ control: form.control, name: "businessType" });

    // Mettre à jour le nom depuis la session si pas de données sauvegardées (une seule fois)
    const hasSetNameFromSession = useMemo(() => {
        if (typeof window === "undefined") return false;
        // Si pas de données sauvegardées et que la session a un nom, on va l'utiliser
        return !initialStored && !!session?.user?.name;
    }, [initialStored, session?.user?.name]);

    // Appliquer le nom de la session au formulaire
    useEffect(() => {
        if (hasSetNameFromSession && session?.user?.name) {
            form.setValue("nomEntreprise", session.user.name);
        }
    }, [hasSetNameFromSession, session?.user?.name, form]);

    // Sauvegarder automatiquement dans localStorage
    const saveProgress = useCallback(() => {
        if (typeof window === "undefined") return;

        const data: StoredProgress = {
            nomEntreprise: form.getValues("nomEntreprise"),
            businessType: form.getValues("businessType"),
            selectedPlan,
            step,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [form, selectedPlan, step]);

    // Sauvegarder à chaque changement
    useEffect(() => {
        saveProgress();
    }, [
        saveProgress,
        step,
        selectedPlan,
        watchedNomEntreprise,
        watchedBusinessType,
    ]);

    // Effacer le localStorage après complétion
    const clearProgress = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    const nextStep = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    // Calcul du progrès (0 à 100)
    const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

    // Vérifier si on peut passer à l'étape suivante (utilise useWatch pour éviter re-renders)
    const canGoNext = useMemo((): boolean => {
        if (step === 1) {
            return (
                !!watchedNomEntreprise &&
                watchedNomEntreprise.length >= 2 &&
                !!watchedBusinessType
            );
        }
        // Step 2 : on peut toujours continuer (FREE par défaut)
        return true;
    }, [step, watchedNomEntreprise, watchedBusinessType]);

    const onSubmit = async (data: OnboardingInput, billingPeriod: "monthly" | "yearly" = "monthly") => {
        setIsLoading(true);
        setError(null);

        try {
            const payload = {
                nomEntreprise: data.nomEntreprise,
                businessType: data.businessType,
                selectedPlan: selectedPlan || "FREE",
                billingPeriod,
            };

            const response = await fetch("/api/onboarding/checkout", {
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

            // Effacer la progression sauvegardée
            clearProgress();

            if (result.requiresPayment && result.checkoutUrl) {
                // Ouvrir Stripe Checkout dans un nouvel onglet (sécurisé)
                // noopener et noreferrer empêchent les attaques de type tabnabbing
                window.open(result.checkoutUrl, "_blank", "noopener,noreferrer");
                setIsLoading(false);
                return;
            }

            // Plan FREE : pas de paiement requis
            await update();
            window.location.replace("/dashboard");
        } catch {
            setError("Une erreur est survenue");
            setIsLoading(false);
        }
    };

    const handleNext = (selectedTemplate?: BusinessTemplate | null) => {
        if (step === 1 && canGoNext && selectedTemplate) {
            nextStep();
        }
    };

    return {
        form,
        isLoading,
        error,
        onSubmit,
        step,
        totalSteps: TOTAL_STEPS,
        setStep,
        nextStep,
        prevStep,
        canGoNext,
        handleNext,
        selectedPlan,
        setSelectedPlan,
        progress,
    };
}
