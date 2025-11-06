// ============================================
// TYPES POUR LES PARAMÈTRES
// ============================================

// Type pour DocumentType (pour éviter les imports circulaires pendant la génération)
export type DocumentType = "DEVIS" | "FACTURE" | "AVOIR";

// Type pour le reset du compteur
export type ResetCompteur = "AUCUN" | "ANNUEL" | "MENSUEL";

// Type pour les séries de documents
export interface SerieDocument {
    id: string;
    code: string;
    nom: string;
    description?: string | null;
    couleur?: string | null;
    pour_devis: boolean;
    pour_factures: boolean;
    pour_avoirs: boolean;
    prochain_numero: number;
    format_numero: string;
    reset_compteur: ResetCompteur;
    derniere_reset?: Date | null;
    est_defaut_devis: boolean;
    est_defaut_factures: boolean;
    est_defaut_avoirs: boolean;
    active: boolean;
    entrepriseId: string;
    _count?: {
        documents: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

// Type pour la création d'une série
export interface CreateSerieDocument {
    code: string;
    nom: string;
    description?: string;
    couleur?: string;
    pour_devis?: boolean;
    pour_factures?: boolean;
    pour_avoirs?: boolean;
    format_numero?: string;
    reset_compteur?: ResetCompteur;
    est_defaut_devis?: boolean;
    est_defaut_factures?: boolean;
    est_defaut_avoirs?: boolean;
}

// Type pour la mise à jour d'une série
export interface UpdateSerieDocument {
    code?: string;
    nom?: string;
    description?: string;
    couleur?: string;
    pour_devis?: boolean;
    pour_factures?: boolean;
    pour_avoirs?: boolean;
    format_numero?: string;
    reset_compteur?: ResetCompteur;
    est_defaut_devis?: boolean;
    est_defaut_factures?: boolean;
    est_defaut_avoirs?: boolean;
    active?: boolean;
}

// Variables disponibles pour le format de numérotation
export const FORMAT_VARIABLES = {
    CODE: "Code de la série (ex: ART, SER)",
    NUM5: "Numéro sur 5 chiffres (00001)",
    NUM4: "Numéro sur 4 chiffres (0001)",
    NUM3: "Numéro sur 3 chiffres (001)",
    YEAR: "Année (2025)",
    YEAR2: "Année sur 2 chiffres (25)",
    MONTH: "Mois (01-12)",
    TYPE: "Type de document (DEV, FACT, AV)",
} as const;

// Templates prédéfinis pour les séries
export const SERIE_TEMPLATES = [
    {
        code: "PROD",
        nom: "Vente de produits",
        description: "Factures et devis pour la vente de produits",
        couleur: "#000000",
        pour_devis: true,
        pour_factures: true,
        pour_avoirs: false,
        format_numero: "{CODE}{NUM5}",
    },
    {
        code: "SER",
        nom: "Prestations de services",
        description: "Factures et devis pour les prestations de services",
        couleur: "#000000",
        pour_devis: true,
        pour_factures: true,
        pour_avoirs: false,
        format_numero: "{CODE}{NUM5}",
    },
    {
        code: "CONS",
        nom: "Consulting",
        description: "Factures et devis pour le consulting",
        couleur: "#000000",
        pour_devis: true,
        pour_factures: true,
        pour_avoirs: false,
        format_numero: "{CODE}{NUM5}",
    },
    {
        code: "ART",
        nom: "Articles divers",
        description: "Tous types d'articles",
        couleur: "#000000",
        pour_devis: true,
        pour_factures: true,
        pour_avoirs: true,
        format_numero: "{CODE}-{YEAR}-{NUM5}",
    },
] as const;

// Fonction pour générer un numéro de document selon le format
export function generateNumeroDocument(
    format: string,
    numero: number,
    code: string,
    type: DocumentType
): string {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const typeMap: Record<DocumentType, string> = {
        DEVIS: "DEV",
        FACTURE: "FACT",
        AVOIR: "AV",
    };

    let result = format;
    result = result.replace("{CODE}", code);
    result = result.replace("{NUM5}", String(numero).padStart(5, "0"));
    result = result.replace("{NUM4}", String(numero).padStart(4, "0"));
    result = result.replace("{NUM3}", String(numero).padStart(3, "0"));
    result = result.replace("{YEAR}", String(year));
    result = result.replace("{YEAR2}", String(year).slice(-2));
    result = result.replace("{MONTH}", month);
    result = result.replace("{TYPE}", typeMap[type] || "");

    return result;
}

// Type pour les paramètres généraux de l'entreprise
export interface CompanySettings {
    nom_entreprise?: string | null;
    siret?: string | null;
    tva_intra?: string | null;
    adresse?: string | null;
    code_postal?: string | null;
    ville?: string | null;
    telephone?: string | null;
    email?: string | null;
    site_web?: string | null;
    logo_url?: string | null;
    mentions_legales?: string | null;
    // Configuration références articles
    prefixe_produit?: string | null;
    prefixe_service?: string | null;
    prochain_numero_produit?: number | null;
    prochain_numero_service?: number | null;
}

// Type pour les informations utilisateur
export interface UserSettings {
    name?: string | null;
    email?: string | null;
    role?: string | null;
    createdAt?: Date | string | null;
}

// Type pour les informations d'entreprise (abonnement)
export interface EntrepriseSettings {
    id?: string;
    plan?: "FREE" | "BASIC" | "PREMIUM" | "ENTERPRISE" | null;
}

// Type pour les préférences de l'utilisateur
export interface PreferenceSettings {
    langue?: string;
    timezone?: string;
    devise?: string;
    format_nombre?: string;
    format_date?: string;
    premier_jour?: string;
}

// Type pour les préférences de notifications
export interface NotificationPreferences {
    id?: string;
    entrepriseId: string;

    // Notifications Email
    email_nouveau_client: boolean;
    email_document_cree: boolean;
    email_document_paye: boolean;
    email_stock_bas: boolean;
    email_rapport_hebdomadaire: boolean;

    // Webhooks
    webhook_enabled: boolean;
    webhook_url?: string;
    webhook_secret?: string;
    webhook_events: string[]; // ["client.created", "document.paid", etc.]

    createdAt?: Date;
    updatedAt?: Date;
}
