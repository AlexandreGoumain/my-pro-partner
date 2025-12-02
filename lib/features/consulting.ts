/**
 * Consulting / Service Intellectuel Specific Features
 */

import { FeatureModule } from "@/lib/navigation/core/types";

export const MissionsFeature: FeatureModule = {
    id: "missions",
    name: "Missions",
    navigation: {
        main: {
            icon: "Briefcase",
            label: "Missions",
            href: "/dashboard/missions",
            order: 15,
        },
        subItems: [
            {
                label: "Toutes les missions",
                href: "/dashboard/missions",
                order: 0,
            },
            {
                label: "En cours",
                href: "/dashboard/missions?statut=EN_COURS",
                order: 1,
            },
            {
                label: "À facturer",
                href: "/dashboard/missions?statut=LIVREE",
                order: 2,
            },
        ],
        quickActions: [
            {
                label: "Nouvelle mission",
                icon: "Plus",
                href: "/dashboard/missions?action=new",
                order: 1,
            },
        ],
    },
    routes: [
        "/dashboard/missions",
        "/dashboard/missions/new",
        "/dashboard/missions/[id]",
    ],
    dependencies: ["clients"],
    i18n: {
        singular: "Mission",
        plural: "Missions",
    },
    permissions: ["canViewProjects"],
};

export const TimesheetFeature: FeatureModule = {
    id: "timesheet",
    name: "Suivi du temps",
    navigation: {
        main: {
            icon: "Clock",
            label: "Temps",
            href: "/dashboard/temps",
            order: 16,
        },
        subItems: [
            {
                label: "Timesheet",
                href: "/dashboard/temps",
                order: 0,
            },
            {
                label: "Statistiques",
                href: "/dashboard/temps/stats",
                order: 1,
            },
        ],
        quickActions: [
            {
                label: "Saisir du temps",
                icon: "Plus",
                href: "/dashboard/temps?action=new",
                order: 2,
            },
        ],
    },
    routes: ["/dashboard/temps", "/dashboard/temps/stats"],
    dependencies: ["missions"],
    i18n: {
        singular: "Entrée de temps",
        plural: "Suivi du temps",
    },
    permissions: ["canViewTimeTracking"],
};

export const EcheancesFeature: FeatureModule = {
    id: "echeances",
    name: "Échéances fiscales",
    navigation: {
        main: {
            icon: "CalendarClock",
            label: "Échéances",
            href: "/dashboard/echeances",
            order: 17,
        },
        subItems: [
            {
                label: "Toutes les échéances",
                href: "/dashboard/echeances",
                order: 0,
            },
            {
                label: "À venir",
                href: "/dashboard/echeances?periode=avenir",
                order: 1,
            },
            {
                label: "En retard",
                href: "/dashboard/echeances?periode=retard",
                order: 2,
            },
        ],
        quickActions: [
            {
                label: "Nouvelle échéance",
                icon: "Plus",
                href: "/dashboard/echeances?action=new",
                order: 3,
            },
        ],
    },
    routes: ["/dashboard/echeances", "/dashboard/echeances/[id]"],
    dependencies: ["missions"],
    i18n: {
        singular: "Échéance",
        plural: "Échéances fiscales",
    },
    permissions: ["canViewProjects"],
};
