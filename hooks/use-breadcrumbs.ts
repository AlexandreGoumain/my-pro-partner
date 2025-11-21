"use client";

import type { BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { usePathname } from "next/navigation";

/**
 * Configuration des breadcrumbs pour chaque route
 * Format: { path: string, label: string, parentPath?: string }
 */
const BREADCRUMB_CONFIG: Record<
    string,
    { label: string; segments?: string[] }
> = {
    // Dashboard
    "/dashboard": { label: "Tableau de bord" },

    // Clients
    "/dashboard/clients": { label: "Clients", segments: ["Clients"] },
    "/dashboard/clients/statistiques": {
        label: "Statistiques",
        segments: ["Clients", "Statistiques"],
    },
    "/dashboard/clients/import-export": {
        label: "Import / Export",
        segments: ["Clients", "Import / Export"],
    },
    "/dashboard/clients/segments": {
        label: "Segments",
        segments: ["Clients", "Segments"],
    },

    // Analytics
    "/dashboard/analytics": { label: "Analytics", segments: ["Analytics"] },
    "/dashboard/analytics/profitability": {
        label: "Rentabilité",
        segments: ["Analytics", "Rentabilité"],
    },
    "/dashboard/analytics/unpaid": {
        label: "Impayées",
        segments: ["Analytics", "Impayées"],
    },
    "/dashboard/analytics/debtors": {
        label: "Débiteurs",
        segments: ["Analytics", "Débiteurs"],
    },

    // Documents
    "/dashboard/documents/invoices": {
        label: "Factures",
        segments: ["Documents", "Factures"],
    },
    "/dashboard/documents/quotes": {
        label: "Devis",
        segments: ["Documents", "Devis"],
    },
    "/dashboard/documents/credits": {
        label: "Avoirs",
        segments: ["Documents", "Avoirs"],
    },

    // Catalogue
    "/dashboard/catalogue": { label: "Catalogue", segments: ["Catalogue"] },
    "/dashboard/catalogue/categories": {
        label: "Catégories",
        segments: ["Catalogue", "Catégories"],
    },
    "/dashboard/catalogue/stock": {
        label: "Stock",
        segments: ["Catalogue", "Stock"],
    },

    // Rachats
    "/dashboard/rachats": { label: "Rachats", segments: ["Rachats"] },

    // Atelier
    "/dashboard/atelier": { label: "Atelier", segments: ["Atelier"] },
    "/dashboard/reparations": {
        label: "Réparations",
        segments: ["Réparations"],
    },

    // Liens de paiement
    "/dashboard/payment-links": {
        label: "Liens de paiement",
        segments: ["Liens de paiement"],
    },

    // Personnel
    "/dashboard/personnel": { label: "Personnel", segments: ["Personnel"] },

    // Magasins
    "/dashboard/stores": { label: "Magasins", segments: ["Magasins"] },

    // Tables
    "/dashboard/tables": { label: "Tables", segments: ["Tables"] },

    // Point de vente
    "/dashboard/pos": { label: "Point de vente", segments: ["Point de vente"] },

    // Terminaux
    "/dashboard/terminals": { label: "Terminaux", segments: ["Terminaux"] },

    // Réservations
    "/dashboard/reservations": {
        label: "Réservations",
        segments: ["Réservations"],
    },

    // Automatisations
    "/dashboard/automations": {
        label: "Automatisations",
        segments: ["Automatisations"],
    },

    // Campagnes
    "/dashboard/campaigns": { label: "Campagnes", segments: ["Campagnes"] },

    // Rapprochement bancaire
    "/dashboard/bank-reconciliation": {
        label: "Rapprochement bancaire",
        segments: ["Rapprochement bancaire"],
    },

    // Fidélité
    "/dashboard/fidelite/niveaux": {
        label: "Niveaux",
        segments: ["Fidélité", "Niveaux"],
    },

    // Tarifs
    "/dashboard/pricing": { label: "Tarifs", segments: ["Tarifs"] },

    // Paramètres
    "/dashboard/settings": { label: "Paramètres", segments: ["Paramètres"] },
    "/dashboard/parametres": { label: "Paramètres", segments: ["Paramètres"] },
    "/dashboard/parametres/entreprise": {
        label: "Entreprise",
        segments: ["Paramètres", "Entreprise"],
    },
    "/dashboard/parametres/equipe": {
        label: "Équipe",
        segments: ["Paramètres", "Équipe"],
    },
};

/**
 * Hook pour générer les breadcrumbs dynamiquement en fonction de la route actuelle
 */
export function useBreadcrumbs(): BreadcrumbItem[] {
    const pathname = usePathname();

    if (!pathname || pathname === "/dashboard") {
        return [];
    }

    // Vérifier si on a une configuration exacte pour ce path
    const config = BREADCRUMB_CONFIG[pathname];
    if (config?.segments) {
        return buildBreadcrumbsFromSegments(config.segments, pathname);
    }

    // Gestion des routes dynamiques (avec [id])
    const pathParts = pathname.split("/").filter(Boolean);

    // Routes avec ID (ex: /dashboard/clients/segments/[id]/analytics)
    if (pathParts.includes("analytics") && pathParts.length > 4) {
        const basePath = `/${pathParts.slice(0, -2).join("/")}`;
        const baseConfig = BREADCRUMB_CONFIG[basePath];
        if (baseConfig?.segments) {
            // On enlève le dernier segment et on ajoute "Analytics"
            const segments = [...baseConfig.segments, "Analytics"];
            return buildBreadcrumbsFromSegments(segments, pathname);
        }
    }

    // Routes de détail (ex: /dashboard/documents/invoices/[id])
    if (pathParts.length >= 4) {
        const basePath = `/${pathParts.slice(0, -1).join("/")}`;
        const baseConfig = BREADCRUMB_CONFIG[basePath];
        if (baseConfig?.segments) {
            // Pour les pages de détail, on garde juste les segments parents
            return buildBreadcrumbsFromSegments(baseConfig.segments, basePath);
        }
    }

    // Fallback: construire depuis le path
    return buildBreadcrumbsFromPath(pathname);
}

/**
 * Construit les breadcrumbs à partir d'un tableau de segments
 */
function buildBreadcrumbsFromSegments(
    segments: string[],
    currentPath: string
): BreadcrumbItem[] {
    const pathParts = currentPath.split("/").filter(Boolean);

    return segments.map((label, index) => {
        // Construire le href en fonction de l'index
        let href: string | undefined;

        if (index < segments.length - 1) {
            // Pour tous les segments sauf le dernier, on essaie de trouver un lien
            if (index === 0) {
                // Premier niveau
                const firstPath = findPathForLabel(label);
                href = firstPath || undefined;
            } else if (index === 1 && pathParts.length > 2) {
                // Deuxième niveau
                const secondPath = `/${pathParts.slice(0, 3).join("/")}`;
                href = secondPath;
            }
        }

        return {
            label,
            href,
        };
    });
}

/**
 * Trouve le path correspondant à un label
 */
function findPathForLabel(label: string): string | null {
    for (const [path, config] of Object.entries(BREADCRUMB_CONFIG)) {
        if (config.label === label && config.segments?.length === 1) {
            return path;
        }
    }
    return null;
}

/**
 * Fallback: construit les breadcrumbs à partir du path
 */
function buildBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
    const parts = pathname.split("/").filter(Boolean);

    // Enlever "dashboard" du début
    if (parts[0] === "dashboard") {
        parts.shift();
    }

    if (parts.length === 0) {
        return [];
    }

    return parts.map((part, index) => {
        const isLast = index === parts.length - 1;
        const label = formatPathPart(part);

        let href: string | undefined;
        if (!isLast && index === 0) {
            href = `/dashboard/${part}`;
        }

        return {
            label,
            href,
        };
    });
}

/**
 * Formate une partie du path pour l'affichage
 */
function formatPathPart(part: string): string {
    // Si c'est un UUID ou un nombre, on retourne tel quel
    if (/^[0-9a-f-]{36}$/.test(part) || /^\d+$/.test(part)) {
        return part;
    }

    // Capitaliser la première lettre
    return part.charAt(0).toUpperCase() + part.slice(1);
}
