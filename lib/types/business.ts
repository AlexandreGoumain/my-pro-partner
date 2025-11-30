/**
 * Types pour les activités métier
 * Fichier séparé pour éviter les imports Prisma côté client
 *
 * IMPORTANT: Utilise des constantes pour que Turbopack puisse les voir côté client
 *
 * @see business-category.ts pour les catégories fonctionnelles
 * @see capability.ts pour les capabilities
 * @see business-hierarchy.ts pour les mappings
 */

// Constante avec toutes les valeurs possibles
export const BUSINESS_TYPES = [
    "GENERAL",
    "PLOMBERIE",
    "ELECTRICITE",
    "CHAUFFAGE",
    "MENUISERIE",
    "PEINTURE",
    "MACONNERIE",
    "RESTAURATION",
    "BOULANGERIE",
    "COIFFURE",
    "ESTHETIQUE",
    "FITNESS",
    "GARAGE",
    "INFORMATIQUE",
    "CONSULTING",
    "COMMERCE_DETAIL",
    // Immobilier - 3 types spécialisés
    "AGENT_IMMOBILIER", // Agent immobilier, mandataire (carte T)
    "GESTION_LOCATIVE", // Administrateur de biens (carte G)
    "SYNDIC_COPROPRIETE", // Syndic de copropriété
    "SANTE",
    "JURIDIQUE",
    "COMPTABILITE",
] as const;

// Type dérivé de la constante (visible par Turbopack)
export type BusinessType = (typeof BUSINESS_TYPES)[number];

// Helper pour vérifier si une valeur est un BusinessType valide
export function isBusinessType(value: string): value is BusinessType {
    return BUSINESS_TYPES.includes(value as BusinessType);
}

// Re-export des types liés pour faciliter les imports
export type { BusinessCategory } from "./business-category";
export type { BusinessTypeConfig, CategoryConfig } from "./business-hierarchy";
export type { Capability } from "./capability";
