import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateCoursSchema = z.object({
    nom: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    dureeMinutes: z.number().min(15).optional(),
    niveau: z
        .enum(["DEBUTANT", "INTERMEDIAIRE", "AVANCE", "TOUS_NIVEAUX"])
        .optional(),
    capaciteMax: z.number().min(1).optional(),
    categorie: z.string().optional().nullable(),
    instructeurId: z.string().optional().nullable(),
    salleId: z.string().optional().nullable(),
    materielNecessaire: z.string().optional().nullable(),
    couleur: z.string().optional().nullable(),
    actif: z.boolean().optional(),
    reservationRequise: z.boolean().optional(),
    imageUrl: z.string().optional().nullable(),
});

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/fitness/cours/[id]
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

        const cours = await prisma.coursCollectif.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                instructeur: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        couleur: true,
                        specialites: true,
                        bio: true,
                    },
                },
                salle: {
                    select: {
                        id: true,
                        nom: true,
                        type: true,
                        capacite: true,
                    },
                },
                seances: {
                    where: {
                        dateHeure: { gte: new Date() },
                        statut: { not: "ANNULEE" },
                    },
                    orderBy: { dateHeure: "asc" },
                    take: 10,
                    include: {
                        _count: { select: { reservations: true } },
                    },
                },
                _count: {
                    select: { seances: true },
                },
            },
        });

        if (!cours) {
            return NextResponse.json(
                { error: "Cours non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json(cours);
    } catch (error) {
        console.error("Erreur GET cours:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// PUT /api/fitness/cours/[id]
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

        const existing = await prisma.coursCollectif.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Cours non trouvé" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const validatedData = updateCoursSchema.parse(body);

        const cours = await prisma.coursCollectif.update({
            where: { id },
            data: validatedData,
            include: {
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

        return NextResponse.json(cours);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Données invalides", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Erreur PUT cours:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// DELETE /api/fitness/cours/[id]
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

        const existing = await prisma.coursCollectif.findFirst({
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
                { error: "Cours non trouvé" },
                { status: 404 }
            );
        }

        if (existing._count.seances > 0) {
            return NextResponse.json(
                {
                    error: "Impossible de supprimer un cours avec des séances planifiées. Désactivez-le plutôt.",
                },
                { status: 400 }
            );
        }

        await prisma.coursCollectif.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erreur DELETE cours:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
