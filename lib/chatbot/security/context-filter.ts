// ============================================
// CONTEXT FILTER - Détection questions hors sujet
// ============================================

/**
 * Mots-clés liés au contexte ERP MyProPartner
 * Plus un message contient ces mots, plus il est pertinent
 */
const ERP_KEYWORDS = [
    // Clients
    "client", "clients", "clientèle", "prospect", "prospects",
    "contact", "contacts", "fiche client", "coordonnées",

    // Fidélité
    "fidélité", "fidelite", "points", "niveau", "récompense",
    "parrainage", "programme fidélité", "carte fidélité",

    // Articles / Produits
    "article", "articles", "produit", "produits", "service", "services",
    "catalogue", "inventaire", "référence", "prix", "tarif",

    // Stock
    "stock", "stocks", "rupture", "réapprovisionnement", "quantité",
    "entrée", "sortie", "mouvement", "alerte stock", "inventaire",

    // Documents
    "devis", "facture", "factures", "avoir", "avoirs", "document",
    "documents", "paiement", "paiements", "impayé", "impayés",
    "échéance", "relance", "bon de commande",

    // Analytics / Stats
    "statistique", "statistiques", "stats", "kpi", "kpis",
    "chiffre d'affaire", "ca", "marge", "bénéfice", "profit",
    "évolution", "tendance", "comparaison", "performance",
    "dashboard", "tableau de bord",

    // Marketing
    "segment", "segments", "campagne", "campagnes", "email",
    "sms", "notification", "ciblage", "automation", "marketing",

    // Actions ERP
    "créer", "creer", "ajouter", "modifier", "supprimer",
    "rechercher", "chercher", "trouver", "afficher", "montrer",
    "lister", "voir", "consulter", "exporter", "importer",

    // Navigation
    "page", "aller", "naviguer", "ouvrir", "accéder",

    // Général ERP
    "erp", "mypropartner", "entreprise", "société", "business",
    "gestion", "gérer", "commande", "commandes", "vente", "ventes",
    "achat", "achats", "fournisseur", "fournisseurs",

    // Temps / Périodes (contexte stats)
    "aujourd'hui", "hier", "semaine", "mois", "année", "trimestre",
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",

    // Questions métier
    "meilleur", "meilleurs", "top", "pire", "moins", "plus",
    "combien", "quel", "quelle", "quels", "quelles", "qui",
    "total", "moyenne", "somme",
];

/**
 * Patterns de questions clairement hors contexte
 */
const OFF_TOPIC_PATTERNS = [
    // Météo
    /quel\s+temps\s+(fait|fera|faisait)/i,
    /météo|meteo/i,
    /il\s+(pleut|neige|fait\s+(beau|chaud|froid))/i,

    // Culture générale
    /capitale\s+(de|du|des|d')/i,
    /qui\s+(a|est)\s+(inventé|créé|découvert|écrit|peint|composé)/i,
    /en\s+quelle\s+année/i,
    /combien\s+(de\s+)?(pays|continents|océans|planètes)/i,

    // Divertissement
    /raconte.*(blague|histoire|conte)/i,
    /chante|chanson|musique|film|série|jeu vidéo/i,
    /qui\s+va\s+gagner/i,
    /match|foot|football|sport/i,

    // Personnel / IA
    /qui\s+(es|êtes)\s*(-|\s)*(tu|vous)/i,
    /comment\s+(tu\s+)?t'appelles/i,
    /(tu|vous)\s+(penses?|crois?|aimes?)/i,
    /ton\s+(avis|opinion)/i,
    /es-tu\s+(un|une)\s+(robot|ia|intelligence)/i,

    // Coding / Tech hors ERP
    /écris.*(code|script|programme)/i,
    /comment\s+(coder|programmer|développer)/i,
    /python|javascript|java|c\+\+|php|ruby/i,

    // Recettes / Cuisine
    /recette|cuisine|cuire|préparer\s+(un|une|des)\s+(plat|gâteau|repas)/i,

    // Santé
    /symptômes?|maladie|médicament|docteur|médecin/i,
    /mal\s+(à\s+la|au|aux)\s+(tête|ventre|dos)/i,

    // Voyages / Géographie
    /où\s+(se\s+trouve|est\s+situé)/i,
    /comment\s+aller\s+à/i,
    /voyage|vacances|hôtel|avion|train/i,

    // Actualités
    /dernières?\s+nouvelles?/i,
    /que\s+se\s+passe/i,
    /actualités?|news/i,

    // Maths / Sciences générales
    /combien\s+font?\s+\d+\s*[\+\-\*\/x]\s*\d+/i,
    /résou(dre|s)\s+(cette\s+)?équation/i,
    /formule\s+(chimique|mathématique|physique)/i,
];

/**
 * Expressions qui indiquent une question liée à l'ERP
 * (augmentent le score de pertinence)
 */
const ERP_INTENT_PATTERNS = [
    /mes?\s+(client|article|stock|facture|devis|vente)/i,
    /mon\s+(ca|chiffre|dashboard|tableau)/i,
    /ma\s+(marge|performance|entreprise)/i,
    /(créer?|ajouter?|modifier?|supprimer?)\s+(un|une|des|le|la)/i,
    /(recherche|cherche|trouve|montre|affiche|liste)/i,
    /(combien|quel|quelle).*(client|vente|stock|ca|facture)/i,
    /en\s+rupture/i,
    /points?\s+de\s+fidélité/i,
    /segment|campagne|marketing/i,
    /impayé|retard\s+de\s+paiement/i,
    /top\s+\d+/i,
    /ce\s+(mois|trimestre|semaine|jour)/i,
];

export interface ContextCheckResult {
    isOnTopic: boolean;
    relevanceScore: number; // 0-100
    reason?: string;
}

/**
 * Vérifie si un message est dans le contexte de l'ERP
 * @param message Le message utilisateur
 * @returns Résultat avec score de pertinence
 */
export function checkContext(message: string): ContextCheckResult {
    const lowerMessage = message.toLowerCase();
    let score = 50; // Score de base neutre

    // 1. Vérifier si c'est clairement hors sujet (-50 points)
    for (const pattern of OFF_TOPIC_PATTERNS) {
        if (pattern.test(message)) {
            return {
                isOnTopic: false,
                relevanceScore: 0,
                reason: "Cette question ne semble pas liée à la gestion de votre entreprise. Je suis votre assistant ERP MyProPartner, spécialisé dans la gestion de vos clients, stocks, documents et analytics.",
            };
        }
    }

    // 2. Vérifier les intentions ERP (+20 points par pattern)
    for (const pattern of ERP_INTENT_PATTERNS) {
        if (pattern.test(message)) {
            score += 20;
        }
    }

    // 3. Compter les mots-clés ERP (+5 points par mot)
    const words = lowerMessage.split(/\s+/);
    let keywordCount = 0;

    for (const word of words) {
        // Vérifier si le mot correspond à un keyword (avec tolérance pour accents)
        const normalizedWord = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        for (const keyword of ERP_KEYWORDS) {
            const normalizedKeyword = keyword.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (normalizedWord.includes(normalizedKeyword) || normalizedKeyword.includes(normalizedWord)) {
                keywordCount++;
                break;
            }
        }
    }

    score += keywordCount * 5;

    // 4. Pénaliser les messages très courts sans contexte
    if (words.length < 3 && keywordCount === 0) {
        score -= 20;
    }

    // 5. Messages de salutation = OK (on laisse passer)
    if (/^(bonjour|salut|hello|hey|coucou|bonsoir)/i.test(message.trim())) {
        return {
            isOnTopic: true,
            relevanceScore: 100,
        };
    }

    // 6. Messages de remerciement/politesse = OK
    if (/^(merci|thanks|ok|d'accord|super|parfait|génial)/i.test(message.trim())) {
        return {
            isOnTopic: true,
            relevanceScore: 100,
        };
    }

    // Normaliser le score entre 0 et 100
    score = Math.max(0, Math.min(100, score));

    // Seuil de pertinence : 30
    const isOnTopic = score >= 30;

    return {
        isOnTopic,
        relevanceScore: score,
        reason: isOnTopic
            ? undefined
            : "Je ne suis pas sûr de comprendre votre demande. Pouvez-vous reformuler en lien avec la gestion de vos clients, stocks, documents ou analytics ?",
    };
}

/**
 * Message d'aide quand la question est hors contexte
 */
export function getOffTopicHelpMessage(): string {
    return `Je suis votre assistant ERP MyProPartner. Je peux vous aider avec :

📊 **Analytics** - Stats, KPIs, évolutions, tendances
👥 **Clients** - Recherche, création, fidélité, segments
📦 **Stock** - Inventaire, alertes, mouvements
📄 **Documents** - Devis, factures, avoirs
🎯 **Marketing** - Campagnes, segments, ciblage

Posez-moi une question sur ces sujets !`;
}
