import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

// POST /api/reservations/[id]/confirm - Confirm a reservation
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

        // Only EN_ATTENTE reservations can be confirmed
        if (existingReservation.statut !== "EN_ATTENTE") {
            return NextResponse.json(
                {
                    error: "Seules les réservations en attente peuvent être confirmées",
                },
                { status: 400 }
            );
        }

        const reservation = await prisma.reservation.update({
            where: { id },
            data: { statut: "CONFIRMEE" },
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
        console.error("Error confirming reservation:", error);
        return NextResponse.json(
            { error: "Failed to confirm reservation" },
            { status: 500 }
        );
    }
}
