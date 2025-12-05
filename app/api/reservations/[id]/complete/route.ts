import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * POST /api/reservations/[id]/complete
 * Mark reservation as completed
 */
export async function POST(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existingReservation = await prisma.reservation.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    table: true,
                },
            });

            if (!existingReservation) {
                throw new NotFoundError("Réservation non trouvée");
            }

            if (existingReservation.statut !== "ARRIVEE") {
                throw new BusinessError(
                    "Seules les réservations avec clients arrivés peuvent être terminées"
                );
            }

            const result = await prisma.$transaction(async (tx) => {
                const reservation = await tx.reservation.update({
                    where: { id },
                    data: { statut: "TERMINEE" },
                    include: {
                        table: {
                            select: {
                                id: true,
                                numero: true,
                                nom: true,
                                zone: true,
                            },
                        },
                        client: {
                            select: {
                                id: true,
                                nom: true,
                                prenom: true,
                                telephone: true,
                                email: true,
                            },
                        },
                    },
                });

                if (existingReservation.tableId) {
                    await tx.tableRestaurant.update({
                        where: { id: existingReservation.tableId },
                        data: { statut: "LIBRE" },
                    });
                }

                return reservation;
            });

            return NextResponse.json({ reservation: result });
        },
        {
            capability: "agenda",
            context: { resourceName: "Reservation", operation: "complete" },
        }
    );
}
