/**
 * Types pour le processus d'onboarding
 */

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
    title: "Finalisation",
    description: "Informations complémentaires",
  },
];
