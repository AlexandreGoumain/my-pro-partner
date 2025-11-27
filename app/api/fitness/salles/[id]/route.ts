import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSalleSchema = z.object({
    nom: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    type: z
        .enum([
            "MUSCULATION",
            "CARDIO",
            "COURS_COLLECTIF",
            "PISCINE",
            "SAUNA",
            "VESTIAIRE",
            "CROSSFIT",
            "YOGA",
            "SPINNING",
            "BOXE",
            "AUTRE",
        ])
        .optional(),
    capacite: z.number().min(0).optional(),
    equipements: z.string().optional().nullable(),
    surface: z.number().optional().nullable(),
    reservable: z.boolean().optional(),
    premium: z.boolean().optional(),
    actif: z.boolean().optional(),
    ordre: z.number().optional(),
    couleur: z.string().optional().nullable(),
});

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/fitness/salles/[id]
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

        const salle = await prisma.salleFitness.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                cours: {
                    where: { actif: true },
                    select: {
                        id: true,
                        nom: true,
                        niveau: true,
                        dureeMinutes: true,
                    },
                },
                _count: {
                    select: {
                        cours: true,
                        seances: true,
                        presences: true,
                    },
                },
            },
        });

        if (!salle) {
            return NextResponse.json(
                { error: "Salle non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json(salle);
    } catch (error) {
        console.error("Erreur GET salle:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// PUT /api/fitness/salles/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("salles_fitness");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const existing = await prisma.salleFitness.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Salle non trouvée" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const validatedData = updateSalleSchema.parse(body);

        const salle = await prisma.salleFitness.update({
            where: { id },
            data: validatedData,
        });

        return NextResponse.json(salle);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Données invalides", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Erreur PUT salle:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// DELETE /api/fitness/salles/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("salles_fitness");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const existing = await prisma.salleFitness.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                _count: {
                    select: { seances: true },
                },
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Salle non trouvée" },
                { status: 404 }
            );
        }

        if (existing._count.seances > 0) {
            return NextResponse.json(
                {
                    error: "Impossible de supprimer une salle avec des séances planifiées. Désactivez-la plutôt.",
                },
                { status: 400 }
            );
        }

        await prisma.salleFitness.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erreur DELETE salle:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
