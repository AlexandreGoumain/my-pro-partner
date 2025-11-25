/**
 * Catégories fonctionnelles de business
 * Regroupe les BusinessTypes par modèle opérationnel
 */

export const BUSINESS_CATEGORIES = [
    "INTERVENTION", // Artisans domicile/atelier
    "POINT_DE_VENTE", // Commerce avec caisse/POS
    "RENDEZ_VOUS", // Services sur rendez-vous
    "SERVICE_INTELLECTUEL", // Prestations intellectuelles
    "COMMERCE", // Commerce de détail
    "IMMOBILIER", // Gestion immobilière
    "GENERAL", // Configuration standard
] as const;

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number];

// Labels pour l'affichage UI
export const BUSINESS_CATEGORY_LABELS: Record<BusinessCategory, string> = {
    INTERVENTION: "Artisanat & Intervention",
    POINT_DE_VENTE: "Points de Vente",
    RENDEZ_VOUS: "Rendez-vous & Services",
    SERVICE_INTELLECTUEL: "Services Professionnels",
    COMMERCE: "Commerce",
    IMMOBILIER: "Immobilier",
    GENERAL: "Général",
};

// Icônes pour l'affichage UI
export const BUSINESS_CATEGORY_ICONS: Record<BusinessCategory, string> = {
    INTERVENTION: "Wrench",
    POINT_DE_VENTE: "Store",
    RENDEZ_VOUS: "Calendar",
    SERVICE_INTELLECTUEL: "Briefcase",
    COMMERCE: "ShoppingCart",
    IMMOBILIER: "Home",
    GENERAL: "Building2",
};

// Helper pour vérifier si une valeur est une BusinessCategory valide
export function isBusinessCategory(value: string): value is BusinessCategory {
    return BUSINESS_CATEGORIES.includes(value as BusinessCategory);
}
