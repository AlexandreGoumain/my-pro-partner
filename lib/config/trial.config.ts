import { PLAN_ABONNEMENT } from "./activity-plan-mapping";

type PlanAbonnement = (typeof PLAN_ABONNEMENT)[keyof typeof PLAN_ABONNEMENT];

/**
 * Configuration du système de période d'essai (trial)
 */

// Constantes
const DEFAULT_TRIAL_DAYS = 14;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Durées de trial disponibles par plan (en jours)
 */
export const TRIAL_DURATIONS: Record<PlanAbonnement, number> = {
    [PLAN_ABONNEMENT.FREE]: 0, // Pas de trial pour FREE
    [PLAN_ABONNEMENT.STARTER]: DEFAULT_TRIAL_DAYS,
    [PLAN_ABONNEMENT.PRO]: DEFAULT_TRIAL_DAYS,
    [PLAN_ABONNEMENT.ENTERPRISE]: DEFAULT_TRIAL_DAYS,
};

/**
 * Définit si un plan peut avoir un trial
 */
export const TRIAL_ENABLED: Record<PlanAbonnement, boolean> = {
    [PLAN_ABONNEMENT.FREE]: false,
    [PLAN_ABONNEMENT.STARTER]: true,
    [PLAN_ABONNEMENT.PRO]: true,
    [PLAN_ABONNEMENT.ENTERPRISE]: true,
};

/**
 * Jours avant expiration pour envoyer les rappels
 */
export const TRIAL_REMINDER_DAYS = [7, 3, 1]; // Rappels à J-7, J-3, J-1

/**
 * Helper pour pluraliser "jour(s)"
 */
function pluralizeDays(count: number): string {
    return `${count} jour${count > 1 ? "s" : ""}`;
}

/**
 * Configuration des messages de trial
 */
export const TRIAL_MESSAGES = {
    /** Message de bannière pendant le trial */
    activeBanner: (daysLeft: number, planName: string) => {
        if (daysLeft === 1) {
            return `Dernier jour de votre essai ${planName}. Profitez-en pour explorer toutes les fonctionnalités !`;
        }
        if (daysLeft <= 3) {
            return `Il vous reste ${pluralizeDays(daysLeft)} d'essai ${planName}. Pensez à upgrader pour conserver ces fonctionnalités.`;
        }
        return `Essai ${planName} actif - ${pluralizeDays(daysLeft)} restants`;
    },

    /** Message d'activation du trial */
    activated: (planName: string, days: number) =>
        `Votre essai ${planName} de ${pluralizeDays(days)} a démarré ! Explorez toutes les fonctionnalités sans engagement.`,

    /** Message d'expiration imminente (3 jours avant) */
    expiring: (planName: string, daysLeft: number) =>
        `Votre essai ${planName} expire dans ${pluralizeDays(daysLeft)}. Upgrader maintenant pour conserver vos fonctionnalités avancées.`,

    /** Message d'expiration (dernier jour) */
    expiringToday: (planName: string) =>
        `Votre essai ${planName} expire aujourd'hui ! Upgrader dès maintenant pour ne rien perdre.`,

    /** Message après expiration */
    expired: (planName: string) =>
        `Votre essai ${planName} a expiré. Vous êtes maintenant sur le plan FREE avec des fonctionnalités limitées.`,

    /** Message de downgrade automatique */
    downgraded: (fromPlan: string) =>
        `Votre essai ${fromPlan} est terminé. Vous avez été basculé sur le plan FREE. Upgrader pour retrouver vos fonctionnalités.`,
} as const;

/**
 * Configuration des emails de trial
 */
export const TRIAL_EMAILS = {
    /** Sujet : Email de bienvenue trial */
    welcomeSubject: (planName: string) =>
        `Bienvenue dans votre essai ${planName} !`,

    /** Sujet : Rappel expiration à 7 jours */
    reminder7Subject: (planName: string) =>
        `Plus qu'une semaine d'essai ${planName}`,

    /** Sujet : Rappel expiration à 3 jours */
    reminder3Subject: (planName: string) =>
        `Votre essai ${planName} expire dans 3 jours`,

    /** Sujet : Rappel expiration demain */
    reminder1Subject: (planName: string) =>
        `Dernier jour pour profiter de votre essai ${planName}`,

    /** Sujet : Essai expiré */
    expiredSubject: "Votre période d'essai est terminée",
} as const;

/**
 * Features perdues après expiration du trial par plan
 */
export const TRIAL_FEATURES_LOST: Record<
    PlanAbonnement,
    {
        title: string;
        features: string[];
    }
> = {
    [PLAN_ABONNEMENT.FREE]: {
        title: "Aucune feature",
        features: [],
    },
    [PLAN_ABONNEMENT.STARTER]: {
        title: "Fonctionnalités que vous allez perdre",
        features: [
            "Gestion stock avancée avec alertes",
            "Champs personnalisés métier",
            "Programme de fidélité évolué",
            "3 utilisateurs simultanés",
            "Limite clients : 500 → 50",
            "Limite produits : 200 → 50",
            "Limite documents : 100/mois → 20/mois",
            "Assistant IA (100 questions/mois)",
        ],
    },
    [PLAN_ABONNEMENT.PRO]: {
        title: "Fonctionnalités que vous allez perdre",
        features: [
            "Assistant IA illimité",
            "API REST et Webhooks",
            "Analytics avancées avec prédictions",
            "Exports comptables automatiques",
            "10 utilisateurs simultanés",
            "Gestion multi-emplacements",
            "Support prioritaire",
            "Limite clients : illimité → 50",
            "Limite produits : illimité → 50",
            "Limite documents : illimité → 20/mois",
        ],
    },
    [PLAN_ABONNEMENT.ENTERPRISE]: {
        title: "Fonctionnalités que vous allez perdre",
        features: [
            "Tout illimité (clients, produits, documents, utilisateurs)",
            "White-label et personnalisation",
            "Support 24/7 dédié",
            "SLA garantis",
            "Formation équipe incluse",
            "Développements sur mesure",
            "API premium avec rate limits élevés",
        ],
    },
};

/**
 * Configuration du comportement après expiration
 */
export const TRIAL_EXPIRATION_BEHAVIOR = {
    /** Downgrade automatique vers FREE */
    autoDowngradeToFree: true,

    /** Envoyer email de notification d'expiration */
    sendExpirationEmail: true,

    /** Envoyer notifications in-app */
    showExpirationNotification: true,

    /** Période de grâce après expiration (jours) */
    gracePeriodDays: 0, // Pas de période de grâce

    /** Permet de réactiver le trial une fois expiré */
    allowTrialReactivation: false,
};

/**
 * Récupère la durée de trial pour un plan donné
 */
export function getTrialDuration(plan: PlanAbonnement): number {
    return TRIAL_DURATIONS[plan] || 0;
}

/**
 * Vérifie si un plan peut avoir un trial
 */
export function canHaveTrial(plan: PlanAbonnement): boolean {
    return TRIAL_ENABLED[plan] || false;
}

/**
 * Calcule la date d'expiration du trial
 */
export function calculateTrialExpiration(
    startDate: Date,
    plan: PlanAbonnement
): Date {
    const duration = getTrialDuration(plan);
    const expirationDate = new Date(startDate);
    expirationDate.setDate(expirationDate.getDate() + duration);
    return expirationDate;
}

/**
 * Calcule le nombre de jours restants dans le trial
 */
export function getDaysLeftInTrial(expirationDate: Date): number {
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / MS_PER_DAY);
    return Math.max(0, diffDays);
}

/**
 * Vérifie si le trial est expiré
 */
export function isTrialExpired(expirationDate: Date): boolean {
    return new Date() > expirationDate;
}

/**
 * Vérifie si un rappel doit être envoyé
 */
export function shouldSendReminder(daysLeft: number): boolean {
    return TRIAL_REMINDER_DAYS.includes(daysLeft);
}

/**
 * Récupère le message approprié selon les jours restants
 */
export function getTrialMessage(
    daysLeft: number,
    planName: string,
    expired: boolean = false
): string {
    if (expired) {
        return TRIAL_MESSAGES.expired(planName);
    }

    if (daysLeft === 0) {
        return TRIAL_MESSAGES.expiringToday(planName);
    }

    if (daysLeft <= 3) {
        return TRIAL_MESSAGES.expiring(planName, daysLeft);
    }

    return TRIAL_MESSAGES.activeBanner(daysLeft, planName);
}

/**
 * Récupère les features qui seront perdues après expiration
 */
export function getFeaturesLostAfterTrial(plan: PlanAbonnement): string[] {
    return TRIAL_FEATURES_LOST[plan]?.features || [];
}

/**
 * Type pour le statut d'un trial
 */
export interface TrialStatus {
    active: boolean;
    plan: PlanAbonnement | null;
    startDate: Date | null;
    expirationDate: Date | null;
    daysLeft: number;
    expired: boolean;
    message: string;
}

/**
 * Calcule le statut complet d'un trial
 */
export function getTrialStatus(
    trialActive: boolean,
    trialPlan: PlanAbonnement | null,
    trialStartDate: Date | null,
    trialExpiresAt: Date | null
): TrialStatus {
    if (!trialActive || !trialPlan || !trialExpiresAt) {
        return {
            active: false,
            plan: null,
            startDate: null,
            expirationDate: null,
            daysLeft: 0,
            expired: false,
            message: "",
        };
    }

    const daysLeft = getDaysLeftInTrial(trialExpiresAt);
    const expired = isTrialExpired(trialExpiresAt);
    const planName = trialPlan.toString();
    const message = getTrialMessage(daysLeft, planName, expired);

    return {
        active: !expired,
        plan: trialPlan,
        startDate: trialStartDate,
        expirationDate: trialExpiresAt,
        daysLeft,
        expired,
        message,
    };
}
