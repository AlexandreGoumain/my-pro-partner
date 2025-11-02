export interface PlanFeatureItem {
    text: string;
    available: boolean;
    detail: string;
}

export interface PlanFeatureCategory {
    category: string;
    items: PlanFeatureItem[];
}

export interface PlanDetails {
    name: string;
    basePrice: number;
    description: string;
    tagline: string;
    badge?: string;
    highlights: string[];
    features: PlanFeatureCategory[];
    ideal: string[];
}

export type PricingPlans = {
    [K in "demarrage" | "pro" | "entreprise"]: PlanDetails;
};

export const pricingDetails: PricingPlans = {
    demarrage: {
        name: "Démarrage",
        basePrice: 49,
        description: "Idéal pour démarrer votre activité",
        tagline: "Tout ce dont vous avez besoin pour lancer votre entreprise",
        badge: undefined,
        highlights: [
            "Interface simple et intuitive",
            "Pas de frais cachés",
            "Accès immédiat",
            "Support en français",
        ],
        features: [
            {
                category: "Gestion Clients",
                items: [
                    {
                        text: "Jusqu'à 50 clients",
                        available: true,
                        detail: "Base de données clients avec recherche et filtres",
                    },
                    {
                        text: "Fiches clients détaillées",
                        available: true,
                        detail: "Coordonnées, historique, notes personnalisées",
                    },
                    {
                        text: "Import/Export CSV",
                        available: true,
                        detail: "Importez vos clients existants facilement",
                    },
                ],
            },
            {
                category: "Facturation",
                items: [
                    {
                        text: "Devis illimités",
                        available: true,
                        detail: "Créez autant de devis que nécessaire",
                    },
                    {
                        text: "Factures illimitées",
                        available: true,
                        detail: "Générez vos factures en quelques clics",
                    },
                    {
                        text: "Conversion devis → facture",
                        available: true,
                        detail: "Transformez un devis en facture instantanément",
                    },
                    {
                        text: "Personnalisation des documents",
                        available: true,
                        detail: "Logo, couleurs, mentions légales",
                    },
                    {
                        text: "Envoi par email",
                        available: true,
                        detail: "Envoyez vos documents directement depuis l'application",
                    },
                    {
                        text: "Génération PDF",
                        available: true,
                        detail: "Téléchargez vos documents au format PDF",
                    },
                ],
            },
            {
                category: "Catalogue & Stock",
                items: [
                    {
                        text: "Jusqu'à 100 produits",
                        available: true,
                        detail: "Gérez votre catalogue de produits et services",
                    },
                    {
                        text: "Suivi de stock basique",
                        available: true,
                        detail: "Suivez les quantités en stock",
                    },
                    {
                        text: "Catégories de produits",
                        available: true,
                        detail: "Organisez votre catalogue par catégories",
                    },
                    {
                        text: "Alertes de stock",
                        available: false,
                        detail: "Notifications automatiques de stock bas",
                    },
                ],
            },
            {
                category: "Support",
                items: [
                    {
                        text: "Support par email",
                        available: true,
                        detail: "Réponse sous 24-48h en jours ouvrés",
                    },
                    {
                        text: "Base de connaissances",
                        available: true,
                        detail: "Accès à notre documentation complète",
                    },
                    {
                        text: "Tutoriels vidéo",
                        available: true,
                        detail: "Guides vidéo pour bien démarrer",
                    },
                ],
            },
            {
                category: "Avancé",
                items: [
                    {
                        text: "Multi-utilisateurs",
                        available: false,
                        detail: "Collaborez avec votre équipe",
                    },
                    {
                        text: "Automatisation",
                        available: false,
                        detail: "Automatisez vos tâches répétitives",
                    },
                    {
                        text: "API",
                        available: false,
                        detail: "Intégrez avec vos autres outils",
                    },
                    {
                        text: "Exports avancés",
                        available: false,
                        detail: "Exportez vos données dans différents formats",
                    },
                ],
            },
        ],
        ideal: [
            "Auto-entrepreneurs démarrant leur activité",
            "Artisans travaillant seuls",
            "Freelances cherchant une solution simple",
            "Petites structures avec peu de clients",
        ],
    },
    pro: {
        name: "Pro",
        basePrice: 99,
        description: "Pour développer votre activité",
        tagline:
            "Toutes les fonctionnalités pour faire grandir votre entreprise",
        badge: "Le plus populaire",
        highlights: [
            "Tout illimité",
            "Automatisation incluse",
            "Support prioritaire",
            "Jusqu'à 5 utilisateurs",
        ],
        features: [
            {
                category: "Gestion Clients",
                items: [
                    {
                        text: "Clients illimités",
                        available: true,
                        detail: "Aucune limite sur le nombre de clients",
                    },
                    {
                        text: "Fiches clients avancées",
                        available: true,
                        detail: "Coordonnées, historique, documents, notes",
                    },
                    {
                        text: "Segmentation clients",
                        available: true,
                        detail: "Créez des groupes de clients personnalisés",
                    },
                    {
                        text: "Import/Export avancé",
                        available: true,
                        detail: "Formats multiples, mapping personnalisé",
                    },
                ],
            },
            {
                category: "Facturation",
                items: [
                    {
                        text: "Devis & factures illimités",
                        available: true,
                        detail: "Aucune limite sur vos documents",
                    },
                    {
                        text: "Avoirs & factures d'acompte",
                        available: true,
                        detail: "Gestion complète de vos documents",
                    },
                    {
                        text: "Personnalisation avancée",
                        available: true,
                        detail: "Modèles personnalisés, champs personnalisés",
                    },
                    {
                        text: "Signature électronique",
                        available: true,
                        detail: "Faites signer vos devis en ligne",
                    },
                    {
                        text: "Paiement en ligne",
                        available: true,
                        detail: "Acceptez les paiements par carte",
                    },
                    {
                        text: "Relances automatiques",
                        available: true,
                        detail: "Relancez automatiquement les impayés",
                    },
                ],
            },
            {
                category: "Catalogue & Stock",
                items: [
                    {
                        text: "Catalogue illimité",
                        available: true,
                        detail: "Aucune limite sur vos produits",
                    },
                    {
                        text: "Suivi de stock avancé",
                        available: true,
                        detail: "Mouvements, historique, inventaires",
                    },
                    {
                        text: "Alertes de stock intelligentes",
                        available: true,
                        detail: "Notifications personnalisées",
                    },
                    {
                        text: "Multi-dépôts",
                        available: true,
                        detail: "Gérez plusieurs entrepôts/emplacements",
                    },
                    {
                        text: "Code-barres",
                        available: true,
                        detail: "Scannez vos produits",
                    },
                ],
            },
            {
                category: "Collaboration",
                items: [
                    {
                        text: "Jusqu'à 5 utilisateurs",
                        available: true,
                        detail: "Collaborez avec votre équipe",
                    },
                    {
                        text: "Rôles et permissions",
                        available: true,
                        detail: "Contrôlez les accès de chaque utilisateur",
                    },
                    {
                        text: "Journal d'activité",
                        available: true,
                        detail: "Suivez les actions de votre équipe",
                    },
                ],
            },
            {
                category: "Automatisation",
                items: [
                    {
                        text: "Relances automatiques",
                        available: true,
                        detail: "Emails de relance programmés",
                    },
                    {
                        text: "Rappels & notifications",
                        available: true,
                        detail: "Ne manquez plus rien",
                    },
                    {
                        text: "Workflows personnalisés",
                        available: true,
                        detail: "Automatisez vos processus",
                    },
                ],
            },
            {
                category: "Rapports & Exports",
                items: [
                    {
                        text: "Tableaux de bord avancés",
                        available: true,
                        detail: "Visualisez vos KPIs en temps réel",
                    },
                    {
                        text: "Exports comptables",
                        available: true,
                        detail: "Exportez pour votre comptable",
                    },
                    {
                        text: "Rapports personnalisés",
                        available: true,
                        detail: "Créez vos propres rapports",
                    },
                ],
            },
            {
                category: "Support",
                items: [
                    {
                        text: "Support prioritaire",
                        available: true,
                        detail: "Réponse sous 4h en jours ouvrés",
                    },
                    {
                        text: "Chat en direct",
                        available: true,
                        detail: "Assistance immédiate",
                    },
                    {
                        text: "Onboarding personnalisé",
                        available: true,
                        detail: "Accompagnement au démarrage",
                    },
                ],
            },
            {
                category: "Avancé",
                items: [
                    {
                        text: "API",
                        available: false,
                        detail: "Intégrations personnalisées",
                    },
                    {
                        text: "Serveur dédié",
                        available: false,
                        detail: "Performances optimales",
                    },
                    {
                        text: "SLA garanti",
                        available: false,
                        detail: "Disponibilité garantie 99.9%",
                    },
                ],
            },
        ],
        ideal: [
            "PME en croissance",
            "Entreprises avec plusieurs collaborateurs",
            "Activités nécessitant de l'automatisation",
            "Structures cherchant à se professionnaliser",
        ],
    },
    entreprise: {
        name: "Entreprise",
        basePrice: 199,
        description: "Pour les équipes qui grandissent",
        tagline: "Solution enterprise avec tout ce qu'il vous faut",
        badge: undefined,
        highlights: [
            "Utilisateurs illimités",
            "API complète",
            "Support dédié 24/7",
            "Formation personnalisée",
        ],
        features: [
            {
                category: "Tout du plan Pro +",
                items: [
                    {
                        text: "Toutes les fonctionnalités Pro",
                        available: true,
                        detail: "Accès complet à toutes les fonctionnalités",
                    },
                ],
            },
            {
                category: "Collaboration",
                items: [
                    {
                        text: "Utilisateurs illimités",
                        available: true,
                        detail: "Aucune limite sur votre équipe",
                    },
                    {
                        text: "Rôles personnalisés avancés",
                        available: true,
                        detail: "Créez vos propres niveaux d'accès",
                    },
                    {
                        text: "Audit logs complet",
                        available: true,
                        detail: "Traçabilité totale des actions",
                    },
                    {
                        text: "SSO (Single Sign-On)",
                        available: true,
                        detail: "Connexion avec vos systèmes d'authentification",
                    },
                ],
            },
            {
                category: "API & Intégrations",
                items: [
                    {
                        text: "API REST complète",
                        available: true,
                        detail: "Accès programmatique à toutes les données",
                    },
                    {
                        text: "Webhooks",
                        available: true,
                        detail: "Notifications en temps réel",
                    },
                    {
                        text: "Intégrations personnalisées",
                        available: true,
                        detail: "Nous développons vos intégrations",
                    },
                    {
                        text: "Documentation API complète",
                        available: true,
                        detail: "Guides et exemples de code",
                    },
                ],
            },
            {
                category: "Infrastructure",
                items: [
                    {
                        text: "Serveur dédié",
                        available: true,
                        detail: "Infrastructure dédiée à votre entreprise",
                    },
                    {
                        text: "SLA 99.9%",
                        available: true,
                        detail: "Disponibilité garantie",
                    },
                    {
                        text: "Backup quotidien",
                        available: true,
                        detail: "Sauvegardes automatiques sécurisées",
                    },
                    {
                        text: "Hébergement EU/US",
                        available: true,
                        detail: "Choisissez la localisation de vos données",
                    },
                ],
            },
            {
                category: "Support & Formation",
                items: [
                    {
                        text: "Support dédié 24/7",
                        available: true,
                        detail: "Équipe dédiée disponible à tout moment",
                    },
                    {
                        text: "Account manager dédié",
                        available: true,
                        detail: "Un interlocuteur unique pour vous accompagner",
                    },
                    {
                        text: "Formation sur site",
                        available: true,
                        detail: "Formation de vos équipes dans vos locaux",
                    },
                    {
                        text: "Consulting",
                        available: true,
                        detail: "Conseils pour optimiser vos processus",
                    },
                ],
            },
            {
                category: "Sécurité & Conformité",
                items: [
                    {
                        text: "RGPD compliant",
                        available: true,
                        detail: "Conforme aux réglementations européennes",
                    },
                    {
                        text: "Encryption avancée",
                        available: true,
                        detail: "Vos données sont chiffrées",
                    },
                    {
                        text: "Certifications ISO",
                        available: true,
                        detail: "Certifications de sécurité",
                    },
                    {
                        text: "Contrat sur mesure",
                        available: true,
                        detail: "Conditions adaptées à vos besoins",
                    },
                ],
            },
        ],
        ideal: [
            "Grandes entreprises",
            "Équipes de plus de 10 personnes",
            "Entreprises avec besoins d'intégrations",
            "Structures nécessitant un SLA",
        ],
    },
};
