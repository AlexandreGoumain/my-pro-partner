import { type ArticleTypeValue } from "@/lib/navigation/core/types";
import { BUSINESS_PRESETS } from "@/lib/navigation/presets";
import { type ArticleTypeFilter } from "@/lib/types/article";
import { BusinessType } from "@/lib/types/business";
import {
    Briefcase,
    LucideIcon,
    Package,
    RotateCcw,
    Search,
    ShoppingBag,
    Wrench,
} from "lucide-react";

export interface ArticleEmptyStateMessage {
    title: string;
    description: string;
    buttonText: string;
    icon: LucideIcon;
}

export function getArticleEmptyStateMessage(
    typeFilter: ArticleTypeFilter,
    hasNoDataAtAll: boolean
): ArticleEmptyStateMessage {
    if (typeFilter === "PRODUIT") {
        return {
            title: "Aucun produit trouvé",
            description:
                "Aucun produit ne correspond à vos critères. Essayez de modifier vos filtres ou ajoutez un nouveau produit.",
            buttonText: "Ajouter un produit",
            icon: Package,
        };
    }

    if (typeFilter === "SERVICE") {
        return {
            title: "Aucun service trouvé",
            description:
                "Aucun service ne correspond à vos critères. Essayez de modifier vos filtres ou ajoutez un nouveau service.",
            buttonText: "Ajouter un service",
            icon: Briefcase,
        };
    }

    if (typeFilter === "OCCASION") {
        return {
            title: "Aucun article d'occasion trouvé",
            description:
                "Aucun article d'occasion ne correspond à vos critères. Essayez de modifier vos filtres ou ajoutez un nouveau produit d'occasion.",
            buttonText: "Ajouter un article d'occasion",
            icon: RotateCcw,
        };
    }

    if (typeFilter === "PIECE") {
        return {
            title: "Aucune pièce détachée trouvée",
            description:
                "Aucune pièce détachée ne correspond à vos critères. Essayez de modifier vos filtres ou ajoutez une nouvelle pièce.",
            buttonText: "Ajouter une pièce détachée",
            icon: Wrench,
        };
    }

    if (typeFilter === "TOUS" && hasNoDataAtAll) {
        return {
            title: "Commencez votre catalogue",
            description:
                "Vous n'avez pas encore de produits ni de services. Créez votre premier article pour commencer à gérer votre activité.",
            buttonText: "Créer mon premier article",
            icon: ShoppingBag,
        };
    }

    // Filtre actif mais pas de résultats
    return {
        title: "Aucun article trouvé",
        description:
            "Aucun article ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou ajoutez un nouvel article.",
        buttonText: "Ajouter un article",
        icon: Search,
    };
}

/**
 * Get available article types for a business type
 * Returns the article types that can be used by this business
 */
export function getAvailableArticleTypes(
    businessType: BusinessType
): ArticleTypeValue[] {
    const preset = BUSINESS_PRESETS[businessType];

    // If preset has custom availableArticleTypes, use them
    if (preset?.availableArticleTypes) {
        return preset.availableArticleTypes;
    }

    // Default fallback: all types except OCCASION
    return ["PRODUIT", "SERVICE", "PIECE"];
}
