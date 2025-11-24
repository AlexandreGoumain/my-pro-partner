// ============================================
// DATA RETENTION - Politique de rétention des données
// ============================================

import { prisma } from "@/lib/prisma";
import { logger } from "./logger";

/**
 * Politiques de rétention par type de données
 */
export const RETENTION_POLICIES = {
    /**
     * Conversations non épinglées : 90 jours
     */
    UNPINNED_CONVERSATIONS: 90 * 24 * 60 * 60 * 1000,

    /**
     * Conversations épinglées : 365 jours
     */
    PINNED_CONVERSATIONS: 365 * 24 * 60 * 60 * 1000,

    /**
     * Logs d'audit (niveau low/medium) : 30 jours
     */
    AUDIT_LOGS_LOW: 30 * 24 * 60 * 60 * 1000,

    /**
     * Logs d'audit (niveau high/critical) : 180 jours
     */
    AUDIT_LOGS_HIGH: 180 * 24 * 60 * 60 * 1000,

    /**
     * Tokens de confirmation expirés : 24 heures
     */
    EXPIRED_TOKENS: 24 * 60 * 60 * 1000,

    /**
     * Messages supprimés (soft delete) : 30 jours
     */
    DELETED_MESSAGES: 30 * 24 * 60 * 60 * 1000,

    /**
     * Feedback négatifs : 180 jours
     */
    NEGATIVE_FEEDBACK: 180 * 24 * 60 * 60 * 1000,

    /**
     * Feedback positifs : 90 jours
     */
    POSITIVE_FEEDBACK: 90 * 24 * 60 * 60 * 1000,
} as const;

/**
 * Résultat d'une opération de nettoyage
 */
export interface CleanupResult {
    type: string;
    deletedCount: number;
    duration: number;
    error?: string;
}

/**
 * Supprimer les conversations non épinglées anciennes
 */
export async function cleanupOldConversations(): Promise<CleanupResult> {
    const startTime = Date.now();

    try {
        const cutoffDate = new Date(
            Date.now() - RETENTION_POLICIES.UNPINNED_CONVERSATIONS
        );

        const result = await prisma.conversation.deleteMany({
            where: {
                pinned: false,
                updatedAt: {
                    lt: cutoffDate,
                },
            },
        });

        const duration = Date.now() - startTime;

        logger.info("Cleaned up old unpinned conversations", {
            deletedCount: result.count,
            cutoffDate: cutoffDate.toISOString(),
            duration,
        });

        return {
            type: "unpinned_conversations",
            deletedCount: result.count,
            duration,
        };
    } catch (error) {
        const duration = Date.now() - startTime;

        logger.error("Failed to cleanup old conversations", error);

        return {
            type: "unpinned_conversations",
            deletedCount: 0,
            duration,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Supprimer les conversations épinglées très anciennes
 */
export async function cleanupOldPinnedConversations(): Promise<CleanupResult> {
    const startTime = Date.now();

    try {
        const cutoffDate = new Date(
            Date.now() - RETENTION_POLICIES.PINNED_CONVERSATIONS
        );

        const result = await prisma.conversation.deleteMany({
            where: {
                pinned: true,
                updatedAt: {
                    lt: cutoffDate,
                },
            },
        });

        const duration = Date.now() - startTime;

        logger.info("Cleaned up old pinned conversations", {
            deletedCount: result.count,
            cutoffDate: cutoffDate.toISOString(),
            duration,
        });

        return {
            type: "pinned_conversations",
            deletedCount: result.count,
            duration,
        };
    } catch (error) {
        const duration = Date.now() - startTime;

        logger.error("Failed to cleanup old pinned conversations", error);

        return {
            type: "pinned_conversations",
            deletedCount: 0,
            duration,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Supprimer les anciens logs d'audit de faible importance
 */
export async function cleanupOldAuditLogs(): Promise<CleanupResult> {
    const startTime = Date.now();

    try {
        // TODO: Implémenter avec le modèle AuditLog une fois créé
        // const cutoffDate = new Date(
        //     Date.now() - RETENTION_POLICIES.AUDIT_LOGS_LOW
        // );

        // const result = await prisma.auditLog.deleteMany({
        //     where: {
        //         riskLevel: {
        //             in: ["low", "medium"],
        //         },
        //         createdAt: {
        //             lt: cutoffDate,
        //         },
        //     },
        // });

        const duration = Date.now() - startTime;

        logger.info("Cleanup of old audit logs (not implemented)", {
            duration,
        });

        return {
            type: "audit_logs_low",
            deletedCount: 0,
            duration,
        };
    } catch (error) {
        const duration = Date.now() - startTime;

        logger.error("Failed to cleanup old audit logs", error);

        return {
            type: "audit_logs_low",
            deletedCount: 0,
            duration,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Anonymiser les conversations très anciennes au lieu de les supprimer
 * (pour conformité RGPD)
 */
export async function anonymizeOldConversations(): Promise<CleanupResult> {
    const startTime = Date.now();

    try {
        const cutoffDate = new Date(
            Date.now() - RETENTION_POLICIES.PINNED_CONVERSATIONS * 2
        );

        // Anonymiser en supprimant les informations personnelles
        // mais gardant les données statistiques
        const conversations = await prisma.conversation.findMany({
            where: {
                updatedAt: {
                    lt: cutoffDate,
                },
            },
            select: {
                id: true,
            },
        });

        let anonymizedCount = 0;

        for (const conv of conversations) {
            // Remplacer le titre par un hash anonyme
            await prisma.conversation.update({
                where: { id: conv.id },
                data: {
                    titre: `[Anonymized conversation ${conv.id.substring(0, 8)}]`,
                },
            });

            // Optionnel: Anonymiser aussi les messages
            // await prisma.message.updateMany({
            //     where: { conversationId: conv.id },
            //     data: {
            //         content: "[Content anonymized for data retention policy]",
            //     },
            // });

            anonymizedCount++;
        }

        const duration = Date.now() - startTime;

        logger.info("Anonymized old conversations", {
            anonymizedCount,
            cutoffDate: cutoffDate.toISOString(),
            duration,
        });

        return {
            type: "anonymized_conversations",
            deletedCount: anonymizedCount,
            duration,
        };
    } catch (error) {
        const duration = Date.now() - startTime;

        logger.error("Failed to anonymize old conversations", error);

        return {
            type: "anonymized_conversations",
            deletedCount: 0,
            duration,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Exécuter toutes les tâches de nettoyage
 * À appeler via un cron job quotidien
 */
export async function runAllCleanupTasks(): Promise<CleanupResult[]> {
    logger.info("Starting data retention cleanup tasks");

    const results: CleanupResult[] = [];

    // Exécuter les tâches en parallèle
    const tasks = [
        cleanupOldConversations(),
        cleanupOldPinnedConversations(),
        cleanupOldAuditLogs(),
    ];

    const taskResults = await Promise.allSettled(tasks);

    for (const result of taskResults) {
        if (result.status === "fulfilled") {
            results.push(result.value);
        } else {
            logger.error("Cleanup task failed", result.reason);
            results.push({
                type: "unknown",
                deletedCount: 0,
                duration: 0,
                error: result.reason?.message || "Unknown error",
            });
        }
    }

    // Calculer les statistiques globales
    const totalDeleted = results.reduce(
        (sum, r) => sum + r.deletedCount,
        0
    );
    const totalDuration = results.reduce(
        (sum, r) => sum + r.duration,
        0
    );
    const totalErrors = results.filter((r) => r.error).length;

    logger.info("Data retention cleanup completed", {
        totalDeleted,
        totalDuration,
        totalErrors,
        tasks: results.length,
    });

    return results;
}

/**
 * Obtenir des statistiques sur les données à nettoyer
 */
export async function getCleanupStatistics(): Promise<{
    unpinnedConversationsToDelete: number;
    pinnedConversationsToDelete: number;
    oldestConversation: Date | null;
    newestConversation: Date | null;
    totalConversations: number;
}> {
    try {
        const unpinnedCutoff = new Date(
            Date.now() - RETENTION_POLICIES.UNPINNED_CONVERSATIONS
        );
        const pinnedCutoff = new Date(
            Date.now() - RETENTION_POLICIES.PINNED_CONVERSATIONS
        );

        const [
            unpinnedCount,
            pinnedCount,
            oldestConv,
            newestConv,
            totalCount,
        ] = await Promise.all([
            prisma.conversation.count({
                where: {
                    pinned: false,
                    updatedAt: { lt: unpinnedCutoff },
                },
            }),
            prisma.conversation.count({
                where: {
                    pinned: true,
                    updatedAt: { lt: pinnedCutoff },
                },
            }),
            prisma.conversation.findFirst({
                orderBy: { updatedAt: "asc" },
                select: { updatedAt: true },
            }),
            prisma.conversation.findFirst({
                orderBy: { updatedAt: "desc" },
                select: { updatedAt: true },
            }),
            prisma.conversation.count(),
        ]);

        return {
            unpinnedConversationsToDelete: unpinnedCount,
            pinnedConversationsToDelete: pinnedCount,
            oldestConversation: oldestConv?.updatedAt || null,
            newestConversation: newestConv?.updatedAt || null,
            totalConversations: totalCount,
        };
    } catch (error) {
        logger.error("Failed to get cleanup statistics", error);

        return {
            unpinnedConversationsToDelete: 0,
            pinnedConversationsToDelete: 0,
            oldestConversation: null,
            newestConversation: null,
            totalConversations: 0,
        };
    }
}
