// ============================================
// PROMPT INJECTION FILTER
// ============================================

/**
 * Patterns dangereux d'injection de prompt
 * Ces patterns indiquent une tentative de manipulation de l'IA
 */
const INJECTION_PATTERNS = [
    // Instructions d'oubli/ignorance
    /ignore\s+(all\s+)?(previous|past|prior)\s+(instructions?|prompts?|rules?)/gi,
    /forget\s+(everything|all|instructions?|prompts?|rules?)/gi,
    /disregard\s+(all\s+)?(previous|past|prior)\s+(instructions?|prompts?|rules?)/gi,

    // Changements de rôle/personnalité
    /you\s+are\s+now\s+(a|an)/gi,
    /act\s+as\s+(a|an|if)/gi,
    /pretend\s+(you\s+are|to\s+be)/gi,
    /from\s+now\s+on,?\s+you/gi,

    // Demandes de révélation
    /show\s+(me\s+)?(your\s+)?(system\s+)?(prompt|instructions?|rules?)/gi,
    /repeat\s+(your\s+)?(system\s+)?(prompt|instructions?|rules?)/gi,
    /what\s+(is|are)\s+your\s+(system\s+)?(prompt|instructions?|rules?)/gi,
    /tell\s+me\s+your\s+(system\s+)?(prompt|instructions?|rules?)/gi,

    // Bypass de sécurité
    /bypass\s+(security|safety|restrictions?)/gi,
    /override\s+(security|safety|restrictions?)/gi,
    /disable\s+(security|safety|checks?|restrictions?)/gi,

    // Manipulation de permissions
    /grant\s+(me\s+)?(admin|full|elevated)\s+(access|permissions?|rights?)/gi,
    /give\s+me\s+(admin|full|elevated)\s+(access|permissions?|rights?)/gi,

    // Instructions d'exécution directe de code
    /execute\s+(this\s+)?(code|command|sql|query)/gi,
    /run\s+(this\s+)?(code|command|sql|query)/gi,

    // Demandes de suppression en masse
    /delete\s+(all|everything)/gi,
    /remove\s+(all|everything)/gi,
    /drop\s+table/gi,

    // Tentatives d'accès système
    /access\s+(the\s+)?(database|system|files?)/gi,
    /read\s+(the\s+)?(database|system|files?)/gi,
];

/**
 * Mots-clés suspects (scoring - pas bloquants directement)
 */
const SUSPICIOUS_KEYWORDS = [
    "jailbreak",
    "dan mode",
    "developer mode",
    "god mode",
    "sudo",
    "root access",
    "admin mode",
    "unrestricted",
];

/**
 * Détecte si un message contient des patterns d'injection de prompt
 * @param message Le contenu du message à analyser
 * @returns true si une injection est détectée, false sinon
 */
export function detectInjection(message: string): boolean {
    // Vérifier les patterns d'injection
    for (const pattern of INJECTION_PATTERNS) {
        if (pattern.test(message)) {
            return true;
        }
    }

    return false;
}

/**
 * Calcule un score de suspicion pour un message (0-100)
 * Plus le score est élevé, plus le message est suspect
 * @param message Le contenu du message à analyser
 * @returns Score de suspicion entre 0 et 100
 */
export function getSuspicionScore(message: string): number {
    let score = 0;
    const lowerMessage = message.toLowerCase();

    // Patterns critiques (50+ points = blocage immédiat)
    const criticalPatterns = [
        /ignore\s+(all\s+)?(previous|past|prior)\s+(instructions?|prompts?|rules?)/gi,
        /forget\s+(everything|all|instructions?|prompts?|rules?)/gi,
        /disregard\s+(all\s+)?(previous|past|prior)\s+(instructions?|prompts?|rules?)/gi,
        /show\s+(me\s+)?(your\s+)?(system\s+)?(prompt|instructions?|rules?)/gi,
        /repeat\s+(your\s+)?(system\s+)?(prompt|instructions?|rules?)/gi,
        /what\s+(is|are)\s+your\s+(system\s+)?(prompt|instructions?|rules?)/gi,
        /tell\s+me\s+your\s+(system\s+)?(prompt|instructions?|rules?)/gi,
        /bypass\s+(security|safety|restrictions?)/gi,
        /override\s+(security|safety|restrictions?)/gi,
        /you\s+are\s+now\s+(a|an|in)/gi,
        /act\s+as\s+(a|an|if)/gi,
        /drop\s+table/gi,
        /delete\s+from.*where/gi,
    ];

    // Vérifier patterns critiques (50 points chacun)
    for (const pattern of criticalPatterns) {
        if (pattern.test(message)) {
            score += 50;
            break; // Un seul suffit pour bloquer
        }
    }

    // Si pas de pattern critique, vérifier les autres (+30 points)
    if (score === 0) {
        for (const pattern of INJECTION_PATTERNS) {
            if (pattern.test(message)) {
                score += 30;
            }
        }
    }

    // +10 points par mot-clé suspect
    for (const keyword of SUSPICIOUS_KEYWORDS) {
        if (lowerMessage.includes(keyword)) {
            score += 10;
        }
    }

    // +5 points si contient beaucoup de mots en MAJUSCULES
    const uppercaseWords = message.match(/\b[A-Z]{3,}\b/g);
    if (uppercaseWords && uppercaseWords.length > 3) {
        score += 5;
    }

    // +10 points si contient des balises HTML/script
    if (/<script|<iframe|<object|<embed/i.test(message)) {
        score += 10;
    }

    // +5 points si très long (>5000 caractères)
    if (message.length > 5000) {
        score += 5;
    }

    return Math.min(score, 100);
}

/**
 * Détecte et bloque les tentatives d'injection évidente
 * Retourne un objet avec le statut et éventuellement le pattern détecté
 * @param message Le contenu du message à analyser
 * @returns Objet avec blocked (boolean) et reason (string optionnel)
 */
export function checkInjection(message: string): {
    blocked: boolean;
    reason?: string;
    score: number;
} {
    const score = getSuspicionScore(message);

    // Bloquer si score > 50 ou injection évidente
    if (detectInjection(message)) {
        return {
            blocked: true,
            reason: "Votre message contient des instructions suspectes. Veuillez reformuler votre demande de manière claire et simple.",
            score,
        };
    }

    if (score >= 50) {
        return {
            blocked: true,
            reason: "Votre message a été signalé comme suspect. Veuillez reformuler sans termes techniques ou instructions système.",
            score,
        };
    }

    return {
        blocked: false,
        score,
    };
}

/**
 * Sanitize le contenu pour éviter les injections dans le system prompt
 * Remplace ou supprime les termes dangereux
 * @param input Chaîne à sanitizer
 * @returns Chaîne sanitizée
 */
export function sanitizeForPrompt(input: string): string {
    let sanitized = input;

    // Remplacer les mots-clés d'injection par des alternatives neutres
    sanitized = sanitized.replace(/IGNORE/gi, "skip");
    sanitized = sanitized.replace(/FORGET/gi, "do not remember");
    sanitized = sanitized.replace(/PREVIOUS INSTRUCTIONS?/gi, "prior guidance");
    sanitized = sanitized.replace(/SYSTEM PROMPT/gi, "context");
    sanitized = sanitized.replace(/OVERRIDE/gi, "change");
    sanitized = sanitized.replace(/BYPASS/gi, "avoid");

    // Limiter la longueur pour éviter les prompt bombs
    if (sanitized.length > 100) {
        sanitized = sanitized.substring(0, 97) + "...";
    }

    // Supprimer les caractères de contrôle et balises
    sanitized = sanitized.replace(/[<>]/g, "");
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, "");

    return sanitized.trim();
}
