import { BusinessType } from "@/lib/types/business";
import {
    Wrench,
    Store,
    Sparkles,
    Briefcase,
    Building2,
    Heart,
    type LucideIcon,
} from "lucide-react";

/**
 * Catégories principales pour l'onboarding conversationnel.
 * Chaque catégorie regroupe plusieurs business types.
 */
export interface BusinessCategory {
    id: string;
    label: string;
    description: string;
    icon: LucideIcon;
    color: string;
    businessTypes: BusinessType[];
}

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
    {
        id: "artisanat",
        label: "Artisanat & BTP",
        description: "Plombier, électricien, menuisier...",
        icon: Wrench,
        color: "#3B82F6",
        businessTypes: [
            "PLOMBERIE",
            "ELECTRICITE",
            "CHAUFFAGE",
            "MENUISERIE",
            "PEINTURE",
            "MACONNERIE",
        ],
    },
    {
        id: "commerce",
        label: "Commerce & Restauration",
        description: "Restaurant, boulangerie, boutique...",
        icon: Store,
        color: "#EF4444",
        businessTypes: ["RESTAURATION", "BOULANGERIE", "COMMERCE_DETAIL"],
    },
    {
        id: "beaute",
        label: "Beauté & Bien-être",
        description: "Coiffeur, esthéticienne, coach...",
        icon: Sparkles,
        color: "#EC4899",
        businessTypes: ["COIFFURE", "ESTHETIQUE", "FITNESS"],
    },
    {
        id: "services",
        label: "Services & Conseil",
        description: "Consultant, informaticien, formateur...",
        icon: Briefcase,
        color: "#8B5CF6",
        businessTypes: ["CONSULTING", "INFORMATIQUE", "GENERAL"],
    },
    {
        id: "immobilier",
        label: "Immobilier",
        description: "Agent immo, gestion locative, syndic...",
        icon: Building2,
        color: "#059669",
        businessTypes: [
            "AGENT_IMMOBILIER",
            "GESTION_LOCATIVE",
            "SYNDIC_COPROPRIETE",
        ],
    },
    {
        id: "sante",
        label: "Santé & Juridique",
        description: "Médecin, avocat, comptable, garage...",
        icon: Heart,
        color: "#DC2626",
        businessTypes: ["SANTE", "JURIDIQUE", "COMPTABILITE", "GARAGE"],
    },
];

/**
 * Récupère une catégorie par son ID
 */
export function getCategoryById(id: string): BusinessCategory | undefined {
    return BUSINESS_CATEGORIES.find((cat) => cat.id === id);
}

/**
 * Récupère la catégorie d'un business type
 */
export function getCategoryByBusinessType(
    businessType: BusinessType
): BusinessCategory | undefined {
    return BUSINESS_CATEGORIES.find((cat) =>
        cat.businessTypes.includes(businessType)
    );
}
