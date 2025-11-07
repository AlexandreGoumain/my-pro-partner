import { prisma } from "@/lib/prisma";
import { NotificationType } from "@/lib/generated/prisma";

interface CreateNotificationOptions {
    clientId: string;
    type: NotificationType;
    titre: string;
    message?: string;
    metadata?: Record<string, any>;
}

export class NotificationService {
    /**
     * Create a new notification for a client
     */
    static async createNotification(options: CreateNotificationOptions) {
        return prisma.clientNotification.create({
            data: {
                clientId: options.clientId,
                type: options.type,
                titre: options.titre,
                message: options.message,
                metadata: options.metadata || {},
            },
        });
    }

    /**
     * Get all notifications for a client (sorted by most recent first)
     */
    static async getClientNotifications(clientId: string, limit = 50) {
        return prisma.clientNotification.findMany({
            where: { clientId },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    }

    /**
     * Get unread notifications count
     */
    static async getUnreadCount(clientId: string): Promise<number> {
        return prisma.clientNotification.count({
            where: {
                clientId,
                lue: false,
            },
        });
    }

    /**
     * Mark a notification as read
     */
    static async markAsRead(notificationId: string, clientId: string) {
        return prisma.clientNotification.updateMany({
            where: {
                id: notificationId,
                clientId, // Ensure client owns this notification
            },
            data: {
                lue: true,
                lueAt: new Date(),
            },
        });
    }

    /**
     * Mark all notifications as read for a client
     */
    static async markAllAsRead(clientId: string) {
        return prisma.clientNotification.updateMany({
            where: {
                clientId,
                lue: false,
            },
            data: {
                lue: true,
                lueAt: new Date(),
            },
        });
    }

    /**
     * Delete old read notifications (keep only last 30 days)
     */
    static async deleteOldNotifications(clientId: string) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return prisma.clientNotification.deleteMany({
            where: {
                clientId,
                lue: true,
                lueAt: {
                    lt: thirtyDaysAgo,
                },
            },
        });
    }

    // === Notification Creators (helpers for common notifications) ===

    static async notifyNewDocument(
        clientId: string,
        documentType: string,
        documentNumber: string,
        documentId: string
    ) {
        const typeLabel = documentType === "FACTURE" ? "facture" : documentType === "DEVIS" ? "devis" : "avoir";

        return this.createNotification({
            clientId,
            type: "NOUVEAU_DOCUMENT",
            titre: `Nouveau ${typeLabel} disponible`,
            message: `Votre ${typeLabel} ${documentNumber} est maintenant disponible dans votre espace client.`,
            metadata: {
                documentId,
                documentType,
                documentNumber,
            },
        });
    }

    static async notifyPointsExpiring(
        clientId: string,
        points: number,
        expirationDate: Date
    ) {
        return this.createNotification({
            clientId,
            type: "POINTS_EXPIRATION",
            titre: "Points fidélité bientôt expirés",
            message: `${points} points vont expirer le ${expirationDate.toLocaleDateString("fr-FR")}. Utilisez-les avant qu'il ne soit trop tard !`,
            metadata: {
                points,
                expirationDate: expirationDate.toISOString(),
            },
        });
    }

    static async notifyLevelChange(
        clientId: string,
        newLevel: string,
        oldLevel?: string
    ) {
        const message = oldLevel
            ? `Félicitations ! Vous êtes passé du niveau ${oldLevel} au niveau ${newLevel}.`
            : `Félicitations ! Vous avez atteint le niveau ${newLevel}.`;

        return this.createNotification({
            clientId,
            type: "NIVEAU_FIDELITE",
            titre: "Nouveau niveau de fidélité",
            message,
            metadata: {
                newLevel,
                oldLevel,
            },
        });
    }

    static async notifyPaymentReceived(
        clientId: string,
        amount: number,
        documentNumber: string
    ) {
        return this.createNotification({
            clientId,
            type: "PAIEMENT_RECU",
            titre: "Paiement reçu",
            message: `Votre paiement de ${amount.toFixed(2)}€ pour ${documentNumber} a été reçu et enregistré.`,
            metadata: {
                amount,
                documentNumber,
            },
        });
    }
}
