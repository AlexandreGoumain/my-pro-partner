import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updatePresenceSchema = z.object({
    heureSortie: z
        .string()
        .optional()
        .nullable()
        .transform((str) => (str ? new Date(str) : null)),
    notes: z.string().optional().nullable(),
});

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/fitness/presences/[id]
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

        const presence = await prisma.presenceFitness.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
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
                abonnement: {
                    include: {
                        typeAbonnement: true,
                    },
                },
                salle: true,
            },
        });

        if (!presence) {
            return NextResponse.json(
                { error: "Présence non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json(presence);
    } catch (error) {
        console.error("Erreur GET presence:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// PUT /api/fitness/presences/[id] - Mettre à jour (notamment heure de sortie)
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("presences_fitness");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const existing = await prisma.presenceFitness.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Présence non trouvée" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const validatedData = updatePresenceSchema.parse(body);

        const presence = await prisma.presenceFitness.update({
            where: { id },
            data: validatedData,
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        email: true,
                    },
                },
                abonnement: {
                    select: {
                        id: true,
                        numero: true,
                        statut: true,
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

        return NextResponse.json(presence);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Données invalides", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Erreur PUT presence:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// DELETE /api/fitness/presences/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("presences_fitness");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const existing = await prisma.presenceFitness.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Présence non trouvée" },
                { status: 404 }
            );
        }

        await prisma.presenceFitness.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erreur DELETE presence:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
