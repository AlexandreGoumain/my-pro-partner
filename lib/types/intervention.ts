/**
 * Types pour les interventions (Plomberie, Chauffage, Électricité, etc.)
 */

export const STATUT_INTERVENTION = [
    "DEMANDE",
    "PLANIFIEE",
    "EN_ROUTE",
    "SUR_PLACE",
    "DIAGNOSTIC_FAIT",
    "DEVIS_ENVOYE",
    "DEVIS_ACCEPTE",
    "EN_COURS",
    "TERMINEE",
    "FACTUREE",
    "ANNULEE",
] as const;

export type StatutIntervention = (typeof STATUT_INTERVENTION)[number];

export const PRIORITE_INTERVENTION = [
    "NORMALE",
    "URGENTE",
    "CRITIQUE",
] as const;

export type PrioriteIntervention = (typeof PRIORITE_INTERVENTION)[number];

export const TYPE_INTERVENTION = [
    // === PLOMBERIE / CHAUFFAGE ===
    "FUITE",
    "DEPANNAGE",
    "INSTALLATION",
    "ENTRETIEN",
    "DIAGNOSTIC",
    "DEBOUCHAGE",
    "REMPLACEMENT",
    "RENOVATION",
    "MISE_EN_SERVICE",
    "RAMONAGE",
    "CONTROLE_ANNUEL",
    // === MENUISERIE ===
    "POSE",
    "FABRICATION",
    "REPARATION",
    "AJUSTEMENT",
    "FINITION",
    "RESTAURATION",
    "PRISE_COTES",
    "DEPOSE",
    // === PEINTURE ===
    "PREPARATION_SURFACES",
    "PEINTURE_INTERIEURE",
    "PEINTURE_EXTERIEURE",
    "RAVALEMENT",
    "ENDUIT",
    "PAPIER_PEINT",
    "LASURE_VERNIS",
    "DECORATION",
    "TRAITEMENT_SURFACES",
    // === GARAGE / AUTOMOBILE ===
    "REVISION",
    "VIDANGE",
    "FREINAGE",
    "PNEUMATIQUES",
    "EMBRAYAGE",
    "DISTRIBUTION",
    "ECHAPPEMENT",
    "SUSPENSION",
    "DIRECTION",
    "DEMARRAGE",
    "CARROSSERIE",
] as const;

export type TypeIntervention = (typeof TYPE_INTERVENTION)[number];

// Type d'équipement unifié pour tous les métiers d'intervention
export const TYPE_EQUIPEMENT = [
    // === PLOMBERIE ===
    "ROBINETTERIE",
    "SANITAIRES",
    "TUYAUTERIE",
    "EVACUATION",
    "ADOUCISSEUR",
    "BALLON_EAU_CHAUDE",
    // === CHAUFFAGE ===
    "CHAUDIERE_GAZ",
    "CHAUDIERE_FIOUL",
    "CHAUDIERE_BOIS",
    "CHAUDIERE_ELECTRIQUE",
    "POMPE_A_CHALEUR",
    "PAC_AIR_AIR",
    "PAC_AIR_EAU",
    "PAC_GEOTHERMIQUE",
    "CLIMATISATION",
    "RADIATEUR",
    "PLANCHER_CHAUFFANT",
    "CHAUFFE_EAU",
    "BALLON_THERMODYNAMIQUE",
    "THERMOSTAT",
    "VASE_EXPANSION",
    "CIRCULATEUR",
    // === MENUISERIE ===
    "FENETRE",
    "PORTE_INTERIEURE",
    "PORTE_ENTREE",
    "PORTE_GARAGE",
    "VOLET_ROULANT",
    "VOLET_BATTANT",
    "PERSIENNE",
    "PARQUET",
    "ESCALIER",
    "MEUBLE_SUR_MESURE",
    "CUISINE",
    "DRESSING",
    "PLACARD",
    "BIBLIOTHEQUE",
    "PORTAIL",
    "CLOTURE_BOIS",
    "PERGOLA",
    "TERRASSE_BOIS",
    "BARDAGE",
    "CHARPENTE",
    "OSSATURE_BOIS",
    "VERANDA",
    "STORE",
    "PORTE_BLINDEE",
    "VELUX",
    "BAIE_VITREE",
    "GARDE_CORPS",
    "LAMBRIS",
    "PLAN_TRAVAIL",
    // === PEINTURE ===
    "MUR_INTERIEUR",
    "MUR_EXTERIEUR",
    "PLAFOND",
    "FACADE",
    "BOISERIE",
    "FERRONNERIE",
    "SOL",
    "CAGE_ESCALIER",
    // === GARAGE / AUTOMOBILE ===
    "MOTEUR",
    "BOITE_VITESSE",
    "EMBRAYAGE_KIT",
    "TURBO",
    "COURROIE_DISTRIBUTION",
    "PLAQUETTES_FREIN",
    "DISQUES_FREIN",
    "LIQUIDE_FREIN",
    "ETRIER_FREIN",
    "AMORTISSEUR",
    "RESSORT_SUSPENSION",
    "ROTULE",
    "BIELLETTE",
    "SILENT_BLOC",
    "PNEU",
    "JANTE",
    "BATTERIE",
    "ALTERNATEUR",
    "DEMARREUR",
    "BOUGIE",
    "POT_ECHAPPEMENT",
    "CATALYSEUR",
    "SILENCIEUX",
    "CLIMATISATION_AUTO",
    "RADIATEUR_AUTO",
    "POMPE_EAU",
    "THERMOSTAT_AUTO",
    "FILTRE_HUILE",
    "FILTRE_AIR",
    "FILTRE_HABITACLE",
    "FILTRE_CARBURANT",
    "HUILE_MOTEUR",
    "PARE_BRISE",
    "PHARE",
    "RETROVISEUR",
    // === COMMUN ===
    "POMPE",
    "CONDUIT_FUMEE",
    "VENTILATION",
    "AUTRE",
] as const;

export type TypeEquipement = (typeof TYPE_EQUIPEMENT)[number];

export interface Intervention {
    id: string;
    numero: string;
    typeIntervention: TypeIntervention;
    priorite: PrioriteIntervention;
    statut: StatutIntervention;
    description: string;
    adresse: string;
    codePostal: string;
    ville: string;
    complementAdresse?: string | null;
    dateDemande: string;
    datePrevisionnelle?: string | null;
    equipement?: TypeEquipement | null;
    marqueEquipement?: string | null;
    modeleEquipement?: string | null;
    client: {
        id: string;
        nom: string;
        prenom?: string | null;
        telephone?: string | null;
        email?: string | null;
    };
    plombier?: {
        id: string;
        name: string | null;
    } | null;
    coutTotal: number;
}

// Base fields for intervention creation
interface InterventionCreateBase {
    typeIntervention: TypeIntervention;
    priorite?: PrioriteIntervention;
    description: string;
    adresse: string;
    codePostal: string;
    ville: string;
    complementAdresse?: string;
    equipement?: TypeEquipement;
    marqueEquipement?: string;
    modeleEquipement?: string;
    anneeInstall?: number;
    datePrevisionnelle?: string;
    plombierId?: string;
    camionnetteId?: string;
}

// With existing client
interface InterventionCreateWithClient extends InterventionCreateBase {
    clientId: string;
    newClient?: never;
}

// With new client to create
interface InterventionCreateWithNewClient extends InterventionCreateBase {
    clientId?: never;
    newClient: {
        nom: string;
        prenom?: string;
        telephone: string;
    };
}

export type InterventionCreateInput =
    | InterventionCreateWithClient
    | InterventionCreateWithNewClient;

export interface InterventionStats {
    total: number;
    enCours: number;
    urgentes: number;
    enRetard: number;
}

// Labels pour l'affichage
export const TYPE_INTERVENTION_LABELS: Record<TypeIntervention, string> = {
    // === PLOMBERIE / CHAUFFAGE ===
    FUITE: "Fuite",
    DEPANNAGE: "Dépannage",
    INSTALLATION: "Installation",
    ENTRETIEN: "Entretien",
    DIAGNOSTIC: "Diagnostic",
    DEBOUCHAGE: "Débouchage",
    REMPLACEMENT: "Remplacement",
    RENOVATION: "Rénovation",
    MISE_EN_SERVICE: "Mise en service",
    RAMONAGE: "Ramonage",
    CONTROLE_ANNUEL: "Contrôle annuel",
    // === MENUISERIE ===
    POSE: "Pose",
    FABRICATION: "Fabrication",
    REPARATION: "Réparation",
    AJUSTEMENT: "Ajustement",
    FINITION: "Finition",
    RESTAURATION: "Restauration",
    PRISE_COTES: "Prise de cotes",
    DEPOSE: "Dépose",
    // === PEINTURE ===
    PREPARATION_SURFACES: "Préparation des surfaces",
    PEINTURE_INTERIEURE: "Peinture intérieure",
    PEINTURE_EXTERIEURE: "Peinture extérieure",
    RAVALEMENT: "Ravalement de façade",
    ENDUIT: "Enduit",
    PAPIER_PEINT: "Papier peint",
    LASURE_VERNIS: "Lasure / Vernis",
    DECORATION: "Décoration",
    TRAITEMENT_SURFACES: "Traitement de surfaces",
    // === GARAGE / AUTOMOBILE ===
    REVISION: "Révision",
    VIDANGE: "Vidange",
    FREINAGE: "Freinage",
    PNEUMATIQUES: "Pneumatiques",
    EMBRAYAGE: "Embrayage",
    DISTRIBUTION: "Distribution",
    ECHAPPEMENT: "Échappement",
    SUSPENSION: "Suspension",
    DIRECTION: "Direction",
    DEMARRAGE: "Démarrage",
    CARROSSERIE: "Carrosserie",
};

export const PRIORITE_LABELS: Record<PrioriteIntervention, string> = {
    NORMALE: "Normale",
    URGENTE: "Urgente",
    CRITIQUE: "Critique",
};

export const STATUT_LABELS: Record<StatutIntervention, string> = {
    DEMANDE: "Demande",
    PLANIFIEE: "Planifiée",
    EN_ROUTE: "En route",
    SUR_PLACE: "Sur place",
    DIAGNOSTIC_FAIT: "Diagnostic fait",
    DEVIS_ENVOYE: "Devis envoyé",
    DEVIS_ACCEPTE: "Devis accepté",
    EN_COURS: "En cours",
    TERMINEE: "Terminée",
    FACTUREE: "Facturée",
    ANNULEE: "Annulée",
};

export const TYPE_EQUIPEMENT_LABELS: Record<TypeEquipement, string> = {
    // === PLOMBERIE ===
    ROBINETTERIE: "Robinetterie",
    SANITAIRES: "Sanitaires (WC, lavabo...)",
    TUYAUTERIE: "Tuyauterie",
    EVACUATION: "Évacuation",
    ADOUCISSEUR: "Adoucisseur d'eau",
    BALLON_EAU_CHAUDE: "Ballon d'eau chaude",
    // === CHAUFFAGE ===
    CHAUDIERE_GAZ: "Chaudière gaz",
    CHAUDIERE_FIOUL: "Chaudière fioul",
    CHAUDIERE_BOIS: "Chaudière bois",
    CHAUDIERE_ELECTRIQUE: "Chaudière électrique",
    POMPE_A_CHALEUR: "Pompe à chaleur",
    PAC_AIR_AIR: "PAC air-air",
    PAC_AIR_EAU: "PAC air-eau",
    PAC_GEOTHERMIQUE: "PAC géothermique",
    CLIMATISATION: "Climatisation",
    RADIATEUR: "Radiateur",
    PLANCHER_CHAUFFANT: "Plancher chauffant",
    CHAUFFE_EAU: "Chauffe-eau",
    BALLON_THERMODYNAMIQUE: "Ballon thermodynamique",
    THERMOSTAT: "Thermostat",
    VASE_EXPANSION: "Vase d'expansion",
    CIRCULATEUR: "Circulateur",
    // === MENUISERIE ===
    FENETRE: "Fenêtre",
    PORTE_INTERIEURE: "Porte intérieure",
    PORTE_ENTREE: "Porte d'entrée",
    PORTE_GARAGE: "Porte de garage",
    VOLET_ROULANT: "Volet roulant",
    VOLET_BATTANT: "Volet battant",
    PERSIENNE: "Persienne",
    PARQUET: "Parquet",
    ESCALIER: "Escalier",
    MEUBLE_SUR_MESURE: "Meuble sur mesure",
    CUISINE: "Cuisine",
    DRESSING: "Dressing",
    PLACARD: "Placard",
    BIBLIOTHEQUE: "Bibliothèque",
    PORTAIL: "Portail",
    CLOTURE_BOIS: "Clôture bois",
    PERGOLA: "Pergola",
    TERRASSE_BOIS: "Terrasse bois",
    BARDAGE: "Bardage",
    CHARPENTE: "Charpente",
    OSSATURE_BOIS: "Ossature bois",
    VERANDA: "Véranda",
    STORE: "Store",
    PORTE_BLINDEE: "Porte blindée",
    VELUX: "Fenêtre de toit (Velux)",
    BAIE_VITREE: "Baie vitrée",
    GARDE_CORPS: "Garde-corps",
    LAMBRIS: "Lambris",
    PLAN_TRAVAIL: "Plan de travail",
    // === PEINTURE ===
    MUR_INTERIEUR: "Mur intérieur",
    MUR_EXTERIEUR: "Mur extérieur",
    PLAFOND: "Plafond",
    FACADE: "Façade",
    BOISERIE: "Boiserie",
    FERRONNERIE: "Ferronnerie",
    SOL: "Sol",
    CAGE_ESCALIER: "Cage d'escalier",
    // === GARAGE / AUTOMOBILE ===
    MOTEUR: "Moteur",
    BOITE_VITESSE: "Boîte de vitesse",
    EMBRAYAGE_KIT: "Kit embrayage",
    TURBO: "Turbo",
    COURROIE_DISTRIBUTION: "Courroie de distribution",
    PLAQUETTES_FREIN: "Plaquettes de frein",
    DISQUES_FREIN: "Disques de frein",
    LIQUIDE_FREIN: "Liquide de frein",
    ETRIER_FREIN: "Étrier de frein",
    AMORTISSEUR: "Amortisseur",
    RESSORT_SUSPENSION: "Ressort de suspension",
    ROTULE: "Rotule",
    BIELLETTE: "Biellette de direction",
    SILENT_BLOC: "Silent bloc",
    PNEU: "Pneu",
    JANTE: "Jante",
    BATTERIE: "Batterie",
    ALTERNATEUR: "Alternateur",
    DEMARREUR: "Démarreur",
    BOUGIE: "Bougie",
    POT_ECHAPPEMENT: "Pot d'échappement",
    CATALYSEUR: "Catalyseur",
    SILENCIEUX: "Silencieux",
    CLIMATISATION_AUTO: "Climatisation auto",
    RADIATEUR_AUTO: "Radiateur",
    POMPE_EAU: "Pompe à eau",
    THERMOSTAT_AUTO: "Thermostat",
    FILTRE_HUILE: "Filtre à huile",
    FILTRE_AIR: "Filtre à air",
    FILTRE_HABITACLE: "Filtre habitacle",
    FILTRE_CARBURANT: "Filtre à carburant",
    HUILE_MOTEUR: "Huile moteur",
    PARE_BRISE: "Pare-brise",
    PHARE: "Phare",
    RETROVISEUR: "Rétroviseur",
    // === COMMUN ===
    POMPE: "Pompe",
    CONDUIT_FUMEE: "Conduit de fumée",
    VENTILATION: "Ventilation (VMC)",
    AUTRE: "Autre",
};

// Icons pour les types d'intervention
export const TYPE_INTERVENTION_ICONS: Record<TypeIntervention, string> = {
    // === PLOMBERIE / CHAUFFAGE ===
    FUITE: "💧",
    DEPANNAGE: "🔧",
    INSTALLATION: "🔨",
    ENTRETIEN: "⚙️",
    DIAGNOSTIC: "🔍",
    DEBOUCHAGE: "🚰",
    REMPLACEMENT: "♻️",
    RENOVATION: "🏗️",
    MISE_EN_SERVICE: "✅",
    RAMONAGE: "🔥",
    CONTROLE_ANNUEL: "📋",
    // === MENUISERIE ===
    POSE: "🪚",
    FABRICATION: "🪵",
    REPARATION: "🔨",
    AJUSTEMENT: "📐",
    FINITION: "✨",
    RESTAURATION: "🪑",
    PRISE_COTES: "📏",
    DEPOSE: "📦",
    // === PEINTURE ===
    PREPARATION_SURFACES: "🧹",
    PEINTURE_INTERIEURE: "🎨",
    PEINTURE_EXTERIEURE: "🏠",
    RAVALEMENT: "🏢",
    ENDUIT: "🪣",
    PAPIER_PEINT: "📜",
    LASURE_VERNIS: "🪵",
    DECORATION: "🖌️",
    TRAITEMENT_SURFACES: "💧",
    // === GARAGE / AUTOMOBILE ===
    REVISION: "🔧",
    VIDANGE: "🛢️",
    FREINAGE: "🛞",
    PNEUMATIQUES: "🚗",
    EMBRAYAGE: "⚙️",
    DISTRIBUTION: "🔗",
    ECHAPPEMENT: "💨",
    SUSPENSION: "🔩",
    DIRECTION: "🎯",
    DEMARRAGE: "🔋",
    CARROSSERIE: "🚙",
};

// Groupes d'équipements par métier (pour filtrer dans l'UI)
export const EQUIPEMENTS_PAR_METIER = {
    PLOMBERIE: [
        "ROBINETTERIE",
        "SANITAIRES",
        "TUYAUTERIE",
        "EVACUATION",
        "ADOUCISSEUR",
        "BALLON_EAU_CHAUDE",
        "CHAUFFE_EAU",
        "POMPE",
        "AUTRE",
    ],
    CHAUFFAGE: [
        "CHAUDIERE_GAZ",
        "CHAUDIERE_FIOUL",
        "CHAUDIERE_BOIS",
        "CHAUDIERE_ELECTRIQUE",
        "POMPE_A_CHALEUR",
        "PAC_AIR_AIR",
        "PAC_AIR_EAU",
        "PAC_GEOTHERMIQUE",
        "CLIMATISATION",
        "RADIATEUR",
        "PLANCHER_CHAUFFANT",
        "CHAUFFE_EAU",
        "BALLON_THERMODYNAMIQUE",
        "THERMOSTAT",
        "VASE_EXPANSION",
        "CIRCULATEUR",
        "CONDUIT_FUMEE",
        "VENTILATION",
        "AUTRE",
    ],
    MENUISERIE: [
        "FENETRE",
        "PORTE_INTERIEURE",
        "PORTE_ENTREE",
        "PORTE_GARAGE",
        "PORTE_BLINDEE",
        "VOLET_ROULANT",
        "VOLET_BATTANT",
        "PERSIENNE",
        "VELUX",
        "BAIE_VITREE",
        "PARQUET",
        "ESCALIER",
        "MEUBLE_SUR_MESURE",
        "CUISINE",
        "PLAN_TRAVAIL",
        "DRESSING",
        "PLACARD",
        "BIBLIOTHEQUE",
        "LAMBRIS",
        "GARDE_CORPS",
        "PORTAIL",
        "CLOTURE_BOIS",
        "PERGOLA",
        "TERRASSE_BOIS",
        "BARDAGE",
        "CHARPENTE",
        "OSSATURE_BOIS",
        "VERANDA",
        "STORE",
        "AUTRE",
    ],
    PEINTURE: [
        "MUR_INTERIEUR",
        "MUR_EXTERIEUR",
        "PLAFOND",
        "FACADE",
        "BOISERIE",
        "FERRONNERIE",
        "SOL",
        "CAGE_ESCALIER",
        "AUTRE",
    ],
    GARAGE: [
        // Moteur & Transmission
        "MOTEUR",
        "BOITE_VITESSE",
        "EMBRAYAGE_KIT",
        "TURBO",
        "COURROIE_DISTRIBUTION",
        // Freinage
        "PLAQUETTES_FREIN",
        "DISQUES_FREIN",
        "LIQUIDE_FREIN",
        "ETRIER_FREIN",
        // Suspension & Direction
        "AMORTISSEUR",
        "RESSORT_SUSPENSION",
        "ROTULE",
        "BIELLETTE",
        "SILENT_BLOC",
        // Roues & Pneus
        "PNEU",
        "JANTE",
        // Électricité & Démarrage
        "BATTERIE",
        "ALTERNATEUR",
        "DEMARREUR",
        "BOUGIE",
        // Échappement
        "POT_ECHAPPEMENT",
        "CATALYSEUR",
        "SILENCIEUX",
        // Climatisation & Refroidissement
        "CLIMATISATION_AUTO",
        "RADIATEUR_AUTO",
        "POMPE_EAU",
        "THERMOSTAT_AUTO",
        // Filtres & Fluides
        "FILTRE_HUILE",
        "FILTRE_AIR",
        "FILTRE_HABITACLE",
        "FILTRE_CARBURANT",
        "HUILE_MOTEUR",
        // Carrosserie
        "PARE_BRISE",
        "PHARE",
        "RETROVISEUR",
        "AUTRE",
    ],
} as const;

// Types d'intervention par métier (pour filtrer dans l'UI)
export const INTERVENTIONS_PAR_METIER = {
    PLOMBERIE: [
        "FUITE",
        "DEPANNAGE",
        "INSTALLATION",
        "ENTRETIEN",
        "DIAGNOSTIC",
        "DEBOUCHAGE",
        "REMPLACEMENT",
        "RENOVATION",
    ],
    CHAUFFAGE: [
        "DEPANNAGE",
        "INSTALLATION",
        "ENTRETIEN",
        "DIAGNOSTIC",
        "REMPLACEMENT",
        "RENOVATION",
        "MISE_EN_SERVICE",
        "RAMONAGE",
        "CONTROLE_ANNUEL",
    ],
    MENUISERIE: [
        "POSE",
        "FABRICATION",
        "REPARATION",
        "AJUSTEMENT",
        "FINITION",
        "RESTAURATION",
        "PRISE_COTES",
        "DEPOSE",
        "INSTALLATION",
        "RENOVATION",
    ],
    PEINTURE: [
        "PREPARATION_SURFACES",
        "PEINTURE_INTERIEURE",
        "PEINTURE_EXTERIEURE",
        "RAVALEMENT",
        "ENDUIT",
        "PAPIER_PEINT",
        "LASURE_VERNIS",
        "DECORATION",
        "TRAITEMENT_SURFACES",
        "RENOVATION",
    ],
    GARAGE: [
        "DIAGNOSTIC",
        "REVISION",
        "VIDANGE",
        "FREINAGE",
        "PNEUMATIQUES",
        "EMBRAYAGE",
        "DISTRIBUTION",
        "ECHAPPEMENT",
        "SUSPENSION",
        "DIRECTION",
        "DEMARRAGE",
        "CARROSSERIE",
        "DEPANNAGE",
        "CONTROLE_ANNUEL",
        "ENTRETIEN",
    ],
} as const;
