/**
 * Capabilities (fonctionnalités activables par business type)
 * Chaque capability représente un module ou une feature spécifique
 */

export const CAPABILITIES = [
    // === INTERVENTION capabilities ===
    "domicile", // Interventions chez le client
    "atelier", // Réparations en atelier/boutique
    "suivi_bien", // Suivi de bien client (véhicule, PC, etc.)
    "urgence", // Gestion des urgences/astreintes
    "contrats", // Contrats de maintenance
    "garanties", // Suivi des garanties
    "stock_camionnette", // Stock mobile (camionnette/véhicule)

    // === POINT_DE_VENTE capabilities ===
    "pos", // Caisse / Point of Sale
    "tables", // Gestion des tables (restaurant)
    "tickets", // Tickets/reçus rapides
    "commandes_rapides", // Commandes en mode rapide

    // === RENDEZ_VOUS capabilities ===
    "agenda", // Calendrier/planning RDV
    "creneaux", // Gestion des créneaux horaires
    "rappels_sms", // Rappels SMS automatiques
    "recurrence", // RDV récurrents

    // === SERVICE_INTELLECTUEL capabilities ===
    "temps_passe", // Suivi du temps passé
    "projets", // Gestion de projets
    "facturation_horaire", // Facturation au temps

    // === COMMERCE capabilities ===
    "catalogue", // Catalogue produits
    "stock", // Gestion des stocks
    "ventes", // Suivi des ventes

    // === IMMOBILIER capabilities ===
    "mandats", // Gestion des mandats
    "biens", // Gestion des biens immobiliers
    "visites", // Planification des visites

    // === BASE capabilities (tous les business) ===
    "clients", // Gestion clients
    "documents", // Devis/Factures/Avoirs
    "analytics", // Statistiques de base
    "fidelite", // Programme de fidélité
] as const;

export type Capability = (typeof CAPABILITIES)[number];

// Capabilities de base disponibles pour tous les business types
export const BASE_CAPABILITIES: Capability[] = [
    "clients",
    "documents",
    "analytics",
    "fidelite",
];

// Capabilities par catégorie (sans les BASE)
export const CATEGORY_SPECIFIC_CAPABILITIES = {
    INTERVENTION: [
        "domicile",
        "atelier",
        "suivi_bien",
        "urgence",
        "contrats",
        "garanties",
        "stock_camionnette",
    ] as Capability[],
    POINT_DE_VENTE: [
        "pos",
        "tables",
        "tickets",
        "commandes_rapides",
    ] as Capability[],
    RENDEZ_VOUS: [
        "agenda",
        "creneaux",
        "rappels_sms",
        "recurrence",
    ] as Capability[],
    SERVICE_INTELLECTUEL: [
        "temps_passe",
        "projets",
        "facturation_horaire",
    ] as Capability[],
    COMMERCE: ["catalogue", "stock", "ventes"] as Capability[],
    IMMOBILIER: ["mandats", "biens", "visites"] as Capability[],
    GENERAL: [] as Capability[],
} as const;

// Labels pour l'affichage UI
export const CAPABILITY_LABELS: Record<Capability, string> = {
    // INTERVENTION
    domicile: "Interventions à domicile",
    atelier: "Réparations en atelier",
    suivi_bien: "Suivi de biens clients",
    urgence: "Gestion des urgences",
    contrats: "Contrats de maintenance",
    garanties: "Suivi des garanties",
    stock_camionnette: "Stock mobile/camionnette",
    // POINT_DE_VENTE
    pos: "Caisse / POS",
    tables: "Gestion des tables",
    tickets: "Tickets rapides",
    commandes_rapides: "Commandes rapides",
    // RENDEZ_VOUS
    agenda: "Agenda / Planning",
    creneaux: "Créneaux horaires",
    rappels_sms: "Rappels SMS",
    recurrence: "RDV récurrents",
    // SERVICE_INTELLECTUEL
    temps_passe: "Suivi du temps",
    projets: "Gestion de projets",
    facturation_horaire: "Facturation horaire",
    // COMMERCE
    catalogue: "Catalogue produits",
    stock: "Gestion des stocks",
    ventes: "Suivi des ventes",
    // IMMOBILIER
    mandats: "Gestion des mandats",
    biens: "Gestion des biens",
    visites: "Planification visites",
    // BASE
    clients: "Gestion clients",
    documents: "Devis & Factures",
    analytics: "Statistiques",
    fidelite: "Programme fidélité",
};

// Helper pour vérifier si une valeur est une Capability valide
export function isCapability(value: string): value is Capability {
    return CAPABILITIES.includes(value as Capability);
}
