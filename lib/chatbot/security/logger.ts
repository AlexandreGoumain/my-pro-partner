// ============================================
// SECURE LOGGER - Sanitization & Production Safety
// ============================================

/**
 * Niveaux de log
 */
export enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
}

/**
 * Contexte optionnel pour les logs
 */
export interface LogContext {
    userId?: string;
    entrepriseId?: string;
    action?: string;
    [key: string]: unknown;
}

/**
 * Détermine si on doit logger selon le niveau et l'environnement
 */
function shouldLog(level: LogLevel): boolean {
    // En production, ne log que WARN et ERROR
    if (process.env.NODE_ENV === "production") {
        return level === LogLevel.WARN || level === LogLevel.ERROR;
    }

    // En dev, log tout sauf DEBUG si désactivé
    if (level === LogLevel.DEBUG && process.env.DISABLE_DEBUG_LOGS === "true") {
        return false;
    }

    return true;
}

/**
 * Sanitize les données sensibles avant de logger
 * Masque emails, téléphones, tokens, mots de passe, etc.
 */
export function sanitizeLogData(data: unknown): unknown {
    if (data === null || data === undefined) {
        return data;
    }

    // Si c'est une chaîne, appliquer les regex de masquage
    if (typeof data === "string") {
        let sanitized = data;

        // Masquer les emails (exemple@domaine.com → e***@d***.com)
        sanitized = sanitized.replace(
            /([a-zA-Z0-9._%+-])[a-zA-Z0-9._%+-]*@([a-zA-Z0-9.-])[a-zA-Z0-9.-]*\.([a-zA-Z]{2,})/g,
            "$1***@$2***.$3"
        );

        // Masquer les téléphones français (0612345678 → 06****5678)
        sanitized = sanitized.replace(/\b0[1-9](\d{2})\d{4}(\d{2})\b/g, "0*****$2");

        // Masquer les numéros de carte bancaire (1234 5678 9012 3456 → **** **** **** 3456)
        sanitized = sanitized.replace(
            /\b\d{4}\s?\d{4}\s?\d{4}\s?(\d{4})\b/g,
            "**** **** **** $1"
        );

        // Masquer les tokens/clés API (sk-... ou Bearer ...)
        sanitized = sanitized.replace(/\b(sk-|Bearer\s+)[A-Za-z0-9_-]+/g, "$1***");

        // Masquer les adresses IP
        sanitized = sanitized.replace(
            /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
            "***.***.***.***"
        );

        return sanitized;
    }

    // Si c'est un objet, parcourir récursivement
    if (typeof data === "object" && data !== null) {
        if (Array.isArray(data)) {
            return data.map((item) => sanitizeLogData(item));
        }

        const sanitized: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(data)) {
            // Champs sensibles à masquer complètement
            const sensitiveFields = [
                "password",
                "passwd",
                "pwd",
                "apikey",
                "api_key",
                "secret",
                "token",
                "accesstoken",
                "refreshtoken",
                "authorization",
                "creditcard",
                "ssn",
                "cvv",
            ];

            if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
                sanitized[key] = "***REDACTED***";
            } else {
                sanitized[key] = sanitizeLogData(value);
            }
        }
        return sanitized;
    }

    // Autres types (number, boolean, etc.) : retourner tel quel
    return data;
}

/**
 * Logger sécurisé principal
 * Sanitize automatiquement les données sensibles
 */
export function secureLog(
    level: LogLevel,
    message: string,
    data?: unknown,
    context?: LogContext
): void {
    if (!shouldLog(level)) return;

    const sanitizedData = sanitizeLogData(data);
    const sanitizedContext = sanitizeLogData(context);

    const logEntry: Record<string, unknown> = {
        timestamp: new Date().toISOString(),
        level,
        message,
    };
    if (sanitizedContext && typeof sanitizedContext === 'object') {
        Object.assign(logEntry, sanitizedContext);
    }
    if (sanitizedData) {
        logEntry.data = sanitizedData;
    }

    // En production, utiliser un format JSON structuré
    if (process.env.NODE_ENV === "production") {
        console[level](JSON.stringify(logEntry));
    } else {
        // En dev, format plus lisible
        const contextStr = context
            ? ` [${Object.entries(context)
                  .map(([k, v]) => `${k}=${v}`)
                  .join(", ")}]`
            : "";
        console[level](`[${level.toUpperCase()}]${contextStr} ${message}`, sanitizedData || "");
    }
}

/**
 * Helpers pour chaque niveau de log
 */
export const logger = {
    debug: (message: string, data?: unknown, context?: LogContext) => {
        secureLog(LogLevel.DEBUG, message, data, context);
    },

    info: (message: string, data?: unknown, context?: LogContext) => {
        secureLog(LogLevel.INFO, message, data, context);
    },

    warn: (message: string, data?: unknown, context?: LogContext) => {
        secureLog(LogLevel.WARN, message, data, context);
    },

    error: (message: string, error?: Error | unknown, context?: LogContext) => {
        const errorData = error instanceof Error
            ? {
                  name: error.name,
                  message: error.message,
                  stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
              }
            : error;

        secureLog(LogLevel.ERROR, message, errorData, context);
    },
};

/**
 * Logger spécialisé pour les actions du chatbot
 */
export function logChatbotAction(
    actionName: string,
    userId: string,
    entrepriseId: string,
    params?: Record<string, unknown>,
    success?: boolean
): void {
    logger.info("Chatbot action executed", {
        action: actionName,
        success,
        paramsCount: params ? Object.keys(params).length : 0,
    }, {
        userId,
        entrepriseId,
        action: actionName,
    });
}

/**
 * Logger pour les événements de sécurité
 */
export function logSecurityEvent(
    eventType: string,
    severity: "low" | "medium" | "high" | "critical",
    details: string,
    context?: LogContext
): void {
    const level = severity === "critical" || severity === "high"
        ? LogLevel.ERROR
        : LogLevel.WARN;

    secureLog(
        level,
        `[SECURITY] ${eventType}: ${details}`,
        { severity },
        context
    );
}

/**
 * Logger pour les erreurs API
 */
export function logApiError(
    endpoint: string,
    statusCode: number,
    error: Error | unknown,
    context?: LogContext
): void {
    logger.error(
        `API Error on ${endpoint}`,
        {
            statusCode,
            error: error instanceof Error ? error.message : String(error),
        },
        context
    );
}
