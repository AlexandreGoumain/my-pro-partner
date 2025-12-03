/**
 * Computer Shop Specific Features
 */

import { FeatureModule } from "@/lib/navigation/core/types";

export const RepairsFeature: FeatureModule = {
    id: "repairs",
    name: "Réparations",
    navigation: {
        main: {
            icon: "Wrench",
            label: "Réparations",
            href: "/dashboard/reparations",
            order: 21,
        },
        subItems: [
            {
                label: "Toutes les réparations",
                href: "/dashboard/reparations",
                order: 0,
            },
            {
                label: "En cours",
                href: "/dashboard/reparations?filter=en-cours",
                order: 1,
            },
            {
                label: "Prêtes",
                href: "/dashboard/reparations?filter=prete",
                order: 2,
            },
        ],
        quickActions: [
            {
                label: "Nouvelle réparation",
                icon: "Plus",
                href: "/dashboard/reparations/new",
                order: 5,
            },
        ],
    },
    routes: [
        "/dashboard/reparations",
        "/dashboard/reparations/new",
        "/dashboard/reparations/[id]",
    ],
    dependencies: ["clients"],
    i18n: {
        singular: "Réparation",
        plural: "Réparations",
    },
    permissions: ["canViewProducts"],
};

export const RachatsFeature: FeatureModule = {
    id: "rachats",
    name: "Rachats",
    navigation: {
        main: {
            icon: "RotateCcw",
            label: "Rachats",
            href: "/dashboard/rachats",
            order: 22,
        },
        quickActions: [
            {
                label: "Nouveau rachat",
                icon: "Plus",
                href: "/dashboard/rachats/new",
                order: 10,
            },
        ],
    },
    routes: ["/dashboard/rachats", "/dashboard/rachats/[id]"],
    dependencies: ["catalogue"],
    permissions: ["canViewProducts"],
};

export const AtelierFeature: FeatureModule = {
    id: "atelier",
    name: "Atelier",
    navigation: {
        main: {
            icon: "Wrench",
            label: "Atelier",
            href: "/dashboard/atelier",
            order: 23,
        },
    },
    routes: ["/dashboard/atelier"],
    dependencies: ["rachats"],
    permissions: ["canViewProducts"],
};
