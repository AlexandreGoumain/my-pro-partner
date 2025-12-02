/**
 * Real Estate Agent Features
 */

import { FeatureModule } from "@/lib/navigation/core/types";

export const BiensImmoFeature: FeatureModule = {
    id: "biens-immo",
    name: "Biens immobiliers",
    navigation: {
        main: {
            icon: "Home",
            label: "Biens",
            href: "/dashboard/biens-immo",
            order: 11,
        },
        quickActions: [
            {
                label: "Nouveau bien",
                icon: "Plus",
                href: "/dashboard/biens-immo?action=new",
                order: 1,
            },
        ],
    },
    routes: ["/dashboard/biens-immo", "/dashboard/biens-immo/[id]"],
    i18n: {
        singular: "Bien",
        plural: "Biens immobiliers",
    },
    permissions: ["canViewProducts"],
};

export const MandatsFeature: FeatureModule = {
    id: "mandats",
    name: "Mandats",
    navigation: {
        main: {
            icon: "FileSignature",
            label: "Mandats",
            href: "/dashboard/mandats",
            order: 12,
        },
        quickActions: [
            {
                label: "Nouveau mandat",
                icon: "Plus",
                href: "/dashboard/mandats?action=new",
                order: 2,
            },
        ],
    },
    routes: ["/dashboard/mandats", "/dashboard/mandats/[id]"],
    dependencies: ["biens-immo"],
    i18n: {
        singular: "Mandat",
        plural: "Mandats",
    },
    permissions: ["canViewProducts"],
};

export const VisitesImmoFeature: FeatureModule = {
    id: "visites",
    name: "Visites",
    navigation: {
        main: {
            icon: "Calendar",
            label: "Visites",
            href: "/dashboard/visites",
            order: 13,
        },
        quickActions: [
            {
                label: "Planifier visite",
                icon: "Plus",
                href: "/dashboard/visites?action=new",
                order: 3,
            },
        ],
    },
    routes: ["/dashboard/visites", "/dashboard/visites/[id]"],
    dependencies: ["biens-immo"],
    i18n: {
        singular: "Visite",
        plural: "Visites",
    },
    permissions: ["canViewProducts"],
};

export const EstimationsFeature: FeatureModule = {
    id: "estimations",
    name: "Estimations",
    navigation: {
        main: {
            icon: "Calculator",
            label: "Estimations",
            href: "/dashboard/estimations",
            order: 14,
        },
    },
    routes: ["/dashboard/estimations", "/dashboard/estimations/[id]"],
    dependencies: ["biens-immo"],
    i18n: {
        singular: "Estimation",
        plural: "Estimations",
    },
    permissions: ["canViewProducts"],
};

export const MatchingFeature: FeatureModule = {
    id: "matching",
    name: "Matching acquéreurs",
    navigation: {
        main: {
            icon: "Users",
            label: "Matching",
            href: "/dashboard/matching",
            order: 15,
        },
    },
    routes: ["/dashboard/matching"],
    dependencies: ["biens-immo", "clients"],
    i18n: {
        singular: "Recherche",
        plural: "Matching acquéreurs",
    },
    permissions: ["canViewClients"],
};

export const DiffusionFeature: FeatureModule = {
    id: "diffusion",
    name: "Diffusion annonces",
    navigation: {
        main: {
            icon: "Share2",
            label: "Diffusion",
            href: "/dashboard/diffusion",
            order: 16,
        },
    },
    routes: ["/dashboard/diffusion"],
    dependencies: ["biens-immo"],
    i18n: {
        singular: "Annonce",
        plural: "Diffusion annonces",
    },
    permissions: ["canViewProducts"],
};

export const PipelineFeature: FeatureModule = {
    id: "pipeline",
    name: "Pipeline transactions",
    navigation: {
        main: {
            icon: "GitBranch",
            label: "Pipeline",
            href: "/dashboard/pipeline",
            order: 17,
        },
    },
    routes: ["/dashboard/pipeline"],
    dependencies: ["mandats"],
    i18n: {
        singular: "Transaction",
        plural: "Pipeline",
    },
    permissions: ["canViewProducts"],
};
