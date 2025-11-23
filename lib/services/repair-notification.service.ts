/**
 * Repair Notification Service
 * Handles both email and in-app notifications for repair status changes
 */

import type { Reparation, Client, Store } from "@/lib/generated/prisma";
import { StatutReparation, NotificationType } from "@/lib/generated/prisma";
import { EmailService } from "./email/email.service";
import { NotificationService } from "./notification.service";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type RepairWithClient = Reparation & {
    client: Client;
    store?: Store | null;
};

export class RepairNotificationService {
    /**
     * Send notification when repair is deposited
     */
    static async notifyRepairDeposited(
        reparation: RepairWithClient
    ): Promise<void> {
        if (!reparation.client.email) {
            console.warn(
                `[Repair Notification] Client ${reparation.clientId} has no email, skipping notification`
            );
            return;
        }

        const deviceType = this.getDeviceTypeLabel(reparation.typeAppareil);
        const estimatedReturn = reparation.dateEstimeeRetour
            ? format(reparation.dateEstimeeRetour, "dd MMMM yyyy", {
                  locale: fr,
              })
            : undefined;

        // Send email
        await EmailService.sendRepairDepositedEmail(reparation.client.email, {
            clientName:
                reparation.client.prenom && reparation.client.nom
                    ? `${reparation.client.prenom} ${reparation.client.nom}`
                    : reparation.client.nom,
            repairNumber: reparation.numero,
            deviceType,
            deviceBrand: reparation.marque || "Non spécifié",
            deviceModel: reparation.modele || "Non spécifié",
            problemDescription: reparation.panne || "À diagnostiquer",
            estimatedReturnDate: estimatedReturn,
            storeName: reparation.store?.nom || "Notre boutique",
            storeAddress: reparation.store?.adresse || "",
            storePhone: reparation.store?.telephone || "",
        });

        // Create in-app notification
        await NotificationService.createNotification({
            clientId: reparation.clientId,
            type: NotificationType.REPARATION_DEPOSEE,
            titre: "Réparation enregistrée",
            message: `Votre ${deviceType} a bien été déposé pour réparation. Numéro : ${reparation.numero}`,
            metadata: {
                reparationId: reparation.id,
                reparationNumero: reparation.numero,
                typeAppareil: reparation.typeAppareil,
            },
        });
    }

    /**
     * Send notification when diagnostic is complete
     */
    static async notifyDiagnosticComplete(
        reparation: RepairWithClient,
        diagnosticDetail: string,
        estimatedCost?: number,
        repairDelay?: number
    ): Promise<void> {
        if (!reparation.client.email) {
            console.warn(
                `[Repair Notification] Client ${reparation.clientId} has no email, skipping notification`
            );
            return;
        }

        const deviceType = this.getDeviceTypeLabel(reparation.typeAppareil);
        const quoteAcceptUrl = process.env.NEXT_PUBLIC_APP_URL
            ? `${process.env.NEXT_PUBLIC_APP_URL}/client/repairs/${reparation.id}`
            : undefined;

        // Send email
        await EmailService.sendDiagnosticCompleteEmail(
            reparation.client.email,
            {
                clientName:
                    reparation.client.prenom && reparation.client.nom
                        ? `${reparation.client.prenom} ${reparation.client.nom}`
                        : reparation.client.nom,
                repairNumber: reparation.numero,
                deviceType,
                diagnosticDetail,
                estimatedCost,
                repairDelay,
                storeName: reparation.store?.nom || "Notre boutique",
                storePhone: reparation.store?.telephone || "",
                quoteAcceptUrl,
            }
        );

        // Create in-app notification
        await NotificationService.createNotification({
            clientId: reparation.clientId,
            type: NotificationType.REPARATION_DIAGNOSTIC,
            titre: "Diagnostic terminé",
            message: `Le diagnostic de votre ${deviceType} est terminé. ${estimatedCost ? `Coût estimé : ${estimatedCost.toFixed(2)}€` : "Devis disponible."}`,
            metadata: {
                reparationId: reparation.id,
                reparationNumero: reparation.numero,
                diagnosticDetail,
                estimatedCost,
                repairDelay,
            },
        });
    }

    /**
     * Send notification when repair is ready for pickup
     */
    static async notifyReadyForPickup(
        reparation: RepairWithClient
    ): Promise<void> {
        if (!reparation.client.email) {
            console.warn(
                `[Repair Notification] Client ${reparation.clientId} has no email, skipping notification`
            );
            return;
        }

        const deviceType = this.getDeviceTypeLabel(reparation.typeAppareil);

        // Send email
        await EmailService.sendReadyForPickupEmail(reparation.client.email, {
            clientName:
                reparation.client.prenom && reparation.client.nom
                    ? `${reparation.client.prenom} ${reparation.client.nom}`
                    : reparation.client.nom,
            repairNumber: reparation.numero,
            deviceType,
            totalCost: reparation.coutTotal ? Number(reparation.coutTotal) : 0,
            storeName: reparation.store?.nom || "Notre boutique",
            storeAddress: reparation.store?.adresse || "",
            storePhone: reparation.store?.telephone || "",
            storeHours: this.getStoreHours(reparation.store),
        });

        // Create in-app notification
        await NotificationService.createNotification({
            clientId: reparation.clientId,
            type: NotificationType.REPARATION_PRETE,
            titre: "Appareil prêt",
            message: `Bonne nouvelle ! Votre ${deviceType} est prêt à être récupéré. ${reparation.coutTotal ? `Montant : ${reparation.coutTotal.toFixed(2)}€` : ""}`,
            metadata: {
                reparationId: reparation.id,
                reparationNumero: reparation.numero,
                coutTotal: reparation.coutTotal,
            },
        });
    }

    /**
     * Send notification when repair is delayed
     */
    static async notifyDelayed(
        reparation: RepairWithClient,
        reason: string,
        newEstimatedDate: Date
    ): Promise<void> {
        if (!reparation.client.email) {
            console.warn(
                `[Repair Notification] Client ${reparation.clientId} has no email, skipping notification`
            );
            return;
        }

        const deviceType = this.getDeviceTypeLabel(reparation.typeAppareil);
        const formattedDate = format(newEstimatedDate, "dd MMMM yyyy", {
            locale: fr,
        });

        // Send email
        await EmailService.sendDelayedRepairEmail(reparation.client.email, {
            clientName:
                reparation.client.prenom && reparation.client.nom
                    ? `${reparation.client.prenom} ${reparation.client.nom}`
                    : reparation.client.nom,
            repairNumber: reparation.numero,
            deviceType,
            reason,
            newEstimatedDate: formattedDate,
            storeName: reparation.store?.nom || "Notre boutique",
            storePhone: reparation.store?.telephone || "",
        });

        // Create in-app notification
        await NotificationService.createNotification({
            clientId: reparation.clientId,
            type: NotificationType.REPARATION_RETARD,
            titre: "Réparation en retard",
            message: `La réparation de votre ${deviceType} prend plus de temps que prévu. Nouvelle date estimée : ${formattedDate}`,
            metadata: {
                reparationId: reparation.id,
                reparationNumero: reparation.numero,
                reason,
                newEstimatedDate: newEstimatedDate.toISOString(),
            },
        });
    }

    /**
     * Send notification when repair is delivered
     */
    static async notifyDelivered(
        reparation: RepairWithClient
    ): Promise<void> {
        if (!reparation.client.email) {
            console.warn(
                `[Repair Notification] Client ${reparation.clientId} has no email, skipping notification`
            );
            return;
        }

        const deviceType = this.getDeviceTypeLabel(reparation.typeAppareil);
        const warrantyDays = 30; // Default warranty period
        const feedbackUrl = process.env.NEXT_PUBLIC_APP_URL
            ? `${process.env.NEXT_PUBLIC_APP_URL}/client/feedback?repair=${reparation.id}`
            : undefined;

        // Send email
        await EmailService.sendRepairDeliveredEmail(reparation.client.email, {
            clientName:
                reparation.client.prenom && reparation.client.nom
                    ? `${reparation.client.prenom} ${reparation.client.nom}`
                    : reparation.client.nom,
            repairNumber: reparation.numero,
            deviceType,
            warrantyDays,
            storeName: reparation.store?.nom || "Notre boutique",
            storePhone: reparation.store?.telephone || "",
            feedbackUrl,
        });

        // Create in-app notification
        await NotificationService.createNotification({
            clientId: reparation.clientId,
            type: NotificationType.REPARATION_LIVREE,
            titre: "Réparation terminée",
            message: `Merci d'avoir récupéré votre ${deviceType}. Garantie de ${warrantyDays} jours.`,
            metadata: {
                reparationId: reparation.id,
                reparationNumero: reparation.numero,
                warrantyDays,
            },
        });
    }

    /**
     * Send appropriate notification based on status change
     */
    static async sendStatusNotification(
        reparation: RepairWithClient,
        newStatus: StatutReparation,
        notes?: string
    ): Promise<void> {
        try {
            switch (newStatus) {
                case StatutReparation.DEPOSE:
                    await this.notifyRepairDeposited(reparation);
                    break;

                case StatutReparation.PRETE:
                    await this.notifyReadyForPickup(reparation);
                    break;

                case StatutReparation.LIVREE:
                    await this.notifyDelivered(reparation);
                    break;

                // Other statuses don't automatically trigger notifications
                // (diagnostic has its own method)
                default:
                    console.log(
                        `[Repair Notification] No automatic notification for status ${newStatus}`
                    );
            }
        } catch (error) {
            console.error(
                "[Repair Notification] Failed to send notification:",
                error
            );
            // Don't throw - notification failure shouldn't block the repair status update
        }
    }

    // Helper methods
    private static getDeviceTypeLabel(type: string): string {
        const labels: Record<string, string> = {
            ORDINATEUR: "ordinateur",
            SMARTPHONE: "smartphone",
            TABLETTE: "tablette",
            CONSOLE: "console",
            AUTRE: "appareil",
        };
        return labels[type] || "appareil";
    }

    private static getStoreHours(store?: Store | null): string {
        // TODO: Add opening hours to Store model if needed
        // For now, return a default message
        return "Lundi-Vendredi : 9h-18h, Samedi : 9h-13h";
    }
}
