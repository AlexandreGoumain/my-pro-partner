/**
 * Services & Appointments Features
 */

import { FeatureModule } from "@/lib/navigation/core/types";

export const AgendaFeature: FeatureModule = {
    id: "agenda",
    name: "Agenda",
    navigation: {
        main: {
            icon: "CalendarDays",
            label: "Agenda",
            href: "/dashboard/agenda",
            order: 5,
        },
        quickActions: [
            {
                label: "Nouveau RDV",
                icon: "Plus",
                href: "/dashboard/agenda?action=new",
                order: 1,
            },
        ],
    },
    routes: ["/dashboard/agenda"],
    dependencies: ["clients"],
    i18n: {
        singular: "Rendez-vous",
        plural: "Agenda",
    },
};

export const PrestationsFeature: FeatureModule = {
    id: "prestations",
    name: "Prestations",
    navigation: {
        main: {
            icon: "Scissors",
            label: "Prestations",
            href: "/dashboard/prestations",
            order: 15,
        },
        quickActions: [
            {
                label: "Nouvelle prestation",
                icon: "Plus",
                href: "/dashboard/prestations?action=new",
                order: 2,
            },
        ],
    },
    routes: ["/dashboard/prestations"],
    i18n: {
        singular: "Prestation",
        plural: "Prestations",
    },
};

export const EquipeFeature: FeatureModule = {
    id: "equipe",
    name: "Équipe",
    navigation: {
        main: {
            icon: "Users",
            label: "Équipe",
            href: "/dashboard/equipe",
            order: 20,
        },
        quickActions: [
            {
                label: "Nouvel employé",
                icon: "Plus",
                href: "/dashboard/equipe?action=new",
                order: 3,
            },
        ],
    },
    routes: ["/dashboard/equipe"],
    i18n: {
        singular: "Employé",
        plural: "Équipe",
    },
};

export const CabinesFeature: FeatureModule = {
    id: "cabines",
    name: "Cabines",
    navigation: {
        main: {
            icon: "DoorOpen",
            label: "Cabines",
            href: "/dashboard/cabines",
            order: 22,
        },
        quickActions: [
            {
                label: "Nouvelle cabine",
                icon: "Plus",
                href: "/dashboard/cabines?action=new",
                order: 4,
            },
        ],
    },
    routes: ["/dashboard/cabines"],
    i18n: {
        singular: "Cabine",
        plural: "Cabines",
    },
};

export const ReservationsFeature: FeatureModule = {
    id: "reservations",
    name: "Réservations",
    navigation: {
        main: {
            icon: "CalendarDays",
            label: "Réservations",
            href: "/dashboard/reservations",
            order: 25,
        },
    },
    routes: [
        "/dashboard/reservations",
        "/dashboard/reservations/new",
        "/dashboard/reservations/[id]",
    ],
    dependencies: ["clients"],
    i18n: {
        singular: "Réservation",
        plural: "Réservations",
    },
};

export const TablesFeature: FeatureModule = {
    id: "tables",
    name: "Tables",
    navigation: {
        main: {
            icon: "UtensilsCrossed",
            label: "Tables",
            href: "/dashboard/tables",
            order: 24,
        },
    },
    routes: ["/dashboard/tables"],
};

export const MenuFeature: FeatureModule = {
    id: "menu",
    name: "Menu & Carte",
    navigation: {
        main: {
            icon: "ChefHat",
            label: "Menu & Carte",
            href: "/dashboard/menu",
            order: 15,
        },
        quickActions: [
            {
                label: "Nouveau plat",
                icon: "Plus",
                href: "/dashboard/menu/new",
                order: 1,
            },
        ],
    },
    routes: ["/dashboard/menu", "/dashboard/menu/new", "/dashboard/menu/[id]"],
    i18n: {
        singular: "Plat",
        plural: "Menu & Carte",
    },
};

export const POSFeature: FeatureModule = {
    id: "pos",
    name: "Point de vente",
    navigation: {
        main: {
            icon: "ShoppingCart",
            label: "Caisse",
            href: "/dashboard/pos",
            order: 5,
        },
    },
    routes: ["/dashboard/pos"],
    dependencies: ["clients"],
    permissions: ["canProcessSales"],
};
