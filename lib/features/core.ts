/**
 * Core Features - Always available
 */

import { FeatureModule } from "@/lib/navigation/core/types";

export const DashboardFeature: FeatureModule = {
    id: "dashboard",
    name: "Tableau de bord",
    navigation: {
        main: {
            icon: "LayoutDashboard",
            label: "Tableau de bord",
            href: "/dashboard",
            order: 0,
        },
    },
    routes: ["/dashboard"],
};

export const ClientsFeature: FeatureModule = {
    id: "clients",
    name: "Clients",
    navigation: {
        main: {
            icon: "Users",
            label: "Clients",
            href: "/dashboard/clients",
            order: 10,
        },
        subItems: [
            {
                label: "Liste des clients",
                href: "/dashboard/clients",
                order: 1,
            },
            {
                label: "Segments",
                href: "/dashboard/clients/segments",
                order: 2,
            },
            {
                label: "Statistiques",
                href: "/dashboard/clients/statistiques",
                order: 3,
            },
            {
                label: "Import/Export",
                href: "/dashboard/clients/import-export",
                order: 4,
            },
        ],
        quickActions: [
            {
                label: "Nouveau client",
                icon: "Plus",
                href: "/dashboard/clients?action=new",
                order: 1,
            },
        ],
    },
    routes: [
        "/dashboard/clients",
        "/dashboard/clients/new",
        "/dashboard/clients/[id]",
        "/dashboard/clients/segments",
        "/dashboard/clients/segments/[id]",
        "/dashboard/clients/statistiques",
        "/dashboard/clients/import-export",
    ],
    permissions: ["canViewClients", "canCreateClients"],
};
