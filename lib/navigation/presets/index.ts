/**
 * Business Presets - Navigation configurations for each business type
 * Each preset defines which features are enabled and how they're customized
 *
 * @see business-hierarchy.ts pour les catégories et capabilities
 * @see CapabilityService pour interroger la hiérarchie
 */

import { BusinessType } from "@/lib/types/business";
import type { BusinessCategory } from "@/lib/types/business-category";
import {
    BUSINESS_TYPE_TO_CATEGORY,
    CATEGORY_TO_BUSINESS_TYPES,
} from "@/lib/types/business-hierarchy";
import { BusinessPreset } from "../core/types";

// ============================================
// GENERAL (Default fallback)
// ============================================

const GeneralPreset: BusinessPreset = {
    id: "GENERAL" as BusinessType,
    name: "Entreprise générale",
    icon: "Building2",
    color: "#6B7280",
    description: "Configuration standard pour tout type d'activité",

    features: [
        "dashboard",
        "clients",
        "products",
        "inventory",
        "quotes",
        "invoices",
        "credits",
        "analytics",
        "settings",
    ],

    availableArticleTypes: ["PRODUIT", "SERVICE", "PIECE"],
};

// ============================================
// ARTISANAT & BTP (Base)
// ============================================

const ArtisanBasePreset: Partial<BusinessPreset> = {
    features: [
        "dashboard",
        "clients",
        "segments",
        "products",
        "inventory",
        "quotes",
        "invoices",
        "credits",
        "loyalty",
        "analytics",
        "personnel",
        "settings",
    ],

    availableArticleTypes: ["PRODUIT", "SERVICE", "PIECE"],

    i18n: {
        products: {
            singular: "Article",
            plural: "Catalogue & Pièces",
        },
    },
};

const PlomberiePreset: BusinessPreset = {
    id: "PLOMBERIE" as BusinessType,
    name: "Plomberie",
    icon: "Wrench",
    color: "#3B82F6",
    description: "Artisan plombier, installation sanitaire",
    ...ArtisanBasePreset,
    features: [
        ...(ArtisanBasePreset.features || []),
        "interventions",
        "stock-camionnette",
        "contrats",
        "planning",
        "flotte",
    ],
};

const ElectricitePreset: BusinessPreset = {
    id: "ELECTRICITE" as BusinessType,
    name: "Électricité",
    icon: "Zap",
    color: "#EAB308",
    description: "Électricien, installation électrique",
    ...ArtisanBasePreset,
    features: [
        ...(ArtisanBasePreset.features || []),
        "interventions",
        "stock-camionnette",
        "contrats",
        "planning",
        "flotte",
    ],
    quickActions: [
        {
            feature: "interventions",
            action: "new",
            label: "Nouvelle intervention",
            icon: "Zap",
        },
    ],
};

const ChauffagePreset: BusinessPreset = {
    id: "CHAUFFAGE" as BusinessType,
    name: "Chauffage",
    icon: "Flame",
    color: "#F97316",
    description: "Chauffagiste, climatisation, entretien chaudières",
    ...ArtisanBasePreset,
    features: [
        ...(ArtisanBasePreset.features || []),
        "interventions",
        "stock-camionnette",
        "contrats",
        "planning",
        "flotte",
        "equipements",
        "entretiens-planifier",
    ],
    quickActions: [
        {
            feature: "interventions",
            action: "new",
            label: "Nouvelle intervention",
            icon: "Wrench",
        },
        {
            feature: "equipements",
            action: "new",
            label: "Nouvel équipement",
            icon: "Flame",
        },
    ],
    dashboardWidgets: [
        "entretiens-urgents",
        "controles-a-planifier",
        "interventions-en-cours",
        "equipements-stats",
    ],
};

const MenuiseriePreset: BusinessPreset = {
    id: "MENUISERIE" as BusinessType,
    name: "Menuiserie",
    icon: "Hammer",
    color: "#92400E",
    description: "Menuisier, ébéniste",
    ...ArtisanBasePreset,
    features: [
        ...(ArtisanBasePreset.features || []),
        "interventions",
        "stock-camionnette",
        "contrats",
        "planning",
        "flotte",
    ],
    quickActions: [
        {
            feature: "interventions",
            action: "new",
            label: "Nouvelle intervention",
            icon: "Hammer",
        },
    ],
};

const PeinturePreset: BusinessPreset = {
    id: "PEINTURE" as BusinessType,
    name: "Peinture",
    icon: "Paintbrush",
    color: "#0891B2",
    description: "Peintre en bâtiment",
    ...ArtisanBasePreset,
    features: [
        ...(ArtisanBasePreset.features || []),
        "interventions",
        "stock-camionnette",
        "contrats",
        "planning",
        "flotte",
    ],
    quickActions: [
        {
            feature: "interventions",
            action: "new",
            label: "Nouveau chantier",
            icon: "Paintbrush",
        },
    ],
};

const MaconneriePreset: BusinessPreset = {
    id: "MACONNERIE" as BusinessType,
    name: "Maçonnerie",
    icon: "HardHat",
    color: "#78350F",
    description: "Maçon, gros œuvre",
    ...ArtisanBasePreset,
    features: [
        ...(ArtisanBasePreset.features || []),
        "interventions",
        "stock-camionnette",
        "contrats",
        "planning",
        "flotte",
    ],
    quickActions: [
        {
            feature: "interventions",
            action: "new",
            label: "Nouveau chantier",
            icon: "HardHat",
        },
    ],
};

// ============================================
// RESTAURATION & ALIMENTATION
// ============================================

const RestaurantPreset: BusinessPreset = {
    id: "RESTAURATION" as BusinessType,
    name: "Restaurant / Café / Bar",
    icon: "UtensilsCrossed",
    color: "#EF4444",
    description: "Restaurant, café, bar, food truck",

    features: [
        "dashboard",
        "pos",
        "menu", // Menu & Carte (plats, boissons, etc.)
        "tables",
        "reservations",
        "clients",
        "loyalty",
        "invoices",
        "analytics",
        "personnel",
        "settings",
    ],

    i18n: {
        invoices: {
            singular: "Note",
            plural: "Notes",
            new: "Nouvelle note",
        },
        reservations: {
            singular: "Réservation",
            plural: "Réservations & Tables",
        },
    },

    settings: {
        menu: {
            showAllergens: true,
            showPreparationTime: true,
            showCategories: true,
        },
        pos: {
            defaultView: "tables",
            showTableMap: true,
        },
    },

    quickActions: [
        {
            feature: "reservations",
            action: "new",
            label: "Nouvelle réservation",
            icon: "CalendarDays",
        },
        {
            feature: "pos",
            action: "open",
            label: "Ouvrir une table",
            icon: "UtensilsCrossed",
        },
    ],

    dashboardWidgets: [
        "reservations-today",
        "tables-status",
        "revenue-today",
        "popular-dishes",
    ],
};

const BoulangeriePreset: BusinessPreset = {
    id: "BOULANGERIE" as BusinessType,
    name: "Boulangerie / Pâtisserie",
    icon: "Croissant",
    color: "#D97706",
    description: "Boulanger, pâtissier",

    features: [
        "dashboard",
        "pos",
        "products",
        "inventory",
        "clients",
        "loyalty",
        "invoices",
        "analytics",
        "personnel",
        "settings",
    ],

    i18n: {
        products: {
            singular: "Produit",
            plural: "Pains & Pâtisseries",
        },
    },

    settings: {
        inventory: {
            trackExpiry: true,
            dailyProduction: true,
        },
    },
};

// ============================================
// BEAUTÉ & BIEN-ÊTRE
// ============================================

const CoiffurePreset: BusinessPreset = {
    id: "COIFFURE" as BusinessType,
    name: "Salon de coiffure",
    icon: "Scissors",
    color: "#EC4899",
    description: "Coiffeur, barbier",

    features: [
        "dashboard",
        "agenda", // Rendez-vous
        "prestations", // Services proposés
        "equipe", // Employés et disponibilités
        "clients",
        "loyalty",
        "invoices",
        "analytics",
        "campaigns",
        "settings",
    ],

    i18n: {
        prestations: {
            singular: "Prestation",
            plural: "Prestations",
        },
        agenda: {
            singular: "Rendez-vous",
            plural: "Agenda",
        },
        equipe: {
            singular: "Employé",
            plural: "Équipe",
        },
    },

    settings: {
        agenda: {
            defaultDuration: 60,
            enableSmsReminders: true,
        },
    },

    quickActions: [
        {
            feature: "agenda",
            action: "new",
            label: "Nouveau RDV",
            icon: "CalendarDays",
        },
        {
            feature: "clients",
            action: "new",
            label: "Nouveau client",
            icon: "UserPlus",
        },
    ],

    dashboardWidgets: [
        "rdv-today",
        "rdv-upcoming",
        "revenue-today",
        "clients-new",
    ],
};

const EsthetiquePreset: BusinessPreset = {
    id: "ESTHETIQUE" as BusinessType,
    name: "Esthétique / Spa",
    icon: "Sparkles",
    color: "#DB2777",
    description: "Institut de beauté, spa, massage",

    features: [
        "dashboard",
        "agenda", // Planning RDV
        "prestations", // Soins proposés
        "equipe", // Esthéticiennes/praticiens
        "cabines", // Cabines et salles de soins
        "clients",
        "loyalty",
        "invoices",
        "analytics",
        "campaigns",
        "settings",
    ],

    i18n: {
        prestations: {
            singular: "Soin",
            plural: "Soins",
        },
        equipe: {
            singular: "Praticien",
            plural: "Équipe",
        },
        cabines: {
            singular: "Cabine",
            plural: "Cabines",
        },
        agenda: {
            singular: "Rendez-vous",
            plural: "Agenda",
        },
    },

    settings: {
        defaultAppointmentDuration: 60,
        workingHours: {
            start: "09:00",
            end: "19:00",
        },
        allowOnlineBooking: true,
    },

    quickActions: [
        {
            id: "new-rdv",
            label: "Nouveau RDV",
            icon: "CalendarPlus",
            href: "/dashboard/agenda",
        },
        {
            id: "new-client",
            label: "Nouveau client",
            icon: "UserPlus",
            href: "/dashboard/clients/new",
        },
    ],

    dashboardWidgets: [
        "rdv-today",
        "rdv-upcoming",
        "revenue-today",
        "clients-new",
    ],
};

const FitnessPreset: BusinessPreset = {
    id: "FITNESS" as BusinessType,
    name: "Fitness / Sport",
    icon: "Dumbbell",
    color: "#059669",
    description: "Salle de sport, coach sportif, coaching personnel",

    features: [
        "dashboard",
        "check-in", // Check-in des membres
        "clients", // Gestion des membres
        "abonnements-fitness", // Abonnements salle
        "cours-fitness", // Cours collectifs
        "salles-fitness", // Salles et zones
        "coachs", // Équipe de coachs
        "loyalty", // Programme de fidélité
        "invoices", // Facturation
        "analytics", // Statistiques
        "campaigns", // Marketing
        "settings",
    ],

    i18n: {
        clients: {
            singular: "Membre",
            plural: "Membres",
        },
    },

    quickActions: [
        {
            feature: "check-in",
            action: "new",
            label: "Check-in membre",
            icon: "UserCheck",
        },
        {
            feature: "abonnements-fitness",
            action: "new",
            label: "Nouvel abonnement",
            icon: "CreditCard",
        },
        {
            feature: "clients",
            action: "new",
            label: "Nouveau membre",
            icon: "UserPlus",
        },
    ],

    dashboardWidgets: [
        "presences-today",
        "abonnements-actifs",
        "cours-today",
        "revenue-month",
    ],
};

// ============================================
// SERVICES PROFESSIONNELS
// ============================================

const InformatiquePreset: BusinessPreset = {
    id: "INFORMATIQUE" as BusinessType,
    name: "Services informatiques",
    icon: "Monitor",
    color: "#0EA5E9",
    description: "Dépannage et services IT",

    features: [
        "dashboard",
        "clients",
        "repairs", // Réparations
        "catalogue", // Catalogue unifié (produits, services, occasion, pièces)
        "rachats", // Rachats d'occasion
        "atelier", // Démontage & ressources
        "quotes",
        "invoices",
        "analytics",
        "personnel",
        "settings",
    ],

    availableArticleTypes: ["PRODUIT", "SERVICE", "OCCASION", "PIECE"],

    i18n: {
        catalogue: {
            singular: "Article",
            plural: "Catalogue",
        },
        repairs: {
            singular: "Réparation",
            plural: "Réparations",
        },
    },
};

const GaragePreset: BusinessPreset = {
    id: "GARAGE" as BusinessType,
    name: "Garage automobile",
    icon: "Car",
    color: "#1F2937",
    description: "Réparation et entretien automobile",

    features: [
        "dashboard",
        "clients",
        "interventions",
        "contrats",
        "planning",
        "products",
        "inventory",
        "quotes",
        "invoices",
        "analytics",
        "personnel",
        "settings",
    ],

    quickActions: [
        {
            feature: "interventions",
            action: "new",
            label: "Nouvelle intervention",
            icon: "Car",
        },
    ],

    i18n: {
        products: {
            singular: "Pièce",
            plural: "Pièces & Prestations",
        },
        interventions: {
            singular: "Intervention",
            plural: "Interventions",
        },
        planning: {
            singular: "Planning",
            plural: "Planning Atelier",
        },
    },
};

const ConsultingPreset: BusinessPreset = {
    id: "CONSULTING" as BusinessType,
    name: "Conseil / Formation",
    icon: "Briefcase",
    color: "#8B5CF6",
    description: "Consultant, formateur, coach",

    features: [
        "dashboard",
        "clients",
        "missions", // Gestion des missions de consulting
        "timesheet", // Suivi du temps passé
        "quotes",
        "invoices",
        "analytics",
        "settings",
    ],

    i18n: {
        missions: {
            singular: "Mission",
            plural: "Missions",
        },
        timesheet: {
            singular: "Entrée",
            plural: "Temps passé",
        },
        clients: {
            singular: "Client",
            plural: "Clients",
        },
    },

    quickActions: [
        {
            feature: "missions",
            action: "new",
            label: "Nouvelle mission",
            icon: "Briefcase",
        },
        {
            feature: "timesheet",
            action: "new",
            label: "Saisir du temps",
            icon: "Clock",
        },
    ],

    dashboardWidgets: [
        "missions-en-cours",
        "heures-semaine",
        "a-facturer",
        "taux-utilisation",
    ],
};

const ComptabilitePreset: BusinessPreset = {
    id: "COMPTABILITE" as BusinessType,
    name: "Cabinet comptable",
    icon: "Calculator",
    color: "#166534",
    description: "Expert-comptable, gestion comptable",

    features: [
        "dashboard",
        "clients",
        "missions", // Dossiers clients (réutilise missions avec i18n)
        "timesheet", // Suivi du temps passé
        "echeances", // Échéances fiscales
        "quotes",
        "invoices",
        "analytics",
        "settings",
    ],

    i18n: {
        missions: {
            singular: "Dossier",
            plural: "Dossiers",
        },
        timesheet: {
            singular: "Entrée",
            plural: "Temps passé",
        },
        clients: {
            singular: "Client",
            plural: "Clients",
        },
        echeances: {
            singular: "Échéance",
            plural: "Échéances fiscales",
        },
    },

    quickActions: [
        {
            feature: "missions",
            action: "new",
            label: "Nouveau dossier",
            icon: "FolderPlus",
        },
        {
            feature: "timesheet",
            action: "new",
            label: "Saisir du temps",
            icon: "Clock",
        },
    ],

    dashboardWidgets: [
        "echeances-proches",
        "dossiers-actifs",
        "heures-semaine",
        "a-facturer",
    ],
};

const JuridiquePreset: BusinessPreset = {
    id: "JURIDIQUE" as BusinessType,
    name: "Cabinet juridique",
    icon: "Scale",
    color: "#1E40AF",
    description: "Avocat, juriste, notaire",

    features: [
        "dashboard",
        "clients",
        "affaires", // Dossiers/affaires juridiques
        "diligences", // Temps passé et actions
        "echeances-proc", // Échéances procédurales (audiences, délais)
        "quotes", // Conventions d'honoraires
        "invoices",
        "analytics",
        "settings",
    ],

    i18n: {
        affaires: {
            singular: "Affaire",
            plural: "Affaires",
        },
        diligences: {
            singular: "Diligence",
            plural: "Diligences",
        },
        clients: {
            singular: "Client",
            plural: "Clients",
        },
        "echeances-proc": {
            singular: "Échéance",
            plural: "Échéances procédurales",
        },
        quotes: {
            singular: "Convention",
            plural: "Conventions d'honoraires",
        },
    },

    quickActions: [
        {
            feature: "affaires",
            action: "new",
            label: "Nouvelle affaire",
            icon: "FolderPlus",
        },
        {
            feature: "diligences",
            action: "new",
            label: "Saisir une diligence",
            icon: "Clock",
        },
        {
            feature: "echeances-proc",
            action: "new",
            label: "Ajouter échéance",
            icon: "Calendar",
        },
    ],

    dashboardWidgets: [
        "audiences-proches",
        "affaires-actives",
        "diligences-semaine",
        "a-facturer",
        "delais-proches",
    ],
};

// ============================================
// COMMERCE & IMMOBILIER
// ============================================

const CommerceDetailPreset: BusinessPreset = {
    id: "COMMERCE_DETAIL" as BusinessType,
    name: "Commerce de détail",
    icon: "ShoppingCart",
    color: "#7C3AED",
    description: "Boutique, magasin",

    features: [
        "dashboard",
        "pos",
        "products",
        "inventory",
        "clients",
        "loyalty",
        "invoices",
        "analytics",
        "stores",
        "settings",
    ],

    settings: {
        pos: {
            defaultView: "products",
        },
    },
};

// ============================================
// IMMOBILIER - 3 TYPES SPÉCIALISÉS
// ============================================

const AgentImmobilierPreset: BusinessPreset = {
    id: "AGENT_IMMOBILIER" as BusinessType,
    name: "Agent immobilier",
    icon: "Key",
    color: "#0284C7",
    description: "Agent immobilier, mandataire (carte T)",

    features: [
        "dashboard",
        "clients", // Acquéreurs, Vendeurs
        "biens-immo", // Portefeuille de biens
        "mandats", // Gestion des mandats
        "visites", // Planification des visites
        "estimations", // Estimations de biens
        "matching", // Matching acquéreurs/biens
        "diffusion", // Multi-diffusion annonces (SeLoger, LeBonCoin, etc.)
        "pipeline", // Pipeline transaction (mandat → compromis → acte)
        "agenda", // Planning des RDV
        "invoices", // Honoraires
        "analytics",
        "settings",
    ],

    i18n: {
        clients: {
            singular: "Contact",
            plural: "Contacts",
        },
        "biens-immo": {
            singular: "Bien",
            plural: "Biens immobiliers",
        },
        mandats: {
            singular: "Mandat",
            plural: "Mandats",
        },
        visites: {
            singular: "Visite",
            plural: "Visites",
        },
        estimations: {
            singular: "Estimation",
            plural: "Estimations",
        },
        matching: {
            singular: "Recherche",
            plural: "Matching acquéreurs",
        },
        diffusion: {
            singular: "Annonce",
            plural: "Diffusion annonces",
        },
        pipeline: {
            singular: "Transaction",
            plural: "Pipeline",
        },
        invoices: {
            singular: "Honoraire",
            plural: "Honoraires",
        },
    },

    quickActions: [
        {
            feature: "biens-immo",
            action: "new",
            label: "Nouveau bien",
            icon: "Home",
        },
        {
            feature: "mandats",
            action: "new",
            label: "Nouveau mandat",
            icon: "FileSignature",
        },
        {
            feature: "visites",
            action: "new",
            label: "Planifier visite",
            icon: "Calendar",
        },
        {
            feature: "estimations",
            action: "new",
            label: "Nouvelle estimation",
            icon: "Calculator",
        },
    ],

    dashboardWidgets: [
        "mandats-actifs",
        "visites-today",
        "leads-nouveaux",
        "pipeline-stats",
        "diffusion-stats",
    ],
};

const GestionLocativePreset: BusinessPreset = {
    id: "GESTION_LOCATIVE" as BusinessType,
    name: "Gestion locative",
    icon: "Building",
    color: "#059669",
    description: "Administrateur de biens, gestionnaire locatif (carte G)",

    features: [
        "dashboard",
        "clients", // Propriétaires et Locataires
        "biens-immo", // Biens gérés
        "baux", // Gestion des baux
        "loyers", // Appels de loyers et quittances
        "impayes", // Suivi des impayés et relances
        "etats-lieux", // États des lieux entrée/sortie
        "travaux-locatifs", // Travaux et incidents
        "invoices", // Honoraires de gestion
        "analytics",
        "settings",
    ],

    i18n: {
        clients: {
            singular: "Contact",
            plural: "Propriétaires & Locataires",
        },
        "biens-immo": {
            singular: "Bien",
            plural: "Biens gérés",
        },
        baux: {
            singular: "Bail",
            plural: "Baux",
        },
        loyers: {
            singular: "Loyer",
            plural: "Loyers & Quittances",
        },
        impayes: {
            singular: "Impayé",
            plural: "Impayés",
        },
        "etats-lieux": {
            singular: "État des lieux",
            plural: "États des lieux",
        },
        "travaux-locatifs": {
            singular: "Incident",
            plural: "Travaux & Incidents",
        },
    },

    quickActions: [
        {
            feature: "baux",
            action: "new",
            label: "Nouveau bail",
            icon: "FileSignature",
        },
        {
            feature: "loyers",
            action: "generate",
            label: "Générer appels",
            icon: "Receipt",
        },
        {
            feature: "etats-lieux",
            action: "new",
            label: "État des lieux",
            icon: "ClipboardCheck",
        },
        {
            feature: "travaux-locatifs",
            action: "new",
            label: "Signaler incident",
            icon: "AlertTriangle",
        },
    ],

    dashboardWidgets: [
        "loyers-a-percevoir",
        "impayes-encours",
        "baux-a-renouveler",
        "etats-lieux-planifies",
        "incidents-ouverts",
    ],
};

const SyndicCoproprietePreset: BusinessPreset = {
    id: "SYNDIC_COPROPRIETE" as BusinessType,
    name: "Syndic de copropriété",
    icon: "Building2",
    color: "#7C3AED",
    description: "Syndic de copropriété, gestion d'immeubles",

    features: [
        "dashboard",
        "clients", // Copropriétaires
        "coproprietes", // Gestion des immeubles
        "lots", // Lots et tantièmes
        "charges", // Appels de charges
        "ag", // Assemblées générales
        "travaux-copro", // Travaux collectifs
        "compta-copro", // Comptabilité copropriété
        "conseil-syndical", // Conseil syndical
        "invoices", // Honoraires syndic
        "analytics",
        "settings",
    ],

    i18n: {
        clients: {
            singular: "Copropriétaire",
            plural: "Copropriétaires",
        },
        coproprietes: {
            singular: "Copropriété",
            plural: "Copropriétés",
        },
        lots: {
            singular: "Lot",
            plural: "Lots & Tantièmes",
        },
        charges: {
            singular: "Appel",
            plural: "Appels de charges",
        },
        ag: {
            singular: "AG",
            plural: "Assemblées générales",
        },
        "travaux-copro": {
            singular: "Travaux",
            plural: "Travaux collectifs",
        },
        "compta-copro": {
            singular: "Écriture",
            plural: "Comptabilité",
        },
        "conseil-syndical": {
            singular: "Membre",
            plural: "Conseil syndical",
        },
    },

    quickActions: [
        {
            feature: "charges",
            action: "generate",
            label: "Appel de charges",
            icon: "Receipt",
        },
        {
            feature: "ag",
            action: "new",
            label: "Convoquer AG",
            icon: "Users",
        },
        {
            feature: "travaux-copro",
            action: "new",
            label: "Nouveau chantier",
            icon: "HardHat",
        },
    ],

    dashboardWidgets: [
        "charges-a-percevoir",
        "ag-prochaines",
        "travaux-en-cours",
        "impayes-copro",
        "comptes-copro",
    ],
};

// ============================================
// SANTÉ
// ============================================

const SantePreset: BusinessPreset = {
    id: "SANTE" as BusinessType,
    name: "Santé",
    icon: "Heart",
    color: "#DC2626",
    description: "Professions médicales et paramédicales",

    features: [
        "dashboard",
        "reservations", // RDV patients
        "clients", // Patients
        "products", // Actes & soins
        "invoices",
        "analytics",
        "settings",
    ],

    i18n: {
        products: {
            singular: "Acte",
            plural: "Actes & Soins",
        },
        clients: {
            singular: "Patient",
            plural: "Patients",
        },
        reservations: {
            singular: "Rendez-vous",
            plural: "Agenda",
        },
    },
};

// ============================================
// EXPORT
// ============================================

export const BUSINESS_PRESETS: Record<BusinessType, BusinessPreset> = {
    GENERAL: GeneralPreset,

    // Artisanat & BTP
    PLOMBERIE: PlomberiePreset,
    ELECTRICITE: ElectricitePreset,
    CHAUFFAGE: ChauffagePreset,
    MENUISERIE: MenuiseriePreset,
    PEINTURE: PeinturePreset,
    MACONNERIE: MaconneriePreset,

    // Restauration & Alimentation
    RESTAURATION: RestaurantPreset,
    BOULANGERIE: BoulangeriePreset,

    // Beauté & Bien-être
    COIFFURE: CoiffurePreset,
    ESTHETIQUE: EsthetiquePreset,
    FITNESS: FitnessPreset,

    // Services professionnels
    INFORMATIQUE: InformatiquePreset,
    GARAGE: GaragePreset,
    CONSULTING: ConsultingPreset,
    COMPTABILITE: ComptabilitePreset,
    JURIDIQUE: JuridiquePreset,

    // Commerce
    COMMERCE_DETAIL: CommerceDetailPreset,

    // Immobilier - 3 types spécialisés
    AGENT_IMMOBILIER: AgentImmobilierPreset,
    GESTION_LOCATIVE: GestionLocativePreset,
    SYNDIC_COPROPRIETE: SyndicCoproprietePreset,

    // Santé
    SANTE: SantePreset,
};

// ============================================
// HELPERS - Intégration avec la hiérarchie
// ============================================

/**
 * Récupère la catégorie d'un business type
 */
export function getPresetCategory(type: BusinessType): BusinessCategory {
    return BUSINESS_TYPE_TO_CATEGORY[type];
}

/**
 * Récupère tous les presets d'une catégorie
 */
export function getPresetsByCategory(
    category: BusinessCategory
): BusinessPreset[] {
    const types = CATEGORY_TO_BUSINESS_TYPES[category];
    return types.map((type) => BUSINESS_PRESETS[type]);
}

/**
 * Récupère les presets groupés par catégorie
 */
export function getPresetsGroupedByCategory(): Record<
    BusinessCategory,
    BusinessPreset[]
> {
    const result = {} as Record<BusinessCategory, BusinessPreset[]>;

    for (const [category, types] of Object.entries(
        CATEGORY_TO_BUSINESS_TYPES
    )) {
        result[category as BusinessCategory] = types.map(
            (type) => BUSINESS_PRESETS[type]
        );
    }

    return result;
}
