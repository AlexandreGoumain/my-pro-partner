/**
 * Settings & Integrations Features
 */

import { FeatureModule } from "@/lib/navigation/core/types";

export const IntegrationsFeature: FeatureModule = {
    id: "integrations",
    name: "Intégrations",
    navigation: {
        main: {
            icon: "Plug",
            label: "Intégrations",
            href: "/dashboard/integrations",
            order: 60,
        },
    },
    routes: ["/dashboard/integrations"],
};

export const SettingsFeature: FeatureModule = {
    id: "settings",
    name: "Paramètres",
    navigation: {
        main: {
            icon: "Settings",
            label: "Paramètres",
            href: "/dashboard/settings",
            order: 70,
        },
    },
    routes: ["/dashboard/settings"],
    permissions: ["canViewSettings"],
};
