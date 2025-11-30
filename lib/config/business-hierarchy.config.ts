/**
 * Configuration complète de la hiérarchie Business
 * Catégories → Types → Capabilities
 */

import type { BusinessType } from "@/lib/types/business";
import type { BusinessCategory } from "@/lib/types/business-category";
import type {
    BusinessTypeConfig,
    CategoryConfig,
} from "@/lib/types/business-hierarchy";
import {
    BUSINESS_TYPE_DEFAULT_CAPABILITIES,
    CATEGORY_TO_BUSINESS_TYPES,
} from "@/lib/types/business-hierarchy";
import {
    BASE_CAPABILITIES,
    CATEGORY_SPECIFIC_CAPABILITIES,
} from "@/lib/types/capability";

/**
 * Configuration complète des catégories
 */
export const CATEGORY_CONFIGS: Record<BusinessCategory, CategoryConfig> = {
    INTERVENTION: {
        category: "INTERVENTION",
        label: "Artisanat & Intervention",
        icon: "Wrench",
        description: "Activités d'intervention à domicile ou en atelier",
        availableCapabilities: [
            ...CATEGORY_SPECIFIC_CAPABILITIES.INTERVENTION,
            ...BASE_CAPABILITIES,
        ],
        businessTypes: CATEGORY_TO_BUSINESS_TYPES.INTERVENTION,
    },
    POINT_DE_VENTE: {
        category: "POINT_DE_VENTE",
        label: "Points de Vente",
        icon: "Store",
        description: "Commerces avec encaissement sur place",
        availableCapabilities: [
            ...CATEGORY_SPECIFIC_CAPABILITIES.POINT_DE_VENTE,
            ...BASE_CAPABILITIES,
        ],
        businessTypes: CATEGORY_TO_BUSINESS_TYPES.POINT_DE_VENTE,
    },
    RENDEZ_VOUS: {
        category: "RENDEZ_VOUS",
        label: "Rendez-vous & Services",
        icon: "Calendar",
        description: "Activités sur rendez-vous",
        availableCapabilities: [
            ...CATEGORY_SPECIFIC_CAPABILITIES.RENDEZ_VOUS,
            ...BASE_CAPABILITIES,
        ],
        businessTypes: CATEGORY_TO_BUSINESS_TYPES.RENDEZ_VOUS,
    },
    SERVICE_INTELLECTUEL: {
        category: "SERVICE_INTELLECTUEL",
        label: "Services Professionnels",
        icon: "Briefcase",
        description: "Prestations intellectuelles et conseil",
        availableCapabilities: [
            ...CATEGORY_SPECIFIC_CAPABILITIES.SERVICE_INTELLECTUEL,
            ...BASE_CAPABILITIES,
        ],
        businessTypes: CATEGORY_TO_BUSINESS_TYPES.SERVICE_INTELLECTUEL,
    },
    COMMERCE: {
        category: "COMMERCE",
        label: "Commerce",
        icon: "ShoppingCart",
        description: "Commerce de détail",
        availableCapabilities: [
            ...CATEGORY_SPECIFIC_CAPABILITIES.COMMERCE,
            ...BASE_CAPABILITIES,
        ],
        businessTypes: CATEGORY_TO_BUSINESS_TYPES.COMMERCE,
    },
    IMMOBILIER: {
        category: "IMMOBILIER",
        label: "Immobilier",
        icon: "Home",
        description: "Gestion immobilière",
        availableCapabilities: [
            ...CATEGORY_SPECIFIC_CAPABILITIES.IMMOBILIER,
            ...BASE_CAPABILITIES,
        ],
        businessTypes: CATEGORY_TO_BUSINESS_TYPES.IMMOBILIER,
    },
    GENERAL: {
        category: "GENERAL",
        label: "Général",
        icon: "Building2",
        description: "Configuration standard personnalisable",
        availableCapabilities: [...BASE_CAPABILITIES],
        businessTypes: CATEGORY_TO_BUSINESS_TYPES.GENERAL,
    },
};

/**
 * Configuration complète de chaque BusinessType
 */
export const BUSINESS_TYPE_CONFIGS: Record<BusinessType, BusinessTypeConfig> = {
    // === INTERVENTION ===
    PLOMBERIE: {
        type: "PLOMBERIE",
        category: "INTERVENTION",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.PLOMBERIE,
        label: "Plomberie",
        icon: "Wrench",
        description: "Plomberie, chauffagiste, sanitaire",
        color: "#3B82F6",
    },
    ELECTRICITE: {
        type: "ELECTRICITE",
        category: "INTERVENTION",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.ELECTRICITE,
        label: "Électricité",
        icon: "Zap",
        description: "Électricien, domotique, alarmes",
        color: "#F59E0B",
    },
    CHAUFFAGE: {
        type: "CHAUFFAGE",
        category: "INTERVENTION",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.CHAUFFAGE,
        label: "Chauffage",
        icon: "Flame",
        description: "Chauffagiste, climatisation, pompes à chaleur",
        color: "#EF4444",
    },
    MENUISERIE: {
        type: "MENUISERIE",
        category: "INTERVENTION",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.MENUISERIE,
        label: "Menuiserie",
        icon: "Hammer",
        description: "Menuisier, ébéniste, charpentier",
        color: "#92400E",
    },
    PEINTURE: {
        type: "PEINTURE",
        category: "INTERVENTION",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.PEINTURE,
        label: "Peinture",
        icon: "PaintbrushIcon",
        description: "Peintre, décorateur, ravalement",
        color: "#8B5CF6",
    },
    MACONNERIE: {
        type: "MACONNERIE",
        category: "INTERVENTION",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.MACONNERIE,
        label: "Maçonnerie",
        icon: "HardHat",
        description: "Maçon, gros œuvre, terrassement",
        color: "#6B7280",
    },
    GARAGE: {
        type: "GARAGE",
        category: "INTERVENTION",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.GARAGE,
        label: "Garage Auto",
        icon: "Car",
        description: "Réparation automobile, entretien véhicules",
        color: "#1F2937",
    },
    INFORMATIQUE: {
        type: "INFORMATIQUE",
        category: "INTERVENTION",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.INFORMATIQUE,
        label: "Informatique",
        icon: "Monitor",
        description: "Boutique informatique, réparation PC/Mac",
        color: "#06B6D4",
    },

    // === POINT_DE_VENTE ===
    RESTAURATION: {
        type: "RESTAURATION",
        category: "POINT_DE_VENTE",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.RESTAURATION,
        label: "Restauration",
        icon: "UtensilsCrossed",
        description: "Restaurant, brasserie, café",
        color: "#DC2626",
    },
    BOULANGERIE: {
        type: "BOULANGERIE",
        category: "POINT_DE_VENTE",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.BOULANGERIE,
        label: "Boulangerie",
        icon: "Croissant",
        description: "Boulangerie, pâtisserie, traiteur",
        color: "#D97706",
    },

    // === RENDEZ_VOUS ===
    COIFFURE: {
        type: "COIFFURE",
        category: "RENDEZ_VOUS",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.COIFFURE,
        label: "Coiffure",
        icon: "Scissors",
        description: "Salon de coiffure, barbier",
        color: "#EC4899",
    },
    ESTHETIQUE: {
        type: "ESTHETIQUE",
        category: "RENDEZ_VOUS",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.ESTHETIQUE,
        label: "Esthétique",
        icon: "Sparkles",
        description: "Institut de beauté, spa, onglerie",
        color: "#F472B6",
    },
    FITNESS: {
        type: "FITNESS",
        category: "RENDEZ_VOUS",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.FITNESS,
        label: "Fitness",
        icon: "Dumbbell",
        description: "Coach sportif, salle de sport, yoga",
        color: "#10B981",
    },
    SANTE: {
        type: "SANTE",
        category: "RENDEZ_VOUS",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.SANTE,
        label: "Santé",
        icon: "Heart",
        description: "Praticien de santé, kinésithérapeute, ostéopathe",
        color: "#EF4444",
    },

    // === SERVICE_INTELLECTUEL ===
    CONSULTING: {
        type: "CONSULTING",
        category: "SERVICE_INTELLECTUEL",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.CONSULTING,
        label: "Consulting",
        icon: "BriefcaseIcon",
        description: "Consultant, conseil aux entreprises",
        color: "#6366F1",
    },
    COMPTABILITE: {
        type: "COMPTABILITE",
        category: "SERVICE_INTELLECTUEL",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.COMPTABILITE,
        label: "Comptabilité",
        icon: "Calculator",
        description: "Expert-comptable, gestion",
        color: "#059669",
    },
    JURIDIQUE: {
        type: "JURIDIQUE",
        category: "SERVICE_INTELLECTUEL",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.JURIDIQUE,
        label: "Juridique",
        icon: "Scale",
        description: "Avocat, juriste, notaire",
        color: "#7C3AED",
    },

    // === COMMERCE ===
    COMMERCE_DETAIL: {
        type: "COMMERCE_DETAIL",
        category: "COMMERCE",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.COMMERCE_DETAIL,
        label: "Commerce de détail",
        icon: "ShoppingCart",
        description: "Boutique, magasin, e-commerce",
        color: "#F97316",
    },

    // === IMMOBILIER ===
    AGENT_IMMOBILIER: {
        type: "AGENT_IMMOBILIER",
        category: "IMMOBILIER",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.AGENT_IMMOBILIER,
        label: "Agent immobilier",
        icon: "Home",
        description: "Transaction immobilière, mandats de vente et location",
        color: "#0284C7",
    },
    GESTION_LOCATIVE: {
        type: "GESTION_LOCATIVE",
        category: "IMMOBILIER",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.GESTION_LOCATIVE,
        label: "Gestion locative",
        icon: "Building2",
        description: "Administration de biens, gestion des baux et loyers",
        color: "#059669",
    },
    SYNDIC_COPROPRIETE: {
        type: "SYNDIC_COPROPRIETE",
        category: "IMMOBILIER",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.SYNDIC_COPROPRIETE,
        label: "Syndic de copropriété",
        icon: "Landmark",
        description: "Gestion de copropriétés, assemblées générales",
        color: "#7C3AED",
    },

    // === GENERAL ===
    GENERAL: {
        type: "GENERAL",
        category: "GENERAL",
        defaultCapabilities: BUSINESS_TYPE_DEFAULT_CAPABILITIES.GENERAL,
        label: "Général",
        icon: "Building2",
        description: "Configuration standard personnalisable",
        color: "#64748B",
    },
};
