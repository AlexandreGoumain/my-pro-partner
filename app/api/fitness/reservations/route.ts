import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createReservationSchema = z.object({
    seanceId: z.string().min(1, "La séance est requise"),
    clientId: z.string().min(1, "Le client est requis"),
    notes: z.string().optional().nullable(),
});

// GET /api/fitness/reservations - Liste des réservations
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("cours_collectifs");
        if (capabilityCheck) return capabilityCheck;

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");
        const seanceId = searchParams.get("seanceId");
        const clientId = searchParams.get("clientId");
        const statut = searchParams.get("statut");

        const where = {
            entrepriseId: session.user.entrepriseId,
            ...(seanceId && { seanceId }),
            ...(clientId && { clientId }),
            ...(statut && {
                statut: statut as
                    | "CONFIRMEE"
                    | "EN_ATTENTE"
                    | "ANNULEE"
                    | "NO_SHOW"
                    | "PRESENTE",
            }),
        };

        const [reservations, total] = await Promise.all([
            prisma.reservationCours.findMany({
                where,
                orderBy: [{ createdAt: "desc" }],
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    seance: {
                        include: {
                            cours: {
                                select: {
                                    id: true,
                                    nom: true,
                                    couleur: true,
                                },
                            },
                        },
                    },
                    client: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            email: true,
                            telephone: true,
                        },
                    },
                },
            }),
            prisma.reservationCours.count({ where }),
        ]);

        return NextResponse.json({
            data: reservations,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Erreur GET reservations:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// POST /api/fitness/reservations - Créer une réservation
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("cours_collectifs");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();
        const validatedData = createReservationSchema.parse(body);

        // Vérifier que la séance existe et n'est pas annulée
        const seance = await prisma.seanceCours.findFirst({
            where: {
                id: validatedData.seanceId,
                entrepriseId: session.user.entrepriseId,
                statut: { not: "ANNULEE" },
            },
            include: {
                cours: true,
                _count: { select: { reservations: true } },
            },
        });

        if (!seance) {
            return NextResponse.json(
                { error: "Séance non trouvée ou annulée" },
                { status: 404 }
            );
        }

        // Vérifier que le client existe
        const client = await prisma.client.findFirst({
            where: {
                id: validatedData.clientId,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!client) {
            return NextResponse.json(
                { error: "Client non trouvé" },
                { status: 404 }
            );
        }

        // Vérifier si le client n'est pas déjà inscrit
        const existingReservation = await prisma.reservationCours.findUnique({
            where: {
                seanceId_clientId: {
                    seanceId: validatedData.seanceId,
                    clientId: validatedData.clientId,
                },
            },
        });

        if (existingReservation) {
            return NextResponse.json(
                { error: "Ce client est déjà inscrit à cette séance" },
                { status: 400 }
            );
        }

        // Vérifier la capacité
        const capaciteMax = seance.capaciteMax || seance.cours.capaciteMax;
        const isListeAttente = seance._count.reservations >= capaciteMax;

        // Calculer la position en liste d'attente si nécessaire
        let positionAttente: number | null = null;
        if (isListeAttente) {
            const lastInQueue = await prisma.reservationCours.findFirst({
                where: {
                    seanceId: validatedData.seanceId,
                    statut: "EN_ATTENTE",
                },
                orderBy: { positionAttente: "desc" },
            });
            positionAttente = (lastInQueue?.positionAttente || 0) + 1;
        }

        const reservation = await prisma.reservationCours.create({
            data: {
                ...validatedData,
                statut: isListeAttente ? "EN_ATTENTE" : "CONFIRMEE",
                positionAttente,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                seance: {
                    include: {
                        cours: {
                            select: {
                                id: true,
                                nom: true,
                                couleur: true,
                            },
                        },
                    },
                },
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        email: true,
                        telephone: true,
                    },
                },
            },
        });

        // Mettre à jour le compteur de places réservées
        await prisma.seanceCours.update({
            where: { id: validatedData.seanceId },
            data: {
                placesReservees: { increment: isListeAttente ? 0 : 1 },
                statut:
                    seance._count.reservations + 1 >= capaciteMax
                        ? "COMPLETE"
                        : undefined,
            },
        });

        return NextResponse.json(reservation, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Données invalides", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Erreur POST reservation:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
