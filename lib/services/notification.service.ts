import type { Prisma } from "@/lib/generated/prisma";
import { NotificationType } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";

interface CreateNotificationOptions {
    clientId: string;
    type: NotificationType;
    titre: string;
    message?: string;
    metadata?: Prisma.InputJsonValue;
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
        const typeLabel =
            documentType === "FACTURE"
                ? "facture"
                : documentType === "DEVIS"
                  ? "devis"
                  : "avoir";

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

    // === RDV Notifications ===

    static async notifyRdvConfirmed(
        clientId: string,
        rdvId: string,
        prestationNom: string,
        date: string,
        heure: string,
        employeNom?: string
    ) {
        const withEmployee = employeNom ? ` avec ${employeNom}` : "";
        return this.createNotification({
            clientId,
            type: "RDV_CONFIRME",
            titre: "Rendez-vous confirmé",
            message: `Votre rendez-vous pour "${prestationNom}" le ${date} à ${heure}${withEmployee} est confirmé.`,
            metadata: {
                rdvId,
                prestationNom,
                date,
                heure,
                employeNom,
            },
        });
    }

    static async notifyRdvReminder(
        clientId: string,
        rdvId: string,
        prestationNom: string,
        date: string,
        heure: string,
        hoursUntil: number
    ) {
        const timeLabel = hoursUntil === 24 ? "demain" : `dans ${hoursUntil}h`;
        return this.createNotification({
            clientId,
            type: "RDV_RAPPEL",
            titre: "Rappel de rendez-vous",
            message: `Rappel : votre rendez-vous "${prestationNom}" est prévu ${timeLabel} à ${heure}.`,
            metadata: {
                rdvId,
                prestationNom,
                date,
                heure,
                hoursUntil,
            },
        });
    }

    static async notifyRdvCancelled(
        clientId: string,
        rdvId: string,
        prestationNom: string,
        date: string,
        heure: string,
        reason?: string
    ) {
        const reasonText = reason ? ` Motif : ${reason}` : "";
        return this.createNotification({
            clientId,
            type: "RDV_ANNULE",
            titre: "Rendez-vous annulé",
            message: `Votre rendez-vous "${prestationNom}" du ${date} à ${heure} a été annulé.${reasonText}`,
            metadata: {
                rdvId,
                prestationNom,
                date,
                heure,
                reason,
            },
        });
    }

    static async notifyRdvModified(
        clientId: string,
        rdvId: string,
        prestationNom: string,
        oldDate: string,
        oldHeure: string,
        newDate: string,
        newHeure: string
    ) {
        return this.createNotification({
            clientId,
            type: "RDV_MODIFIE",
            titre: "Rendez-vous modifié",
            message: `Votre rendez-vous "${prestationNom}" a été déplacé du ${oldDate} à ${oldHeure} vers le ${newDate} à ${newHeure}.`,
            metadata: {
                rdvId,
                prestationNom,
                oldDate,
                oldHeure,
                newDate,
                newHeure,
            },
        });
    }

    // === Intervention Notifications ===

    static async notifyInterventionPlanifiee(
        clientId: string,
        interventionId: string,
        numero: string,
        datePrevisionnelle: string,
        technicienNom?: string
    ) {
        const withTech = technicienNom ? ` ${technicienNom} interviendra` : "Un technicien interviendra";
        return this.createNotification({
            clientId,
            type: "INTERVENTION_PLANIFIEE",
            titre: "Intervention planifiée",
            message: `${withTech} le ${datePrevisionnelle} pour l'intervention ${numero}.`,
            metadata: {
                interventionId,
                numero,
                datePrevisionnelle,
                technicienNom,
            },
        });
    }

    static async notifyInterventionEnRoute(
        clientId: string,
        interventionId: string,
        numero: string,
        technicienNom?: string,
        estimatedArrival?: string
    ) {
        const tech = technicienNom || "Le technicien";
        const arrival = estimatedArrival ? ` Arrivée estimée : ${estimatedArrival}.` : "";
        return this.createNotification({
            clientId,
            type: "INTERVENTION_EN_ROUTE",
            titre: "Technicien en route",
            message: `${tech} est en route pour l'intervention ${numero}.${arrival}`,
            metadata: {
                interventionId,
                numero,
                technicienNom,
                estimatedArrival,
            },
        });
    }

    static async notifyInterventionEnCours(
        clientId: string,
        interventionId: string,
        numero: string,
        technicienNom?: string
    ) {
        const tech = technicienNom || "Le technicien";
        return this.createNotification({
            clientId,
            type: "INTERVENTION_EN_COURS",
            titre: "Intervention en cours",
            message: `${tech} a commencé l'intervention ${numero}.`,
            metadata: {
                interventionId,
                numero,
                technicienNom,
            },
        });
    }

    static async notifyInterventionTerminee(
        clientId: string,
        interventionId: string,
        numero: string,
        documentId?: string
    ) {
        const docText = documentId ? " Un document est disponible dans votre espace." : "";
        return this.createNotification({
            clientId,
            type: "INTERVENTION_TERMINEE",
            titre: "Intervention terminée",
            message: `L'intervention ${numero} est terminée.${docText}`,
            metadata: {
                interventionId,
                numero,
                documentId,
            },
        });
    }

    static async notifyInterventionAnnulee(
        clientId: string,
        interventionId: string,
        numero: string,
        reason?: string
    ) {
        const reasonText = reason ? ` Motif : ${reason}` : "";
        return this.createNotification({
            clientId,
            type: "INTERVENTION_ANNULEE",
            titre: "Intervention annulée",
            message: `L'intervention ${numero} a été annulée.${reasonText}`,
            metadata: {
                interventionId,
                numero,
                reason,
            },
        });
    }
}
