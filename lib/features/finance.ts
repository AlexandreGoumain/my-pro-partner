/**
 * Finance Features
 */

import { FeatureModule } from "@/lib/navigation/core/types";

export const PaymentsFeature: FeatureModule = {
    id: "payments",
    name: "Paiements",
    dependencies: ["invoices"],
    routes: [],
    permissions: ["canManagePayments"],
};

export const PaymentLinksFeature: FeatureModule = {
    id: "payment-links",
    name: "Liens de paiement",
    navigation: {
        main: {
            icon: "Link",
            label: "Liens de paiement",
            href: "/dashboard/payment-links",
            order: 42,
        },
    },
    routes: ["/dashboard/payment-links"],
};

export const BankReconciliationFeature: FeatureModule = {
    id: "bank-reconciliation",
    name: "Rapprochement bancaire",
    navigation: {
        main: {
            icon: "Building2",
            label: "Rapprochement bancaire",
            href: "/dashboard/bank-reconciliation",
            order: 43,
        },
    },
    routes: ["/dashboard/bank-reconciliation"],
    permissions: ["canViewFinances"],
};
