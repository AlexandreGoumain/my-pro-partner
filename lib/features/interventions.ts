/**
 * Plumbing/Heating Business Specific Features
 */

import { FeatureModule } from "@/lib/navigation/core/types";

export const InterventionsFeature: FeatureModule = {
    id: "interventions",
    name: "Interventions",
    navigation: {
        main: {
            icon: "Wrench",
            label: "Interventions",
            href: "/dashboard/interventions",
            order: 21,
        },
        quickActions: [
            {
                label: "Nouvelle intervention",
                icon: "Plus",
                href: "/dashboard/interventions/new",
                order: 1,
            },
        ],
    },
    routes: [
        "/dashboard/interventions",
        "/dashboard/interventions/new",
        "/dashboard/interventions/[id]",
    ],
    dependencies: ["clients"],
    i18n: {
        singular: "Intervention",
        plural: "Interventions",
    },
    permissions: ["canViewProducts"],
};

export const StockCamionnetteFeature: FeatureModule = {
    id: "stock-camionnette",
    name: "Stock Camionnettes",
    navigation: {
        main: {
            icon: "Truck",
            label: "Stock Mobile",
            href: "/dashboard/stock-camionnette",
            order: 22,
        },
    },
    routes: ["/dashboard/stock-camionnette"],
    dependencies: ["products"],
    i18n: {
        singular: "Camionnette",
        plural: "Stock Camionnettes",
    },
    permissions: ["canViewStock"],
};

export const ContratsEntretienFeature: FeatureModule = {
    id: "contrats",
    name: "Contrats d'Entretien",
    navigation: {
        main: {
            icon: "FileText",
            label: "Contrats",
            href: "/dashboard/contrats",
            order: 23,
        },
        quickActions: [
            {
                label: "Nouveau contrat",
                icon: "Plus",
                href: "/dashboard/contrats/new",
                order: 2,
            },
        ],
    },
    routes: [
        "/dashboard/contrats",
        "/dashboard/contrats/new",
        "/dashboard/contrats/[id]",
    ],
    dependencies: ["clients"],
    i18n: {
        singular: "Contrat",
        plural: "Contrats d'Entretien",
    },
    permissions: ["canViewProducts"],
};

export const PlanningFeature: FeatureModule = {
    id: "planning",
    name: "Planning & Tournées",
    navigation: {
        main: {
            icon: "Calendar",
            label: "Planning",
            href: "/dashboard/planning",
            order: 24,
        },
    },
    routes: ["/dashboard/planning"],
    dependencies: ["interventions"],
    i18n: {
        singular: "Planning",
        plural: "Planning & Tournées",
    },
    permissions: ["canViewProducts"],
};

export const FlotteFeature: FeatureModule = {
    id: "flotte",
    name: "Flotte de véhicules",
    navigation: {
        main: {
            icon: "Truck",
            label: "Flotte",
            href: "/dashboard/flotte",
            order: 25,
        },
        subItems: [
            {
                label: "Tous les véhicules",
                href: "/dashboard/flotte",
                order: 0,
            },
            {
                label: "Entretiens",
                href: "/dashboard/flotte/entretiens",
                order: 1,
            },
        ],
        quickActions: [
            {
                label: "Nouveau véhicule",
                icon: "Plus",
                href: "/dashboard/flotte/new",
                order: 3,
            },
        ],
    },
    routes: [
        "/dashboard/flotte",
        "/dashboard/flotte/new",
        "/dashboard/flotte/[id]",
        "/dashboard/flotte/entretiens",
    ],
    i18n: {
        singular: "Véhicule",
        plural: "Flotte",
    },
    permissions: ["canViewStock"],
};

export const EquipementsFeature: FeatureModule = {
    id: "equipements",
    name: "Parc Équipements",
    navigation: {
        main: {
            icon: "Flame",
            label: "Équipements",
            href: "/dashboard/equipements",
            order: 26,
        },
        quickActions: [
            {
                label: "Nouvel équipement",
                icon: "Plus",
                href: "/dashboard/equipements/new",
                order: 4,
            },
        ],
    },
    routes: [
        "/dashboard/equipements",
        "/dashboard/equipements/new",
        "/dashboard/equipements/[id]",
    ],
    dependencies: ["clients"],
    i18n: {
        singular: "Équipement",
        plural: "Parc Équipements",
    },
    permissions: ["canViewProducts"],
};

export const EntretiensPlanifierFeature: FeatureModule = {
    id: "entretiens-planifier",
    name: "Entretiens à planifier",
    navigation: {
        main: {
            icon: "CalendarClock",
            label: "Entretiens",
            href: "/dashboard/entretiens-planifier",
            order: 27,
        },
    },
    routes: ["/dashboard/entretiens-planifier"],
    dependencies: ["equipements"],
    i18n: {
        singular: "Entretien",
        plural: "Entretiens à planifier",
    },
    permissions: ["canViewProducts"],
};
