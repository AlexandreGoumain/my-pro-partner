import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * POST /api/reservations/[id]/cancel
 * Cancel a reservation
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
            });

            if (!existingReservation) {
                throw new NotFoundError("Réservation non trouvée");
            }

            if (
                ["TERMINEE", "ANNULEE", "NO_SHOW"].includes(
                    existingReservation.statut
                )
            ) {
                throw new BusinessError(
                    "Cette réservation ne peut pas être annulée"
                );
            }

            const reservation = await prisma.reservation.update({
                where: { id },
                data: { statut: "ANNULEE" },
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

            return NextResponse.json({ reservation });
        },
        {
            capability: "agenda",
            context: { resourceName: "Reservation", operation: "cancel" },
        }
    );
}
