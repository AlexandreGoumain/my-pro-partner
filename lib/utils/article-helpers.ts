import { LucideIcon, Package, Briefcase, ShoppingBag, Search } from "lucide-react";

export interface ArticleEmptyStateMessage {
    title: string;
    description: string;
    buttonText: string;
    icon: LucideIcon;
}

export function getArticleEmptyStateMessage(
    typeFilter: "TOUS" | "PRODUIT" | "SERVICE",
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
