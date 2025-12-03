// ============================================
// ACTION CONFIRMATION - Système de tokens pour actions critiques
// ============================================

import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { logger } from "./logger";
import type { RiskLevel } from "./action-metadata";

/**
 * Durée de validité d'un token de confirmation (5 minutes)
 */
const TOKEN_EXPIRY_MS = 5 * 60 * 1000;

/**
 * Token de confirmation pour une action critique
 */
export interface ActionConfirmationToken {
    /**
     * Token unique (à afficher à l'utilisateur)
     */
    token: string;

    /**
     * Hash du token (à stocker en base)
     */
    tokenHash: string;

    /**
     * Nom de l'action à exécuter
     */
    actionName: string;

    /**
     * Paramètres de l'action (chiffrés)
     */
    actionParams: string;

    /**
     * Niveau de risque
     */
    riskLevel: RiskLevel;

    /**
     * ID de l'utilisateur
     */
    userId: string;

    /**
     * ID de l'entreprise
     */
    entrepriseId: string;

    /**
     * ID de la conversation
     */
    conversationId: string;

    /**
     * Date d'expiration
     */
    expiresAt: Date;

    /**
     * Créé à
     */
    createdAt: Date;
}

/**
 * Générer un token de confirmation lisible
 * Format: XXXX-XXXX-XXXX (12 caractères alphanumériques)
 */
function generateConfirmationToken(): string {
    const bytes = randomBytes(6);
    const hex = bytes.toString("hex").toUpperCase();

    // Formater en groupes de 4
    return `${hex.substring(0, 4)}-${hex.substring(4, 8)}-${hex.substring(8, 12)}`;
}

/**
 * Hasher un token pour stockage sécurisé
 */
function hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
}

/**
 * Créer un token de confirmation pour une action critique
 */
export async function createConfirmationToken(params: {
    actionName: string;
    actionParams: Record<string, unknown>;
    riskLevel: RiskLevel;
    userId: string;
    entrepriseId: string;
    conversationId: string;
}): Promise<{ token: string; expiresAt: Date }> {
    const token = generateConfirmationToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

    try {
        // Stocker dans la base de données
        await prisma.chatbotActionToken.create({
            data: {
                tokenHash,
                actionName: params.actionName,
                actionParams: JSON.stringify(params.actionParams),
                riskLevel: params.riskLevel,
                userId: params.userId,
                entrepriseId: params.entrepriseId,
                conversationId: params.conversationId,
                expiresAt,
            },
        });

        logger.info("Confirmation token created", {
            actionName: params.actionName,
            riskLevel: params.riskLevel,
            userId: params.userId,
            entrepriseId: params.entrepriseId,
            expiresAt: expiresAt.toISOString(),
        });

        return { token, expiresAt };
    } catch (error) {
        logger.error("Failed to create confirmation token", error, {
            actionName: params.actionName,
            userId: params.userId,
        });
        throw new Error("Failed to create confirmation token");
    }
}

/**
 * Vérifier et consommer un token de confirmation
 * @returns Les paramètres de l'action si le token est valide, null sinon
 */
export async function verifyConfirmationToken(
    token: string,
    userId: string,
    entrepriseId: string
): Promise<{
    actionName: string;
    actionParams: Record<string, unknown>;
    riskLevel: RiskLevel;
    conversationId: string;
} | null> {
    const tokenHash = hashToken(token);

    try {
        // Récupérer depuis la base de données
        const confirmationToken = await prisma.chatbotActionToken.findFirst({
            where: {
                tokenHash,
                userId,
                entrepriseId,
                used: false,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });

        if (!confirmationToken) {
            return null;
        }

        // Marquer comme utilisé
        await prisma.chatbotActionToken.update({
            where: { id: confirmationToken.id },
            data: { used: true, usedAt: new Date() },
        });

        return {
            actionName: confirmationToken.actionName,
            actionParams: JSON.parse(confirmationToken.actionParams),
            riskLevel: confirmationToken.riskLevel as RiskLevel,
            conversationId: confirmationToken.conversationId,
        };
    } catch (error) {
        logger.error("Failed to verify confirmation token", error, {
            userId,
            entrepriseId,
        });
        return null;
    }
}

/**
 * Nettoyer les tokens expirés
 * À appeler périodiquement (par ex. via un cron job)
 */
export async function cleanupExpiredTokens(): Promise<number> {
    try {
        // Supprimer les tokens expirés
        const result = await prisma.chatbotActionToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });

        logger.info("Cleaned up expired confirmation tokens", {
            deletedCount: result.count,
        });

        return result.count;
    } catch (error) {
        logger.error("Failed to cleanup expired tokens", error);
        return 0;
    }
}

/**
 * Annuler un token de confirmation
 */
export async function cancelConfirmationToken(
    token: string,
    userId: string,
    entrepriseId: string
): Promise<boolean> {
    const tokenHash = hashToken(token);

    try {
        // Marquer comme annulé (utilisé)
        const result = await prisma.chatbotActionToken.updateMany({
            where: {
                tokenHash,
                userId,
                entrepriseId,
                used: false,
            },
            data: {
                used: true,
                usedAt: new Date(),
            },
        });

        logger.info("Token cancelled", {
            userId,
            entrepriseId,
            cancelled: result.count > 0,
        });

        return result.count > 0;
    } catch (error) {
        logger.error("Failed to cancel confirmation token", error, {
            userId,
            entrepriseId,
        });
        return false;
    }
}

/**
 * Obtenir les tokens en attente pour un utilisateur
 */
export async function getPendingTokens(
    userId: string,
    entrepriseId: string
): Promise<unknown[]> {
    try {
        // Récupérer les tokens en attente
        const tokens = await prisma.chatbotActionToken.findMany({
            where: {
                userId,
                entrepriseId,
                used: false,
                expiresAt: {
                    gt: new Date(),
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                actionName: true,
                riskLevel: true,
                createdAt: true,
                expiresAt: true,
            },
        });

        return tokens;
    } catch (error) {
        logger.error("Failed to get pending tokens", error, {
            userId,
            entrepriseId,
        });
        return [];
    }
}
