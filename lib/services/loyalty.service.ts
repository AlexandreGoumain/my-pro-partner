import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma";

interface AddPointsOptions {
    clientId: string;
    entrepriseId: string;
    montant: number;
    reference?: string;
    description?: string;
    pointsExpiration?: Date;
}

interface AssignLoyaltyLevelOptions {
    clientId: string;
    entrepriseId: string;
}

/**
 * Service for managing loyalty program logic
 * Handles points calculation, level assignment, and discount application
 */
export class LoyaltyService {
    /**
     * Configuration: 1¬ dépensé = 1 point
     * This can be made configurable per company in the future
     */
    private static readonly POINTS_PER_EURO = 1;

    /**
     * Default expiration: 1 year from now
     */
    private static readonly DEFAULT_EXPIRATION_DAYS = 365;

    /**
     * Calculate points based on amount spent
     * @param montant Amount in euros
     * @returns Number of points to award
     */
    static calculatePoints(montant: number): number {
        return Math.floor(montant * this.POINTS_PER_EURO);
    }

    /**
     * Add points to a client and create a movement record
     * Also triggers automatic level reassignment
     *
     * @param options Client ID, company ID, amount, and optional metadata
     * @returns Created points movement
     */
    static async addPoints(options: AddPointsOptions) {
        const {
            clientId,
            entrepriseId,
            montant,
            reference,
            description,
            pointsExpiration,
        } = options;

        // Calculate points to award
        const pointsToAdd = this.calculatePoints(montant);

        if (pointsToAdd <= 0) {
            throw new Error("Le montant doit être supérieur à 0 pour gagner des points");
        }

        // Get current client
        const client = await prisma.client.findFirst({
            where: {
                id: clientId,
                entrepriseId,
            },
        });

        if (!client) {
            throw new Error("Client non trouvé");
        }

        // Calculate expiration date if not provided
        const expirationDate =
            pointsExpiration ||
            new Date(Date.now() + this.DEFAULT_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);

        // Create points movement and update client balance in transaction
        const [mouvement] = await prisma.$transaction([
            prisma.mouvementPoints.create({
                data: {
                    type: "GAIN",
                    points: pointsToAdd,
                    description:
                        description || `Gain de ${pointsToAdd} points pour ${montant}¬`,
                    reference,
                    dateExpiration: expirationDate,
                    clientId,
                    entrepriseId,
                },
            }),
            prisma.client.update({
                where: { id: clientId },
                data: {
                    points_solde: {
                        increment: pointsToAdd,
                    },
                },
            }),
        ]);

        // Automatically reassign loyalty level based on new points balance
        await this.assignLoyaltyLevel({
            clientId,
            entrepriseId,
        });

        return mouvement;
    }

    /**
     * Automatically assign the appropriate loyalty level to a client
     * based on their current points balance
     *
     * @param options Client ID and company ID
     * @returns Updated client with new level
     */
    static async assignLoyaltyLevel(options: AssignLoyaltyLevelOptions) {
        const { clientId, entrepriseId } = options;

        // Get client with current points
        const client = await prisma.client.findFirst({
            where: {
                id: clientId,
                entrepriseId,
            },
        });

        if (!client) {
            throw new Error("Client non trouvé");
        }

        // Get all active loyalty levels sorted by threshold (descending)
        const niveaux = await prisma.niveauFidelite.findMany({
            where: {
                entrepriseId,
                actif: true,
            },
            orderBy: {
                seuilPoints: "desc",
            },
        });

        // Find the highest level the client qualifies for
        const appropriateLevel = niveaux.find(
            (niveau) => client.points_solde >= niveau.seuilPoints
        );

        // Only update if level changed
        if (appropriateLevel && client.niveauFideliteId !== appropriateLevel.id) {
            return prisma.client.update({
                where: { id: clientId },
                data: {
                    niveauFideliteId: appropriateLevel.id,
                },
                include: {
                    niveauFidelite: true,
                },
            });
        } else if (!appropriateLevel && client.niveauFideliteId !== null) {
            // Client no longer qualifies for any level
            return prisma.client.update({
                where: { id: clientId },
                data: {
                    niveauFideliteId: null,
                },
            });
        }

        return client;
    }

    /**
     * Get the discount percentage for a client based on their loyalty level
     *
     * @param clientId Client ID
     * @param entrepriseId Company ID
     * @returns Discount percentage (0-100)
     */
    static async getClientDiscount(
        clientId: string,
        entrepriseId: string
    ): Promise<number> {
        const client = await prisma.client.findFirst({
            where: {
                id: clientId,
                entrepriseId,
            },
            include: {
                niveauFidelite: true,
            },
        });

        if (!client || !client.niveauFidelite || !client.niveauFidelite.actif) {
            return 0;
        }

        return Number(client.niveauFidelite.remise);
    }

    /**
     * Spend points (deduct from client balance)
     * Useful for redemption features
     *
     * @param clientId Client ID
     * @param entrepriseId Company ID
     * @param points Number of points to spend
     * @param description Description of the spending
     * @param reference Optional reference
     * @returns Created movement
     */
    static async spendPoints(
        clientId: string,
        entrepriseId: string,
        points: number,
        description: string,
        reference?: string
    ) {
        if (points <= 0) {
            throw new Error("Le nombre de points doit être supérieur à 0");
        }

        // Get current client
        const client = await prisma.client.findFirst({
            where: {
                id: clientId,
                entrepriseId,
            },
        });

        if (!client) {
            throw new Error("Client non trouvé");
        }

        if (client.points_solde < points) {
            throw new Error("Solde de points insuffisant");
        }

        // Create movement and update balance in transaction
        const [mouvement] = await prisma.$transaction([
            prisma.mouvementPoints.create({
                data: {
                    type: "DEPENSE",
                    points,
                    description,
                    reference,
                    clientId,
                    entrepriseId,
                },
            }),
            prisma.client.update({
                where: { id: clientId },
                data: {
                    points_solde: {
                        decrement: points,
                    },
                },
            }),
        ]);

        // Reassign level in case client dropped below threshold
        await this.assignLoyaltyLevel({
            clientId,
            entrepriseId,
        });

        return mouvement;
    }

    /**
     * Get the next loyalty level a client can reach
     *
     * @param clientId Client ID
     * @param entrepriseId Company ID
     * @returns Next level and points needed, or null if already at max
     */
    static async getNextLevel(clientId: string, entrepriseId: string) {
        const client = await prisma.client.findFirst({
            where: {
                id: clientId,
                entrepriseId,
            },
            include: {
                niveauFidelite: true,
            },
        });

        if (!client) {
            throw new Error("Client non trouvé");
        }

        // Get all active levels sorted by threshold
        const niveaux = await prisma.niveauFidelite.findMany({
            where: {
                entrepriseId,
                actif: true,
            },
            orderBy: {
                seuilPoints: "asc",
            },
        });

        // Find the next level above current points
        const nextLevel = niveaux.find(
            (niveau) => niveau.seuilPoints > client.points_solde
        );

        if (!nextLevel) {
            return null; // Already at max level or above
        }

        return {
            nextLevel,
            pointsNeeded: nextLevel.seuilPoints - client.points_solde,
            currentPoints: client.points_solde,
            progress: (client.points_solde / nextLevel.seuilPoints) * 100,
        };
    }
}
