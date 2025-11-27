import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const checkInSchema = z.object({
    // Méthode 1: par numéro de carte
    numeroCarte: z.string().optional(),
    // Méthode 2: par code d'accès
    codeAcces: z.string().optional(),
    // Méthode 3: par client ID (check-in manuel)
    clientId: z.string().optional(),
    // Options
    salleId: z.string().optional().nullable(),
    typeAcces: z
        .enum(["ENTREE", "SORTIE", "COURS", "ESPACE_PREMIUM"])
        .default("ENTREE"),
});

// POST /api/fitness/check-in - Check-in d'un membre
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("presences_fitness");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();
        const validatedData = checkInSchema.parse(body);

        // Trouver l'abonnement et le client
        let abonnement;
        let clientId: string | undefined;

        if (validatedData.numeroCarte) {
            // Recherche par numéro de carte
            abonnement = await prisma.abonnementFitness.findFirst({
                where: {
                    numeroCarte: validatedData.numeroCarte,
                    entrepriseId: session.user.entrepriseId,
                },
                include: {
                    client: true,
                    typeAbonnement: true,
                },
            });

            if (!abonnement) {
                return NextResponse.json(
                    { error: "Carte non reconnue" },
                    { status: 404 }
                );
            }
            clientId = abonnement.clientId;
        } else if (validatedData.codeAcces) {
            // Recherche par code d'accès
            abonnement = await prisma.abonnementFitness.findFirst({
                where: {
                    codeAcces: validatedData.codeAcces,
                    entrepriseId: session.user.entrepriseId,
                },
                include: {
                    client: true,
                    typeAbonnement: true,
                },
            });

            if (!abonnement) {
                return NextResponse.json(
                    { error: "Code d'accès invalide" },
                    { status: 404 }
                );
            }
            clientId = abonnement.clientId;
        } else if (validatedData.clientId) {
            // Check-in manuel par ID client
            clientId = validatedData.clientId;

            // Trouver l'abonnement actif du client
            abonnement = await prisma.abonnementFitness.findFirst({
                where: {
                    clientId,
                    entrepriseId: session.user.entrepriseId,
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
            return NextResponse.json(
                {
                    error: "Veuillez fournir un numéro de carte, code d'accès ou ID client",
                },
                { status: 400 }
            );
        }

        if (!clientId) {
            return NextResponse.json(
                { error: "Client non trouvé" },
                { status: 404 }
            );
        }

        // Vérifier le statut de l'abonnement
        if (abonnement) {
            if (abonnement.statut !== "ACTIF") {
                return NextResponse.json(
                    {
                        error: "Abonnement non actif",
                        statut: abonnement.statut,
                        client: abonnement.client,
                    },
                    { status: 403 }
                );
            }

            // Vérifier la date de fin
            if (
                abonnement.dateFin &&
                new Date(abonnement.dateFin) < new Date()
            ) {
                return NextResponse.json(
                    {
                        error: "Abonnement expiré",
                        dateExpiration: abonnement.dateFin,
                        client: abonnement.client,
                    },
                    { status: 403 }
                );
            }

            // Vérifier les séances restantes (pour les pass)
            if (
                abonnement.seancesRestantes !== null &&
                abonnement.seancesRestantes <= 0
            ) {
                return NextResponse.json(
                    {
                        error: "Plus de séances disponibles",
                        seancesUtilisees: abonnement.seancesUtilisees,
                        client: abonnement.client,
                    },
                    { status: 403 }
                );
            }

            // Vérifier l'accès aux zones premium
            if (
                validatedData.typeAcces === "ESPACE_PREMIUM" &&
                !abonnement.typeAbonnement.accesZonesPremium
            ) {
                return NextResponse.json(
                    {
                        error: "Accès aux zones premium non inclus dans l'abonnement",
                        client: abonnement.client,
                    },
                    { status: 403 }
                );
            }

            // Décrémenter les séances si c'est un pass
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

        // Créer la présence
        const presence = await prisma.presenceFitness.create({
            data: {
                clientId,
                abonnementId: abonnement?.id ?? null,
                typeAcces: validatedData.typeAcces,
                salleId: validatedData.salleId ?? null,
                methodCheckin: validatedData.numeroCarte
                    ? "badge"
                    : validatedData.codeAcces
                      ? "code"
                      : "manuel",
                entrepriseId: session.user.entrepriseId,
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
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Données invalides", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Erreur POST check-in:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
