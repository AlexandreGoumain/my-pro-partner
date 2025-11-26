/**
 * Hiérarchie Business : Category → Type → Capabilities
 * Interfaces et mappings pour le système de classification
 */

import type { BusinessType } from "./business";
import type { BusinessCategory } from "./business-category";
import type { Capability } from "./capability";

/**
 * Configuration d'un BusinessType avec sa catégorie et ses capabilities
 */
export interface BusinessTypeConfig {
    type: BusinessType;
    category: BusinessCategory;
    defaultCapabilities: Capability[];
    label: string;
    icon: string;
    description: string;
    color: string;
}

/**
 * Configuration d'une catégorie avec ses business types
 */
export interface CategoryConfig {
    category: BusinessCategory;
    label: string;
    icon: string;
    description: string;
    availableCapabilities: Capability[];
    businessTypes: BusinessType[];
}

/**
 * Mapping BusinessType → Category
 */
export const BUSINESS_TYPE_TO_CATEGORY: Record<BusinessType, BusinessCategory> =
    {
        // INTERVENTION
        PLOMBERIE: "INTERVENTION",
        ELECTRICITE: "INTERVENTION",
        CHAUFFAGE: "INTERVENTION",
        MENUISERIE: "INTERVENTION",
        PEINTURE: "INTERVENTION",
        MACONNERIE: "INTERVENTION",
        GARAGE: "INTERVENTION",
        INFORMATIQUE: "INTERVENTION",
        // POINT_DE_VENTE
        RESTAURATION: "POINT_DE_VENTE",
        BOULANGERIE: "POINT_DE_VENTE",
        // RENDEZ_VOUS
        COIFFURE: "RENDEZ_VOUS",
        ESTHETIQUE: "RENDEZ_VOUS",
        FITNESS: "RENDEZ_VOUS",
        SANTE: "RENDEZ_VOUS",
        // SERVICE_INTELLECTUEL
        CONSULTING: "SERVICE_INTELLECTUEL",
        COMPTABILITE: "SERVICE_INTELLECTUEL",
        JURIDIQUE: "SERVICE_INTELLECTUEL",
        // COMMERCE
        COMMERCE_DETAIL: "COMMERCE",
        // IMMOBILIER
        IMMOBILIER: "IMMOBILIER",
        // GENERAL
        GENERAL: "GENERAL",
    };

/**
 * Mapping Category → BusinessTypes[]
 */
export const CATEGORY_TO_BUSINESS_TYPES: Record<
    BusinessCategory,
    BusinessType[]
> = {
    INTERVENTION: [
        "PLOMBERIE",
        "ELECTRICITE",
        "CHAUFFAGE",
        "MENUISERIE",
        "PEINTURE",
        "MACONNERIE",
        "GARAGE",
        "INFORMATIQUE",
    ],
    POINT_DE_VENTE: ["RESTAURATION", "BOULANGERIE"],
    RENDEZ_VOUS: ["COIFFURE", "ESTHETIQUE", "FITNESS", "SANTE"],
    SERVICE_INTELLECTUEL: ["CONSULTING", "COMPTABILITE", "JURIDIQUE"],
    COMMERCE: ["COMMERCE_DETAIL"],
    IMMOBILIER: ["IMMOBILIER"],
    GENERAL: ["GENERAL"],
};

/**
 * Capabilities par défaut pour chaque BusinessType
 * Inclut les BASE capabilities + les spécifiques au métier
 */
export const BUSINESS_TYPE_DEFAULT_CAPABILITIES: Record<
    BusinessType,
    Capability[]
> = {
    // === INTERVENTION ===
    PLOMBERIE: [
        "domicile",
        "urgence",
        "contrats",
        "garanties",
        "stock_camionnette",
        "clients",
        "documents",
        "analytics",
        "fidelite",
    ],
    ELECTRICITE: [
        "domicile",
        "urgence",
        "contrats",
        "garanties",
        "stock_camionnette",
        "clients",
        "documents",
        "analytics",
        "fidelite",
    ],
    CHAUFFAGE: [
        "domicile",
        "urgence",
        "contrats",
        "garanties",
        "stock_camionnette",
        "clients",
        "documents",
        "analytics",
        "fidelite",
    ],
    MENUISERIE: [
        "domicile",
        "atelier",
        "contrats",
        "garanties",
        "stock_camionnette",
        "clients",
        "documents",
        "analytics",
        "fidelite",
    ],
    PEINTURE: [
        "domicile",
        "contrats",
        "garanties",
        "stock_camionnette",
        "clients",
        "documents",
        "analytics",
        "fidelite",
    ],
    MACONNERIE: [
        "domicile",
        "contrats",
        "garanties",
        "stock_camionnette",
        "clients",
        "documents",
        "analytics",
        "fidelite",
    ],
    GARAGE: [
        "atelier",
        "suivi_bien",
        "urgence",
        "contrats",
        "garanties",
        "clients",
        "documents",
        "analytics",
        "fidelite",
    ],
    INFORMATIQUE: [
        "atelier",
        "suivi_bien",
        "garanties",
        "clients",
        "documents",
        "analytics",
        "fidelite",
    ],

    // === POINT_DE_VENTE ===
    RESTAURATION: [
        "pos",
        "tables",
        "tickets",
        "commandes_rapides",
        "clients",
        "documents",
        "analytics",
        "fidelite",
    ],
    BOULANGERIE: [
        "pos",
        "tickets",
        "commandes_rapides",
        "clients",
        "documents",
        "analytics",
        "fidelite",
    ],

    // === RENDEZ_VOUS ===
    COIFFURE: [
        "agenda",
        "creneaux",
        "rappels_sms",
        "recurrence",
        "clients",
        "documents",
        "analytics",
        "fidelite",
    ],
    ESTHETIQUE: [
        "agenda",
        "creneaux",
        "rappels_sms",
        "recurrence",
        "clients",
        "documents",
        "analytics",
        "fidelite",
    ],
    FITNESS: [
        "agenda",
        "creneaux",
        "rappels_sms",
        "recurrence",
        "clients",
        "documents",
        "analytics",
        "fidelite",
    ],
    SANTE: [
        "agenda",
        "creneaux",
        "rappels_sms",
        "recurrence",
        "clients",
        "documents",
        "analytics",
        "fidelite",
    ],

    // === SERVICE_INTELLECTUEL ===
    CONSULTING: [
        "temps_passe",
        "projets",
        "facturation_horaire",
        "clients",
        "documents",
        "analytics",
    ],
    COMPTABILITE: [
        "temps_passe",
        "projets",
        "facturation_horaire",
        "clients",
        "documents",
        "analytics",
    ],
    JURIDIQUE: [
        "temps_passe",
        "projets",
        "facturation_horaire",
        "clients",
        "documents",
        "analytics",
    ],

    // === COMMERCE ===
    COMMERCE_DETAIL: [
        "catalogue",
        "stock",
        "ventes",
        "clients",
        "documents",
        "analytics",
        "fidelite",
    ],

    // === IMMOBILIER ===
    IMMOBILIER: [
        "mandats",
        "biens",
        "visites",
        "clients",
        "documents",
        "analytics",
    ],

    // === GENERAL ===
    GENERAL: ["clients", "documents", "analytics", "fidelite"],
};
