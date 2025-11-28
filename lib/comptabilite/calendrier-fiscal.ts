/**
 * Calendrier Fiscal Français
 *
 * Ce fichier contient toutes les échéances fiscales et sociales légales
 * pour les entreprises françaises. Il permet de générer automatiquement
 * les échéances d'un dossier client.
 */

import type {
    PeriodiciteEcheance,
    TypeDossierComptable,
} from "@/lib/types/mission";

// ============================================
// TYPES
// ============================================

export type RegimeFiscal = "REEL_NORMAL" | "REEL_SIMPLIFIE" | "MICRO";
export type RegimeTVA = "MENSUEL" | "TRIMESTRIEL" | "ANNUEL" | "FRANCHISE";
export type FormeJuridique =
    | "SARL"
    | "SAS"
    | "SA"
    | "EURL"
    | "SASU"
    | "EI"
    | "EIRL"
    | "SCI"
    | "SNC"
    | "ASSOCIATION"
    | "AUTRE";

export type TypeImposition = "IS" | "IR";

export interface EcheanceTemplate {
    type: TypeDossierComptable;
    libelle: string;
    description: string;
    periodicite: PeriodiciteEcheance;
    /** Jour du mois (1-31), ou "dernier" pour dernier jour */
    jourEcheance: number | "dernier";
    /** Mois de l'échéance (1-12) pour les échéances annuelles, ou décalage en mois */
    moisEcheance?: number;
    /** Décalage par rapport à la fin de période (en jours) */
    delaiJours?: number;
    /** Conditions d'application */
    conditions?: {
        regimeFiscal?: RegimeFiscal[];
        regimeTVA?: RegimeTVA[];
        formeJuridique?: FormeJuridique[];
        typeImposition?: TypeImposition[];
        avecSalaries?: boolean;
    };
}

export interface ClientComptable {
    id: string;
    nom: string;
    formeJuridique: FormeJuridique;
    regimeFiscal: RegimeFiscal;
    regimeTVA: RegimeTVA;
    typeImposition: TypeImposition;
    dateClotureExercice: string; // Format "MM-DD" ex: "12-31" pour 31 décembre
    avecSalaries: boolean;
    effectif?: number;
}

// ============================================
// CALENDRIER FISCAL FRANÇAIS
// ============================================

export const ECHEANCES_FISCALES: EcheanceTemplate[] = [
    // ========== TVA ==========
    {
        type: "TVA",
        libelle: "TVA CA3",
        description: "Déclaration mensuelle de TVA (formulaire CA3)",
        periodicite: "MENSUEL",
        jourEcheance: 19,
        moisEcheance: 1, // +1 mois après la période
        conditions: {
            regimeTVA: ["MENSUEL"],
        },
    },
    {
        type: "TVA",
        libelle: "TVA CA3 Trimestrielle",
        description: "Déclaration trimestrielle de TVA",
        periodicite: "TRIMESTRIEL",
        jourEcheance: 19,
        moisEcheance: 1,
        conditions: {
            regimeTVA: ["TRIMESTRIEL"],
        },
    },
    {
        type: "TVA",
        libelle: "TVA CA12",
        description: "Déclaration annuelle de TVA (régime simplifié)",
        periodicite: "ANNUEL",
        jourEcheance: 3,
        moisEcheance: 5, // 2ème jour ouvré du 5ème mois
        conditions: {
            regimeFiscal: ["REEL_SIMPLIFIE"],
            regimeTVA: ["ANNUEL"],
        },
    },
    {
        type: "TVA",
        libelle: "Acompte TVA Juillet",
        description: "Acompte semestriel de TVA (régime simplifié)",
        periodicite: "ANNUEL",
        jourEcheance: 19,
        moisEcheance: 7,
        conditions: {
            regimeFiscal: ["REEL_SIMPLIFIE"],
        },
    },
    {
        type: "TVA",
        libelle: "Acompte TVA Décembre",
        description: "Acompte semestriel de TVA (régime simplifié)",
        periodicite: "ANNUEL",
        jourEcheance: 19,
        moisEcheance: 12,
        conditions: {
            regimeFiscal: ["REEL_SIMPLIFIE"],
        },
    },

    // ========== IMPÔT SUR LES SOCIÉTÉS ==========
    {
        type: "IS",
        libelle: "Acompte IS - 1er trimestre",
        description: "Premier acompte d'impôt sur les sociétés (15 mars)",
        periodicite: "ANNUEL",
        jourEcheance: 15,
        moisEcheance: 3,
        conditions: {
            typeImposition: ["IS"],
        },
    },
    {
        type: "IS",
        libelle: "Acompte IS - 2ème trimestre",
        description: "Deuxième acompte d'impôt sur les sociétés (15 juin)",
        periodicite: "ANNUEL",
        jourEcheance: 15,
        moisEcheance: 6,
        conditions: {
            typeImposition: ["IS"],
        },
    },
    {
        type: "IS",
        libelle: "Acompte IS - 3ème trimestre",
        description:
            "Troisième acompte d'impôt sur les sociétés (15 septembre)",
        periodicite: "ANNUEL",
        jourEcheance: 15,
        moisEcheance: 9,
        conditions: {
            typeImposition: ["IS"],
        },
    },
    {
        type: "IS",
        libelle: "Acompte IS - 4ème trimestre",
        description: "Quatrième acompte d'impôt sur les sociétés (15 décembre)",
        periodicite: "ANNUEL",
        jourEcheance: 15,
        moisEcheance: 12,
        conditions: {
            typeImposition: ["IS"],
        },
    },
    {
        type: "IS",
        libelle: "Solde IS",
        description: "Solde de liquidation de l'impôt sur les sociétés",
        periodicite: "ANNUEL",
        jourEcheance: 15,
        moisEcheance: 4, // 4 mois après clôture
        delaiJours: 0,
        conditions: {
            typeImposition: ["IS"],
        },
    },

    // ========== LIASSE FISCALE ==========
    {
        type: "LIASSE_FISCALE",
        libelle: "Liasse fiscale IS",
        description: "Dépôt de la liasse fiscale (2065 et annexes)",
        periodicite: "ANNUEL",
        jourEcheance: 15,
        moisEcheance: 4, // 4 mois après clôture (ajusté selon date)
        conditions: {
            typeImposition: ["IS"],
        },
    },
    {
        type: "LIASSE_FISCALE",
        libelle: "Liasse fiscale IR (BIC/BNC)",
        description: "Déclaration des résultats BIC/BNC",
        periodicite: "ANNUEL",
        jourEcheance: 3,
        moisEcheance: 5, // 2ème jour ouvré de mai
        conditions: {
            typeImposition: ["IR"],
            regimeFiscal: ["REEL_NORMAL", "REEL_SIMPLIFIE"],
        },
    },

    // ========== BILAN ==========
    {
        type: "BILAN",
        libelle: "Clôture des comptes",
        description: "Établissement du bilan et compte de résultat",
        periodicite: "ANNUEL",
        jourEcheance: "dernier",
        moisEcheance: 3, // 3 mois après clôture pour préparation
    },
    {
        type: "BILAN",
        libelle: "Approbation des comptes",
        description: "AGO d'approbation des comptes annuels",
        periodicite: "ANNUEL",
        jourEcheance: "dernier",
        moisEcheance: 6, // 6 mois après clôture
        conditions: {
            formeJuridique: ["SARL", "SAS", "SA", "EURL", "SASU", "SCI"],
        },
    },

    // ========== COTISATIONS SOCIALES ==========
    {
        type: "SOCIAL",
        libelle: "DSN",
        description: "Déclaration Sociale Nominative mensuelle",
        periodicite: "MENSUEL",
        jourEcheance: 5, // ou 15 selon effectif
        moisEcheance: 1,
        conditions: {
            avecSalaries: true,
        },
    },
    {
        type: "SOCIAL",
        libelle: "Cotisations URSSAF",
        description: "Paiement des cotisations sociales",
        periodicite: "MENSUEL",
        jourEcheance: 5, // ou 15 selon effectif
        moisEcheance: 1,
        conditions: {
            avecSalaries: true,
        },
    },

    // ========== PAIE ==========
    {
        type: "PAIE",
        libelle: "Bulletins de paie",
        description: "Établissement des bulletins de salaire",
        periodicite: "MENSUEL",
        jourEcheance: "dernier",
        conditions: {
            avecSalaries: true,
        },
    },

    // ========== CFE / CVAE ==========
    {
        type: "AUTRE",
        libelle: "CFE",
        description: "Cotisation Foncière des Entreprises",
        periodicite: "ANNUEL",
        jourEcheance: 15,
        moisEcheance: 12,
    },
    {
        type: "AUTRE",
        libelle: "CVAE - Déclaration",
        description: "Déclaration de la valeur ajoutée (1330-CVAE)",
        periodicite: "ANNUEL",
        jourEcheance: 3,
        moisEcheance: 5,
    },
    {
        type: "AUTRE",
        libelle: "CVAE - Acompte 1",
        description: "Premier acompte CVAE",
        periodicite: "ANNUEL",
        jourEcheance: 15,
        moisEcheance: 6,
    },
    {
        type: "AUTRE",
        libelle: "CVAE - Acompte 2",
        description: "Deuxième acompte CVAE",
        periodicite: "ANNUEL",
        jourEcheance: 15,
        moisEcheance: 9,
    },

    // ========== DÉCLARATION REVENUS ==========
    {
        type: "IR",
        libelle: "Déclaration IR",
        description: "Déclaration annuelle des revenus",
        periodicite: "ANNUEL",
        jourEcheance: 20,
        moisEcheance: 5,
        conditions: {
            typeImposition: ["IR"],
        },
    },

    // ========== JURIDIQUE ==========
    {
        type: "JURIDIQUE",
        libelle: "Dépôt comptes annuels",
        description: "Dépôt des comptes au greffe du tribunal",
        periodicite: "ANNUEL",
        jourEcheance: "dernier",
        moisEcheance: 7, // 1 mois après AGO
        conditions: {
            formeJuridique: ["SARL", "SAS", "SA", "EURL", "SASU"],
        },
    },
];

// ============================================
// LABELS
// ============================================

export const REGIME_FISCAL_LABELS: Record<RegimeFiscal, string> = {
    REEL_NORMAL: "Réel normal",
    REEL_SIMPLIFIE: "Réel simplifié",
    MICRO: "Micro-entreprise",
};

export const REGIME_TVA_LABELS: Record<RegimeTVA, string> = {
    MENSUEL: "TVA mensuelle",
    TRIMESTRIEL: "TVA trimestrielle",
    ANNUEL: "TVA annuelle (CA12)",
    FRANCHISE: "Franchise en base",
};

export const FORME_JURIDIQUE_LABELS: Record<FormeJuridique, string> = {
    SARL: "SARL",
    SAS: "SAS",
    SA: "SA",
    EURL: "EURL",
    SASU: "SASU",
    EI: "Entreprise Individuelle",
    EIRL: "EIRL",
    SCI: "SCI",
    SNC: "SNC",
    ASSOCIATION: "Association",
    AUTRE: "Autre",
};

export const TYPE_IMPOSITION_LABELS: Record<TypeImposition, string> = {
    IS: "Impôt sur les Sociétés",
    IR: "Impôt sur le Revenu",
};

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Vérifie si une échéance s'applique à un client donné
 */
export function echeanceApplicable(
    template: EcheanceTemplate,
    client: ClientComptable
): boolean {
    const { conditions } = template;
    if (!conditions) return true;

    if (
        conditions.regimeFiscal &&
        !conditions.regimeFiscal.includes(client.regimeFiscal)
    ) {
        return false;
    }

    if (
        conditions.regimeTVA &&
        !conditions.regimeTVA.includes(client.regimeTVA)
    ) {
        return false;
    }

    if (
        conditions.formeJuridique &&
        !conditions.formeJuridique.includes(client.formeJuridique)
    ) {
        return false;
    }

    if (
        conditions.typeImposition &&
        !conditions.typeImposition.includes(client.typeImposition)
    ) {
        return false;
    }

    if (conditions.avecSalaries !== undefined) {
        if (conditions.avecSalaries && !client.avecSalaries) {
            return false;
        }
    }

    return true;
}

/**
 * Calcule la date d'échéance pour une période donnée
 */
export function calculerDateEcheance(
    template: EcheanceTemplate,
    annee: number,
    mois?: number, // Pour échéances mensuelles/trimestrielles
    dateClotureExercice?: string // Format "MM-DD"
): Date {
    let targetMonth: number;
    let targetYear = annee;

    if (template.periodicite === "MENSUEL" && mois !== undefined) {
        // Échéance du mois suivant
        targetMonth = mois + (template.moisEcheance || 1);
        if (targetMonth > 12) {
            targetMonth -= 12;
            targetYear++;
        }
    } else if (template.periodicite === "TRIMESTRIEL" && mois !== undefined) {
        // Mois suivant la fin du trimestre
        targetMonth = mois + (template.moisEcheance || 1);
        if (targetMonth > 12) {
            targetMonth -= 12;
            targetYear++;
        }
    } else if (template.periodicite === "ANNUEL") {
        if (dateClotureExercice && template.moisEcheance) {
            // Échéance relative à la date de clôture
            const [clotMois] = dateClotureExercice.split("-").map(Number);
            targetMonth = clotMois + template.moisEcheance;
            if (targetMonth > 12) {
                targetMonth -= 12;
                targetYear++;
            }
        } else {
            targetMonth = template.moisEcheance || 1;
        }
    } else {
        targetMonth = template.moisEcheance || 1;
    }

    // Calculer le jour
    let targetDay: number;
    if (template.jourEcheance === "dernier") {
        // Dernier jour du mois
        targetDay = new Date(targetYear, targetMonth, 0).getDate();
    } else {
        targetDay = template.jourEcheance;
    }

    // Créer la date
    const date = new Date(targetYear, targetMonth - 1, targetDay);

    // Appliquer le délai si spécifié
    if (template.delaiJours) {
        date.setDate(date.getDate() + template.delaiJours);
    }

    return date;
}

/**
 * Génère toutes les échéances pour un client sur une année
 */
export function genererEcheancesAnnuelles(
    client: ClientComptable,
    annee: number
): Array<{
    template: EcheanceTemplate;
    dateEcheance: Date;
    libelle: string;
}> {
    const echeances: Array<{
        template: EcheanceTemplate;
        dateEcheance: Date;
        libelle: string;
    }> = [];

    for (const template of ECHEANCES_FISCALES) {
        if (!echeanceApplicable(template, client)) continue;

        if (template.periodicite === "MENSUEL") {
            // Générer pour chaque mois
            for (let mois = 1; mois <= 12; mois++) {
                const dateEcheance = calculerDateEcheance(
                    template,
                    annee,
                    mois,
                    client.dateClotureExercice
                );
                const moisNom = new Date(annee, mois - 1).toLocaleDateString(
                    "fr-FR",
                    { month: "long" }
                );
                echeances.push({
                    template,
                    dateEcheance,
                    libelle: `${template.libelle} - ${moisNom} ${annee}`,
                });
            }
        } else if (template.periodicite === "TRIMESTRIEL") {
            // Générer pour chaque trimestre
            for (let trimestre = 1; trimestre <= 4; trimestre++) {
                const moisFin = trimestre * 3;
                const dateEcheance = calculerDateEcheance(
                    template,
                    annee,
                    moisFin,
                    client.dateClotureExercice
                );
                echeances.push({
                    template,
                    dateEcheance,
                    libelle: `${template.libelle} - T${trimestre} ${annee}`,
                });
            }
        } else if (template.periodicite === "ANNUEL") {
            const dateEcheance = calculerDateEcheance(
                template,
                annee,
                undefined,
                client.dateClotureExercice
            );
            echeances.push({
                template,
                dateEcheance,
                libelle: `${template.libelle} ${annee}`,
            });
        }
    }

    // Trier par date
    echeances.sort(
        (a, b) => a.dateEcheance.getTime() - b.dateEcheance.getTime()
    );

    return echeances;
}

/**
 * Obtient les prochaines échéances pour un client
 */
export function getProchainesEcheances(
    client: ClientComptable,
    nombreMois: number = 3
): Array<{
    template: EcheanceTemplate;
    dateEcheance: Date;
    libelle: string;
}> {
    const now = new Date();
    const limite = new Date();
    limite.setMonth(limite.getMonth() + nombreMois);

    const anneeActuelle = now.getFullYear();
    const anneeSuivante = anneeActuelle + 1;

    // Générer pour l'année actuelle et suivante
    const toutesEcheances = [
        ...genererEcheancesAnnuelles(client, anneeActuelle),
        ...genererEcheancesAnnuelles(client, anneeSuivante),
    ];

    // Filtrer les échéances dans la période
    return toutesEcheances.filter(
        (e) => e.dateEcheance >= now && e.dateEcheance <= limite
    );
}
