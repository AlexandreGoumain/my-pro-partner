import { BUSINESS_TYPES } from "@/lib/types/business";

// Types dérivés localement pour éviter les imports Prisma dans les client components
type BusinessType = (typeof BUSINESS_TYPES)[number];

// Constante des plans d'abonnement (même valeurs que l'enum Prisma)
export const PLAN_ABONNEMENT = {
    FREE: "FREE",
    STARTER: "STARTER",
    PRO: "PRO",
    ENTERPRISE: "ENTERPRISE",
} as const;

type PlanAbonnement = (typeof PLAN_ABONNEMENT)[keyof typeof PLAN_ABONNEMENT];

// Constantes partagées
const DEFAULT_TRIAL_DAYS = 14;

/**
 * Classification de complexité des activités métier
 */
export enum ActivityComplexity {
    SIMPLE = "SIMPLE", // FREE suffit au démarrage
    INTERMEDIATE = "INTERMEDIATE", // STARTER recommandé
    COMPLEX = "COMPLEX", // PRO recommandé
}

/**
 * Descriptions des niveaux de complexité pour l'affichage
 */
export const COMPLEXITY_DESCRIPTIONS: Record<ActivityComplexity, string> = {
    [ActivityComplexity.SIMPLE]:
        "Un plan adapté aux besoins essentiels de votre activité.",
    [ActivityComplexity.INTERMEDIATE]:
        "Un plan équilibré avec les fonctionnalités dont vous avez besoin.",
    [ActivityComplexity.COMPLEX]:
        "Un plan complet pour gérer tous les aspects de votre activité.",
};

/**
 * Configuration d'une recommandation de plan par activité
 */
export interface ActivityPlanRecommendation {
    /** Niveau de complexité de l'activité */
    complexity: ActivityComplexity;

    /** Plan recommandé pour cette activité */
    recommendedPlan: PlanAbonnement;

    /** Plan minimum viable (optionnel) */
    minimumPlan?: PlanAbonnement;

    /** Active un trial automatique si l'utilisateur choisit FREE */
    autoTrialIfFree: boolean;

    /** Durée du trial en jours */
    trialDays: number;

    /** Plan du trial automatique */
    trialPlan: PlanAbonnement;

    /** Raisons de la recommandation (features clés) */
    reasons: string[];

    /** Limitations critiques en FREE pour cette activité */
    freeLimitations: string[];

    /** Features essentielles pour cette activité */
    essentialFeatures: string[];
}

/**
 * Mapping complet : BusinessType → Recommandation de plan
 */
export const ACTIVITY_PLAN_MAPPING: Record<
    BusinessType,
    ActivityPlanRecommendation
> = {
    // ===== ACTIVITÉS SIMPLES (FREE viable) =====

    GENERAL: {
        complexity: ActivityComplexity.SIMPLE,
        recommendedPlan: PLAN_ABONNEMENT.FREE,
        autoTrialIfFree: false,
        trialDays: 0,
        trialPlan: PLAN_ABONNEMENT.FREE,
        reasons: [
            "Activité générique adaptée au plan gratuit",
            "Besoins standards couverts par FREE",
        ],
        freeLimitations: [
            "Limité à 50 clients",
            "20 documents par mois",
            "1 utilisateur uniquement",
        ],
        essentialFeatures: [
            "Devis et factures",
            "Gestion clients",
            "Suivi basique",
        ],
    },

    CONSULTING: {
        complexity: ActivityComplexity.SIMPLE,
        recommendedPlan: PLAN_ABONNEMENT.STARTER,
        autoTrialIfFree: false,
        trialDays: 0,
        trialPlan: PLAN_ABONNEMENT.STARTER,
        reasons: [
            "Gestion de missions et projets",
            "Suivi du temps passé par client",
        ],
        freeLimitations: [
            "Pas de suivi temps avancé",
            "Limité à 50 clients",
            "Pas d'assistant IA pour propositions",
        ],
        essentialFeatures: [
            "Devis et factures",
            "Gestion missions",
            "Suivi du temps",
        ],
    },

    INFORMATIQUE: {
        complexity: ActivityComplexity.SIMPLE,
        recommendedPlan: PLAN_ABONNEMENT.PRO,
        autoTrialIfFree: false,
        trialDays: 0,
        trialPlan: PLAN_ABONNEMENT.PRO,
        reasons: [
            "Intégrations API souvent nécessaires",
            "Gestion de tickets et support",
            "Documentation technique",
        ],
        freeLimitations: [
            "Pas d'API REST",
            "Pas de webhooks",
            "Pas de gestion tickets avancée",
        ],
        essentialFeatures: [
            "API REST",
            "Webhooks",
            "Gestion tickets",
            "Assistant IA",
        ],
    },

    COMMERCE_DETAIL: {
        complexity: ActivityComplexity.SIMPLE,
        recommendedPlan: PLAN_ABONNEMENT.STARTER,
        autoTrialIfFree: false,
        trialDays: 0,
        trialPlan: PLAN_ABONNEMENT.STARTER,
        reasons: [
            "Gestion stock importante",
            "Programme de fidélité pour clients réguliers",
            "Catégories produits multiples",
        ],
        freeLimitations: [
            "Stock limité à 50 produits",
            "Pas de programme fidélité avancé",
            "Pas de gestion multi-catégories",
        ],
        essentialFeatures: [
            "Gestion stock avancée",
            "Programme fidélité",
            "Catégories illimitées",
        ],
    },

    // ===== ACTIVITÉS INTERMÉDIAIRES (STARTER recommandé) =====

    PLOMBERIE: {
        complexity: ActivityComplexity.INTERMEDIATE,
        recommendedPlan: PLAN_ABONNEMENT.STARTER,
        autoTrialIfFree: true,
        trialDays: DEFAULT_TRIAL_DAYS,
        trialPlan: PLAN_ABONNEMENT.STARTER,
        reasons: [
            "Gestion des interventions et dépannages",
            "Suivi des garanties et pièces détachées",
            "Stock de matériel important",
        ],
        freeLimitations: [
            "Pas de champs personnalisés (garanties, urgence)",
            "Stock limité à 50 pièces",
            "Pas de suivi interventions avancé",
        ],
        essentialFeatures: [
            "Champs personnalisés (garantie, type intervention)",
            "Gestion stock pièces",
            "Suivi interventions",
        ],
    },

    ELECTRICITE: {
        complexity: ActivityComplexity.INTERMEDIATE,
        recommendedPlan: PLAN_ABONNEMENT.STARTER,
        autoTrialIfFree: true,
        trialDays: DEFAULT_TRIAL_DAYS,
        trialPlan: PLAN_ABONNEMENT.STARTER,
        reasons: [
            "Certifications et normes obligatoires",
            "Gestion du matériel électrique",
            "Suivi des chantiers",
        ],
        freeLimitations: [
            "Pas de champs certifications",
            "Stock limité",
            "Pas de suivi chantiers multi-phases",
        ],
        essentialFeatures: [
            "Champs personnalisés (certifications, conformité)",
            "Gestion stock",
            "Suivi chantiers",
        ],
    },

    CHAUFFAGE: {
        complexity: ActivityComplexity.INTERMEDIATE,
        recommendedPlan: PLAN_ABONNEMENT.STARTER,
        autoTrialIfFree: true,
        trialDays: DEFAULT_TRIAL_DAYS,
        trialPlan: PLAN_ABONNEMENT.STARTER,
        reasons: [
            "Contrats de maintenance annuels",
            "Gestion des interventions saisonnières",
            "Stock de pièces détachées",
        ],
        freeLimitations: [
            "Pas de gestion contrats maintenance",
            "Stock limité",
            "Pas de planification interventions",
        ],
        essentialFeatures: [
            "Contrats de maintenance",
            "Gestion stock",
            "Planning interventions",
        ],
    },

    MENUISERIE: {
        complexity: ActivityComplexity.INTERMEDIATE,
        recommendedPlan: PLAN_ABONNEMENT.STARTER,
        autoTrialIfFree: true,
        trialDays: DEFAULT_TRIAL_DAYS,
        trialPlan: PLAN_ABONNEMENT.STARTER,
        reasons: [
            "Projets sur mesure et devis détaillés",
            "Gestion du bois et matériaux",
            "Suivi de fabrication",
        ],
        freeLimitations: [
            "Devis simplifiés uniquement",
            "Pas de suivi fabrication",
            "Stock matériaux limité",
        ],
        essentialFeatures: [
            "Devis détaillés sur mesure",
            "Suivi fabrication",
            "Gestion stock matériaux",
        ],
    },

    PEINTURE: {
        complexity: ActivityComplexity.INTERMEDIATE,
        recommendedPlan: PLAN_ABONNEMENT.STARTER,
        autoTrialIfFree: true,
        trialDays: DEFAULT_TRIAL_DAYS,
        trialPlan: PLAN_ABONNEMENT.STARTER,
        reasons: [
            "Gestion des chantiers multi-jours",
            "Stock de peintures et fournitures",
            "Suivi des surfaces et métrés",
        ],
        freeLimitations: [
            "Pas de calculs automatiques de surfaces",
            "Stock limité",
            "Pas de suivi chantiers",
        ],
        essentialFeatures: [
            "Calculs surfaces automatiques",
            "Gestion stock peintures",
            "Suivi chantiers",
        ],
    },

    MACONNERIE: {
        complexity: ActivityComplexity.INTERMEDIATE,
        recommendedPlan: PLAN_ABONNEMENT.STARTER,
        autoTrialIfFree: true,
        trialDays: DEFAULT_TRIAL_DAYS,
        trialPlan: PLAN_ABONNEMENT.STARTER,
        reasons: [
            "Chantiers de longue durée",
            "Gestion matériaux importants",
            "Devis complexes avec phases",
        ],
        freeLimitations: [
            "Devis simplifiés",
            "Pas de gestion phases chantier",
            "Stock limité",
        ],
        essentialFeatures: [
            "Devis multi-phases",
            "Suivi chantiers longs",
            "Gestion stock matériaux",
        ],
    },

    COIFFURE: {
        complexity: ActivityComplexity.INTERMEDIATE,
        recommendedPlan: PLAN_ABONNEMENT.STARTER,
        autoTrialIfFree: true,
        trialDays: DEFAULT_TRIAL_DAYS,
        trialPlan: PLAN_ABONNEMENT.STARTER,
        reasons: [
            "Prise de rendez-vous et planning",
            "Programme de fidélité important",
            "Gestion des prestations et produits",
        ],
        freeLimitations: [
            "Pas de planning avancé",
            "Programme fidélité basique",
            "Stock produits limité",
        ],
        essentialFeatures: [
            "Planning rendez-vous",
            "Programme fidélité avancé",
            "Gestion prestations",
        ],
    },

    ESTHETIQUE: {
        complexity: ActivityComplexity.INTERMEDIATE,
        recommendedPlan: PLAN_ABONNEMENT.STARTER,
        autoTrialIfFree: true,
        trialDays: DEFAULT_TRIAL_DAYS,
        trialPlan: PLAN_ABONNEMENT.STARTER,
        reasons: [
            "Gestion rendez-vous et protocoles",
            "Suivi clients et historique soins",
            "Stock de produits cosmétiques",
        ],
        freeLimitations: [
            "Pas de planning avancé",
            "Historique clients limité",
            "Stock produits limité",
        ],
        essentialFeatures: [
            "Planning rendez-vous",
            "Historique soins clients",
            "Gestion stock cosmétiques",
        ],
    },

    BOULANGERIE: {
        complexity: ActivityComplexity.INTERMEDIATE,
        recommendedPlan: PLAN_ABONNEMENT.STARTER,
        autoTrialIfFree: true,
        trialDays: DEFAULT_TRIAL_DAYS,
        trialPlan: PLAN_ABONNEMENT.STARTER,
        reasons: [
            "Gestion production quotidienne",
            "Stock ingrédients et traçabilité",
            "Programme fidélité clients réguliers",
        ],
        freeLimitations: [
            "Pas de gestion production",
            "Stock limité à 50 produits",
            "Pas de traçabilité ingrédients",
        ],
        essentialFeatures: [
            "Gestion production",
            "Traçabilité ingrédients",
            "Programme fidélité",
        ],
    },

    // ===== ACTIVITÉS COMPLEXES (PRO recommandé) =====

    RESTAURATION: {
        complexity: ActivityComplexity.COMPLEX,
        recommendedPlan: PLAN_ABONNEMENT.PRO,
        autoTrialIfFree: true,
        trialDays: DEFAULT_TRIAL_DAYS,
        trialPlan: PLAN_ABONNEMENT.PRO,
        reasons: [
            "Gestion multi-tables et salles",
            "Menus, cartes et allergènes obligatoires",
            "Stock complexe et traçabilité alimentaire",
            "Plusieurs utilisateurs (serveurs, cuisine)",
        ],
        freeLimitations: [
            "Limité à 50 clients (insuffisant pour restaurant)",
            "Pas de gestion tables",
            "Pas de gestion allergènes",
            "20 factures/mois seulement",
            "1 utilisateur uniquement",
        ],
        essentialFeatures: [
            "Gestion multi-tables",
            "Menus et allergènes",
            "Stock avec traçabilité",
            "Multi-utilisateurs",
            "Programme fidélité avancé",
        ],
    },

    FITNESS: {
        complexity: ActivityComplexity.COMPLEX,
        recommendedPlan: PLAN_ABONNEMENT.PRO,
        autoTrialIfFree: true,
        trialDays: DEFAULT_TRIAL_DAYS,
        trialPlan: PLAN_ABONNEMENT.PRO,
        reasons: [
            "Gestion abonnements mensuels récurrents",
            "Planning cours collectifs",
            "Suivi membres et paiements automatiques",
            "Plusieurs coachs/instructeurs",
        ],
        freeLimitations: [
            "Pas de gestion abonnements récurrents",
            "Pas de planning cours",
            "Limité à 50 membres (très insuffisant)",
            "1 utilisateur uniquement",
        ],
        essentialFeatures: [
            "Abonnements récurrents",
            "Planning cours collectifs",
            "Membres illimités",
            "Multi-utilisateurs",
            "Analytics fréquentation",
        ],
    },

    GARAGE: {
        complexity: ActivityComplexity.COMPLEX,
        recommendedPlan: PLAN_ABONNEMENT.PRO,
        autoTrialIfFree: true,
        trialDays: DEFAULT_TRIAL_DAYS,
        trialPlan: PLAN_ABONNEMENT.PRO,
        reasons: [
            "Gestion parc véhicules clients",
            "Stock pièces détachées important",
            "Historique interventions par véhicule",
            "Plusieurs mécaniciens",
        ],
        freeLimitations: [
            "Pas de gestion véhicules avancée",
            "Stock limité à 50 pièces (très insuffisant)",
            "Pas d'historique détaillé",
            "1 utilisateur uniquement",
        ],
        essentialFeatures: [
            "Gestion parc véhicules",
            "Stock pièces illimité",
            "Historique interventions",
            "Multi-utilisateurs",
            "Carnet d'entretien",
        ],
    },

    AGENT_IMMOBILIER: {
        complexity: ActivityComplexity.COMPLEX,
        recommendedPlan: PLAN_ABONNEMENT.PRO,
        autoTrialIfFree: true,
        trialDays: DEFAULT_TRIAL_DAYS,
        trialPlan: PLAN_ABONNEMENT.PRO,
        reasons: [
            "Gestion des mandats et transactions",
            "Diffusion multi-portails (SeLoger, LeBonCoin...)",
            "Pipeline de ventes avec matching acquéreurs",
            "Plusieurs agents négociateurs",
        ],
        freeLimitations: [
            "Limité à 50 biens/clients (très insuffisant)",
            "Pas de diffusion multi-portails",
            "Pas de matching acquéreurs",
            "1 utilisateur uniquement",
        ],
        essentialFeatures: [
            "Mandats et biens illimités",
            "Diffusion multi-portails",
            "Matching acquéreurs",
            "Pipeline transactions",
            "Estimations",
        ],
    },

    GESTION_LOCATIVE: {
        complexity: ActivityComplexity.COMPLEX,
        recommendedPlan: PLAN_ABONNEMENT.PRO,
        autoTrialIfFree: true,
        trialDays: DEFAULT_TRIAL_DAYS,
        trialPlan: PLAN_ABONNEMENT.PRO,
        reasons: [
            "Gestion des baux et loyers mensuels",
            "Suivi des impayés et relances",
            "États des lieux numériques",
            "Révision IRL automatique",
        ],
        freeLimitations: [
            "Limité à 50 baux (très insuffisant)",
            "Pas d'appels de loyers automatiques",
            "Pas de gestion impayés",
            "1 utilisateur uniquement",
        ],
        essentialFeatures: [
            "Baux illimités",
            "Appels de loyers automatiques",
            "Suivi impayés et relances",
            "États des lieux",
            "Révision IRL",
        ],
    },

    SYNDIC_COPROPRIETE: {
        complexity: ActivityComplexity.COMPLEX,
        recommendedPlan: PLAN_ABONNEMENT.PRO,
        autoTrialIfFree: true,
        trialDays: DEFAULT_TRIAL_DAYS,
        trialPlan: PLAN_ABONNEMENT.PRO,
        reasons: [
            "Gestion multi-copropriétés",
            "Assemblées générales et résolutions",
            "Comptabilité copropriété réglementée",
            "Appels de charges et travaux",
        ],
        freeLimitations: [
            "Limité à 50 lots (très insuffisant)",
            "Pas de gestion AG",
            "Pas de comptabilité copro",
            "1 utilisateur uniquement",
        ],
        essentialFeatures: [
            "Copropriétés et lots illimités",
            "Assemblées générales",
            "Comptabilité copropriété",
            "Appels de charges",
            "Conseil syndical",
        ],
    },

    SANTE: {
        complexity: ActivityComplexity.COMPLEX,
        recommendedPlan: PLAN_ABONNEMENT.PRO,
        autoTrialIfFree: true,
        trialDays: DEFAULT_TRIAL_DAYS,
        trialPlan: PLAN_ABONNEMENT.PRO,
        reasons: [
            "Dossiers patients confidentiels et sécurisés",
            "Conformité RGPD santé renforcée",
            "Planning rendez-vous avancé",
            "Facturation tiers-payants complexe",
        ],
        freeLimitations: [
            "Limité à 50 patients (insuffisant)",
            "Pas de dossiers médicaux sécurisés",
            "Pas de gestion tiers-payant",
            "Sécurité basique",
        ],
        essentialFeatures: [
            "Dossiers patients sécurisés",
            "Conformité RGPD santé",
            "Tiers-payant",
            "Planning rendez-vous",
            "Téléconsultations",
        ],
    },

    JURIDIQUE: {
        complexity: ActivityComplexity.COMPLEX,
        recommendedPlan: PLAN_ABONNEMENT.PRO,
        autoTrialIfFree: true,
        trialDays: DEFAULT_TRIAL_DAYS,
        trialPlan: PLAN_ABONNEMENT.PRO,
        reasons: [
            "Gestion dossiers clients complexes",
            "Suivi du temps facturable précis",
            "Documents confidentiels nombreux",
            "Plusieurs collaborateurs",
        ],
        freeLimitations: [
            "Limité à 50 dossiers (insuffisant)",
            "20 documents/mois (très insuffisant)",
            "Pas de suivi temps facturable",
            "1 utilisateur uniquement",
        ],
        essentialFeatures: [
            "Dossiers illimités",
            "Suivi temps facturable",
            "Documents illimités sécurisés",
            "Multi-utilisateurs",
            "Facturation horaire",
        ],
    },

    COMPTABILITE: {
        complexity: ActivityComplexity.COMPLEX,
        recommendedPlan: PLAN_ABONNEMENT.PRO,
        autoTrialIfFree: true,
        trialDays: DEFAULT_TRIAL_DAYS,
        trialPlan: PLAN_ABONNEMENT.PRO,
        reasons: [
            "Gestion portefeuille clients important",
            "Exports comptables et déclarations",
            "Intégrations bancaires et fiscales",
            "Plusieurs collaborateurs",
        ],
        freeLimitations: [
            "Limité à 50 clients (très insuffisant)",
            "Pas d'exports comptables avancés",
            "Pas d'intégrations bancaires",
            "1 utilisateur uniquement",
        ],
        essentialFeatures: [
            "Clients illimités",
            "Exports comptables (FEC, etc.)",
            "Intégrations bancaires",
            "Multi-utilisateurs",
            "API pour logiciels comptables",
        ],
    },
};

/**
 * Récupère la recommandation de plan pour une activité donnée
 */
export function getActivityRecommendation(
    businessType: BusinessType
): ActivityPlanRecommendation {
    return ACTIVITY_PLAN_MAPPING[businessType];
}

/**
 * Détermine si un trial doit être activé automatiquement
 */
export function shouldAutoActivateTrial(
    businessType: BusinessType,
    selectedPlan: PlanAbonnement
): boolean {
    const recommendation = getActivityRecommendation(businessType);
    return (
        selectedPlan === PLAN_ABONNEMENT.FREE && recommendation.autoTrialIfFree
    );
}

/**
 * Récupère les activités par niveau de complexité
 */
export function getActivitiesByComplexity(
    complexity: ActivityComplexity
): BusinessType[] {
    return Object.entries(ACTIVITY_PLAN_MAPPING)
        .filter(([_, config]) => config.complexity === complexity)
        .map(([businessType, _]) => businessType as BusinessType);
}

/**
 * Récupère le plan de trial pour une activité
 */
export function getTrialPlanForActivity(businessType: BusinessType): {
    plan: PlanAbonnement;
    days: number;
} | null {
    const recommendation = getActivityRecommendation(businessType);
    if (!recommendation.autoTrialIfFree) return null;

    return {
        plan: recommendation.trialPlan,
        days: recommendation.trialDays,
    };
}
