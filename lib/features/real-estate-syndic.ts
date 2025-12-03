/**
 * Real Estate - Syndic / Property Management Features
 */

import { FeatureModule } from "@/lib/navigation/core/types";

export const CoproprietesFeature: FeatureModule = {
    id: "coproprietes",
    name: "Copropriétés",
    navigation: {
        main: {
            icon: "Building2",
            label: "Copropriétés",
            href: "/dashboard/coproprietes",
            order: 11,
        },
        quickActions: [
            {
                label: "Nouvelle copropriété",
                icon: "Plus",
                href: "/dashboard/coproprietes?action=new",
                order: 1,
            },
        ],
    },
    routes: ["/dashboard/coproprietes", "/dashboard/coproprietes/[id]"],
    i18n: {
        singular: "Copropriété",
        plural: "Copropriétés",
    },
    permissions: ["canViewProducts"],
};

export const LotsFeature: FeatureModule = {
    id: "lots",
    name: "Lots",
    navigation: {
        main: {
            icon: "Grid3x3",
            label: "Lots",
            href: "/dashboard/lots",
            order: 12,
        },
    },
    routes: ["/dashboard/lots", "/dashboard/lots/[id]"],
    dependencies: ["coproprietes"],
    i18n: {
        singular: "Lot",
        plural: "Lots & Tantièmes",
    },
    permissions: ["canViewProducts"],
};

export const ChargesFeature: FeatureModule = {
    id: "charges",
    name: "Charges",
    navigation: {
        main: {
            icon: "Receipt",
            label: "Charges",
            href: "/dashboard/charges",
            order: 13,
        },
        quickActions: [
            {
                label: "Appel de charges",
                icon: "Plus",
                href: "/dashboard/charges?action=new",
                order: 2,
            },
        ],
    },
    routes: ["/dashboard/charges", "/dashboard/charges/[id]"],
    dependencies: ["coproprietes"],
    i18n: {
        singular: "Appel",
        plural: "Appels de charges",
    },
    permissions: ["canViewProducts"],
};

export const AGFeature: FeatureModule = {
    id: "ag",
    name: "Assemblées générales",
    navigation: {
        main: {
            icon: "Users",
            label: "AG",
            href: "/dashboard/ag",
            order: 14,
        },
        quickActions: [
            {
                label: "Convoquer AG",
                icon: "Plus",
                href: "/dashboard/ag?action=new",
                order: 3,
            },
        ],
    },
    routes: ["/dashboard/ag", "/dashboard/ag/[id]"],
    dependencies: ["coproprietes"],
    i18n: {
        singular: "AG",
        plural: "Assemblées générales",
    },
    permissions: ["canViewProducts"],
};

export const TravauxCoproFeature: FeatureModule = {
    id: "travaux-copro",
    name: "Travaux collectifs",
    navigation: {
        main: {
            icon: "HardHat",
            label: "Travaux",
            href: "/dashboard/travaux-copro",
            order: 15,
        },
    },
    routes: ["/dashboard/travaux-copro", "/dashboard/travaux-copro/[id]"],
    dependencies: ["coproprietes"],
    i18n: {
        singular: "Travaux",
        plural: "Travaux collectifs",
    },
    permissions: ["canViewProducts"],
};

export const ComptaCoproFeature: FeatureModule = {
    id: "compta-copro",
    name: "Comptabilité copropriété",
    navigation: {
        main: {
            icon: "Calculator",
            label: "Comptabilité",
            href: "/dashboard/compta-copro",
            order: 16,
        },
    },
    routes: ["/dashboard/compta-copro"],
    dependencies: ["coproprietes"],
    i18n: {
        singular: "Écriture",
        plural: "Comptabilité",
    },
    permissions: ["canViewProducts"],
};

export const ConseilSyndicalFeature: FeatureModule = {
    id: "conseil-syndical",
    name: "Conseil syndical",
    navigation: {
        main: {
            icon: "Users",
            label: "Conseil syndical",
            href: "/dashboard/conseil-syndical",
            order: 17,
        },
    },
    routes: ["/dashboard/conseil-syndical"],
    dependencies: ["coproprietes"],
    i18n: {
        singular: "Membre",
        plural: "Conseil syndical",
    },
    permissions: ["canViewProducts"],
};
