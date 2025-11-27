import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

// POST /api/reservations/[id]/cancel - Cancel a reservation
export async function POST(request: NextRequest, { params }: Params) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Check if reservation exists
        const existingReservation = await prisma.reservation.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existingReservation) {
            return NextResponse.json(
                { error: "Réservation non trouvée" },
                { status: 404 }
            );
        }

        // Cannot cancel already completed, cancelled or no-show reservations
        if (
            ["TERMINEE", "ANNULEE", "NO_SHOW"].includes(
                existingReservation.statut
            )
        ) {
            return NextResponse.json(
                { error: "Cette réservation ne peut pas être annulée" },
                { status: 400 }
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
    } catch (error) {
        console.error("Error cancelling reservation:", error);
        return NextResponse.json(
            { error: "Failed to cancel reservation" },
            { status: 500 }
        );
    }
}
