/**
 * Types pour les cabinets d'avocats (JURIDIQUE)
 */

// ============================================
// ENUMS - Domaines juridiques
// ============================================

export const DOMAINE_JURIDIQUE = [
    "CIVIL",
    "FAMILLE",
    "PENAL",
    "COMMERCIAL",
    "SOCIAL",
    "IMMOBILIER",
    "ADMINISTRATIF",
    "FISCAL",
    "PROPRIETE_INTELLECTUELLE",
    "CONSOMMATION",
    "ASSURANCE",
    "BANCAIRE",
    "SOCIETES",
    "CONSTRUCTION",
    "ENVIRONNEMENT",
    "NUMERIQUE",
    "AUTRE",
] as const;
export type DomaineJuridique = (typeof DOMAINE_JURIDIQUE)[number];

export const DOMAINE_JURIDIQUE_LABELS: Record<DomaineJuridique, string> = {
    CIVIL: "Droit civil",
    FAMILLE: "Droit de la famille",
    PENAL: "Droit pénal",
    COMMERCIAL: "Droit commercial",
    SOCIAL: "Droit du travail",
    IMMOBILIER: "Droit immobilier",
    ADMINISTRATIF: "Droit administratif",
    FISCAL: "Droit fiscal",
    PROPRIETE_INTELLECTUELLE: "Propriété intellectuelle",
    CONSOMMATION: "Droit de la consommation",
    ASSURANCE: "Droit des assurances",
    BANCAIRE: "Droit bancaire",
    SOCIETES: "Droit des sociétés",
    CONSTRUCTION: "Droit de la construction",
    ENVIRONNEMENT: "Droit de l'environnement",
    NUMERIQUE: "Droit du numérique",
    AUTRE: "Autre",
};

// ============================================
// ENUMS - Types de procédure
// ============================================

export const TYPE_PROCEDURE = [
    "CONTENTIEUX",
    "AMIABLE",
    "CONSEIL",
    "REDACTION",
    "NEGOCIATION",
    "AUDIT",
    "RECOUVREMENT",
    "EXECUTION",
] as const;
export type TypeProcedure = (typeof TYPE_PROCEDURE)[number];

export const TYPE_PROCEDURE_LABELS: Record<TypeProcedure, string> = {
    CONTENTIEUX: "Contentieux",
    AMIABLE: "Règlement amiable",
    CONSEIL: "Conseil",
    REDACTION: "Rédaction d'actes",
    NEGOCIATION: "Négociation",
    AUDIT: "Audit juridique",
    RECOUVREMENT: "Recouvrement",
    EXECUTION: "Exécution",
};

// ============================================
// ENUMS - Juridictions
// ============================================

export const JURIDICTION = [
    "TRIBUNAL_JUDICIAIRE",
    "TRIBUNAL_PROXIMITE",
    "TRIBUNAL_COMMERCE",
    "CONSEIL_PRUDHOMMES",
    "TRIBUNAL_POLICE",
    "TRIBUNAL_CORRECTIONNEL",
    "COUR_ASSISES",
    "JUGE_INSTRUCTION",
    "COUR_APPEL",
    "COUR_CASSATION",
    "TRIBUNAL_ADMINISTRATIF",
    "COUR_ADMINISTRATIVE_APPEL",
    "CONSEIL_ETAT",
    "MEDIATEUR",
    "ARBITRAGE",
    "JAF",
    "JEX",
    "AUTRE",
] as const;
export type Juridiction = (typeof JURIDICTION)[number];

export const JURIDICTION_LABELS: Record<Juridiction, string> = {
    TRIBUNAL_JUDICIAIRE: "Tribunal judiciaire",
    TRIBUNAL_PROXIMITE: "Tribunal de proximité",
    TRIBUNAL_COMMERCE: "Tribunal de commerce",
    CONSEIL_PRUDHOMMES: "Conseil de prud'hommes",
    TRIBUNAL_POLICE: "Tribunal de police",
    TRIBUNAL_CORRECTIONNEL: "Tribunal correctionnel",
    COUR_ASSISES: "Cour d'assises",
    JUGE_INSTRUCTION: "Juge d'instruction",
    COUR_APPEL: "Cour d'appel",
    COUR_CASSATION: "Cour de cassation",
    TRIBUNAL_ADMINISTRATIF: "Tribunal administratif",
    COUR_ADMINISTRATIVE_APPEL: "Cour administrative d'appel",
    CONSEIL_ETAT: "Conseil d'État",
    MEDIATEUR: "Médiateur",
    ARBITRAGE: "Arbitrage",
    JAF: "Juge aux affaires familiales",
    JEX: "Juge de l'exécution",
    AUTRE: "Autre juridiction",
};

// ============================================
// ENUMS - Statuts affaire
// ============================================

export const STATUT_AFFAIRE = [
    "ETUDE",
    "INSTRUCTION",
    "MISE_EN_ETAT",
    "AUDIENCE",
    "DELIBERE",
    "DECISION",
    "APPEL",
    "EXECUTEE",
    "CLOTUREE",
    "ARCHIVEE",
] as const;
export type StatutAffaire = (typeof STATUT_AFFAIRE)[number];

export const STATUT_AFFAIRE_LABELS: Record<StatutAffaire, string> = {
    ETUDE: "En étude",
    INSTRUCTION: "Instruction",
    MISE_EN_ETAT: "Mise en état",
    AUDIENCE: "Audience fixée",
    DELIBERE: "En délibéré",
    DECISION: "Décision rendue",
    APPEL: "En appel",
    EXECUTEE: "En exécution",
    CLOTUREE: "Clôturée",
    ARCHIVEE: "Archivée",
};

export const STATUT_AFFAIRE_COLORS: Record<StatutAffaire, string> = {
    ETUDE: "bg-black/5 text-black/60",
    INSTRUCTION: "bg-black/10 text-black",
    MISE_EN_ETAT: "bg-black/10 text-black",
    AUDIENCE: "bg-orange-50 text-orange-700",
    DELIBERE: "bg-black/5 text-black/60",
    DECISION: "bg-black/10 text-black",
    APPEL: "bg-orange-50 text-orange-700",
    EXECUTEE: "bg-black/10 text-black",
    CLOTUREE: "bg-black/5 text-black/40",
    ARCHIVEE: "bg-black/5 text-black/40",
};

// ============================================
// ENUMS - Types d'échéance procédurale
// ============================================

export const TYPE_ECHEANCE_PROCEDURALE = [
    "AUDIENCE",
    "CONCLUSIONS",
    "PIECES",
    "RECOURS",
    "SIGNIFICATION",
    "EXECUTION",
    "PRESCRIPTION",
    "MEDIATION",
    "EXPERTISE",
    "COMPARUTION",
    "DELIBERE",
    "DECISION",
    "AUTRE",
] as const;
export type TypeEcheanceProcedurale =
    (typeof TYPE_ECHEANCE_PROCEDURALE)[number];

export const TYPE_ECHEANCE_PROCEDURALE_LABELS: Record<
    TypeEcheanceProcedurale,
    string
> = {
    AUDIENCE: "Audience",
    CONCLUSIONS: "Dépôt de conclusions",
    PIECES: "Communication de pièces",
    RECOURS: "Délai de recours",
    SIGNIFICATION: "Signification",
    EXECUTION: "Délai d'exécution",
    PRESCRIPTION: "Prescription",
    MEDIATION: "Médiation",
    EXPERTISE: "Expertise",
    COMPARUTION: "Comparution",
    DELIBERE: "Délibéré",
    DECISION: "Décision",
    AUTRE: "Autre",
};

// ============================================
// ENUMS - Statut échéance procédurale
// ============================================

export const STATUT_ECHEANCE_PROCEDURALE = [
    "A_VENIR",
    "EN_PREPARATION",
    "PRET",
    "EFFECTUEE",
    "REPORTEE",
    "ANNULEE",
] as const;
export type StatutEcheanceProcedurale =
    (typeof STATUT_ECHEANCE_PROCEDURALE)[number];

export const STATUT_ECHEANCE_PROCEDURALE_LABELS: Record<
    StatutEcheanceProcedurale,
    string
> = {
    A_VENIR: "À venir",
    EN_PREPARATION: "En préparation",
    PRET: "Prêt",
    EFFECTUEE: "Effectuée",
    REPORTEE: "Reportée",
    ANNULEE: "Annulée",
};

export const STATUT_ECHEANCE_PROCEDURALE_COLORS: Record<
    StatutEcheanceProcedurale,
    string
> = {
    A_VENIR: "bg-black/5 text-black/60",
    EN_PREPARATION: "bg-orange-50 text-orange-700",
    PRET: "bg-black/10 text-black",
    EFFECTUEE: "bg-black/5 text-black/40",
    REPORTEE: "bg-orange-50 text-orange-700",
    ANNULEE: "bg-red-50 text-red-600",
};

// ============================================
// ENUMS - Types d'honoraires
// ============================================

export const TYPE_HONORAIRES = [
    "TEMPS_PASSE",
    "FORFAIT",
    "RESULTAT",
    "MIXTE",
    "AIDE_JURIDICTIONNELLE",
] as const;
export type TypeHonoraires = (typeof TYPE_HONORAIRES)[number];

export const TYPE_HONORAIRES_LABELS: Record<TypeHonoraires, string> = {
    TEMPS_PASSE: "Au temps passé",
    FORFAIT: "Forfait",
    RESULTAT: "Honoraires de résultat",
    MIXTE: "Mixte",
    AIDE_JURIDICTIONNELLE: "Aide juridictionnelle",
};

// ============================================
// ENUMS - Qualité des parties
// ============================================

export const QUALITE_PARTIE = [
    "DEMANDEUR",
    "DEFENDEUR",
    "PARTIE_CIVILE",
    "PREVENU",
    "ACCUSE",
    "APPELANT",
    "INTIME",
    "INTERVENANT",
    "TIERS",
] as const;
export type QualitePartie = (typeof QUALITE_PARTIE)[number];

export const QUALITE_PARTIE_LABELS: Record<QualitePartie, string> = {
    DEMANDEUR: "Demandeur",
    DEFENDEUR: "Défendeur",
    PARTIE_CIVILE: "Partie civile",
    PREVENU: "Prévenu",
    ACCUSE: "Accusé",
    APPELANT: "Appelant",
    INTIME: "Intimé",
    INTERVENANT: "Intervenant",
    TIERS: "Tiers",
};

// ============================================
// ENUMS - Types de diligence
// ============================================

export const TYPE_DILIGENCE = [
    "CONSULTATION",
    "RECHERCHE",
    "REDACTION",
    "AUDIENCE",
    "NEGOCIATION",
    "CORRESPONDANCE",
    "TELEPHONE",
    "REUNION",
    "DEPLACEMENT",
    "EXPERTISE",
    "ADMINISTRATIF",
    "AUTRE",
] as const;
export type TypeDiligence = (typeof TYPE_DILIGENCE)[number];

export const TYPE_DILIGENCE_LABELS: Record<TypeDiligence, string> = {
    CONSULTATION: "Consultation client",
    RECHERCHE: "Recherches juridiques",
    REDACTION: "Rédaction",
    AUDIENCE: "Audience",
    NEGOCIATION: "Négociation",
    CORRESPONDANCE: "Correspondance",
    TELEPHONE: "Appel téléphonique",
    REUNION: "Réunion",
    DEPLACEMENT: "Déplacement",
    EXPERTISE: "Expertise",
    ADMINISTRATIF: "Formalités administratives",
    AUTRE: "Autre",
};

// ============================================
// INTERFACES - Affaire
// ============================================

export interface Affaire {
    id: string;
    reference: string;
    intitule: string;
    description?: string | null;

    // Client
    clientId: string;
    client: {
        id: string;
        nom: string;
        prenom?: string | null;
        email?: string | null;
        telephone?: string | null;
    };
    qualiteClient: QualitePartie;

    // Classification
    domaine: DomaineJuridique;
    typeProcedure: TypeProcedure;
    juridiction?: Juridiction | null;
    chambre?: string | null;

    // Numéros de procédure
    numeroRG?: string | null;
    numeroParquet?: string | null;

    // Dates clés
    dateOuverture: string;
    dateFaits?: string | null;
    dateCloture?: string | null;

    // Parties adverses
    parties?: PartieAdverse[];

    // Honoraires
    typeHonoraires: TypeHonoraires;
    tauxHoraire?: number | null;
    montantForfait?: number | null;
    provision?: number | null;
    montantAJ?: number | null;

    // Enjeu
    enjeuFinancier?: number | null;

    // Statut
    statut: StatutAffaire;

    // Relations
    echeances?: EcheanceProcedurale[];
    diligences?: Diligence[];

    // Responsable
    responsableId?: string | null;
    responsable?: {
        id: string;
        name?: string | null;
        email: string;
    };

    // Convention d'honoraires
    devisId?: string | null;

    // Conflit d'intérêts
    conflitVerifie: boolean;
    dateVerifConflit?: string | null;

    // Calculated
    totalDiligences?: number; // en minutes
    totalHonoraires?: number;
    prochainEcheance?: EcheanceProcedurale | null;

    // Metadata
    createdAt: string;
    updatedAt: string;
}

export interface AffaireWithDetails extends Affaire {
    _count?: {
        parties: number;
        echeances: number;
        diligences: number;
    };
}

export interface AffaireCreateInput {
    intitule: string;
    description?: string;
    clientId: string;
    qualiteClient?: QualitePartie;
    domaine: DomaineJuridique;
    typeProcedure?: TypeProcedure;
    juridiction?: Juridiction;
    chambre?: string;
    numeroRG?: string;
    numeroParquet?: string;
    dateOuverture?: string;
    dateFaits?: string;
    typeHonoraires?: TypeHonoraires;
    tauxHoraire?: number;
    montantForfait?: number;
    provision?: number;
    montantAJ?: number;
    enjeuFinancier?: number;
    responsableId?: string;
}

export interface AffaireUpdateInput {
    intitule?: string;
    description?: string;
    clientId?: string;
    qualiteClient?: QualitePartie;
    domaine?: DomaineJuridique;
    typeProcedure?: TypeProcedure;
    juridiction?: Juridiction | null;
    chambre?: string | null;
    numeroRG?: string | null;
    numeroParquet?: string | null;
    dateFaits?: string | null;
    dateCloture?: string | null;
    typeHonoraires?: TypeHonoraires;
    tauxHoraire?: number | null;
    montantForfait?: number | null;
    provision?: number | null;
    montantAJ?: number | null;
    enjeuFinancier?: number | null;
    statut?: StatutAffaire;
    responsableId?: string | null;
    conflitVerifie?: boolean;
    dateVerifConflit?: string | null;
}

export interface AffaireFilters {
    search?: string;
    statut?: StatutAffaire | StatutAffaire[];
    domaine?: DomaineJuridique | DomaineJuridique[];
    juridiction?: Juridiction | Juridiction[];
    typeProcedure?: TypeProcedure;
    clientId?: string;
    responsableId?: string;
    dateDebut?: string;
    dateFin?: string;
}

export interface AffaireStats {
    total: number;
    enCours: number; // Statuts actifs (pas CLOTUREE, ARCHIVEE)
    audiencesProchaines: number; // Échéances de type AUDIENCE à venir
    totalHonoraires: number;
    totalProvisions: number;
    diligencesNonFacturees: number; // en minutes
}

// ============================================
// INTERFACES - Partie adverse
// ============================================

export interface PartieAdverse {
    id: string;
    affaireId: string;
    nom: string;
    prenom?: string | null;
    raisonSociale?: string | null;
    qualite: QualitePartie;
    adresse?: string | null;
    email?: string | null;
    telephone?: string | null;
    avocat?: string | null;
    avocatBarreau?: string | null;
    avocatEmail?: string | null;
    avocatTelephone?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface PartieAdverseCreateInput {
    nom: string;
    prenom?: string;
    raisonSociale?: string;
    qualite: QualitePartie;
    adresse?: string;
    email?: string;
    telephone?: string;
    avocat?: string;
    avocatBarreau?: string;
    avocatEmail?: string;
    avocatTelephone?: string;
}

// ============================================
// INTERFACES - Échéance procédurale
// ============================================

export interface EcheanceProcedurale {
    id: string;
    affaireId: string;
    affaire?: {
        id: string;
        reference: string;
        intitule: string;
        client: {
            id: string;
            nom: string;
        };
    };

    type: TypeEcheanceProcedurale;
    libelle: string;
    description?: string | null;

    dateEcheance: string;
    heureDebut?: string | null;
    heureFin?: string | null;
    lieu?: string | null;

    statut: StatutEcheanceProcedurale;
    resultat?: string | null;

    rappel1Envoye: boolean;
    rappel2Envoye: boolean;

    createdAt: string;
    updatedAt: string;
}

export interface EcheanceProceduraleCreateInput {
    affaireId: string;
    type: TypeEcheanceProcedurale;
    libelle: string;
    description?: string;
    dateEcheance: string;
    heureDebut?: string;
    heureFin?: string;
    lieu?: string;
}

export interface EcheanceProceduraleUpdateInput {
    type?: TypeEcheanceProcedurale;
    libelle?: string;
    description?: string | null;
    dateEcheance?: string;
    heureDebut?: string | null;
    heureFin?: string | null;
    lieu?: string | null;
    statut?: StatutEcheanceProcedurale;
    resultat?: string | null;
}

export interface EcheanceProceduraleFilters {
    affaireId?: string;
    type?: TypeEcheanceProcedurale | TypeEcheanceProcedurale[];
    statut?: StatutEcheanceProcedurale | StatutEcheanceProcedurale[];
    dateDebut?: string;
    dateFin?: string;
}

// ============================================
// INTERFACES - Diligence
// ============================================

export interface Diligence {
    id: string;
    affaireId: string;
    affaire?: {
        id: string;
        reference: string;
        intitule: string;
        client: {
            id: string;
            nom: string;
        };
    };

    type: TypeDiligence;
    description: string;

    date: string;
    duree: number; // en minutes

    facturable: boolean;
    tauxHoraire: number;
    montant: number;

    facturee: boolean;
    factureId?: string | null;

    userId: string;
    user?: {
        id: string;
        name?: string | null;
        email: string;
    };

    createdAt: string;
    updatedAt: string;
}

export interface DiligenceCreateInput {
    affaireId: string;
    type: TypeDiligence;
    description: string;
    date: string;
    duree: number; // en minutes
    facturable?: boolean;
    tauxHoraire?: number;
}

export interface DiligenceUpdateInput {
    type?: TypeDiligence;
    description?: string;
    date?: string;
    duree?: number;
    facturable?: boolean;
    tauxHoraire?: number;
    montant?: number;
}

export interface DiligenceFilters {
    affaireId?: string;
    type?: TypeDiligence | TypeDiligence[];
    facturable?: boolean;
    facturee?: boolean;
    userId?: string;
    dateDebut?: string;
    dateFin?: string;
}

export interface DiligenceStats {
    totalMinutes: number;
    totalFacturable: number;
    totalMontant: number;
    nonFacturees: number;
    parType: Record<TypeDiligence, number>;
}

// ============================================
// DÉLAIS LÉGAUX - Calendrier procédural français
// ============================================

/**
 * Délais légaux pour les procédures françaises
 * Source: Code de procédure civile, Code de procédure pénale
 */
export const DELAIS_LEGAUX = {
    // Recours en appel
    APPEL_CIVIL: 30, // 1 mois
    APPEL_PRUDHOMMES: 30, // 1 mois
    APPEL_TRIBUNAL_COMMERCE: 30, // 1 mois
    APPEL_PENAL: 10, // 10 jours
    APPEL_CORRECTIONNEL: 10, // 10 jours

    // Recours en cassation
    POURVOI_CASSATION_CIVIL: 60, // 2 mois
    POURVOI_CASSATION_PENAL: 5, // 5 jours francs

    // Opposition
    OPPOSITION_JUGEMENT_DEFAUT: 30, // 1 mois
    OPPOSITION_ORDONNANCE_INJONCTION: 30, // 1 mois

    // Référé
    DELAI_REFERE_EXPERTISE: 15, // Délai court - référé

    // Conclusions
    CONCLUSIONS_PREMIERE_INSTANCE: 90, // Variable - calendrier de mise en état
    CONCLUSIONS_APPEL: 90, // 3 mois généralement

    // Communication de pièces
    COMMUNICATION_PIECES: 15, // Variable selon calendrier

    // Signification
    SIGNIFICATION_JUGEMENT: 14, // 2 semaines recommandé

    // Prescription
    PRESCRIPTION_CIVILE_5_ANS: 1825, // 5 ans
    PRESCRIPTION_CIVILE_2_ANS: 730, // 2 ans (consommation)
    PRESCRIPTION_CIVILE_10_ANS: 3650, // 10 ans (corporel)
    PRESCRIPTION_PENALE_CRIME: 7300, // 20 ans
    PRESCRIPTION_PENALE_DELIT: 2190, // 6 ans
    PRESCRIPTION_PENALE_CONTRAVENTION: 365, // 1 an
} as const;

export type DelaiLegal = keyof typeof DELAIS_LEGAUX;

/**
 * Calcule la date limite en ajoutant un délai légal
 */
export function calculerDateLimite(dateDepart: Date, delai: DelaiLegal): Date {
    const result = new Date(dateDepart);
    result.setDate(result.getDate() + DELAIS_LEGAUX[delai]);
    return result;
}

/**
 * Vérifie si un délai est dépassé
 */
export function estDelaiDepasse(dateDepart: Date, delai: DelaiLegal): boolean {
    const dateLimite = calculerDateLimite(dateDepart, delai);
    return new Date() > dateLimite;
}

/**
 * Calcule le nombre de jours restants avant l'expiration
 */
export function joursRestants(dateDepart: Date, delai: DelaiLegal): number {
    const dateLimite = calculerDateLimite(dateDepart, delai);
    const now = new Date();
    const diffTime = dateLimite.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
