/**
 * Juridique / Law Firm Specific Features
 */

import { FeatureModule } from "@/lib/navigation/core/types";

export const AffairesFeature: FeatureModule = {
    id: "affaires",
    name: "Affaires",
    navigation: {
        main: {
            icon: "Scale",
            label: "Affaires",
            href: "/dashboard/affaires",
            order: 15,
        },
        subItems: [
            {
                label: "Toutes les affaires",
                href: "/dashboard/affaires",
                order: 0,
            },
            {
                label: "En cours",
                href: "/dashboard/affaires?statut=EN_COURS",
                order: 1,
            },
            {
                label: "Audiences à venir",
                href: "/dashboard/affaires?filtre=audiences",
                order: 2,
            },
        ],
        quickActions: [
            {
                label: "Nouvelle affaire",
                icon: "Plus",
                href: "/dashboard/affaires?action=new",
                order: 1,
            },
        ],
    },
    routes: [
        "/dashboard/affaires",
        "/dashboard/affaires/new",
        "/dashboard/affaires/[id]",
    ],
    dependencies: ["clients"],
    i18n: {
        singular: "Affaire",
        plural: "Affaires",
    },
    permissions: ["canViewProjects"],
};

export const DiligencesFeature: FeatureModule = {
    id: "diligences",
    name: "Diligences",
    navigation: {
        main: {
            icon: "Clock",
            label: "Diligences",
            href: "/dashboard/diligences",
            order: 16,
        },
        subItems: [
            {
                label: "Toutes les diligences",
                href: "/dashboard/diligences",
                order: 0,
            },
            {
                label: "À facturer",
                href: "/dashboard/diligences?statut=a-facturer",
                order: 1,
            },
            {
                label: "Statistiques",
                href: "/dashboard/diligences/stats",
                order: 2,
            },
        ],
        quickActions: [
            {
                label: "Saisir une diligence",
                icon: "Plus",
                href: "/dashboard/diligences?action=new",
                order: 2,
            },
        ],
    },
    routes: ["/dashboard/diligences", "/dashboard/diligences/stats"],
    dependencies: ["affaires"],
    i18n: {
        singular: "Diligence",
        plural: "Diligences",
    },
    permissions: ["canViewTimeTracking"],
};

export const EcheancesProcFeature: FeatureModule = {
    id: "echeances-proc",
    name: "Échéances procédurales",
    navigation: {
        main: {
            icon: "CalendarClock",
            label: "Échéances",
            href: "/dashboard/echeances-proc",
            order: 17,
        },
        subItems: [
            {
                label: "Calendrier",
                href: "/dashboard/echeances-proc",
                order: 0,
            },
            {
                label: "Audiences",
                href: "/dashboard/echeances-proc?type=AUDIENCE",
                order: 1,
            },
            {
                label: "Délais",
                href: "/dashboard/echeances-proc?type=delais",
                order: 2,
            },
        ],
        quickActions: [
            {
                label: "Nouvelle échéance",
                icon: "Plus",
                href: "/dashboard/echeances-proc?action=new",
                order: 3,
            },
        ],
    },
    routes: ["/dashboard/echeances-proc", "/dashboard/echeances-proc/[id]"],
    dependencies: ["affaires"],
    i18n: {
        singular: "Échéance",
        plural: "Échéances procédurales",
    },
    permissions: ["canViewProjects"],
};
