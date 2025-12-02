/**
 * Team Management Features
 */

import { FeatureModule } from "@/lib/navigation/core/types";

export const PersonnelFeature: FeatureModule = {
    id: "personnel",
    name: "Personnel",
    navigation: {
        main: {
            icon: "Users",
            label: "Personnel",
            href: "/dashboard/personnel",
            order: 50,
        },
    },
    routes: [
        "/dashboard/personnel",
        "/dashboard/personnel/new",
        "/dashboard/personnel/[id]",
    ],
    permissions: ["canViewUsers", "canManageUsers"],
};

export const TimeTrackingFeature: FeatureModule = {
    id: "time-tracking",
    name: "Suivi du temps",
    dependencies: ["personnel"],
    routes: ["/dashboard/personnel"],
    permissions: ["canViewTimeTracking"],
};

export const StoresFeature: FeatureModule = {
    id: "stores",
    name: "Magasins",
    navigation: {
        main: {
            icon: "Store",
            label: "Magasins",
            href: "/dashboard/stores",
            order: 55,
        },
    },
    routes: [
        "/dashboard/stores",
        "/dashboard/stores/new",
        "/dashboard/stores/[id]",
    ],
};
