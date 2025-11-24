#!/usr/bin/env node

/**
 * Script de nettoyage automatique des données anciennes
 *
 * Ce script doit être exécuté quotidiennement via cron job :
 * 0 2 * * * cd /var/www/my-pro-partner && node scripts/cleanup-data.js >> /var/log/cleanup-chatbot.log 2>&1
 *
 * Actions effectuées :
 * - Suppression des conversations > 90 jours
 * - Suppression des logs de sécurité > 30 jours
 * - Suppression des messages orphelins
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Configuration
const CONVERSATION_RETENTION_DAYS = 90;
const SECURITY_LOG_RETENTION_DAYS = 30;
const DRY_RUN = process.argv.includes("--dry-run");

/**
 * Calcule une date dans le passé
 */
function daysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}

/**
 * Formate un nombre avec séparateurs de milliers
 */
function formatNumber(num) {
    return num.toLocaleString("fr-FR");
}

/**
 * Log avec timestamp
 */
function log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
}

/**
 * Nettoyage des anciennes conversations
 */
async function cleanupOldConversations() {
    const cutoffDate = daysAgo(CONVERSATION_RETENTION_DAYS);

    log(
        `Cleaning conversations older than ${cutoffDate.toLocaleDateString("fr-FR")}...`
    );

    try {
        if (DRY_RUN) {
            const count = await prisma.chatbotConversation.count({
                where: {
                    createdAt: {
                        lt: cutoffDate,
                    },
                },
            });
            log(`[DRY RUN] Would delete ${formatNumber(count)} conversations`);
            return count;
        }

        // Supprimer d'abord les messages associés
        const deletedMessages = await prisma.chatbotMessage.deleteMany({
            where: {
                conversation: {
                    createdAt: {
                        lt: cutoffDate,
                    },
                },
            },
        });
        log(`  ✓ Deleted ${formatNumber(deletedMessages.count)} messages`);

        // Ensuite les conversations
        const deletedConversations =
            await prisma.chatbotConversation.deleteMany({
                where: {
                    createdAt: {
                        lt: cutoffDate,
                    },
                },
            });
        log(
            `  ✓ Deleted ${formatNumber(deletedConversations.count)} conversations (>${CONVERSATION_RETENTION_DAYS} days)`
        );

        return deletedConversations.count;
    } catch (error) {
        log(`  ✗ Error cleaning conversations: ${error.message}`);
        throw error;
    }
}

/**
 * Nettoyage des anciens logs de sécurité
 */
async function cleanupOldSecurityLogs() {
    const cutoffDate = daysAgo(SECURITY_LOG_RETENTION_DAYS);

    log(
        `Cleaning security logs older than ${cutoffDate.toLocaleDateString("fr-FR")}...`
    );

    try {
        if (DRY_RUN) {
            const count = await prisma.chatbotSecurityLog.count({
                where: {
                    timestamp: {
                        lt: cutoffDate,
                    },
                },
            });
            log(`[DRY RUN] Would delete ${formatNumber(count)} security logs`);
            return count;
        }

        const deleted = await prisma.chatbotSecurityLog.deleteMany({
            where: {
                timestamp: {
                    lt: cutoffDate,
                },
            },
        });
        log(
            `  ✓ Deleted ${formatNumber(deleted.count)} security logs (>${SECURITY_LOG_RETENTION_DAYS} days)`
        );

        return deleted.count;
    } catch (error) {
        log(`  ✗ Error cleaning security logs: ${error.message}`);
        throw error;
    }
}

/**
 * Nettoyage des messages orphelins (sans conversation)
 */
async function cleanupOrphanMessages() {
    log("Cleaning orphan messages...");

    try {
        if (DRY_RUN) {
            const count = await prisma.chatbotMessage.count({
                where: {
                    conversationId: null,
                },
            });
            log(
                `[DRY RUN] Would delete ${formatNumber(count)} orphan messages`
            );
            return count;
        }

        const deleted = await prisma.chatbotMessage.deleteMany({
            where: {
                conversationId: null,
            },
        });
        log(`  ✓ Deleted ${formatNumber(deleted.count)} orphan messages`);

        return deleted.count;
    } catch (error) {
        log(`  ✗ Error cleaning orphan messages: ${error.message}`);
        throw error;
    }
}

/**
 * Affiche les statistiques après nettoyage
 */
async function displayStatistics() {
    log("Database statistics:");

    try {
        const conversationCount = await prisma.chatbotConversation.count();
        const messageCount = await prisma.chatbotMessage.count();
        const securityLogCount = await prisma.chatbotSecurityLog.count();

        log(`  • Conversations: ${formatNumber(conversationCount)}`);
        log(`  • Messages: ${formatNumber(messageCount)}`);
        log(`  • Security logs: ${formatNumber(securityLogCount)}`);

        // Statistiques par plan
        const conversationsByPlan = await prisma.chatbotConversation.groupBy({
            by: ["entrepriseId"],
            _count: true,
            orderBy: {
                _count: {
                    entrepriseId: "desc",
                },
            },
            take: 5,
        });

        if (conversationsByPlan.length > 0) {
            log("  • Top 5 enterprises by conversation count:");
            for (const stat of conversationsByPlan) {
                log(
                    `    - Enterprise ${stat.entrepriseId}: ${formatNumber(stat._count)} conversations`
                );
            }
        }
    } catch (error) {
        log(`  ✗ Error displaying statistics: ${error.message}`);
    }
}

/**
 * Fonction principale
 */
async function main() {
    const startTime = Date.now();

    log("========================================");
    log("Starting cleanup process...");
    if (DRY_RUN) {
        log("⚠️  DRY RUN MODE - No data will be deleted");
    }
    log("========================================");

    try {
        // Vérifier la connexion à la base de données
        await prisma.$connect();
        log("✓ Connected to database");

        // Nettoyages
        const deletedConversations = await cleanupOldConversations();
        const deletedLogs = await cleanupOldSecurityLogs();
        const deletedOrphans = await cleanupOrphanMessages();

        // Statistiques
        await displayStatistics();

        // Résumé
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        log("========================================");
        log("Cleanup completed successfully!");
        log(`  • Duration: ${duration}s`);
        log(`  • Conversations deleted: ${formatNumber(deletedConversations)}`);
        log(`  • Security logs deleted: ${formatNumber(deletedLogs)}`);
        log(`  • Orphan messages deleted: ${formatNumber(deletedOrphans)}`);
        log("========================================");

        process.exit(0);
    } catch (error) {
        log("========================================");
        log(`✗ Cleanup failed: ${error.message}`);
        log(`Stack trace: ${error.stack}`);
        log("========================================");
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Exécution
main();
