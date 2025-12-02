/**
 * Loyalty & Marketing Features
 */

import { FeatureModule } from "@/lib/navigation/core/types";

export const LoyaltyFeature: FeatureModule = {
    id: "loyalty",
    name: "Fidélité",
    navigation: {
        main: {
            icon: "Award",
            label: "Fidélité",
            href: "/dashboard/fidelite/niveaux",
            order: 35,
        },
    },
    routes: ["/dashboard/fidelite/niveaux"],
    dependencies: ["clients"],
};

export const SegmentsFeature: FeatureModule = {
    id: "segments",
    name: "Segmentation",
    dependencies: ["clients"],
    routes: ["/dashboard/clients/segments", "/dashboard/clients/segments/[id]"],
    permissions: ["canSegmentClients"],
};

export const CampaignsFeature: FeatureModule = {
    id: "campaigns",
    name: "Campagnes",
    navigation: {
        main: {
            icon: "Mail",
            label: "Campagnes",
            href: "/dashboard/campaigns",
            order: 45,
        },
    },
    routes: ["/dashboard/campaigns", "/dashboard/campaigns/new"],
    dependencies: ["clients", "segments"],
};

export const AutomationsFeature: FeatureModule = {
    id: "automations",
    name: "Automatisations",
    navigation: {
        main: {
            icon: "Zap",
            label: "Automatisations",
            href: "/dashboard/automations",
            order: 46,
        },
    },
    routes: ["/dashboard/automations"],
    dependencies: ["clients"],
};
