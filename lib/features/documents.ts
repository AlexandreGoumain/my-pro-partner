/**
 * Document Features - Quotes, Invoices, Credits
 */

import { FeatureModule } from "@/lib/navigation/core/types";

export const QuotesFeature: FeatureModule = {
    id: "quotes",
    name: "Devis",
    navigation: {
        main: {
            icon: "FileText",
            label: "Documents",
            href: "/dashboard/documents/quotes",
            order: 30,
        },
        subItems: [
            { label: "Devis", href: "/dashboard/documents/quotes", order: 1 },
            {
                label: "Factures",
                href: "/dashboard/documents/invoices",
                order: 2,
            },
            { label: "Avoirs", href: "/dashboard/documents/credits", order: 3 },
        ],
        quickActions: [
            {
                label: "Nouveau devis",
                icon: "Plus",
                href: "/dashboard/documents/quotes/new",
                order: 2,
            },
        ],
    },
    routes: [
        "/dashboard/documents/quotes",
        "/dashboard/documents/quotes/new",
        "/dashboard/documents/quotes/[id]",
    ],
    dependencies: ["clients"],
    permissions: ["canViewDocuments", "canCreateDocuments"],
};

export const InvoicesFeature: FeatureModule = {
    id: "invoices",
    name: "Factures",
    navigation: {
        quickActions: [
            {
                label: "Nouvelle facture",
                icon: "Plus",
                href: "/dashboard/documents/invoices/new",
                order: 3,
            },
        ],
    },
    routes: [
        "/dashboard/documents/invoices",
        "/dashboard/documents/invoices/new",
        "/dashboard/documents/invoices/[id]",
    ],
    dependencies: ["clients"],
    permissions: ["canViewDocuments"],
};

export const CreditsFeature: FeatureModule = {
    id: "credits",
    name: "Avoirs",
    routes: [
        "/dashboard/documents/credits",
        "/dashboard/documents/credits/new",
        "/dashboard/documents/credits/[id]",
    ],
    dependencies: ["invoices"],
    permissions: ["canViewDocuments"],
};
