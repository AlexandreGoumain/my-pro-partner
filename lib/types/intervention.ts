/**
 * Types pour les interventions
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
    "FUITE",
    "DEPANNAGE",
    "INSTALLATION",
    "ENTRETIEN",
    "DIAGNOSTIC",
    "DEBOUCHAGE",
    "REMPLACEMENT",
    "RENOVATION",
] as const;

export type TypeIntervention = (typeof TYPE_INTERVENTION)[number];

export const TYPE_EQUIPEMENT_PLOMBERIE = [
    "CHAUDIERE",
    "CHAUFFE_EAU",
    "BALLON_ECS",
    "ADOUCISSEUR",
    "POMPE_CHALEUR",
    "RADIATEUR",
    "PLANCHER_CHAUFFANT",
    "WC",
    "LAVABO",
    "DOUCHE",
    "BAIGNOIRE",
    "EVIER",
    "ROBINETTERIE",
    "CANALISATION",
    "EVACUATION",
    "COMPTEUR",
    "AUTRE",
] as const;

export type TypeEquipementPlomberie =
    (typeof TYPE_EQUIPEMENT_PLOMBERIE)[number];

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
    equipement?: TypeEquipementPlomberie | null;
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

export interface InterventionCreateInput {
    clientId: string;
    typeIntervention: TypeIntervention;
    priorite?: PrioriteIntervention;
    description: string;
    adresse: string;
    codePostal: string;
    ville: string;
    complementAdresse?: string;
    equipement?: TypeEquipementPlomberie;
    marqueEquipement?: string;
    modeleEquipement?: string;
    anneeInstall?: number;
    datePrevisionnelle?: string;
    plombierId?: string;
    camionnetteId?: string;
}

export interface InterventionStats {
    total: number;
    enCours: number;
    urgentes: number;
    enRetard: number;
}

// Labels pour l'affichage
export const TYPE_INTERVENTION_LABELS: Record<TypeIntervention, string> = {
    FUITE: "Fuite",
    DEPANNAGE: "Dépannage",
    INSTALLATION: "Installation",
    ENTRETIEN: "Entretien",
    DIAGNOSTIC: "Diagnostic",
    DEBOUCHAGE: "Débouchage",
    REMPLACEMENT: "Remplacement",
    RENOVATION: "Rénovation",
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

export const TYPE_EQUIPEMENT_LABELS: Record<TypeEquipementPlomberie, string> = {
    CHAUDIERE: "Chaudière",
    CHAUFFE_EAU: "Chauffe-eau",
    BALLON_ECS: "Ballon ECS",
    ADOUCISSEUR: "Adoucisseur",
    POMPE_CHALEUR: "Pompe à chaleur",
    RADIATEUR: "Radiateur",
    PLANCHER_CHAUFFANT: "Plancher chauffant",
    WC: "WC",
    LAVABO: "Lavabo",
    DOUCHE: "Douche",
    BAIGNOIRE: "Baignoire",
    EVIER: "Évier",
    ROBINETTERIE: "Robinetterie",
    CANALISATION: "Canalisation",
    EVACUATION: "Évacuation",
    COMPTEUR: "Compteur",
    AUTRE: "Autre",
};

// Icons pour les types d'intervention
export const TYPE_INTERVENTION_ICONS: Record<TypeIntervention, string> = {
    FUITE: "💧",
    DEPANNAGE: "🔧",
    INSTALLATION: "🔨",
    ENTRETIEN: "⚙️",
    DIAGNOSTIC: "🔍",
    DEBOUCHAGE: "🚰",
    REMPLACEMENT: "♻️",
    RENOVATION: "🏗️",
};
