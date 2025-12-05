/**
 * Analytics & Reports Features
 */

import { FeatureModule } from "@/lib/navigation/core/types";

export const AnalyticsFeature: FeatureModule = {
    id: "analytics",
    name: "Analytics",
    navigation: {
        main: {
            icon: "BarChart3",
            label: "Analytics",
            href: "/dashboard/analytics",
            order: 40,
        },
        subItems: [
            { label: "Vue d'ensemble", href: "/dashboard/analytics", order: 1 },
            {
                label: "Rentabilité",
                href: "/dashboard/analytics/profitability",
                order: 2,
            },
            { label: "Impayés", href: "/dashboard/analytics/unpaid", order: 3 },
            {
                label: "Débiteurs",
                href: "/dashboard/analytics/debtors",
                order: 4,
            },
        ],
    },
    routes: [
        "/dashboard/analytics",
        "/dashboard/analytics/profitability",
        "/dashboard/analytics/unpaid",
        "/dashboard/analytics/debtors",
    ],
    permissions: ["canViewReports"],
};
