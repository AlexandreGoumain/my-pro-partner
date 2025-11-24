/**
 * Feature Catalog - All reusable features
 * Each feature can be enabled/disabled per business type
 */

import { FeatureModule } from "@/lib/navigation/core/types";

// ============================================
// CORE FEATURES (Always available)
// ============================================

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
      { label: "Liste des clients", href: "/dashboard/clients", order: 1 },
      { label: "Segments", href: "/dashboard/clients/segments", order: 2 },
      { label: "Statistiques", href: "/dashboard/clients/statistiques", order: 3 },
      { label: "Import/Export", href: "/dashboard/clients/import-export", order: 4 },
    ],
    quickActions: [
      {
        label: "Nouveau client",
        icon: "Plus",
        href: "/dashboard/clients/new",
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

// ============================================
// PRODUCT & INVENTORY
// ============================================

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
      { label: "Catégories", href: "/dashboard/catalogue/categories", order: 2 },
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

// ============================================
// DOCUMENTS
// ============================================

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
      { label: "Factures", href: "/dashboard/documents/invoices", order: 2 },
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

// ============================================
// SERVICES & APPOINTMENTS
// ============================================

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
  dependencies: ["products"],
  routes: ["/dashboard/catalogue"],
  i18n: {
    singular: "Plat",
    plural: "Menu & Carte",
  },
};

// ============================================
// POINT OF SALE
// ============================================

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
  dependencies: ["products", "clients"],
  permissions: ["canProcessSales"],
};

// ============================================
// LOYALTY & MARKETING
// ============================================

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

// ============================================
// ANALYTICS & REPORTS
// ============================================

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
      { label: "Rentabilité", href: "/dashboard/analytics/profitability", order: 2 },
      { label: "Impayés", href: "/dashboard/analytics/unpaid", order: 3 },
      { label: "Débiteurs", href: "/dashboard/analytics/debtors", order: 4 },
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

// ============================================
// TEAM MANAGEMENT
// ============================================

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
  routes: ["/dashboard/personnel", "/dashboard/personnel/new", "/dashboard/personnel/[id]"],
  permissions: ["canViewUsers", "canManageUsers"],
};

export const TimeTrackingFeature: FeatureModule = {
  id: "time-tracking",
  name: "Suivi du temps",
  dependencies: ["personnel"],
  routes: ["/dashboard/personnel"],
  permissions: ["canViewTimeTracking"],
};

// ============================================
// MULTI-STORE
// ============================================

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
  routes: ["/dashboard/stores", "/dashboard/stores/new", "/dashboard/stores/[id]"],
};

// Feature désactivée - Nécessite du matériel Stripe Terminal
// Pour réactiver : mettre ENABLE_PAYMENT_TERMINALS à true dans lib/config/features.config.ts
// export const TerminalsFeature: FeatureModule = {
//   id: "terminals",
//   name: "Terminaux",
//   navigation: {
//     main: {
//       icon: "CreditCard",
//       label: "Terminaux",
//       href: "/dashboard/terminals",
//       order: 56,
//     },
//   },
//   routes: ["/dashboard/terminals"],
//   dependencies: ["pos"],
// };

// ============================================
// FINANCE
// ============================================

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

// ============================================
// COMPUTER SHOPS SPECIFIC
// ============================================

export const RepairsFeature: FeatureModule = {
  id: "repairs",
  name: "Réparations",
  navigation: {
    main: {
      icon: "Wrench",
      label: "Réparations",
      href: "/dashboard/reparations",
      order: 21,
    },
    subItems: [
      { label: "Toutes les réparations", href: "/dashboard/reparations", order: 0 },
      { label: "En cours", href: "/dashboard/reparations?filter=en-cours", order: 1 },
      { label: "Prêtes", href: "/dashboard/reparations?filter=prete", order: 2 },
    ],
    quickActions: [
      {
        label: "Nouvelle réparation",
        icon: "Plus",
        href: "/dashboard/reparations/new",
        order: 5,
      },
    ],
  },
  routes: [
    "/dashboard/reparations",
    "/dashboard/reparations/new",
    "/dashboard/reparations/[id]",
  ],
  dependencies: ["clients"],
  i18n: {
    singular: "Réparation",
    plural: "Réparations",
  },
  permissions: ["canViewProducts"],
};

export const RachatsFeature: FeatureModule = {
  id: "rachats",
  name: "Rachats",
  navigation: {
    main: {
      icon: "RotateCcw",
      label: "Rachats",
      href: "/dashboard/rachats",
      order: 22,
    },
    quickActions: [
      {
        label: "Nouveau rachat",
        icon: "Plus",
        href: "/dashboard/rachats/new",
        order: 10,
      },
    ],
  },
  routes: [
    "/dashboard/rachats",
    "/dashboard/rachats/[id]",
  ],
  dependencies: ["catalogue"],
  permissions: ["canViewProducts"],
};

export const AtelierFeature: FeatureModule = {
  id: "atelier",
  name: "Atelier",
  navigation: {
    main: {
      icon: "Wrench",
      label: "Atelier",
      href: "/dashboard/atelier",
      order: 23,
    },
  },
  routes: ["/dashboard/atelier"],
  dependencies: ["rachats"],
  permissions: ["canViewProducts"],
};

// ============================================
// CATALOGUE (Unified view)
// ============================================

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
      { label: "Tous les articles", href: "/dashboard/catalogue", order: 0 },
      { label: "Stock", href: "/dashboard/catalogue/stock", order: 1 },
      { label: "Catégories", href: "/dashboard/catalogue/categories", order: 2 },
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

// ============================================
// INTEGRATIONS
// ============================================

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

// ============================================
// SETTINGS
// ============================================

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

// ============================================
// FEATURE CATALOG
// ============================================

export const FEATURE_CATALOG: Record<string, FeatureModule> = {
  // Core
  dashboard: DashboardFeature,
  clients: ClientsFeature,

  // Products & Inventory
  products: ProductsFeature,
  inventory: InventoryFeature,

  // Documents
  quotes: QuotesFeature,
  invoices: InvoicesFeature,
  credits: CreditsFeature,

  // Services & Appointments
  reservations: ReservationsFeature,
  tables: TablesFeature,
  menu: MenuFeature,

  // Point of Sale
  pos: POSFeature,

  // Loyalty & Marketing
  loyalty: LoyaltyFeature,
  segments: SegmentsFeature,
  campaigns: CampaignsFeature,
  automations: AutomationsFeature,

  // Analytics
  analytics: AnalyticsFeature,

  // Team
  personnel: PersonnelFeature,
  "time-tracking": TimeTrackingFeature,

  // Multi-store
  stores: StoresFeature,
  // terminals: TerminalsFeature, // Désactivé - Voir lib/config/features.config.ts

  // Computer shops specific
  repairs: RepairsFeature,
  rachats: RachatsFeature,
  atelier: AtelierFeature,
  catalogue: CatalogueFeature,

  // Finance
  payments: PaymentsFeature,
  "payment-links": PaymentLinksFeature,
  "bank-reconciliation": BankReconciliationFeature,

  // Integrations
  integrations: IntegrationsFeature,

  // Settings
  settings: SettingsFeature,
} as const;

export type FeatureId = keyof typeof FEATURE_CATALOG;
