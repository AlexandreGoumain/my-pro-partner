import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError, ConflictError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createReservationSchema = z.object({
    seanceId: z.string().min(1, "La séance est requise"),
    clientId: z.string().min(1, "Le client est requis"),
    notes: z.string().optional().nullable(),
});

const reservationInclude = {
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
} as const;

/**
 * GET /api/fitness/reservations
 * List reservations
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const { searchParams } = new URL(request.url);
            const page = parseInt(searchParams.get("page") || "1");
            const limit = parseInt(searchParams.get("limit") || "50");
            const seanceId = searchParams.get("seanceId");
            const clientId = searchParams.get("clientId");
            const statut = searchParams.get("statut");

            const where = {
                entrepriseId: ctx.entrepriseId,
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
                    include: reservationInclude,
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
        },
        {
            capability: "cours_collectifs",
            context: { resourceName: "ReservationCours", operation: "list" },
        }
    );
}

/**
 * POST /api/fitness/reservations
 * Create a reservation
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();
            const validation = createReservationSchema.safeParse(body);

            if (!validation.success) {
                throw new ValidationError(
                    "Données invalides",
                    validation.error.flatten().fieldErrors as Record<string, string[]>
                );
            }

            const data = validation.data;

            // Check that the session exists and is not cancelled
            const seance = await prisma.seanceCours.findFirst({
                where: {
                    id: data.seanceId,
                    entrepriseId: ctx.entrepriseId,
                    statut: { not: "ANNULEE" },
                },
                include: {
                    cours: true,
                    _count: { select: { reservations: true } },
                },
            });

            if (!seance) {
                throw new NotFoundError("Séance non trouvée ou annulée");
            }

            // Check that the client exists
            const client = await prisma.client.findFirst({
                where: {
                    id: data.clientId,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!client) {
                throw new NotFoundError("Client non trouvé");
            }

            // Check if the client is not already registered
            const existingReservation = await prisma.reservationCours.findUnique({
                where: {
                    seanceId_clientId: {
                        seanceId: data.seanceId,
                        clientId: data.clientId,
                    },
                },
            });

            if (existingReservation) {
                throw new ConflictError("Ce client est déjà inscrit à cette séance");
            }

            // Check capacity
            const capaciteMax = seance.capaciteMax || seance.cours.capaciteMax;
            const isListeAttente = seance._count.reservations >= capaciteMax;

            // Calculate wait list position if necessary
            let positionAttente: number | null = null;
            if (isListeAttente) {
                const lastInQueue = await prisma.reservationCours.findFirst({
                    where: {
                        seanceId: data.seanceId,
                        statut: "EN_ATTENTE",
                    },
                    orderBy: { positionAttente: "desc" },
                });
                positionAttente = (lastInQueue?.positionAttente || 0) + 1;
            }

            const reservation = await prisma.reservationCours.create({
                data: {
                    ...data,
                    statut: isListeAttente ? "EN_ATTENTE" : "CONFIRMEE",
                    positionAttente,
                    entrepriseId: ctx.entrepriseId,
                },
                include: reservationInclude,
            });

            // Update reserved seats counter
            await prisma.seanceCours.update({
                where: { id: data.seanceId },
                data: {
                    placesReservees: { increment: isListeAttente ? 0 : 1 },
                    statut:
                        seance._count.reservations + 1 >= capaciteMax
                            ? "COMPLETE"
                            : undefined,
                },
            });

            return NextResponse.json(reservation, { status: 201 });
        },
        {
            capability: "cours_collectifs",
            context: { resourceName: "ReservationCours", operation: "create" },
        }
    );
}
