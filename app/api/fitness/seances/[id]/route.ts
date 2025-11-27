import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSeanceSchema = z.object({
    dateHeure: z
        .string()
        .optional()
        .transform((str) => (str ? new Date(str) : undefined)),
    dureeMinutes: z.number().optional().nullable(),
    instructeurId: z.string().optional().nullable(),
    salleId: z.string().optional().nullable(),
    capaciteMax: z.number().optional().nullable(),
    statut: z
        .enum(["PLANIFIEE", "EN_COURS", "TERMINEE", "ANNULEE", "COMPLETE"])
        .optional(),
    placesReservees: z.number().optional(),
    notes: z.string().optional().nullable(),
    motifAnnulation: z.string().optional().nullable(),
});

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/fitness/seances/[id]
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

        const seance = await prisma.seanceCours.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                cours: true,
                instructeur: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        couleur: true,
                        specialites: true,
                    },
                },
                salle: true,
                reservations: {
                    include: {
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
                    orderBy: [
                        { statut: "asc" },
                        { positionAttente: "asc" },
                        { createdAt: "asc" },
                    ],
                },
                _count: {
                    select: { reservations: true },
                },
            },
        });

        if (!seance) {
            return NextResponse.json(
                { error: "Séance non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json(seance);
    } catch (error) {
        console.error("Erreur GET seance:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// PUT /api/fitness/seances/[id]
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

        const existing = await prisma.seanceCours.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Séance non trouvée" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const validatedData = updateSeanceSchema.parse(body);

        // Filtrer les valeurs undefined
        const updateData = Object.fromEntries(
            Object.entries(validatedData).filter(([, v]) => v !== undefined)
        );

        const seance = await prisma.seanceCours.update({
            where: { id },
            data: updateData,
            include: {
                cours: {
                    select: {
                        id: true,
                        nom: true,
                        niveau: true,
                        dureeMinutes: true,
                        capaciteMax: true,
                        couleur: true,
                    },
                },
                instructeur: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        couleur: true,
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

        return NextResponse.json(seance);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Données invalides", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Erreur PUT seance:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// DELETE /api/fitness/seances/[id]
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

        const existing = await prisma.seanceCours.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                _count: {
                    select: { reservations: true },
                },
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Séance non trouvée" },
                { status: 404 }
            );
        }

        // Supprimer les réservations associées
        await prisma.reservationCours.deleteMany({
            where: { seanceId: id },
        });

        await prisma.seanceCours.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erreur DELETE seance:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
