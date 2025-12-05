/**
 * Real Estate - Rental Management Features
 */

import { FeatureModule } from "@/lib/navigation/core/types";

export const BauxFeature: FeatureModule = {
    id: "baux",
    name: "Baux",
    navigation: {
        main: {
            icon: "FileText",
            label: "Baux",
            href: "/dashboard/baux",
            order: 12,
        },
        quickActions: [
            {
                label: "Nouveau bail",
                icon: "Plus",
                href: "/dashboard/baux?action=new",
                order: 1,
            },
        ],
    },
    routes: ["/dashboard/baux", "/dashboard/baux/[id]"],
    dependencies: ["biens-immo"],
    i18n: {
        singular: "Bail",
        plural: "Baux",
    },
    permissions: ["canViewProducts"],
};

export const LoyersFeature: FeatureModule = {
    id: "loyers",
    name: "Loyers",
    navigation: {
        main: {
            icon: "Receipt",
            label: "Loyers",
            href: "/dashboard/loyers",
            order: 13,
        },
        quickActions: [
            {
                label: "Générer appels",
                icon: "Plus",
                href: "/dashboard/loyers?action=generate",
                order: 2,
            },
        ],
    },
    routes: ["/dashboard/loyers", "/dashboard/loyers/[id]"],
    dependencies: ["baux"],
    i18n: {
        singular: "Loyer",
        plural: "Loyers & Quittances",
    },
    permissions: ["canViewProducts"],
};

export const ImpayesFeature: FeatureModule = {
    id: "impayes",
    name: "Impayés",
    navigation: {
        main: {
            icon: "AlertCircle",
            label: "Impayés",
            href: "/dashboard/impayes",
            order: 14,
        },
    },
    routes: ["/dashboard/impayes"],
    dependencies: ["loyers"],
    i18n: {
        singular: "Impayé",
        plural: "Impayés",
    },
    permissions: ["canViewProducts"],
};

export const EtatsLieuxFeature: FeatureModule = {
    id: "etats-lieux",
    name: "États des lieux",
    navigation: {
        main: {
            icon: "ClipboardCheck",
            label: "États des lieux",
            href: "/dashboard/etats-lieux",
            order: 15,
        },
    },
    routes: ["/dashboard/etats-lieux", "/dashboard/etats-lieux/[id]"],
    dependencies: ["baux"],
    i18n: {
        singular: "État des lieux",
        plural: "États des lieux",
    },
    permissions: ["canViewProducts"],
};

export const TravauxLocatifsFeature: FeatureModule = {
    id: "travaux-locatifs",
    name: "Travaux & Incidents",
    navigation: {
        main: {
            icon: "Wrench",
            label: "Travaux",
            href: "/dashboard/travaux-locatifs",
            order: 16,
        },
    },
    routes: ["/dashboard/travaux-locatifs", "/dashboard/travaux-locatifs/[id]"],
    dependencies: ["biens-immo"],
    i18n: {
        singular: "Incident",
        plural: "Travaux & Incidents",
    },
    permissions: ["canViewProducts"],
};
