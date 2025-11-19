import {
    getTrialPlanForActivity,
    PLAN_ABONNEMENT,
} from "@/lib/config/activity-plan-mapping";
import {
    calculateTrialExpiration,
    getTrialStatus,
} from "@/lib/config/trial.config";
import { prisma } from "@/lib/prisma";
import { BusinessType } from "@/lib/services/business-template.service";

// Constantes
const ERROR_MESSAGES = {
    ENTREPRISE_NOT_FOUND: "Entreprise not found",
    TRIAL_INFO_NOT_FOUND: "Trial information could not be determined for this business type",
} as const;

const TRIAL_INACTIVE_DATA = {
    trialActive: false,
    trialPlan: null,
    trialStartDate: null,
    trialExpiresAt: null,
} as const;

type PlanAbonnement = (typeof PLAN_ABONNEMENT)[keyof typeof PLAN_ABONNEMENT];

interface TrialData {
    trialActive: boolean;
    trialPlan: PlanAbonnement | null;
    trialStartDate: Date | null;
    trialExpiresAt: Date | null;
}

/**
 * Prépare les données de trial en fonction de l'activation
 * @param shouldActivateTrial - Si le trial doit être activé
 * @param businessType - Type d'activité métier
 * @returns Données de trial à stocker en base
 */
export function prepareTrialData(
    shouldActivateTrial: boolean,
    businessType: BusinessType
): TrialData {
    if (!shouldActivateTrial) {
        return TRIAL_INACTIVE_DATA;
    }

    const trialInfo = getTrialPlanForActivity(businessType);

    if (!trialInfo) {
        throw new Error(ERROR_MESSAGES.TRIAL_INFO_NOT_FOUND);
    }

    const startDate = new Date();

    return {
        trialActive: true,
        trialPlan: trialInfo.plan,
        trialStartDate: startDate,
        trialExpiresAt: calculateTrialExpiration(startDate, trialInfo.plan),
    };
}

/**
 * Récupère le statut du trial pour une entreprise et désactive automatiquement si expiré
 * @param entrepriseId - ID de l'entreprise
 * @returns Statut du trial et plan actuel
 */
export async function getAndUpdateTrialStatus(entrepriseId: string) {
    // Récupérer l'entreprise avec ses infos de trial
    const entreprise = await prisma.entreprise.findUnique({
        where: { id: entrepriseId },
        select: {
            trialActive: true,
            trialPlan: true,
            trialStartDate: true,
            trialExpiresAt: true,
            plan: true,
        },
    });

    if (!entreprise) {
        throw new Error(ERROR_MESSAGES.ENTREPRISE_NOT_FOUND);
    }

    // Calculer le statut du trial
    const trialStatus = getTrialStatus(
        entreprise.trialActive,
        entreprise.trialPlan,
        entreprise.trialStartDate,
        entreprise.trialExpiresAt
    );

    // Si le trial est expiré mais marqué actif, le désactiver
    if (entreprise.trialActive && trialStatus.expired) {
        await prisma.entreprise.update({
            where: { id: entrepriseId },
            data: {
                trialActive: false,
            },
        });
    }

    return {
        trial: trialStatus,
        currentPlan: entreprise.plan,
    };
}
