// ============================================
// AUDIT LOGGING - Traçabilité complète des actions
// ============================================

import { prisma } from "@/lib/prisma";
import { logger } from "./logger";
import type { RiskLevel } from "./action-metadata";

/**
 * Type d'événement d'audit
 */
export type AuditEventType =
    | "MESSAGE_SENT"
    | "MESSAGE_RECEIVED"
    | "ACTION_EXECUTED"
    | "ACTION_BLOCKED"
    | "INJECTION_DETECTED"
    | "INJECTION_BLOCKED"
    | "RATE_LIMIT_EXCEEDED"
    | "CONVERSATION_CREATED"
    | "CONVERSATION_DELETED"
    | "FEEDBACK_SUBMITTED"
    | "ENCRYPTION_ERROR"
    | "SECURITY_ALERT";

/**
 * Métadonnées d'un événement d'audit
 */
export interface AuditEventMetadata {
    /**
     * Identifiant de l'utilisateur
     */
    userId: string;

    /**
     * Identifiant de l'entreprise
     */
    entrepriseId: string;

    /**
     * Type d'événement
     */
    eventType: AuditEventType;

    /**
     * Niveau de risque de l'événement
     */
    riskLevel: RiskLevel;

    /**
     * Description de l'événement
     */
    description: string;

    /**
     * Nom de l'action (si applicable)
     */
    actionName?: string;

    /**
     * Identifiant de la conversation (si applicable)
     */
    conversationId?: string;

    /**
     * Identifiant du message (si applicable)
     */
    messageId?: string;

    /**
     * Résultat de l'action (success/failure)
     */
    result?: "success" | "failure" | "blocked";

    /**
     * Message d'erreur (si échec)
     */
    errorMessage?: string;

    /**
     * Données supplémentaires (JSON)
     */
    metadata?: Record<string, unknown>;

    /**
     * Adresse IP de l'utilisateur
     */
    ipAddress?: string;

    /**
     * User agent (navigateur)
     */
    userAgent?: string;
}

/**
 * Enregistrer un événement d'audit
 * Stocke dans la base de données et log avec le secure logger
 */
export async function recordAuditEvent(event: AuditEventMetadata): Promise<void> {
    try {
        // Créer l'événement d'audit dans la base
        // Note: Il faudra ajouter le modèle AuditLog dans Prisma
        // Pour l'instant, on log juste de manière sécurisée

        // Déterminer le niveau de log
        const logLevel = event.riskLevel === "critical" || event.riskLevel === "high"
            ? "warn"
            : "info";

        // Logger l'événement
        if (logLevel === "warn") {
            logger.warn(`[AUDIT] ${event.eventType}: ${event.description}`, {
                userId: event.userId,
                entrepriseId: event.entrepriseId,
                eventType: event.eventType,
                riskLevel: event.riskLevel,
                actionName: event.actionName,
                conversationId: event.conversationId,
                result: event.result,
                errorMessage: event.errorMessage,
                metadata: event.metadata,
            });
        } else {
            logger.info(`[AUDIT] ${event.eventType}: ${event.description}`, {
                userId: event.userId,
                entrepriseId: event.entrepriseId,
                eventType: event.eventType,
                riskLevel: event.riskLevel,
                actionName: event.actionName,
                conversationId: event.conversationId,
                result: event.result,
            });
        }

        // Enregistrer dans la base de données
        await prisma.chatbotAuditLog.create({
            data: {
                userId: event.userId,
                entrepriseId: event.entrepriseId,
                eventType: event.eventType,
                riskLevel: event.riskLevel,
                description: event.description,
                actionName: event.actionName,
                conversationId: event.conversationId,
                messageId: event.messageId,
                result: event.result,
                errorMessage: event.errorMessage,
                metadata: event.metadata as object,
                ipAddress: event.ipAddress,
                userAgent: event.userAgent,
            },
        });
    } catch (error) {
        // Si l'audit fail, au moins logger l'erreur
        logger.error("Failed to record audit event", error, {
            eventType: event.eventType,
            userId: event.userId,
        });
    }
}

/**
 * Enregistrer l'envoi d'un message
 */
export async function auditMessageSent(
    userId: string,
    entrepriseId: string,
    conversationId: string,
    messageId: string,
    contentLength: number
): Promise<void> {
    await recordAuditEvent({
        userId,
        entrepriseId,
        eventType: "MESSAGE_SENT",
        riskLevel: "low",
        description: `User sent a message (${contentLength} characters)`,
        conversationId,
        messageId,
        result: "success",
        metadata: { contentLength },
    });
}

/**
 * Enregistrer la réception d'une réponse
 */
export async function auditMessageReceived(
    userId: string,
    entrepriseId: string,
    conversationId: string,
    messageId: string,
    model: string,
    toolCallsCount: number
): Promise<void> {
    await recordAuditEvent({
        userId,
        entrepriseId,
        eventType: "MESSAGE_RECEIVED",
        riskLevel: "low",
        description: `Assistant responded using ${model} (${toolCallsCount} tool calls)`,
        conversationId,
        messageId,
        result: "success",
        metadata: { model, toolCallsCount },
    });
}

/**
 * Enregistrer l'exécution d'une action
 */
export async function auditActionExecuted(
    userId: string,
    entrepriseId: string,
    actionName: string,
    riskLevel: RiskLevel,
    result: "success" | "failure",
    errorMessage?: string,
    metadata?: Record<string, unknown>
): Promise<void> {
    await recordAuditEvent({
        userId,
        entrepriseId,
        eventType: "ACTION_EXECUTED",
        riskLevel,
        description: `Executed action: ${actionName}`,
        actionName,
        result,
        errorMessage,
        metadata,
    });
}

/**
 * Enregistrer le blocage d'une action
 */
export async function auditActionBlocked(
    userId: string,
    entrepriseId: string,
    actionName: string,
    riskLevel: RiskLevel,
    reason: string
): Promise<void> {
    await recordAuditEvent({
        userId,
        entrepriseId,
        eventType: "ACTION_BLOCKED",
        riskLevel,
        description: `Blocked action: ${actionName} - Reason: ${reason}`,
        actionName,
        result: "blocked",
        errorMessage: reason,
    });
}

/**
 * Enregistrer une tentative d'injection détectée
 */
export async function auditInjectionDetected(
    userId: string,
    entrepriseId: string,
    suspicionScore: number,
    blocked: boolean
): Promise<void> {
    await recordAuditEvent({
        userId,
        entrepriseId,
        eventType: blocked ? "INJECTION_BLOCKED" : "INJECTION_DETECTED",
        riskLevel: blocked ? "critical" : "high",
        description: `Prompt injection ${blocked ? "blocked" : "detected"} (score: ${suspicionScore})`,
        result: blocked ? "blocked" : "success",
        metadata: { suspicionScore, blocked },
    });
}

/**
 * Enregistrer un dépassement de rate limit
 */
export async function auditRateLimitExceeded(
    userId: string,
    entrepriseId: string,
    limitType: string,
    limit: number
): Promise<void> {
    await recordAuditEvent({
        userId,
        entrepriseId,
        eventType: "RATE_LIMIT_EXCEEDED",
        riskLevel: "medium",
        description: `Rate limit exceeded for ${limitType} (limit: ${limit})`,
        result: "blocked",
        metadata: { limitType, limit },
    });
}

/**
 * Enregistrer la création d'une conversation
 */
export async function auditConversationCreated(
    userId: string,
    entrepriseId: string,
    conversationId: string
): Promise<void> {
    await recordAuditEvent({
        userId,
        entrepriseId,
        eventType: "CONVERSATION_CREATED",
        riskLevel: "low",
        description: "Created new conversation",
        conversationId,
        result: "success",
    });
}

/**
 * Enregistrer la suppression d'une conversation
 */
export async function auditConversationDeleted(
    userId: string,
    entrepriseId: string,
    conversationId: string
): Promise<void> {
    await recordAuditEvent({
        userId,
        entrepriseId,
        eventType: "CONVERSATION_DELETED",
        riskLevel: "medium",
        description: "Deleted conversation",
        conversationId,
        result: "success",
    });
}

/**
 * Récupérer les événements d'audit pour un utilisateur
 */
export async function getAuditLogs(
    userId: string,
    options?: {
        eventType?: AuditEventType;
        riskLevel?: RiskLevel;
        limit?: number;
        offset?: number;
    }
): Promise<unknown[]> {
    try {
        const logs = await prisma.chatbotAuditLog.findMany({
            where: {
                userId,
                ...(options?.eventType && { eventType: options.eventType }),
                ...(options?.riskLevel && { riskLevel: options.riskLevel }),
            },
            orderBy: { createdAt: "desc" },
            take: options?.limit || 100,
            skip: options?.offset || 0,
        });
        return logs;
    } catch (error) {
        logger.error("Failed to get audit logs", error, { userId });
        return [];
    }
}
