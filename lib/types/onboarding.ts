/**
 * Types pour le processus d'onboarding
 */

import { BusinessType } from "@/lib/types/business";
import { PlanAbonnement } from "@prisma/client";

export interface OnboardingStep {
    number: number;
    title: string;
    description: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        number: 1,
        title: "Votre entreprise",
        description: "Informations de base",
    },
    {
        number: 2,
        title: "Type d'activité",
        description: "Personnalisation",
    },
    {
        number: 3,
        title: "Votre plan",
        description: "Sélection du plan",
    },
    {
        number: 4,
        title: "Finalisation",
        description: "Informations complémentaires",
    },
];

export interface OnboardingData {
    nomEntreprise: string;
    businessType: BusinessType | null;
    selectedPlan: PlanAbonnement | null;
    secteur?: string;
    siret?: string;
    adresse?: string;
    telephone?: string;
}
