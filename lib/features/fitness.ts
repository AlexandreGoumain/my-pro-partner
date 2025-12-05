/**
 * Fitness / Gym Specific Features
 */

import { FeatureModule } from "@/lib/navigation/core/types";

export const AbonnementsFitnessFeature: FeatureModule = {
    id: "abonnements-fitness",
    name: "Abonnements",
    navigation: {
        main: {
            icon: "CreditCard",
            label: "Abonnements",
            href: "/dashboard/fitness/abonnements",
            order: 15,
        },
        subItems: [
            {
                label: "Tous les abonnements",
                href: "/dashboard/fitness/abonnements",
                order: 0,
            },
            {
                label: "Types d'abonnements",
                href: "/dashboard/fitness/types-abonnements",
                order: 1,
            },
        ],
        quickActions: [
            {
                label: "Nouvel abonnement",
                icon: "Plus",
                href: "/dashboard/fitness/abonnements?action=new",
                order: 1,
            },
        ],
    },
    routes: [
        "/dashboard/fitness/abonnements",
        "/dashboard/fitness/abonnements/[id]",
        "/dashboard/fitness/types-abonnements",
    ],
    i18n: {
        singular: "Abonnement",
        plural: "Abonnements",
    },
};

export const CoursFitnessFeature: FeatureModule = {
    id: "cours-fitness",
    name: "Cours collectifs",
    navigation: {
        main: {
            icon: "Users",
            label: "Cours",
            href: "/dashboard/fitness/cours",
            order: 20,
        },
        subItems: [
            {
                label: "Tous les cours",
                href: "/dashboard/fitness/cours",
                order: 0,
            },
            {
                label: "Planning",
                href: "/dashboard/fitness/planning",
                order: 1,
            },
        ],
        quickActions: [
            {
                label: "Nouveau cours",
                icon: "Plus",
                href: "/dashboard/fitness/cours?action=new",
                order: 2,
            },
        ],
    },
    routes: [
        "/dashboard/fitness/cours",
        "/dashboard/fitness/cours/[id]",
        "/dashboard/fitness/planning",
    ],
    i18n: {
        singular: "Cours",
        plural: "Cours collectifs",
    },
};

export const SallesFitnessFeature: FeatureModule = {
    id: "salles-fitness",
    name: "Salles & Zones",
    navigation: {
        main: {
            icon: "DoorOpen",
            label: "Salles",
            href: "/dashboard/fitness/salles",
            order: 25,
        },
        quickActions: [
            {
                label: "Nouvelle salle",
                icon: "Plus",
                href: "/dashboard/fitness/salles?action=new",
                order: 3,
            },
        ],
    },
    routes: ["/dashboard/fitness/salles", "/dashboard/fitness/salles/[id]"],
    i18n: {
        singular: "Salle",
        plural: "Salles & Zones",
    },
};

export const CheckInFeature: FeatureModule = {
    id: "check-in",
    name: "Check-in & Présences",
    navigation: {
        main: {
            icon: "UserCheck",
            label: "Check-in",
            href: "/dashboard/fitness/check-in",
            order: 5,
        },
        subItems: [
            {
                label: "Check-in",
                href: "/dashboard/fitness/check-in",
                order: 1,
            },
            {
                label: "Historique présences",
                href: "/dashboard/fitness/presences",
                order: 2,
            },
        ],
    },
    routes: ["/dashboard/fitness/check-in", "/dashboard/fitness/presences"],
    i18n: {
        singular: "Présence",
        plural: "Check-in",
    },
};

export const CoachsFeature: FeatureModule = {
    id: "coachs",
    name: "Coachs & Instructeurs",
    navigation: {
        main: {
            icon: "Dumbbell",
            label: "Coachs",
            href: "/dashboard/fitness/coachs",
            order: 35,
        },
        quickActions: [
            {
                label: "Nouveau coach",
                icon: "Plus",
                href: "/dashboard/fitness/coachs?action=new",
                order: 4,
            },
        ],
    },
    routes: ["/dashboard/fitness/coachs", "/dashboard/fitness/coachs/[id]"],
    i18n: {
        singular: "Coach",
        plural: "Coachs",
    },
};
