import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
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

// GET /api/fitness/reservations/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const reservation = await prisma.reservationCours.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
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
            },
        });

        if (!reservation) {
            return NextResponse.json(
                { error: "Réservation non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json(reservation);
    } catch (error) {
        console.error("Erreur GET reservation:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// PUT /api/fitness/reservations/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
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

        const { id } = await params;

        const existing = await prisma.reservationCours.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                seance: true,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Réservation non trouvée" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const validatedData = updateReservationSchema.parse(body);

        // Si on passe à PRESENTE, enregistrer l'heure d'arrivée
        const updateData = {
            ...validatedData,
            ...(validatedData.statut === "PRESENTE" &&
                !validatedData.heureArrivee && {
                    heureArrivee: new Date(),
                }),
        };

        // Gérer les changements de statut
        if (validatedData.statut && validatedData.statut !== existing.statut) {
            // Si on annule une réservation confirmée, libérer la place
            if (
                validatedData.statut === "ANNULEE" &&
                existing.statut === "CONFIRMEE"
            ) {
                await prisma.seanceCours.update({
                    where: { id: existing.seanceId },
                    data: { placesReservees: { decrement: 1 } },
                });

                // Promouvoir le premier en liste d'attente
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

            // Si on confirme une réservation en attente
            if (
                validatedData.statut === "CONFIRMEE" &&
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

        return NextResponse.json(reservation);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Données invalides", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Erreur PUT reservation:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// DELETE /api/fitness/reservations/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

        const { id } = await params;

        const existing = await prisma.reservationCours.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Réservation non trouvée" },
                { status: 404 }
            );
        }

        // Mettre à jour le compteur si c'était une réservation confirmée
        if (existing.statut === "CONFIRMEE") {
            await prisma.seanceCours.update({
                where: { id: existing.seanceId },
                data: { placesReservees: { decrement: 1 } },
            });
        }

        await prisma.reservationCours.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erreur DELETE reservation:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
