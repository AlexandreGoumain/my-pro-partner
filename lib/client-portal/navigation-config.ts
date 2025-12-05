import {
    Home,
    FileText,
    Award,
    Calendar,
    Wrench,
    UtensilsCrossed,
    Dumbbell,
    User,
    Building2,
    Bell,
    type LucideIcon
} from "lucide-react";
import type { Capability } from "@/lib/types/capability";

export interface ClientPortalNavItem {
    /** Display name */
    name: string;
    /** Route path */
    href: string;
    /** Lucide icon component */
    icon: LucideIcon;
    /** Required capabilities (empty = always visible) */
    capabilities: Capability[];
    /** If true, show if ANY capability matches. If false (default), show if ALL match */
    anyCapability?: boolean;
    /** Description for accessibility */
    description?: string;
}

/**
 * Client portal navigation configuration
 * Items are shown based on the client's business capabilities
 */
export const CLIENT_PORTAL_NAVIGATION: ClientPortalNavItem[] = [
    {
        name: "Tableau de bord",
        href: "/client/dashboard",
        icon: Home,
        capabilities: [], // Always visible
        description: "Vue d'ensemble de votre espace client",
    },
    {
        name: "Mes documents",
        href: "/client/documents",
        icon: FileText,
        capabilities: [], // Always visible
        description: "Vos devis, factures et avoirs",
    },
    {
        name: "Fidélité",
        href: "/client/fidelite",
        icon: Award,
        capabilities: ["fidelite"],
        description: "Votre programme de fidélité et vos points",
    },
    {
        name: "Mes rendez-vous",
        href: "/client/rdv",
        icon: Calendar,
        capabilities: ["agenda"],
        description: "Gérer et réserver vos rendez-vous",
    },
    {
        name: "Mes interventions",
        href: "/client/interventions",
        icon: Wrench,
        capabilities: ["domicile", "atelier"],
        anyCapability: true,
        description: "Suivre vos interventions et réparations",
    },
    {
        name: "Mes réservations",
        href: "/client/reservations",
        icon: UtensilsCrossed,
        capabilities: ["tables"],
        description: "Vos réservations de table",
    },
    {
        name: "Mon abonnement",
        href: "/client/fitness",
        icon: Dumbbell,
        capabilities: ["abonnements_fitness"],
        description: "Votre abonnement et vos cours",
    },
    {
        name: "Mon espace",
        href: "/client/immobilier",
        icon: Building2,
        capabilities: ["baux_locatifs", "charges_copro", "coproprietes"],
        anyCapability: true,
        description: "Vos documents immobiliers",
    },
    {
        name: "Notifications",
        href: "/client/notifications",
        icon: Bell,
        capabilities: [], // Always visible
        description: "Vos notifications",
    },
    {
        name: "Mon profil",
        href: "/client/profil",
        icon: User,
        capabilities: [], // Always visible
        description: "Gérer vos informations personnelles",
    },
];

/**
 * Filter navigation items based on client capabilities
 */
export function getFilteredNavigation(
    capabilities: Capability[]
): ClientPortalNavItem[] {
    return CLIENT_PORTAL_NAVIGATION.filter((item) => {
        // No capabilities required = always show
        if (item.capabilities.length === 0) {
            return true;
        }

        // Check capabilities
        if (item.anyCapability) {
            // Show if ANY capability matches
            return item.capabilities.some((cap) => capabilities.includes(cap));
        } else {
            // Show if ALL capabilities match
            return item.capabilities.every((cap) => capabilities.includes(cap));
        }
    });
}

/**
 * Check if a nav item should be visible based on capabilities
 */
export function isNavItemVisible(
    item: ClientPortalNavItem,
    capabilities: Capability[]
): boolean {
    if (item.capabilities.length === 0) {
        return true;
    }

    if (item.anyCapability) {
        return item.capabilities.some((cap) => capabilities.includes(cap));
    }

    return item.capabilities.every((cap) => capabilities.includes(cap));
}
