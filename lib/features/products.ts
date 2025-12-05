/**
 * Product & Inventory Features
 */

import { FeatureModule } from "@/lib/navigation/core/types";

export const ProductsFeature: FeatureModule = {
    id: "products",
    name: "Articles",
    navigation: {
        main: {
            icon: "Package",
            label: "Articles",
            href: "/dashboard/catalogue",
            order: 20,
        },
        subItems: [
            { label: "Catalogue", href: "/dashboard/catalogue", order: 0 },
            { label: "Stock", href: "/dashboard/catalogue/stock", order: 1 },
            {
                label: "Catégories",
                href: "/dashboard/catalogue/categories",
                order: 2,
            },
        ],
        quickActions: [
            {
                label: "Nouvel article",
                icon: "Plus",
                href: "/dashboard/catalogue/new",
                order: 1,
            },
        ],
    },
    routes: [
        "/dashboard/catalogue",
        "/dashboard/catalogue/new",
        "/dashboard/catalogue/[id]",
        "/dashboard/catalogue/stock",
        "/dashboard/catalogue/categories",
    ],
    i18n: {
        singular: "Article",
        plural: "Articles",
    },
    permissions: ["canViewProducts"],
};

export const InventoryFeature: FeatureModule = {
    id: "inventory",
    name: "Gestion de stock",
    dependencies: ["products"],
    routes: ["/dashboard/catalogue/stock"],
    permissions: ["canManageStock"],
};

export const CatalogueFeature: FeatureModule = {
    id: "catalogue",
    name: "Catalogue",
    navigation: {
        main: {
            icon: "Package",
            label: "Catalogue",
            href: "/dashboard/catalogue",
            order: 20,
        },
        subItems: [
            {
                label: "Tous les articles",
                href: "/dashboard/catalogue",
                order: 0,
            },
            { label: "Stock", href: "/dashboard/catalogue/stock", order: 1 },
            {
                label: "Catégories",
                href: "/dashboard/catalogue/categories",
                order: 2,
            },
        ],
        quickActions: [
            {
                label: "Nouvel article",
                icon: "Plus",
                href: "/dashboard/catalogue/new",
                order: 1,
            },
        ],
    },
    routes: [
        "/dashboard/catalogue",
        "/dashboard/catalogue/new",
        "/dashboard/catalogue/[id]",
        "/dashboard/catalogue/stock",
        "/dashboard/catalogue/categories",
    ],
    i18n: {
        singular: "Article",
        plural: "Catalogue",
    },
    permissions: ["canViewProducts"],
};
