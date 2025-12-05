import { NotFoundError } from "@/lib/errors";
import type { StatutReparation } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";

/**
 * Reparation Service
 * Handles all business logic related to repair tickets
 */
export class ReparationService {
    /**
     * Generate a unique reference for a repair ticket
     * Format: REP-XXX (e.g., REP-001, REP-002)
     */
    static async generateReference(entrepriseId: string): Promise<string> {
        const parametres = await prisma.parametresEntreprise.findUnique({
            where: { entrepriseId },
        });

        if (!parametres) {
            throw new NotFoundError("Paramètres de l'entreprise", entrepriseId);
        }

        const prefix = parametres.prefixe_reparation;
        const currentNumber = parametres.prochain_numero_reparation;

        // Increment the counter
        await prisma.parametresEntreprise.update({
            where: { entrepriseId },
            data: {
                prochain_numero_reparation: currentNumber + 1,
            },
        });

        // Format with leading zeros
        const formattedNumber = String(currentNumber).padStart(3, "0");
        return `${prefix}-${formattedNumber}`;
    }

    /**
     * Calculate total repair cost
     */
    static calculateTotal(coutMain: number, coutPieces: number): number {
        return coutMain + coutPieces;
    }

    /**
     * Validate status transition
     */
    static validateStatusTransition(
        currentStatus: StatutReparation,
        newStatus: StatutReparation
    ): boolean {
        // Define valid transitions
        const validTransitions: Record<StatutReparation, StatutReparation[]> = {
            DEPOSE: ["DIAGNOSTIC", "ANNULEE"],
            DIAGNOSTIC: ["DEVIS_ENVOYE", "EN_COURS", "ANNULEE"],
            DEVIS_ENVOYE: ["ATTENTE_PIECES", "EN_COURS", "ANNULEE"],
            ATTENTE_PIECES: ["EN_COURS", "ANNULEE"],
            EN_COURS: ["PRETE", "ATTENTE_PIECES", "ANNULEE"],
            PRETE: ["LIVREE", "ABANDONNEE"],
            LIVREE: [],
            ANNULEE: [],
            ABANDONNEE: [],
        };

        return validTransitions[currentStatus]?.includes(newStatus) || false;
    }

    /**
     * Create status change log entry
     */
    static createStatusChangeLog(
        oldStatus: StatutReparation,
        newStatus: StatutReparation,
        userId: string
    ) {
        return {
            oldStatus,
            newStatus,
            date: new Date().toISOString(),
            userId,
        };
    }

    /**
     * Get status label in French
     */
    static getStatusLabel(status: StatutReparation): string {
        const labels: Record<StatutReparation, string> = {
            DEPOSE: "Déposé",
            DIAGNOSTIC: "En diagnostic",
            DEVIS_ENVOYE: "Devis envoyé",
            ATTENTE_PIECES: "En attente de pièces",
            EN_COURS: "En cours de réparation",
            PRETE: "Prête à récupérer",
            LIVREE: "Livrée",
            ANNULEE: "Annulée",
            ABANDONNEE: "Abandonnée",
        };

        return labels[status] || status;
    }

    /**
     * Check if repair can be deleted
     */
    static canDelete(statut: StatutReparation): boolean {
        // Only allow deletion of repairs that haven't been started
        return ["DEPOSE", "DIAGNOSTIC", "ANNULEE"].includes(statut);
    }

    /**
     * Check if repair can be edited
     */
    static canEdit(statut: StatutReparation): boolean {
        // Cannot edit delivered or abandoned repairs
        return !["LIVREE", "ABANDONNEE"].includes(statut);
    }

    /**
     * Calculate estimated return date based on repair time
     */
    static calculateEstimatedReturn(
        dateDepot: Date,
        delaiReparationHeures?: number
    ): Date | null {
        if (!delaiReparationHeures) return null;

        const returnDate = new Date(dateDepot);
        // Add business days (8 hours/day)
        const businessDays = Math.ceil(delaiReparationHeures / 8);
        returnDate.setDate(returnDate.getDate() + businessDays);

        return returnDate;
    }

    /**
     * Check if repair is delayed
     */
    static isDelayed(
        dateEstimeeRetour?: Date | null,
        statut?: StatutReparation
    ): boolean {
        if (!dateEstimeeRetour || !statut) return false;

        // Don't mark as delayed if already delivered or abandoned
        if (["LIVREE", "ABANDONNEE", "ANNULEE"].includes(statut)) return false;

        return new Date() > new Date(dateEstimeeRetour);
    }

    /**
     * Format device information for display
     */
    static formatDeviceInfo(
        typeAppareil: string,
        marque?: string | null,
        modele?: string | null
    ): string {
        const parts = [typeAppareil.replace(/_/g, " ")];
        if (marque) parts.push(marque);
        if (modele) parts.push(modele);
        return parts.join(" ");
    }

    /**
     * Get status color for UI
     */
    static getStatusColor(status: StatutReparation): string {
        const colors: Record<StatutReparation, string> = {
            DEPOSE: "gray",
            DIAGNOSTIC: "blue",
            DEVIS_ENVOYE: "purple",
            ATTENTE_PIECES: "orange",
            EN_COURS: "yellow",
            PRETE: "green",
            LIVREE: "green",
            ANNULEE: "red",
            ABANDONNEE: "red",
        };

        return colors[status] || "gray";
    }

    /**
     * Get priority label in French
     */
    static getPriorityLabel(priorite: string): string {
        const labels: Record<string, string> = {
            NORMALE: "Normale",
            URGENTE: "Urgente",
            CRITIQUE: "Critique",
        };

        return labels[priorite] || priorite;
    }

    /**
     * Get priority color for UI
     */
    static getPriorityColor(priorite: string): string {
        const colors: Record<string, string> = {
            NORMALE: "gray",
            URGENTE: "orange",
            CRITIQUE: "red",
        };

        return colors[priorite] || "gray";
    }
}
