/**
 * Business Presets - Navigation configurations for each business type
 * Each preset defines which features are enabled and how they're customized
 */

import { BusinessPreset } from "../core/types";
import { BusinessType } from "@prisma/client";

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
  features: [...(ArtisanBasePreset.features || [])],
};

const ElectricitePreset: BusinessPreset = {
  id: "ELECTRICITE" as BusinessType,
  name: "Électricité",
  icon: "Zap",
  color: "#EAB308",
  description: "Électricien, installation électrique",
  ...ArtisanBasePreset,
  features: [...(ArtisanBasePreset.features || [])],
};

const ChauffagePreset: BusinessPreset = {
  id: "CHAUFFAGE" as BusinessType,
  name: "Chauffage",
  icon: "Flame",
  color: "#F97316",
  description: "Chauffagiste, climatisation",
  ...ArtisanBasePreset,
  features: [...(ArtisanBasePreset.features || [])],
};

const MenuiseriePreset: BusinessPreset = {
  id: "MENUISERIE" as BusinessType,
  name: "Menuiserie",
  icon: "Hammer",
  color: "#92400E",
  description: "Menuisier, ébéniste",
  ...ArtisanBasePreset,
  features: [...(ArtisanBasePreset.features || [])],
};

const PeinturePreset: BusinessPreset = {
  id: "PEINTURE" as BusinessType,
  name: "Peinture",
  icon: "Paintbrush",
  color: "#0891B2",
  description: "Peintre en bâtiment",
  ...ArtisanBasePreset,
  features: [...(ArtisanBasePreset.features || [])],
};

const MaconneriePreset: BusinessPreset = {
  id: "MACONNERIE" as BusinessType,
  name: "Maçonnerie",
  icon: "HardHat",
  color: "#78350F",
  description: "Maçon, gros œuvre",
  ...ArtisanBasePreset,
  features: [...(ArtisanBasePreset.features || [])],
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
    "tables",
    "reservations",
    "products",       // Menu items
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
      singular: "Plat",
      plural: "Menu & Carte",
      catalog: "Notre carte",
    },
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
    products: {
      showAllergens: true,
      showPreparationTime: true,
    },
    pos: {
      defaultView: "tables",
      showTableMap: true,
    },
  },

  quickActions: [
    { feature: "reservations", action: "new", label: "Nouvelle réservation", icon: "CalendarDays" },
    { feature: "pos", action: "open", label: "Ouvrir une table", icon: "UtensilsCrossed" },
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
    "reservations",
    "clients",
    "loyalty",
    "products",       // Services & Products
    "invoices",
    "analytics",
    "personnel",
    "campaigns",
    "settings",
  ],

  i18n: {
    products: {
      singular: "Prestation",
      plural: "Prestations & Produits",
    },
    reservations: {
      singular: "Rendez-vous",
      plural: "Agenda",
    },
  },

  settings: {
    reservations: {
      defaultDuration: 60,
      enableSmsReminders: true,
    },
  },

  quickActions: [
    { feature: "reservations", action: "new", label: "Nouveau RDV", icon: "CalendarDays" },
    { feature: "clients", action: "new", label: "Nouveau client", icon: "UserPlus" },
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
    "reservations",
    "clients",
    "loyalty",
    "products",
    "invoices",
    "analytics",
    "personnel",
    "campaigns",
    "settings",
  ],

  i18n: {
    products: {
      singular: "Soin",
      plural: "Soins & Produits",
    },
    reservations: {
      singular: "Rendez-vous",
      plural: "Planning",
    },
  },
};

const FitnessPreset: BusinessPreset = {
  id: "FITNESS" as BusinessType,
  name: "Fitness / Sport",
  icon: "Dumbbell",
  color: "#059669",
  description: "Salle de sport, coach sportif",

  features: [
    "dashboard",
    "clients",
    "reservations",  // Cours collectifs
    "products",      // Abonnements & séances
    "invoices",
    "analytics",
    "personnel",
    "settings",
  ],

  i18n: {
    products: {
      singular: "Abonnement",
      plural: "Abonnements & Cours",
    },
    reservations: {
      singular: "Cours",
      plural: "Planning des cours",
    },
  },
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
    "products",      // Services
    "quotes",
    "invoices",
    "analytics",
    "personnel",
    "settings",
  ],

  i18n: {
    products: {
      singular: "Prestation",
      plural: "Prestations & Matériel",
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
    "reservations",  // RDV entretien
    "products",      // Pièces & prestations
    "inventory",
    "quotes",
    "invoices",
    "analytics",
    "personnel",
    "settings",
  ],

  i18n: {
    products: {
      singular: "Article",
      plural: "Pièces & Prestations",
    },
    reservations: {
      singular: "Intervention",
      plural: "Planning atelier",
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
    "products",      // Missions & formations
    "quotes",
    "invoices",
    "analytics",
    "settings",
  ],

  i18n: {
    products: {
      singular: "Prestation",
      plural: "Missions & Formations",
    },
  },
};

const ComptabilitePreset: BusinessPreset = {
  id: "COMPTABILITE" as BusinessType,
  name: "Comptabilité",
  icon: "Calculator",
  color: "#166534",
  description: "Expert-comptable",

  features: [
    "dashboard",
    "clients",
    "products",      // Prestations comptables
    "invoices",
    "analytics",
    "bank-reconciliation",
    "settings",
  ],

  i18n: {
    products: {
      singular: "Prestation",
      plural: "Prestations comptables",
    },
    clients: {
      singular: "Dossier",
      plural: "Dossiers clients",
    },
  },
};

const JuridiquePreset: BusinessPreset = {
  id: "JURIDIQUE" as BusinessType,
  name: "Juridique",
  icon: "Scale",
  color: "#1E40AF",
  description: "Avocat, notaire",

  features: [
    "dashboard",
    "clients",
    "products",      // Actes & consultations
    "quotes",
    "invoices",
    "analytics",
    "settings",
  ],

  i18n: {
    products: {
      singular: "Prestation",
      plural: "Actes & Consultations",
    },
  },
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

const ImmobilierPreset: BusinessPreset = {
  id: "IMMOBILIER" as BusinessType,
  name: "Immobilier",
  icon: "Home",
  color: "#0284C7",
  description: "Agence immobilière",

  features: [
    "dashboard",
    "clients",
    "products",      // Biens immobiliers
    "invoices",
    "analytics",
    "settings",
  ],

  i18n: {
    products: {
      singular: "Bien",
      plural: "Biens immobiliers",
    },
    clients: {
      singular: "Contact",
      plural: "Contacts",
    },
  },
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
    "reservations",  // RDV patients
    "clients",       // Patients
    "products",      // Actes & soins
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

  // Commerce & Immobilier
  COMMERCE_DETAIL: CommerceDetailPreset,
  IMMOBILIER: ImmobilierPreset,

  // Santé
  SANTE: SantePreset,
};
