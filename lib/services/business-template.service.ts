import { CATEGORY_CONFIGS } from "@/lib/config/business-hierarchy.config";
import { prisma } from "@/lib/prisma";
import { BusinessType } from "@/lib/types/business";
import type { BusinessCategory } from "@/lib/types/business-category";
import { CapabilityService } from "./capability.service";

/**
 * Service de gestion des templates métier
 * Permet de personnaliser l'expérience selon le type de business
 *
 * @see CapabilityService pour la gestion des capabilities
 * @see business-hierarchy.config.ts pour la configuration des catégories
 */

// Constantes
const DEFAULT_BUSINESS_TYPE = "GENERAL" as const;
const FREE_PLAN_LIMITS = {
    MAX_CATEGORIES: 3,
    MAX_LOYALTY_LEVELS: 2,
    MAX_FEATURES: 3,
    MAX_LOYALTY_BENEFITS: 2,
} as const;

const INITIAL_DOCUMENT_NUMBER = 1;

// Ré-exporter BusinessType pour la compatibilité
export type { BusinessType } from "@/lib/types/business";

export interface BusinessTemplate {
    type: BusinessType;
    label: string;
    icon: string;
    description: string;
    color: string;
    categories: {
        nom: string;
        description: string;
        champsPersonnalises?: {
            nom: string;
            code: string;
            type: "TEXT" | "NUMBER" | "DATE" | "SELECT" | "TEXTAREA";
            obligatoire?: boolean;
            options?: string[];
        }[];
    }[];
    niveauxFidelite?: {
        nom: string;
        pointsSeuil: number;
        remise: number;
        couleur: string;
        icone: string;
        avantages: string[];
    }[];
    seriesDocuments?: {
        type: "DEVIS" | "FACTURE" | "AVOIR";
        nom: string;
        prefix: string;
        format: string;
    }[];
    termsAndConditions?: string;
    features?: string[];
}

export class BusinessTemplateService {
    /**
     * Templates prédéfinis par métier
     */
    static readonly TEMPLATES: Record<BusinessType, BusinessTemplate> = {
        GENERAL: {
            type: "GENERAL",
            label: "Entreprise générale",
            icon: "Building2",
            description: "Configuration standard pour tout type d'activité",
            color: "#6B7280",
            categories: [
                {
                    nom: "Produits",
                    description: "Produits généraux",
                },
                {
                    nom: "Services",
                    description: "Prestations de services",
                },
            ],
        },

        PLOMBERIE: {
            type: "PLOMBERIE",
            label: "Plomberie",
            icon: "Wrench",
            description: "Artisan plombier, installation sanitaire",
            color: "#3B82F6",
            categories: [
                {
                    nom: "Dépannage",
                    description: "Interventions de dépannage urgentes",
                    champsPersonnalises: [
                        {
                            nom: "Type d'intervention",
                            code: "type_intervention",
                            type: "SELECT",
                            obligatoire: true,
                            options: [
                                "Fuite",
                                "Débouchage",
                                "Chauffe-eau",
                                "Robinetterie",
                            ],
                        },
                        {
                            nom: "Urgence",
                            code: "urgence",
                            type: "SELECT",
                            options: ["Normale", "Urgente", "Très urgente"],
                        },
                    ],
                },
                {
                    nom: "Installation",
                    description: "Installation sanitaire et chauffage",
                    champsPersonnalises: [
                        {
                            nom: "Garantie (années)",
                            code: "garantie_annees",
                            type: "NUMBER",
                        },
                    ],
                },
                {
                    nom: "Pièces détachées",
                    description: "Robinetterie, tuyaux, raccords",
                },
            ],
            niveauxFidelite: [
                {
                    nom: "Client",
                    pointsSeuil: 0,
                    remise: 0,
                    couleur: "#6B7280",
                    icone: "User",
                    avantages: ["Devis gratuit", "Garantie 1 an"],
                },
                {
                    nom: "Fidèle",
                    pointsSeuil: 500,
                    remise: 5,
                    couleur: "#3B82F6",
                    icone: "Star",
                    avantages: [
                        "5% de remise",
                        "Déplacement offert",
                        "Garantie 2 ans",
                    ],
                },
                {
                    nom: "VIP",
                    pointsSeuil: 2000,
                    remise: 10,
                    couleur: "#F59E0B",
                    icone: "Crown",
                    avantages: [
                        "10% de remise",
                        "Priorité dépannage",
                        "Garantie 3 ans",
                        "Maintenance gratuite",
                    ],
                },
            ],
            termsAndConditions:
                "Devis valable 30 jours. Garantie légale de conformité. Intervention sous 24h en cas d'urgence.",
            features: [
                "Gestion des interventions urgentes",
                "Suivi des garanties",
            ],
        },

        ELECTRICITE: {
            type: "ELECTRICITE",
            label: "Électricité",
            icon: "Zap",
            description: "Électricien, installation électrique",
            color: "#EAB308",
            categories: [
                {
                    nom: "Installation électrique",
                    description: "Pose de tableaux, câblage",
                    champsPersonnalises: [
                        {
                            nom: "Certification",
                            code: "certification",
                            type: "SELECT",
                            options: ["Consuel", "NF C 15-100", "RGIE"],
                        },
                        {
                            nom: "Puissance (kW)",
                            code: "puissance_kw",
                            type: "NUMBER",
                        },
                    ],
                },
                {
                    nom: "Dépannage électrique",
                    description: "Pannes et coupures",
                    champsPersonnalises: [
                        {
                            nom: "Type de panne",
                            code: "type_panne",
                            type: "SELECT",
                            options: [
                                "Disjoncteur",
                                "Court-circuit",
                                "Prise défectueuse",
                            ],
                        },
                    ],
                },
                {
                    nom: "Domotique",
                    description: "Installations connectées",
                },
                {
                    nom: "Fournitures",
                    description: "Matériel électrique",
                },
            ],
            termsAndConditions:
                "Travaux conformes à la norme NF C 15-100. Certification Consuel fournie. Garantie décennale.",
            features: [
                "Certifications électriques",
                "Attestations Consuel",
                "Planning interventions",
            ],
        },

        RESTAURATION: {
            type: "RESTAURATION",
            label: "Restaurant / Café / Bar",
            icon: "UtensilsCrossed",
            description: "Restaurant, café, bar, food truck",
            color: "#EF4444",
            categories: [
                {
                    nom: "Entrées",
                    description: "Entrées et amuse-bouches",
                    champsPersonnalises: [
                        {
                            nom: "Allergènes",
                            code: "allergenes",
                            type: "TEXT",
                        },
                        {
                            nom: "Végétarien",
                            code: "vegetarien",
                            type: "SELECT",
                            options: ["Oui", "Non"],
                        },
                    ],
                },
                {
                    nom: "Plats",
                    description: "Plats principaux",
                    champsPersonnalises: [
                        {
                            nom: "Temps de préparation (min)",
                            code: "temps_preparation",
                            type: "NUMBER",
                        },
                        {
                            nom: "Allergènes",
                            code: "allergenes",
                            type: "TEXT",
                        },
                    ],
                },
                {
                    nom: "Desserts",
                    description: "Desserts et pâtisseries",
                },
                {
                    nom: "Boissons",
                    description: "Boissons chaudes et froides",
                    champsPersonnalises: [
                        {
                            nom: "Type",
                            code: "type_boisson",
                            type: "SELECT",
                            options: ["Chaude", "Froide", "Alcoolisée"],
                        },
                        {
                            nom: "Taille",
                            code: "taille",
                            type: "SELECT",
                            options: ["25cl", "33cl", "50cl", "1L"],
                        },
                    ],
                },
                {
                    nom: "Menus",
                    description: "Menus et formules",
                },
            ],
            niveauxFidelite: [
                {
                    nom: "Découverte",
                    pointsSeuil: 0,
                    remise: 0,
                    couleur: "#6B7280",
                    icone: "User",
                    avantages: ["Café offert après 10 visites"],
                },
                {
                    nom: "Habitué",
                    pointsSeuil: 200,
                    remise: 5,
                    couleur: "#F59E0B",
                    icone: "Star",
                    avantages: [
                        "5% de remise",
                        "Dessert offert le jour anniversaire",
                    ],
                },
                {
                    nom: "VIP",
                    pointsSeuil: 1000,
                    remise: 10,
                    couleur: "#DC2626",
                    icone: "Crown",
                    avantages: [
                        "10% de remise",
                        "Réservation prioritaire",
                        "Menu dégustation offert",
                    ],
                },
            ],
            seriesDocuments: [
                {
                    type: "FACTURE",
                    nom: "Tickets",
                    prefix: "T",
                    format: "T{YYYY}{MM}-{0000}",
                },
                {
                    type: "FACTURE",
                    nom: "Notes",
                    prefix: "N",
                    format: "N{YYYY}-{0000}",
                },
            ],
            features: [
                "Gestion des tables",
                "Gestion des allergènes",
                "Menu du jour",
                "Réservations",
            ],
        },

        COIFFURE: {
            type: "COIFFURE",
            label: "Salon de coiffure",
            icon: "Scissors",
            description: "Coiffeur, barbier",
            color: "#EC4899",
            categories: [
                {
                    nom: "Coupe",
                    description: "Coupes et brushing",
                    champsPersonnalises: [
                        {
                            nom: "Type",
                            code: "type_coupe",
                            type: "SELECT",
                            options: ["Homme", "Femme", "Enfant"],
                        },
                        {
                            nom: "Durée (min)",
                            code: "duree_min",
                            type: "NUMBER",
                        },
                    ],
                },
                {
                    nom: "Coloration",
                    description: "Coloration et mèches",
                    champsPersonnalises: [
                        {
                            nom: "Couleur",
                            code: "couleur",
                            type: "TEXT",
                        },
                    ],
                },
                {
                    nom: "Soins",
                    description: "Soins capillaires",
                },
                {
                    nom: "Produits",
                    description: "Shampoings, masques, etc.",
                },
            ],
            niveauxFidelite: [
                {
                    nom: "Client",
                    pointsSeuil: 0,
                    remise: 0,
                    couleur: "#6B7280",
                    icone: "User",
                    avantages: ["Carte de fidélité"],
                },
                {
                    nom: "Fidèle",
                    pointsSeuil: 300,
                    remise: 10,
                    couleur: "#EC4899",
                    icone: "Star",
                    avantages: [
                        "10% de remise",
                        "Coupe offerte tous les 10 RDV",
                    ],
                },
                {
                    nom: "VIP",
                    pointsSeuil: 1000,
                    remise: 15,
                    couleur: "#8B5CF6",
                    icone: "Crown",
                    avantages: [
                        "15% de remise",
                        "Réservation prioritaire",
                        "Soin offert par mois",
                    ],
                },
            ],
            features: [
                "Gestion des rendez-vous",
                "Rappels SMS",
                "Historique des coupes",
            ],
        },

        GARAGE: {
            type: "GARAGE",
            label: "Garage automobile",
            icon: "Car",
            description: "Réparation et entretien automobile",
            color: "#1F2937",
            categories: [
                {
                    nom: "Entretien",
                    description: "Révisions et vidanges",
                    champsPersonnalises: [
                        {
                            nom: "Type véhicule",
                            code: "type_vehicule",
                            type: "SELECT",
                            options: [
                                "Voiture",
                                "Moto",
                                "Utilitaire",
                                "Poids lourd",
                            ],
                        },
                        {
                            nom: "Kilométrage",
                            code: "kilometrage",
                            type: "NUMBER",
                        },
                        {
                            nom: "Immatriculation",
                            code: "immatriculation",
                            type: "TEXT",
                            obligatoire: true,
                        },
                    ],
                },
                {
                    nom: "Réparation",
                    description: "Pannes et réparations",
                    champsPersonnalises: [
                        {
                            nom: "Type de réparation",
                            code: "type_reparation",
                            type: "SELECT",
                            options: [
                                "Mécanique",
                                "Carrosserie",
                                "Électronique",
                                "Pneumatique",
                            ],
                        },
                    ],
                },
                {
                    nom: "Pneus",
                    description: "Changement et équilibrage",
                },
                {
                    nom: "Pièces détachées",
                    description: "Pièces et accessoires",
                },
            ],
            features: [
                "Historique véhicule",
                "Rappels entretien",
                "Devis en ligne",
            ],
        },

        INFORMATIQUE: {
            type: "INFORMATIQUE",
            label: "Services informatiques",
            icon: "Monitor",
            description: "Dépannage et services IT",
            color: "#0EA5E9",
            categories: [
                {
                    nom: "Dépannage",
                    description: "Réparation matériel",
                    champsPersonnalises: [
                        {
                            nom: "Type appareil",
                            code: "type_appareil",
                            type: "SELECT",
                            options: [
                                "PC",
                                "Mac",
                                "Smartphone",
                                "Tablette",
                                "Serveur",
                            ],
                        },
                        {
                            nom: "Problème",
                            code: "probleme",
                            type: "TEXT",
                        },
                    ],
                },
                {
                    nom: "Installation",
                    description: "Installation logiciels et matériel",
                },
                {
                    nom: "Formation",
                    description: "Formation et conseil",
                    champsPersonnalises: [
                        {
                            nom: "Nombre de participants",
                            code: "nb_participants",
                            type: "NUMBER",
                        },
                        {
                            nom: "Durée (heures)",
                            code: "duree_heures",
                            type: "NUMBER",
                        },
                    ],
                },
                {
                    nom: "Matériel",
                    description: "Vente de matériel informatique",
                },
            ],
            features: [
                "Tickets de support",
                "Suivi interventions",
                "Base de connaissances",
            ],
        },

        CONSULTING: {
            type: "CONSULTING",
            label: "Conseil / Formation",
            icon: "BriefcaseIcon",
            description: "Consultant, formateur, coach",
            color: "#8B5CF6",
            categories: [
                {
                    nom: "Consulting",
                    description: "Prestations de conseil",
                    champsPersonnalises: [
                        {
                            nom: "Type mission",
                            code: "type_mission",
                            type: "SELECT",
                            options: [
                                "Audit",
                                "Stratégie",
                                "Accompagnement",
                                "Expertise",
                            ],
                        },
                        {
                            nom: "Durée (jours)",
                            code: "duree_jours",
                            type: "NUMBER",
                        },
                    ],
                },
                {
                    nom: "Formation",
                    description: "Sessions de formation",
                    champsPersonnalises: [
                        {
                            nom: "Format",
                            code: "format",
                            type: "SELECT",
                            options: ["Présentiel", "Distanciel", "Hybride"],
                        },
                        {
                            nom: "Nombre participants",
                            code: "nb_participants",
                            type: "NUMBER",
                        },
                    ],
                },
                {
                    nom: "Coaching",
                    description: "Séances de coaching individuel",
                },
            ],
            features: [
                "Gestion projets",
                "Planning missions",
                "Rapports d'activité",
            ],
        },

        CHAUFFAGE: {
            type: "CHAUFFAGE",
            label: "Chauffage",
            icon: "Flame",
            description: "Chauffagiste, climatisation",
            color: "#F97316",
            categories: [
                {
                    nom: "Installation",
                    description: "Pose chaudière, radiateurs",
                },
                {
                    nom: "Entretien",
                    description: "Maintenance annuelle",
                },
                {
                    nom: "Dépannage",
                    description: "Réparations urgentes",
                },
            ],
        },

        MENUISERIE: {
            type: "MENUISERIE",
            label: "Menuiserie",
            icon: "Hammer",
            description: "Menuisier, ébéniste",
            color: "#92400E",
            categories: [
                {
                    nom: "Portes et fenêtres",
                    description: "Pose et réparation",
                },
                {
                    nom: "Meubles sur mesure",
                    description: "Création de meubles",
                },
                {
                    nom: "Aménagement",
                    description: "Placards, dressings",
                },
            ],
        },

        PEINTURE: {
            type: "PEINTURE",
            label: "Peinture",
            icon: "PaintbrushIcon",
            description: "Peintre en bâtiment",
            color: "#0891B2",
            categories: [
                {
                    nom: "Peinture intérieure",
                    description: "Murs et plafonds",
                },
                {
                    nom: "Peinture extérieure",
                    description: "Façades",
                },
                {
                    nom: "Revêtements",
                    description: "Papier peint, enduit décoratif",
                },
            ],
        },

        MACONNERIE: {
            type: "MACONNERIE",
            label: "Maçonnerie",
            icon: "HardHat",
            description: "Maçon, gros œuvre",
            color: "#78350F",
            categories: [
                {
                    nom: "Gros œuvre",
                    description: "Fondations, murs",
                },
                {
                    nom: "Rénovation",
                    description: "Travaux de rénovation",
                },
                {
                    nom: "Extension",
                    description: "Agrandissement",
                },
            ],
        },

        BOULANGERIE: {
            type: "BOULANGERIE",
            label: "Boulangerie / Pâtisserie",
            icon: "Croissant",
            description: "Boulanger, pâtissier",
            color: "#D97706",
            categories: [
                {
                    nom: "Pains",
                    description: "Baguettes, pains spéciaux",
                },
                {
                    nom: "Viennoiseries",
                    description: "Croissants, pains au chocolat",
                },
                {
                    nom: "Pâtisseries",
                    description: "Gâteaux, tartes",
                },
                {
                    nom: "Sandwichs",
                    description: "Snacking",
                },
            ],
        },

        ESTHETIQUE: {
            type: "ESTHETIQUE",
            label: "Esthétique / Spa",
            icon: "Sparkles",
            description: "Institut de beauté, spa, massage",
            color: "#DB2777",
            categories: [
                {
                    nom: "Soins du visage",
                    description: "Nettoyage, masques",
                },
                {
                    nom: "Soins du corps",
                    description: "Gommages, enveloppements",
                },
                {
                    nom: "Épilation",
                    description: "Cire, laser",
                },
                {
                    nom: "Massages",
                    description: "Relaxants, thérapeutiques",
                },
                {
                    nom: "Onglerie",
                    description: "Manucure, pédicure",
                },
            ],
        },

        FITNESS: {
            type: "FITNESS",
            label: "Fitness / Sport",
            icon: "Dumbbell",
            description: "Salle de sport, coach sportif",
            color: "#059669",
            categories: [
                {
                    nom: "Abonnements",
                    description: "Abonnements mensuels/annuels",
                },
                {
                    nom: "Cours collectifs",
                    description: "Yoga, Pilates, Zumba",
                },
                {
                    nom: "Coaching individuel",
                    description: "Personal training",
                },
                {
                    nom: "Produits",
                    description: "Compléments, accessoires",
                },
            ],
        },

        COMMERCE_DETAIL: {
            type: "COMMERCE_DETAIL",
            label: "Commerce de détail",
            icon: "ShoppingCart",
            description: "Boutique, magasin",
            color: "#7C3AED",
            categories: [
                {
                    nom: "Produits",
                    description: "Articles en vente",
                },
            ],
        },

        AGENT_IMMOBILIER: {
            type: "AGENT_IMMOBILIER",
            label: "Agent immobilier",
            icon: "Home",
            description: "Transaction immobilière, mandats de vente et location",
            color: "#0284C7",
            categories: [
                {
                    nom: "Mandats vente",
                    description: "Mandats exclusifs et simples de vente",
                },
                {
                    nom: "Mandats location",
                    description: "Mandats de recherche locataire",
                },
                {
                    nom: "Honoraires",
                    description: "Frais d'agence et commissions",
                },
            ],
            features: [
                "Gestion des mandats",
                "Diffusion multi-portails",
                "Matching acquéreurs",
                "Pipeline transactions",
                "Estimations",
            ],
        },

        GESTION_LOCATIVE: {
            type: "GESTION_LOCATIVE",
            label: "Gestion locative",
            icon: "Building2",
            description: "Administration de biens, gestion des baux et loyers",
            color: "#059669",
            categories: [
                {
                    nom: "Loyers",
                    description: "Appels et encaissement des loyers",
                },
                {
                    nom: "Charges locatives",
                    description: "Régularisation des charges",
                },
                {
                    nom: "Travaux",
                    description: "Interventions et maintenance",
                },
            ],
            features: [
                "Gestion des baux",
                "Appels de loyers automatiques",
                "Suivi des impayés",
                "États des lieux",
                "Révision IRL",
            ],
        },

        SYNDIC_COPROPRIETE: {
            type: "SYNDIC_COPROPRIETE",
            label: "Syndic de copropriété",
            icon: "Landmark",
            description: "Gestion de copropriétés, assemblées générales",
            color: "#7C3AED",
            categories: [
                {
                    nom: "Charges copropriété",
                    description: "Appels de fonds et charges",
                },
                {
                    nom: "Travaux collectifs",
                    description: "Gros travaux et entretien",
                },
                {
                    nom: "Comptabilité syndic",
                    description: "Comptes de la copropriété",
                },
            ],
            features: [
                "Gestion des copropriétés",
                "Assemblées générales",
                "Appels de charges",
                "Comptabilité copro",
                "Conseil syndical",
            ],
        },

        SANTE: {
            type: "SANTE",
            label: "Santé",
            icon: "Heart",
            description: "Professions médicales et paramédicales",
            color: "#DC2626",
            categories: [
                {
                    nom: "Consultations",
                    description: "Consultations médicales",
                },
                {
                    nom: "Soins",
                    description: "Actes et soins",
                },
                {
                    nom: "Analyses",
                    description: "Examens et analyses",
                },
            ],
        },

        JURIDIQUE: {
            type: "JURIDIQUE",
            label: "Juridique",
            icon: "Scale",
            description: "Avocat, notaire",
            color: "#1E40AF",
            categories: [
                {
                    nom: "Consultations",
                    description: "Conseils juridiques",
                },
                {
                    nom: "Actes",
                    description: "Rédaction d'actes",
                },
                {
                    nom: "Contentieux",
                    description: "Procédures judiciaires",
                },
            ],
        },

        COMPTABILITE: {
            type: "COMPTABILITE",
            label: "Comptabilité",
            icon: "Calculator",
            description: "Expert-comptable",
            color: "#166534",
            categories: [
                {
                    nom: "Tenue de comptabilité",
                    description: "Saisie comptable mensuelle",
                },
                {
                    nom: "Déclarations fiscales",
                    description: "TVA, IS, CFE",
                },
                {
                    nom: "Bilan annuel",
                    description: "Clôture des comptes",
                },
                {
                    nom: "Conseil",
                    description: "Conseils en gestion",
                },
            ],
        },
    };

    /**
     * Récupérer un template par type de business
     */
    static getTemplate(type: BusinessType): BusinessTemplate {
        return this.TEMPLATES[type] || this.TEMPLATES[DEFAULT_BUSINESS_TYPE];
    }

    /**
     * Appliquer un template à une entreprise
     */
    static async applyTemplate(
        entrepriseId: string,
        businessType: BusinessType
    ): Promise<void> {
        const template = this.getTemplate(businessType);

        // 1. Mettre à jour le type de business de l'entreprise
        await prisma.entreprise.update({
            where: { id: entrepriseId },
            data: { businessType },
        });

        // 2. Créer les catégories prédéfinies
        for (const cat of template.categories) {
            const categorie = await prisma.categorie.create({
                data: {
                    nom: cat.nom,
                    description: cat.description,
                    entrepriseId,
                },
            });

            // 3. Créer les champs personnalisés si définis
            if (cat.champsPersonnalises) {
                for (const champ of cat.champsPersonnalises) {
                    await prisma.champPersonnalise.create({
                        data: {
                            categorieId: categorie.id,
                            nom: champ.nom,
                            code: champ.code,
                            type: champ.type,
                            obligatoire: champ.obligatoire || false,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            options: (champ.options || null) as any,
                        },
                    });
                }
            }
        }

        // 4. Créer les niveaux de fidélité prédéfinis
        if (template.niveauxFidelite) {
            for (const niveau of template.niveauxFidelite) {
                await prisma.niveauFidelite.create({
                    data: {
                        nom: niveau.nom,
                        seuilPoints: niveau.pointsSeuil,
                        remise: niveau.remise,
                        couleur: niveau.couleur,
                        icone: niveau.icone,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        avantages: JSON.stringify(niveau.avantages) as any,
                        entrepriseId,
                    },
                });
            }
        }

        // 5. Créer les séries de documents prédéfinies
        if (template.seriesDocuments) {
            for (const serie of template.seriesDocuments) {
                await prisma.serieDocument.create({
                    data: {
                        nom: serie.nom,
                        code: serie.prefix,
                        format_numero: serie.format,
                        prochain_numero: INITIAL_DOCUMENT_NUMBER,
                        pour_devis: serie.type === "DEVIS",
                        pour_factures: serie.type === "FACTURE",
                        pour_avoirs: serie.type === "AVOIR",
                        entrepriseId,
                    },
                });
            }
        }

        // 6. Mettre à jour les conditions générales dans les paramètres
        if (template.termsAndConditions) {
            // Récupérer le nom de l'entreprise pour le champ obligatoire
            const entreprise = await prisma.entreprise.findUnique({
                where: { id: entrepriseId },
                select: { nom: true },
            });

            await prisma.parametresEntreprise.upsert({
                where: { entrepriseId },
                create: {
                    entrepriseId,
                    nom_entreprise: entreprise?.nom || "",
                    mentions_legales: template.termsAndConditions,
                },
                update: {
                    mentions_legales: template.termsAndConditions,
                },
            });
        }
    }

    /**
     * Récupérer tous les templates disponibles
     */
    static getAllTemplates(): BusinessTemplate[] {
        return Object.values(this.TEMPLATES);
    }

    /**
     * Récupérer les templates par catégorie (utilise la nouvelle hiérarchie)
     */
    static getTemplatesByCategory(): Record<string, BusinessTemplate[]> {
        const result: Record<string, BusinessTemplate[]> = {};

        for (const [_category, config] of Object.entries(CATEGORY_CONFIGS)) {
            result[config.label] = config.businessTypes.map(
                (type) => this.TEMPLATES[type]
            );
        }

        return result;
    }

    /**
     * Récupérer les templates groupés par BusinessCategory (typed)
     */
    static getTemplatesByBusinessCategory(): Record<
        BusinessCategory,
        BusinessTemplate[]
    > {
        const result = {} as Record<BusinessCategory, BusinessTemplate[]>;

        for (const [category, config] of Object.entries(CATEGORY_CONFIGS)) {
            result[category as BusinessCategory] = config.businessTypes.map(
                (type) => this.TEMPLATES[type]
            );
        }

        return result;
    }

    /**
     * Récupérer la catégorie d'un business type
     */
    static getCategoryForType(type: BusinessType): BusinessCategory {
        return CapabilityService.getCategoryForType(type);
    }

    /**
     * Récupère une variante de template selon le plan de l'utilisateur
     * FREE: Version simplifiée (moins de catégories, pas de champs personnalisés)
     * STARTER/PRO/ENTERPRISE: Version complète
     */
    static getTemplateVariant(
        businessType: BusinessType,
        plan: "FREE" | "STARTER" | "PRO" | "ENTERPRISE",
        isTrialActive: boolean = false
    ): BusinessTemplate {
        const fullTemplate = this.getTemplate(businessType);

        // Si trial actif ou plan payant, retourner template complet
        if (isTrialActive || plan !== "FREE") {
            return fullTemplate;
        }

        // Version simplifiée pour FREE
        return this.simplifyTemplate(fullTemplate);
    }

    /**
     * Simplifie un template pour le plan FREE
     * - Limite à 2-3 catégories maximum
     * - Supprime les champs personnalisés
     * - Simplifie les niveaux de fidélité (max 2 niveaux)
     * - Garde les features essentielles uniquement
     */
    private static simplifyTemplate(
        template: BusinessTemplate
    ): BusinessTemplate {
        return {
            ...template,
            // Limiter à 3 catégories max
            categories: template.categories
                .slice(0, FREE_PLAN_LIMITS.MAX_CATEGORIES)
                .map((cat) => ({
                    nom: cat.nom,
                    description: cat.description,
                    // Supprimer les champs personnalisés en FREE
                    champsPersonnalises: undefined,
                })),
            // Simplifier à 2 niveaux de fidélité max
            niveauxFidelite: template.niveauxFidelite
                ?.slice(0, FREE_PLAN_LIMITS.MAX_LOYALTY_LEVELS)
                .map((niveau) => ({
                    ...niveau,
                    // Simplifier les avantages
                    avantages: niveau.avantages.slice(
                        0,
                        FREE_PLAN_LIMITS.MAX_LOYALTY_BENEFITS
                    ),
                })),
            // Garder que les features essentielles
            features: template.features?.slice(
                0,
                FREE_PLAN_LIMITS.MAX_FEATURES
            ),
        };
    }

    /**
     * Vérifie si une feature du template est disponible pour le plan
     */
    static isFeatureAvailableForPlan(
        businessType: BusinessType,
        feature: string,
        plan: "FREE" | "STARTER" | "PRO" | "ENTERPRISE",
        isTrialActive: boolean = false
    ): boolean {
        // Si trial actif ou plan payant, toutes les features sont disponibles
        if (isTrialActive || plan !== "FREE") {
            return true;
        }

        const fullTemplate = this.getTemplate(businessType);
        const simplifiedTemplate = this.simplifyTemplate(fullTemplate);

        // Vérifier si la feature est dans la version simplifiée
        return simplifiedTemplate.features?.includes(feature) ?? false;
    }

    /**
     * Récupère le nombre de catégories disponibles selon le plan
     */
    static getAvailableCategoriesCount(
        businessType: BusinessType,
        plan: "FREE" | "STARTER" | "PRO" | "ENTERPRISE",
        isTrialActive: boolean = false
    ): number {
        const template = this.getTemplateVariant(
            businessType,
            plan,
            isTrialActive
        );
        return template.categories.length;
    }

    /**
     * Applique la variante appropriée du template selon le plan
     */
    static async applyTemplateVariant(
        entrepriseId: string,
        businessType: BusinessType,
        plan: "FREE" | "STARTER" | "PRO" | "ENTERPRISE",
        isTrialActive: boolean = false
    ): Promise<void> {
        const templateVariant = this.getTemplateVariant(
            businessType,
            plan,
            isTrialActive
        );

        // Réutiliser la logique d'application existante
        await this.applyTemplate(entrepriseId, businessType);

        // Si FREE et pas de trial, supprimer les éléments non supportés
        if (plan === "FREE" && !isTrialActive) {
            // Supprimer les catégories excédentaires (garder que FREE_PLAN_LIMITS.MAX_CATEGORIES)
            const categories = await prisma.categorie.findMany({
                where: { entrepriseId },
                orderBy: { ordre: "asc" },
            });

            if (categories.length > FREE_PLAN_LIMITS.MAX_CATEGORIES) {
                const toDelete = categories.slice(
                    FREE_PLAN_LIMITS.MAX_CATEGORIES
                );
                await prisma.categorie.deleteMany({
                    where: {
                        id: { in: toDelete.map((c) => c.id) },
                    },
                });
            }

            // Limiter les niveaux de fidélité à FREE_PLAN_LIMITS.MAX_LOYALTY_LEVELS
            const niveaux = await prisma.niveauFidelite.findMany({
                where: { entrepriseId },
                orderBy: { ordre: "asc" },
            });

            if (niveaux.length > FREE_PLAN_LIMITS.MAX_LOYALTY_LEVELS) {
                const toDelete = niveaux.slice(
                    FREE_PLAN_LIMITS.MAX_LOYALTY_LEVELS
                );
                await prisma.niveauFidelite.deleteMany({
                    where: {
                        id: { in: toDelete.map((n) => n.id) },
                    },
                });
            }
        }
    }
}
