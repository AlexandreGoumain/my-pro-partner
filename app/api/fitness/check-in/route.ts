import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError, ForbiddenError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const checkInSchema = z.object({
    // Method 1: by card number
    numeroCarte: z.string().optional(),
    // Method 2: by access code
    codeAcces: z.string().optional(),
    // Method 3: by client ID (manual check-in)
    clientId: z.string().optional(),
    // Options
    salleId: z.string().optional().nullable(),
    typeAcces: z
        .enum(["ENTREE", "SORTIE", "COURS", "ESPACE_PREMIUM"])
        .default("ENTREE"),
});

/**
 * POST /api/fitness/check-in
 * Check-in a member
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();
            const validation = checkInSchema.safeParse(body);

            if (!validation.success) {
                throw new ValidationError(
                    "Données invalides",
                    validation.error.flatten().fieldErrors as Record<string, string[]>
                );
            }

            const data = validation.data;

            // Find subscription and client
            let abonnement;
            let clientId: string | undefined;

            if (data.numeroCarte) {
                // Search by card number
                abonnement = await prisma.abonnementFitness.findFirst({
                    where: {
                        numeroCarte: data.numeroCarte,
                        entrepriseId: ctx.entrepriseId,
                    },
                    include: {
                        client: true,
                        typeAbonnement: true,
                    },
                });

                if (!abonnement) {
                    throw new NotFoundError("Carte non reconnue");
                }
                clientId = abonnement.clientId;
            } else if (data.codeAcces) {
                // Search by access code
                abonnement = await prisma.abonnementFitness.findFirst({
                    where: {
                        codeAcces: data.codeAcces,
                        entrepriseId: ctx.entrepriseId,
                    },
                    include: {
                        client: true,
                        typeAbonnement: true,
                    },
                });

                if (!abonnement) {
                    throw new NotFoundError("Code d'accès invalide");
                }
                clientId = abonnement.clientId;
            } else if (data.clientId) {
                // Manual check-in by client ID
                clientId = data.clientId;

                // Find active subscription for client
                abonnement = await prisma.abonnementFitness.findFirst({
                    where: {
                        clientId,
                        entrepriseId: ctx.entrepriseId,
                        statut: "ACTIF",
                        OR: [{ dateFin: null }, { dateFin: { gte: new Date() } }],
                    },
                    include: {
                        client: true,
                        typeAbonnement: true,
                    },
                    orderBy: { createdAt: "desc" },
                });
            } else {
                throw new ValidationError(
                    "Veuillez fournir un numéro de carte, code d'accès ou ID client"
                );
            }

            if (!clientId) {
                throw new NotFoundError("Client non trouvé");
            }

            // Check subscription status
            if (abonnement) {
                if (abonnement.statut !== "ACTIF") {
                    throw new ForbiddenError(
                        `Abonnement non actif (statut: ${abonnement.statut})`
                    );
                }

                // Check end date
                if (
                    abonnement.dateFin &&
                    new Date(abonnement.dateFin) < new Date()
                ) {
                    throw new ForbiddenError("Abonnement expiré");
                }

                // Check remaining sessions (for passes)
                if (
                    abonnement.seancesRestantes !== null &&
                    abonnement.seancesRestantes <= 0
                ) {
                    throw new ForbiddenError("Plus de séances disponibles");
                }

                // Check premium zone access
                if (
                    data.typeAcces === "ESPACE_PREMIUM" &&
                    !abonnement.typeAbonnement.accesZonesPremium
                ) {
                    throw new ForbiddenError(
                        "Accès aux zones premium non inclus dans l'abonnement"
                    );
                }

                // Decrement sessions if it's a pass
                if (abonnement.seancesRestantes !== null) {
                    await prisma.abonnementFitness.update({
                        where: { id: abonnement.id },
                        data: {
                            seancesRestantes: { decrement: 1 },
                            seancesUtilisees: { increment: 1 },
                        },
                    });
                }
            }

            // Create attendance record
            const presence = await prisma.presenceFitness.create({
                data: {
                    clientId,
                    abonnementId: abonnement?.id ?? null,
                    typeAcces: data.typeAcces,
                    salleId: data.salleId ?? null,
                    methodCheckin: data.numeroCarte
                        ? "badge"
                        : data.codeAcces
                          ? "code"
                          : "manuel",
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    client: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            email: true,
                        },
                    },
                    abonnement: {
                        select: {
                            id: true,
                            numero: true,
                            statut: true,
                            seancesRestantes: true,
                            typeAbonnement: {
                                select: {
                                    nom: true,
                                },
                            },
                        },
                    },
                    salle: {
                        select: {
                            id: true,
                            nom: true,
                            type: true,
                        },
                    },
                },
            });

            return NextResponse.json({
                success: true,
                message: `Bienvenue ${presence.client.prenom || ""} ${presence.client.nom} !`,
                presence,
                abonnement: abonnement
                    ? {
                          type: abonnement.typeAbonnement.nom,
                          seancesRestantes:
                              abonnement.seancesRestantes !== null
                                  ? abonnement.seancesRestantes - 1
                                  : null,
                      }
                    : null,
            });
        },
        {
            capability: "presences_fitness",
            context: { resourceName: "CheckIn", operation: "create" },
        }
    );
}
