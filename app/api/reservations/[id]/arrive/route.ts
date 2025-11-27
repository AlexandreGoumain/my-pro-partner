import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

// POST /api/reservations/[id]/arrive - Mark client as arrived
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
            include: {
                table: true,
            },
        });

        if (!existingReservation) {
            return NextResponse.json(
                { error: "Réservation non trouvée" },
                { status: 404 }
            );
        }

        // Only EN_ATTENTE or CONFIRMEE reservations can be marked as arrived
        if (!["EN_ATTENTE", "CONFIRMEE"].includes(existingReservation.statut)) {
            return NextResponse.json(
                {
                    error: "Seules les réservations en attente ou confirmées peuvent être marquées comme arrivées",
                },
                { status: 400 }
            );
        }

        // Use transaction to update reservation and table status
        const result = await prisma.$transaction(async (tx) => {
            // Update reservation status
            const reservation = await tx.reservation.update({
                where: { id },
                data: { statut: "ARRIVEE" },
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

            // If table is assigned, mark it as occupied
            if (existingReservation.tableId) {
                await tx.tableRestaurant.update({
                    where: { id: existingReservation.tableId },
                    data: { statut: "OCCUPEE" },
                });
            }

            return reservation;
        });

        return NextResponse.json({ reservation: result });
    } catch (error) {
        console.error("Error marking reservation as arrived:", error);
        return NextResponse.json(
            { error: "Failed to mark reservation as arrived" },
            { status: 500 }
        );
    }
}
