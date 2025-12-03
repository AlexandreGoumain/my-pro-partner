import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateReservationSchema = z.object({
    statut: z
        .enum(["CONFIRMEE", "EN_ATTENTE", "ANNULEE", "NO_SHOW", "PRESENTE"])
        .optional(),
    heureArrivee: z
        .string()
        .optional()
        .nullable()
        .transform((str) => (str ? new Date(str) : null)),
    notes: z.string().optional().nullable(),
});

type RouteParams = { params: Promise<{ id: string }> };

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

const reservationDetailInclude = {
    seance: {
        include: {
            cours: true,
            instructeur: {
                select: {
                    id: true,
                    nom: true,
                    prenom: true,
                },
            },
            salle: true,
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
 * GET /api/fitness/reservations/[id]
 * Get a single reservation
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const reservation = await prisma.reservationCours.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: reservationDetailInclude,
            });

            if (!reservation) {
                throw new NotFoundError("Réservation non trouvée");
            }

            return NextResponse.json(reservation);
        },
        {
            capability: "cours_collectifs",
            context: { resourceName: "ReservationCours", operation: "get" },
        }
    );
}

/**
 * PUT /api/fitness/reservations/[id]
 * Update a reservation
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.reservationCours.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    seance: true,
                },
            });

            if (!existing) {
                throw new NotFoundError("Réservation non trouvée");
            }

            const body = await request.json();
            const validation = updateReservationSchema.safeParse(body);

            if (!validation.success) {
                throw new ValidationError(
                    "Données invalides",
                    validation.error.flatten().fieldErrors as Record<string, string[]>
                );
            }

            const data = validation.data;

            // If changing to PRESENTE, record arrival time
            const updateData = {
                ...data,
                ...(data.statut === "PRESENTE" &&
                    !data.heureArrivee && {
                        heureArrivee: new Date(),
                    }),
            };

            // Handle status changes
            if (data.statut && data.statut !== existing.statut) {
                // If cancelling a confirmed reservation, free up the spot
                if (
                    data.statut === "ANNULEE" &&
                    existing.statut === "CONFIRMEE"
                ) {
                    await prisma.seanceCours.update({
                        where: { id: existing.seanceId },
                        data: { placesReservees: { decrement: 1 } },
                    });

                    // Promote the first person in the waiting list
                    const nextInQueue = await prisma.reservationCours.findFirst({
                        where: {
                            seanceId: existing.seanceId,
                            statut: "EN_ATTENTE",
                        },
                        orderBy: { positionAttente: "asc" },
                    });

                    if (nextInQueue) {
                        await prisma.reservationCours.update({
                            where: { id: nextInQueue.id },
                            data: { statut: "CONFIRMEE", positionAttente: null },
                        });

                        await prisma.seanceCours.update({
                            where: { id: existing.seanceId },
                            data: { placesReservees: { increment: 1 } },
                        });
                    }
                }

                // If confirming a waiting list reservation
                if (
                    data.statut === "CONFIRMEE" &&
                    existing.statut === "EN_ATTENTE"
                ) {
                    await prisma.seanceCours.update({
                        where: { id: existing.seanceId },
                        data: { placesReservees: { increment: 1 } },
                    });
                }
            }

            const reservation = await prisma.reservationCours.update({
                where: { id },
                data: updateData,
                include: reservationInclude,
            });

            return NextResponse.json(reservation);
        },
        {
            capability: "cours_collectifs",
            context: { resourceName: "ReservationCours", operation: "update" },
        }
    );
}

/**
 * DELETE /api/fitness/reservations/[id]
 * Delete a reservation
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.reservationCours.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Réservation non trouvée");
            }

            // Update counter if it was a confirmed reservation
            if (existing.statut === "CONFIRMEE") {
                await prisma.seanceCours.update({
                    where: { id: existing.seanceId },
                    data: { placesReservees: { decrement: 1 } },
                });
            }

            await prisma.reservationCours.delete({ where: { id } });

            return NextResponse.json({ success: true });
        },
        {
            capability: "cours_collectifs",
            context: { resourceName: "ReservationCours", operation: "delete" },
        }
    );
}
