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

// ============================================
// SERVICES & APPOINTMENTS
// ============================================

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
    dependencies: ["clients"],
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
    routes: [
        "/dashboard/stores",
        "/dashboard/stores/new",
        "/dashboard/stores/[id]",
    ],
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
            {
                label: "Toutes les réparations",
                href: "/dashboard/reparations",
                order: 0,
            },
            {
                label: "En cours",
                href: "/dashboard/reparations?filter=en-cours",
                order: 1,
            },
            {
                label: "Prêtes",
                href: "/dashboard/reparations?filter=prete",
                order: 2,
            },
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
    routes: ["/dashboard/rachats", "/dashboard/rachats/[id]"],
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
// PLUMBING BUSINESS SPECIFIC
// ============================================

export const InterventionsFeature: FeatureModule = {
    id: "interventions",
    name: "Interventions",
    navigation: {
        main: {
            icon: "Wrench",
            label: "Interventions",
            href: "/dashboard/interventions",
            order: 21,
        },
        quickActions: [
            {
                label: "Nouvelle intervention",
                icon: "Plus",
                href: "/dashboard/interventions/new",
                order: 1,
            },
        ],
    },
    routes: [
        "/dashboard/interventions",
        "/dashboard/interventions/new",
        "/dashboard/interventions/[id]",
    ],
    dependencies: ["clients"],
    i18n: {
        singular: "Intervention",
        plural: "Interventions",
    },
    permissions: ["canViewProducts"],
};

export const StockCamionnetteFeature: FeatureModule = {
    id: "stock-camionnette",
    name: "Stock Camionnettes",
    navigation: {
        main: {
            icon: "Truck",
            label: "Stock Mobile",
            href: "/dashboard/stock-camionnette",
            order: 22,
        },
    },
    routes: ["/dashboard/stock-camionnette"],
    dependencies: ["products"],
    i18n: {
        singular: "Camionnette",
        plural: "Stock Camionnettes",
    },
    permissions: ["canViewStock"],
};

export const ContratsEntretienFeature: FeatureModule = {
    id: "contrats",
    name: "Contrats d'Entretien",
    navigation: {
        main: {
            icon: "FileText",
            label: "Contrats",
            href: "/dashboard/contrats",
            order: 23,
        },
        quickActions: [
            {
                label: "Nouveau contrat",
                icon: "Plus",
                href: "/dashboard/contrats/new",
                order: 2,
            },
        ],
    },
    routes: [
        "/dashboard/contrats",
        "/dashboard/contrats/new",
        "/dashboard/contrats/[id]",
    ],
    dependencies: ["clients"],
    i18n: {
        singular: "Contrat",
        plural: "Contrats d'Entretien",
    },
    permissions: ["canViewProducts"],
};

export const PlanningFeature: FeatureModule = {
    id: "planning",
    name: "Planning & Tournées",
    navigation: {
        main: {
            icon: "Calendar",
            label: "Planning",
            href: "/dashboard/planning",
            order: 24,
        },
    },
    routes: ["/dashboard/planning"],
    dependencies: ["interventions"],
    i18n: {
        singular: "Planning",
        plural: "Planning & Tournées",
    },
    permissions: ["canViewProducts"],
};

export const FlotteFeature: FeatureModule = {
    id: "flotte",
    name: "Flotte de véhicules",
    navigation: {
        main: {
            icon: "Truck",
            label: "Flotte",
            href: "/dashboard/flotte",
            order: 25,
        },
        subItems: [
            {
                label: "Tous les véhicules",
                href: "/dashboard/flotte",
                order: 0,
            },
            {
                label: "Entretiens",
                href: "/dashboard/flotte/entretiens",
                order: 1,
            },
        ],
        quickActions: [
            {
                label: "Nouveau véhicule",
                icon: "Plus",
                href: "/dashboard/flotte/new",
                order: 3,
            },
        ],
    },
    routes: [
        "/dashboard/flotte",
        "/dashboard/flotte/new",
        "/dashboard/flotte/[id]",
        "/dashboard/flotte/entretiens",
    ],
    i18n: {
        singular: "Véhicule",
        plural: "Flotte",
    },
    permissions: ["canViewStock"],
};

export const EquipementsFeature: FeatureModule = {
    id: "equipements",
    name: "Parc Équipements",
    navigation: {
        main: {
            icon: "Flame",
            label: "Équipements",
            href: "/dashboard/equipements",
            order: 26,
        },
        quickActions: [
            {
                label: "Nouvel équipement",
                icon: "Plus",
                href: "/dashboard/equipements/new",
                order: 4,
            },
        ],
    },
    routes: [
        "/dashboard/equipements",
        "/dashboard/equipements/new",
        "/dashboard/equipements/[id]",
    ],
    dependencies: ["clients"],
    i18n: {
        singular: "Équipement",
        plural: "Parc Équipements",
    },
    permissions: ["canViewProducts"],
};

export const EntretiensPlanifierFeature: FeatureModule = {
    id: "entretiens-planifier",
    name: "Entretiens à planifier",
    navigation: {
        main: {
            icon: "CalendarClock",
            label: "Entretiens",
            href: "/dashboard/entretiens-planifier",
            order: 27,
        },
    },
    routes: ["/dashboard/entretiens-planifier"],
    dependencies: ["equipements"],
    i18n: {
        singular: "Entretien",
        plural: "Entretiens à planifier",
    },
    permissions: ["canViewProducts"],
};

// ============================================
// CONSULTING / SERVICE INTELLECTUEL SPECIFIC
// ============================================

export const MissionsFeature: FeatureModule = {
    id: "missions",
    name: "Missions",
    navigation: {
        main: {
            icon: "Briefcase",
            label: "Missions",
            href: "/dashboard/missions",
            order: 15,
        },
        subItems: [
            {
                label: "Toutes les missions",
                href: "/dashboard/missions",
                order: 0,
            },
            {
                label: "En cours",
                href: "/dashboard/missions?statut=EN_COURS",
                order: 1,
            },
            {
                label: "À facturer",
                href: "/dashboard/missions?statut=LIVREE",
                order: 2,
            },
        ],
        quickActions: [
            {
                label: "Nouvelle mission",
                icon: "Plus",
                href: "/dashboard/missions?action=new",
                order: 1,
            },
        ],
    },
    routes: [
        "/dashboard/missions",
        "/dashboard/missions/new",
        "/dashboard/missions/[id]",
    ],
    dependencies: ["clients"],
    i18n: {
        singular: "Mission",
        plural: "Missions",
    },
    permissions: ["canViewProjects"],
};

export const TimesheetFeature: FeatureModule = {
    id: "timesheet",
    name: "Suivi du temps",
    navigation: {
        main: {
            icon: "Clock",
            label: "Temps",
            href: "/dashboard/temps",
            order: 16,
        },
        subItems: [
            {
                label: "Timesheet",
                href: "/dashboard/temps",
                order: 0,
            },
            {
                label: "Statistiques",
                href: "/dashboard/temps/stats",
                order: 1,
            },
        ],
        quickActions: [
            {
                label: "Saisir du temps",
                icon: "Plus",
                href: "/dashboard/temps?action=new",
                order: 2,
            },
        ],
    },
    routes: ["/dashboard/temps", "/dashboard/temps/stats"],
    dependencies: ["missions"],
    i18n: {
        singular: "Entrée de temps",
        plural: "Suivi du temps",
    },
    permissions: ["canViewTimeTracking"],
};

// ============================================
// FITNESS / GYM SPECIFIC
// ============================================

export const AbonnementsFitnessFeature: FeatureModule = {
    id: "abonnements-fitness",
    name: "Abonnements",
    navigation: {
        main: {
            icon: "CreditCard",
            label: "Abonnements",
            href: "/dashboard/fitness/abonnements",
            order: 15,
        },
        subItems: [
            {
                label: "Tous les abonnements",
                href: "/dashboard/fitness/abonnements",
                order: 0,
            },
            {
                label: "Types d'abonnements",
                href: "/dashboard/fitness/types-abonnements",
                order: 1,
            },
        ],
        quickActions: [
            {
                label: "Nouvel abonnement",
                icon: "Plus",
                href: "/dashboard/fitness/abonnements?action=new",
                order: 1,
            },
        ],
    },
    routes: [
        "/dashboard/fitness/abonnements",
        "/dashboard/fitness/abonnements/[id]",
        "/dashboard/fitness/types-abonnements",
    ],
    i18n: {
        singular: "Abonnement",
        plural: "Abonnements",
    },
};

export const CoursFitnessFeature: FeatureModule = {
    id: "cours-fitness",
    name: "Cours collectifs",
    navigation: {
        main: {
            icon: "Users",
            label: "Cours",
            href: "/dashboard/fitness/cours",
            order: 20,
        },
        subItems: [
            {
                label: "Tous les cours",
                href: "/dashboard/fitness/cours",
                order: 0,
            },
            {
                label: "Planning",
                href: "/dashboard/fitness/planning",
                order: 1,
            },
        ],
        quickActions: [
            {
                label: "Nouveau cours",
                icon: "Plus",
                href: "/dashboard/fitness/cours?action=new",
                order: 2,
            },
        ],
    },
    routes: [
        "/dashboard/fitness/cours",
        "/dashboard/fitness/cours/[id]",
        "/dashboard/fitness/planning",
    ],
    i18n: {
        singular: "Cours",
        plural: "Cours collectifs",
    },
};

export const SallesFitnessFeature: FeatureModule = {
    id: "salles-fitness",
    name: "Salles & Zones",
    navigation: {
        main: {
            icon: "DoorOpen",
            label: "Salles",
            href: "/dashboard/fitness/salles",
            order: 25,
        },
        quickActions: [
            {
                label: "Nouvelle salle",
                icon: "Plus",
                href: "/dashboard/fitness/salles?action=new",
                order: 3,
            },
        ],
    },
    routes: ["/dashboard/fitness/salles", "/dashboard/fitness/salles/[id]"],
    i18n: {
        singular: "Salle",
        plural: "Salles & Zones",
    },
};

export const CheckInFeature: FeatureModule = {
    id: "check-in",
    name: "Check-in & Présences",
    navigation: {
        main: {
            icon: "UserCheck",
            label: "Check-in",
            href: "/dashboard/fitness/check-in",
            order: 5,
        },
        subItems: [
            {
                label: "Check-in",
                href: "/dashboard/fitness/check-in",
                order: 1,
            },
            {
                label: "Historique présences",
                href: "/dashboard/fitness/presences",
                order: 2,
            },
        ],
    },
    routes: ["/dashboard/fitness/check-in", "/dashboard/fitness/presences"],
    i18n: {
        singular: "Présence",
        plural: "Check-in",
    },
};

export const CoachsFeature: FeatureModule = {
    id: "coachs",
    name: "Coachs & Instructeurs",
    navigation: {
        main: {
            icon: "Dumbbell",
            label: "Coachs",
            href: "/dashboard/fitness/coachs",
            order: 35,
        },
        quickActions: [
            {
                label: "Nouveau coach",
                icon: "Plus",
                href: "/dashboard/fitness/coachs?action=new",
                order: 4,
            },
        ],
    },
    routes: ["/dashboard/fitness/coachs", "/dashboard/fitness/coachs/[id]"],
    i18n: {
        singular: "Coach",
        plural: "Coachs",
    },
};

// ============================================
// ACCOUNTING / COMPTABILITE SPECIFIC
// ============================================

export const EcheancesFeature: FeatureModule = {
    id: "echeances",
    name: "Échéances fiscales",
    navigation: {
        main: {
            icon: "CalendarClock",
            label: "Échéances",
            href: "/dashboard/echeances",
            order: 17,
        },
        subItems: [
            {
                label: "Toutes les échéances",
                href: "/dashboard/echeances",
                order: 0,
            },
            {
                label: "À venir",
                href: "/dashboard/echeances?periode=avenir",
                order: 1,
            },
            {
                label: "En retard",
                href: "/dashboard/echeances?periode=retard",
                order: 2,
            },
        ],
        quickActions: [
            {
                label: "Nouvelle échéance",
                icon: "Plus",
                href: "/dashboard/echeances?action=new",
                order: 3,
            },
        ],
    },
    routes: ["/dashboard/echeances", "/dashboard/echeances/[id]"],
    dependencies: ["missions"],
    i18n: {
        singular: "Échéance",
        plural: "Échéances fiscales",
    },
    permissions: ["canViewProjects"],
};

// ============================================
// JURIDIQUE / LAW FIRM SPECIFIC
// ============================================

export const AffairesFeature: FeatureModule = {
    id: "affaires",
    name: "Affaires",
    navigation: {
        main: {
            icon: "Scale",
            label: "Affaires",
            href: "/dashboard/affaires",
            order: 15,
        },
        subItems: [
            {
                label: "Toutes les affaires",
                href: "/dashboard/affaires",
                order: 0,
            },
            {
                label: "En cours",
                href: "/dashboard/affaires?statut=EN_COURS",
                order: 1,
            },
            {
                label: "Audiences à venir",
                href: "/dashboard/affaires?filtre=audiences",
                order: 2,
            },
        ],
        quickActions: [
            {
                label: "Nouvelle affaire",
                icon: "Plus",
                href: "/dashboard/affaires?action=new",
                order: 1,
            },
        ],
    },
    routes: [
        "/dashboard/affaires",
        "/dashboard/affaires/new",
        "/dashboard/affaires/[id]",
    ],
    dependencies: ["clients"],
    i18n: {
        singular: "Affaire",
        plural: "Affaires",
    },
    permissions: ["canViewProjects"],
};

export const DiligencesFeature: FeatureModule = {
    id: "diligences",
    name: "Diligences",
    navigation: {
        main: {
            icon: "Clock",
            label: "Diligences",
            href: "/dashboard/diligences",
            order: 16,
        },
        subItems: [
            {
                label: "Toutes les diligences",
                href: "/dashboard/diligences",
                order: 0,
            },
            {
                label: "À facturer",
                href: "/dashboard/diligences?statut=a-facturer",
                order: 1,
            },
            {
                label: "Statistiques",
                href: "/dashboard/diligences/stats",
                order: 2,
            },
        ],
        quickActions: [
            {
                label: "Saisir une diligence",
                icon: "Plus",
                href: "/dashboard/diligences?action=new",
                order: 2,
            },
        ],
    },
    routes: ["/dashboard/diligences", "/dashboard/diligences/stats"],
    dependencies: ["affaires"],
    i18n: {
        singular: "Diligence",
        plural: "Diligences",
    },
    permissions: ["canViewTimeTracking"],
};

export const EcheancesProcFeature: FeatureModule = {
    id: "echeances-proc",
    name: "Échéances procédurales",
    navigation: {
        main: {
            icon: "CalendarClock",
            label: "Échéances",
            href: "/dashboard/echeances-proc",
            order: 17,
        },
        subItems: [
            {
                label: "Calendrier",
                href: "/dashboard/echeances-proc",
                order: 0,
            },
            {
                label: "Audiences",
                href: "/dashboard/echeances-proc?type=AUDIENCE",
                order: 1,
            },
            {
                label: "Délais",
                href: "/dashboard/echeances-proc?type=delais",
                order: 2,
            },
        ],
        quickActions: [
            {
                label: "Nouvelle échéance",
                icon: "Plus",
                href: "/dashboard/echeances-proc?action=new",
                order: 3,
            },
        ],
    },
    routes: ["/dashboard/echeances-proc", "/dashboard/echeances-proc/[id]"],
    dependencies: ["affaires"],
    i18n: {
        singular: "Échéance",
        plural: "Échéances procédurales",
    },
    permissions: ["canViewProjects"],
};

// ============================================
// IMMOBILIER - AGENT IMMOBILIER
// ============================================

export const BiensImmoFeature: FeatureModule = {
    id: "biens-immo",
    name: "Biens immobiliers",
    navigation: {
        main: {
            icon: "Home",
            label: "Biens",
            href: "/dashboard/biens-immo",
            order: 11,
        },
        quickActions: [
            {
                label: "Nouveau bien",
                icon: "Plus",
                href: "/dashboard/biens-immo?action=new",
                order: 1,
            },
        ],
    },
    routes: ["/dashboard/biens-immo", "/dashboard/biens-immo/[id]"],
    i18n: {
        singular: "Bien",
        plural: "Biens immobiliers",
    },
    permissions: ["canViewProducts"],
};

export const MandatsFeature: FeatureModule = {
    id: "mandats",
    name: "Mandats",
    navigation: {
        main: {
            icon: "FileSignature",
            label: "Mandats",
            href: "/dashboard/mandats",
            order: 12,
        },
        quickActions: [
            {
                label: "Nouveau mandat",
                icon: "Plus",
                href: "/dashboard/mandats?action=new",
                order: 2,
            },
        ],
    },
    routes: ["/dashboard/mandats", "/dashboard/mandats/[id]"],
    dependencies: ["biens-immo"],
    i18n: {
        singular: "Mandat",
        plural: "Mandats",
    },
    permissions: ["canViewProducts"],
};

export const VisitesImmoFeature: FeatureModule = {
    id: "visites",
    name: "Visites",
    navigation: {
        main: {
            icon: "Calendar",
            label: "Visites",
            href: "/dashboard/visites",
            order: 13,
        },
        quickActions: [
            {
                label: "Planifier visite",
                icon: "Plus",
                href: "/dashboard/visites?action=new",
                order: 3,
            },
        ],
    },
    routes: ["/dashboard/visites", "/dashboard/visites/[id]"],
    dependencies: ["biens-immo"],
    i18n: {
        singular: "Visite",
        plural: "Visites",
    },
    permissions: ["canViewProducts"],
};

export const EstimationsFeature: FeatureModule = {
    id: "estimations",
    name: "Estimations",
    navigation: {
        main: {
            icon: "Calculator",
            label: "Estimations",
            href: "/dashboard/estimations",
            order: 14,
        },
    },
    routes: ["/dashboard/estimations", "/dashboard/estimations/[id]"],
    dependencies: ["biens-immo"],
    i18n: {
        singular: "Estimation",
        plural: "Estimations",
    },
    permissions: ["canViewProducts"],
};

export const MatchingFeature: FeatureModule = {
    id: "matching",
    name: "Matching acquéreurs",
    navigation: {
        main: {
            icon: "Users",
            label: "Matching",
            href: "/dashboard/matching",
            order: 15,
        },
    },
    routes: ["/dashboard/matching"],
    dependencies: ["biens-immo", "clients"],
    i18n: {
        singular: "Recherche",
        plural: "Matching acquéreurs",
    },
    permissions: ["canViewClients"],
};

export const DiffusionFeature: FeatureModule = {
    id: "diffusion",
    name: "Diffusion annonces",
    navigation: {
        main: {
            icon: "Share2",
            label: "Diffusion",
            href: "/dashboard/diffusion",
            order: 16,
        },
    },
    routes: ["/dashboard/diffusion"],
    dependencies: ["biens-immo"],
    i18n: {
        singular: "Annonce",
        plural: "Diffusion annonces",
    },
    permissions: ["canViewProducts"],
};

export const PipelineFeature: FeatureModule = {
    id: "pipeline",
    name: "Pipeline transactions",
    navigation: {
        main: {
            icon: "GitBranch",
            label: "Pipeline",
            href: "/dashboard/pipeline",
            order: 17,
        },
    },
    routes: ["/dashboard/pipeline"],
    dependencies: ["mandats"],
    i18n: {
        singular: "Transaction",
        plural: "Pipeline",
    },
    permissions: ["canViewProducts"],
};

// ============================================
// IMMOBILIER - GESTION LOCATIVE
// ============================================

export const BauxFeature: FeatureModule = {
    id: "baux",
    name: "Baux",
    navigation: {
        main: {
            icon: "FileText",
            label: "Baux",
            href: "/dashboard/baux",
            order: 12,
        },
        quickActions: [
            {
                label: "Nouveau bail",
                icon: "Plus",
                href: "/dashboard/baux?action=new",
                order: 1,
            },
        ],
    },
    routes: ["/dashboard/baux", "/dashboard/baux/[id]"],
    dependencies: ["biens-immo"],
    i18n: {
        singular: "Bail",
        plural: "Baux",
    },
    permissions: ["canViewProducts"],
};

export const LoyersFeature: FeatureModule = {
    id: "loyers",
    name: "Loyers",
    navigation: {
        main: {
            icon: "Receipt",
            label: "Loyers",
            href: "/dashboard/loyers",
            order: 13,
        },
        quickActions: [
            {
                label: "Générer appels",
                icon: "Plus",
                href: "/dashboard/loyers?action=generate",
                order: 2,
            },
        ],
    },
    routes: ["/dashboard/loyers", "/dashboard/loyers/[id]"],
    dependencies: ["baux"],
    i18n: {
        singular: "Loyer",
        plural: "Loyers & Quittances",
    },
    permissions: ["canViewProducts"],
};

export const ImpayesFeature: FeatureModule = {
    id: "impayes",
    name: "Impayés",
    navigation: {
        main: {
            icon: "AlertCircle",
            label: "Impayés",
            href: "/dashboard/impayes",
            order: 14,
        },
    },
    routes: ["/dashboard/impayes"],
    dependencies: ["loyers"],
    i18n: {
        singular: "Impayé",
        plural: "Impayés",
    },
    permissions: ["canViewProducts"],
};

export const EtatsLieuxFeature: FeatureModule = {
    id: "etats-lieux",
    name: "États des lieux",
    navigation: {
        main: {
            icon: "ClipboardCheck",
            label: "États des lieux",
            href: "/dashboard/etats-lieux",
            order: 15,
        },
    },
    routes: ["/dashboard/etats-lieux", "/dashboard/etats-lieux/[id]"],
    dependencies: ["baux"],
    i18n: {
        singular: "État des lieux",
        plural: "États des lieux",
    },
    permissions: ["canViewProducts"],
};

export const TravauxLocatifsFeature: FeatureModule = {
    id: "travaux-locatifs",
    name: "Travaux & Incidents",
    navigation: {
        main: {
            icon: "Wrench",
            label: "Travaux",
            href: "/dashboard/travaux-locatifs",
            order: 16,
        },
    },
    routes: ["/dashboard/travaux-locatifs", "/dashboard/travaux-locatifs/[id]"],
    dependencies: ["biens-immo"],
    i18n: {
        singular: "Incident",
        plural: "Travaux & Incidents",
    },
    permissions: ["canViewProducts"],
};

// ============================================
// IMMOBILIER - SYNDIC
// ============================================

export const CoproprietesFeature: FeatureModule = {
    id: "coproprietes",
    name: "Copropriétés",
    navigation: {
        main: {
            icon: "Building2",
            label: "Copropriétés",
            href: "/dashboard/coproprietes",
            order: 11,
        },
        quickActions: [
            {
                label: "Nouvelle copropriété",
                icon: "Plus",
                href: "/dashboard/coproprietes?action=new",
                order: 1,
            },
        ],
    },
    routes: ["/dashboard/coproprietes", "/dashboard/coproprietes/[id]"],
    i18n: {
        singular: "Copropriété",
        plural: "Copropriétés",
    },
    permissions: ["canViewProducts"],
};

export const LotsFeature: FeatureModule = {
    id: "lots",
    name: "Lots",
    navigation: {
        main: {
            icon: "Grid3x3",
            label: "Lots",
            href: "/dashboard/lots",
            order: 12,
        },
    },
    routes: ["/dashboard/lots", "/dashboard/lots/[id]"],
    dependencies: ["coproprietes"],
    i18n: {
        singular: "Lot",
        plural: "Lots & Tantièmes",
    },
    permissions: ["canViewProducts"],
};

export const ChargesFeature: FeatureModule = {
    id: "charges",
    name: "Charges",
    navigation: {
        main: {
            icon: "Receipt",
            label: "Charges",
            href: "/dashboard/charges",
            order: 13,
        },
        quickActions: [
            {
                label: "Appel de charges",
                icon: "Plus",
                href: "/dashboard/charges?action=new",
                order: 2,
            },
        ],
    },
    routes: ["/dashboard/charges", "/dashboard/charges/[id]"],
    dependencies: ["coproprietes"],
    i18n: {
        singular: "Appel",
        plural: "Appels de charges",
    },
    permissions: ["canViewProducts"],
};

export const AGFeature: FeatureModule = {
    id: "ag",
    name: "Assemblées générales",
    navigation: {
        main: {
            icon: "Users",
            label: "AG",
            href: "/dashboard/ag",
            order: 14,
        },
        quickActions: [
            {
                label: "Convoquer AG",
                icon: "Plus",
                href: "/dashboard/ag?action=new",
                order: 3,
            },
        ],
    },
    routes: ["/dashboard/ag", "/dashboard/ag/[id]"],
    dependencies: ["coproprietes"],
    i18n: {
        singular: "AG",
        plural: "Assemblées générales",
    },
    permissions: ["canViewProducts"],
};

export const TravauxCoproFeature: FeatureModule = {
    id: "travaux-copro",
    name: "Travaux collectifs",
    navigation: {
        main: {
            icon: "HardHat",
            label: "Travaux",
            href: "/dashboard/travaux-copro",
            order: 15,
        },
    },
    routes: ["/dashboard/travaux-copro", "/dashboard/travaux-copro/[id]"],
    dependencies: ["coproprietes"],
    i18n: {
        singular: "Travaux",
        plural: "Travaux collectifs",
    },
    permissions: ["canViewProducts"],
};

export const ComptaCoproFeature: FeatureModule = {
    id: "compta-copro",
    name: "Comptabilité copropriété",
    navigation: {
        main: {
            icon: "Calculator",
            label: "Comptabilité",
            href: "/dashboard/compta-copro",
            order: 16,
        },
    },
    routes: ["/dashboard/compta-copro"],
    dependencies: ["coproprietes"],
    i18n: {
        singular: "Écriture",
        plural: "Comptabilité",
    },
    permissions: ["canViewProducts"],
};

export const ConseilSyndicalFeature: FeatureModule = {
    id: "conseil-syndical",
    name: "Conseil syndical",
    navigation: {
        main: {
            icon: "Users",
            label: "Conseil syndical",
            href: "/dashboard/conseil-syndical",
            order: 17,
        },
    },
    routes: ["/dashboard/conseil-syndical"],
    dependencies: ["coproprietes"],
    i18n: {
        singular: "Membre",
        plural: "Conseil syndical",
    },
    permissions: ["canViewProducts"],
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
    agenda: AgendaFeature,
    prestations: PrestationsFeature,
    equipe: EquipeFeature,
    cabines: CabinesFeature,
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

    // Plumbing/Heating specific
    interventions: InterventionsFeature,
    "stock-camionnette": StockCamionnetteFeature,
    contrats: ContratsEntretienFeature,
    planning: PlanningFeature,
    flotte: FlotteFeature,
    equipements: EquipementsFeature,
    "entretiens-planifier": EntretiensPlanifierFeature,

    // Fitness / Gym specific
    "abonnements-fitness": AbonnementsFitnessFeature,
    "cours-fitness": CoursFitnessFeature,
    "salles-fitness": SallesFitnessFeature,
    "check-in": CheckInFeature,
    coachs: CoachsFeature,

    // Consulting / Service intellectuel specific
    missions: MissionsFeature,
    timesheet: TimesheetFeature,

    // Accounting / Comptabilite specific
    echeances: EcheancesFeature,

    // Juridique / Law firm specific
    affaires: AffairesFeature,
    diligences: DiligencesFeature,
    "echeances-proc": EcheancesProcFeature,

    // Immobilier - Agent Immobilier
    "biens-immo": BiensImmoFeature,
    mandats: MandatsFeature,
    visites: VisitesImmoFeature,
    estimations: EstimationsFeature,
    matching: MatchingFeature,
    diffusion: DiffusionFeature,
    pipeline: PipelineFeature,

    // Immobilier - Gestion Locative
    baux: BauxFeature,
    loyers: LoyersFeature,
    impayes: ImpayesFeature,
    "etats-lieux": EtatsLieuxFeature,
    "travaux-locatifs": TravauxLocatifsFeature,

    // Immobilier - Syndic
    coproprietes: CoproprietesFeature,
    lots: LotsFeature,
    charges: ChargesFeature,
    ag: AGFeature,
    "travaux-copro": TravauxCoproFeature,
    "compta-copro": ComptaCoproFeature,
    "conseil-syndical": ConseilSyndicalFeature,

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
