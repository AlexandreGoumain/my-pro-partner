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
    "menu", // Menu & Carte (restaurant)
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

    // === AGENT_IMMOBILIER capabilities ===
    "mandats_immo", // Gestion des mandats (vente, location, exclusif, simple)
    "biens_immo", // Portefeuille de biens immobiliers
    "visites_immo", // Planification et suivi des visites
    "estimation_immo", // Estimation de biens
    "matching_immo", // Matching acquéreurs/biens
    "diffusion_annonces", // Multidiffusion (SeLoger, LeBonCoin...)
    "pipeline_transaction", // Pipeline de vente (mandat → compromis → acte)
    "honoraires_immo", // Gestion des honoraires et commissions

    // === GESTION_LOCATIVE capabilities ===
    "baux_locatifs", // Gestion des baux et contrats
    "loyers", // Appels de loyers et quittances
    "impayes_locatifs", // Suivi des impayés et relances
    "etats_lieux", // États des lieux entrée/sortie
    "travaux_locatifs", // Gestion des travaux et incidents
    "revision_loyers", // Révision annuelle des loyers
    "caf_apl", // Gestion APL/CAF

    // === SYNDIC_COPROPRIETE capabilities ===
    "coproprietes", // Gestion des copropriétés
    "lots_copro", // Gestion des lots et tantièmes
    "charges_copro", // Appels de charges
    "assemblees_generales", // AG et votes
    "travaux_copro", // Travaux collectifs
    "comptabilite_copro", // Comptabilité de copropriété
    "conseil_syndical", // Conseil syndical

    // === FITNESS capabilities ===
    "abonnements_fitness", // Gestion des abonnements salle de sport
    "cours_collectifs", // Cours collectifs (yoga, spinning, etc.)
    "salles_fitness", // Gestion des salles/zones
    "presences_fitness", // Check-in / présences des membres
    "planning_fitness", // Planning des cours

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
        "menu",
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
    IMMOBILIER: [
        // Agent Immobilier
        "mandats_immo",
        "biens_immo",
        "visites_immo",
        "estimation_immo",
        "matching_immo",
        "diffusion_annonces",
        "pipeline_transaction",
        "honoraires_immo",
        // Gestion Locative
        "baux_locatifs",
        "loyers",
        "impayes_locatifs",
        "etats_lieux",
        "travaux_locatifs",
        "revision_loyers",
        "caf_apl",
        // Syndic Copropriété
        "coproprietes",
        "lots_copro",
        "charges_copro",
        "assemblees_generales",
        "travaux_copro",
        "comptabilite_copro",
        "conseil_syndical",
    ] as Capability[],
    FITNESS: [
        "abonnements_fitness",
        "cours_collectifs",
        "salles_fitness",
        "presences_fitness",
        "planning_fitness",
    ] as Capability[],
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
    menu: "Menu & Carte",
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
    // AGENT_IMMOBILIER
    mandats_immo: "Gestion des mandats",
    biens_immo: "Portefeuille de biens",
    visites_immo: "Planification des visites",
    estimation_immo: "Estimations de biens",
    matching_immo: "Matching acquéreurs",
    diffusion_annonces: "Multidiffusion annonces",
    pipeline_transaction: "Pipeline de vente",
    honoraires_immo: "Honoraires & commissions",
    // GESTION_LOCATIVE
    baux_locatifs: "Gestion des baux",
    loyers: "Appels de loyers",
    impayes_locatifs: "Suivi des impayés",
    etats_lieux: "États des lieux",
    travaux_locatifs: "Travaux & incidents",
    revision_loyers: "Révision des loyers",
    caf_apl: "Gestion APL/CAF",
    // SYNDIC_COPROPRIETE
    coproprietes: "Gestion des copropriétés",
    lots_copro: "Lots & tantièmes",
    charges_copro: "Appels de charges",
    assemblees_generales: "Assemblées générales",
    travaux_copro: "Travaux collectifs",
    comptabilite_copro: "Comptabilité copropriété",
    conseil_syndical: "Conseil syndical",
    // FITNESS
    abonnements_fitness: "Abonnements salle de sport",
    cours_collectifs: "Cours collectifs",
    salles_fitness: "Gestion des salles",
    presences_fitness: "Check-in / Présences",
    planning_fitness: "Planning des cours",
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
